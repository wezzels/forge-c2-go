package dis

import (
	"encoding/binary"
)

// =============================================================================
// Phase 0.1.9: Packet Coalescing/Defragmentation for Large Link 16 Messages
// =============================================================================

// MaxDISPacketSize is the maximum size of a single DIS PDU (per IEEE 1278.1)
// Standard Ethernet MTU is 1500 bytes, leaving room for IP/UDP headers
const MaxDISPacketSize = 1400

// CoalescedHeader marks a coalesced set of PDUs
type CoalescedHeader struct {
	SequenceNumber uint16
	PDUCount       uint8
	TotalLength    uint32
}

// PackCoalescedPDUs coalesces multiple PDU buffers into a single datagram.
// Takes individual PDU byte slices and combines them into one buffer up to maxSize.
func PackCoalescedPDUs(pduBuffers [][]byte, maxSize int) (coalesced []byte, offsets []int, err error) {
	if len(pduBuffers) == 0 {
		return nil, nil, nil
	}

	// Calculate header size (8 bytes)
	headerSize := 8
	usableSize := maxSize - headerSize

	coalesced = make([]byte, maxSize)
	offsets = make([]int, 0, len(pduBuffers))

	off := headerSize
	for i, pdu := range pduBuffers {
		if off+len(pdu) > usableSize {
			break
		}
		copy(coalesced[off:], pdu)
		offsets = append(offsets, off)
		off += len(pdu)
		_ = i // avoid unused
	}

	// Fill header
	binary.LittleEndian.PutUint16(coalesced[0:], 1) // sequence number
	coalesced[2] = uint8(len(offsets))
	binary.LittleEndian.PutUint32(coalesced[3:], uint32(off))

	return coalesced[:off], offsets, nil
}

// UnpackCoalescedPDUs unpacks multiple PDUs from a coalesced datagram
func UnpackCoalescedPDUs(coalesced []byte) (pdus [][]byte, err error) {
	if len(coalesced) < 8 {
		return nil, ErrBufferTooSmall
	}

	sequenceNumber := binary.LittleEndian.Uint16(coalesced[0:])
	_ = sequenceNumber // unused for now
	pduCount := coalesced[2]
	totalLength := binary.LittleEndian.Uint32(coalesced[3:])

	if int(totalLength) > len(coalesced) {
		return nil, ErrInvalidPDU
	}

	pdus = make([][]byte, 0, pduCount)
	off := 8

	for i := uint8(0); i < pduCount && off < int(totalLength); i++ {
		if off+12 > int(totalLength) { // minimum PDU header size (6 header + 6 entity ID)
			break
		}

		// Read PDU length from the DIS header (PDUHeaderLength at offset 4-5)
		pduLength := int(binary.LittleEndian.Uint16(coalesced[off+4:]))
		if pduLength == 0 || pduLength < 24 || off+pduLength > int(totalLength) {
			break
		}

		pdu := make([]byte, pduLength)
		copy(pdu, coalesced[off:off+pduLength])
		pdus = append(pdus, pdu)
		off += pduLength
	}

	return pdus, nil
}

// DefragmentBuffer reassembles fragmented multicast packets
type DefragmentBuffer struct {
	fragments map[uint16][]*DefragmentEntry
}

// DefragmentEntry tracks a single fragment
type DefragmentEntry struct {
	Index uint8
	Total uint8
	Data  []byte
}

// NewDefragmentBuffer creates a new defragmentation buffer
func NewDefragmentBuffer() *DefragmentBuffer {
	return &DefragmentBuffer{
		fragments: make(map[uint16][]*DefragmentEntry),
	}
}

// AddFragment adds a fragment and returns complete message when all received
func (d *DefragmentBuffer) AddFragment(sequenceNumber uint16, fragmentIndex, totalFragments uint8, data []byte) ([]byte, bool) {
	entry, ok := d.fragments[sequenceNumber]
	if !ok {
		entry = make([]*DefragmentEntry, totalFragments)
		d.fragments[sequenceNumber] = entry
	}

	entry[fragmentIndex] = &DefragmentEntry{
		Index: fragmentIndex,
		Total: totalFragments,
		Data:  data,
	}

	// Check if all fragments received
	complete := true
	totalSize := 0
	for i := uint8(0); i < totalFragments; i++ {
		if entry[i] == nil {
			complete = false
			break
		}
		totalSize += len(entry[i].Data)
	}

	if !complete {
		return nil, false
	}

	// Reassemble
	result := make([]byte, totalSize)
	off := 0
	for i := uint8(0); i < totalFragments; i++ {
		copy(result[off:], entry[i].Data)
		off += len(entry[i].Data)
	}

	delete(d.fragments, sequenceNumber)
	return result, true
}

// ReadPDULength extracts PDU length from header (bytes 8-11 for Entity State PDU)
func ReadPDULength(pdu []byte) int {
	if len(pdu) < 12 {
		return 0
	}
	// PDU length is at offset 8 for standard DIS PDU header
	length := binary.LittleEndian.Uint16(pdu[8:])
	return int(length)
}

// FragmentPDU fragments a large PDU for transmission over MTU-constrained networks
func FragmentPDU(pdu []byte, maxSize int, sequenceNumber uint16) (fragments []*FragmentedPDU, err error) {
	if len(pdu) <= maxSize {
		return []*FragmentedPDU{
			{SequenceNumber: sequenceNumber, FragmentIndex: 0, TotalFragments: 1, Data: pdu},
		}, nil
	}

	totalFragments := uint8((len(pdu) + maxSize - 1) / maxSize)
	fragments = make([]*FragmentedPDU, 0, totalFragments)

	for i := uint8(0); i < totalFragments; i++ {
		start := int(i) * maxSize
		end := start + maxSize
		if end > len(pdu) {
			end = len(pdu)
		}

		fragments = append(fragments, &FragmentedPDU{
			SequenceNumber:  sequenceNumber,
			FragmentIndex:  i,
			TotalFragments: totalFragments,
			Data:           pdu[start:end],
		})
	}

	return fragments, nil
}

// FragmentedPDU represents a single fragment of a larger PDU
type FragmentedPDU struct {
	SequenceNumber  uint16
	FragmentIndex   uint8
	TotalFragments  uint8
	Data            []byte
}

// FragmentHeaderSize is the size of fragmentation metadata
const FragmentHeaderSize = 5

// PackFragmentedPDU packs a fragmented PDU with header
func PackFragmentedPDU(frag *FragmentedPDU, buf []byte) int {
	if len(buf) < FragmentHeaderSize+len(frag.Data) {
		return 0
	}

	off := 0
	binary.LittleEndian.PutUint16(buf[off:], frag.SequenceNumber)
	off += 2
	buf[off] = frag.FragmentIndex
	off++
	buf[off] = frag.TotalFragments
	off++
	buf[off] = uint8(len(frag.Data))
	off++

	copy(buf[off:], frag.Data)
	off += len(frag.Data)

	return off
}

// UnpackFragmentedPDU unpacks a fragmented PDU header
func UnpackFragmentedPDU(buf []byte) (*FragmentedPDU, int) {
	if len(buf) < FragmentHeaderSize {
		return nil, 0
	}

	off := 0
	seqNum := binary.LittleEndian.Uint16(buf[off:])
	off += 2
	fragIndex := buf[off]
	off++
	totalFrag := buf[off]
	off++
	dataLen := int(buf[off])
	off++

	if len(buf) < off+dataLen {
		return nil, 0
	}

	return &FragmentedPDU{
		SequenceNumber: seqNum,
		FragmentIndex:  fragIndex,
		TotalFragments: totalFrag,
		Data:           buf[off : off+dataLen],
	}, off + dataLen
}
