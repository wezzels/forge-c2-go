package dis

import (
	"encoding/binary"
	"testing"
)

// TestCoalescedPDUPackUnpack tests packet coalescing and defragmentation.
func TestCoalescedPDUPackUnpack(t *testing.T) {
	// Create valid DIS Entity State PDU buffers
	pdu1 := make([]byte, EntityStatePDUSize)
	pdu2 := make([]byte, EntityStatePDUSize)

	// Set proper DIS header
	pdu1[0] = 7  // Protocol version
	pdu1[2] = 1  // Exercise ID
	binary.LittleEndian.PutUint16(pdu1[4:], uint16(EntityStatePDUSize))
	pdu1[6] = 1 // PDU type (Entity State)

	pdu2[0] = 7
	pdu2[2] = 1
	binary.LittleEndian.PutUint16(pdu2[4:], uint16(EntityStatePDUSize))
	pdu2[6] = 1 // PDU type

	// Coalesce
	coalesced, offsets, err := PackCoalescedPDUs([][]byte{pdu1, pdu2}, MaxDISPacketSize)
	if err != nil {
		t.Fatalf("PackCoalescedPDUs failed: %v", err)
	}

	if len(offsets) != 2 {
		t.Errorf("offsets: got %d, want 2", len(offsets))
	}

	// Unpack
	unpacked, err := UnpackCoalescedPDUs(coalesced)
	if err != nil {
		t.Fatalf("UnpackCoalescedPDUs failed: %v", err)
	}

	if len(unpacked) != 2 {
		t.Errorf("unpacked count: got %d, want 2", len(unpacked))
	}
	t.Logf("Coalesced PDU: %d bytes -> %d PDUs", len(coalesced), len(unpacked))
}

// TestDefragmentBuffer tests reassembly of fragmented messages.
func TestDefragmentBuffer(t *testing.T) {
	def := NewDefragmentBuffer()

	seqNum := uint16(42)

	// Add fragments out of order
	data2, complete := def.AddFragment(seqNum, 1, 3, []byte("World "))
	if complete {
		t.Error("Should not be complete after only 1 fragment")
	}
	if data2 != nil {
		t.Error("Should not return data yet")
	}

	data1, complete := def.AddFragment(seqNum, 0, 3, []byte("Hello "))
	if complete {
		t.Error("Should not be complete after only 2 fragments")
	}
	if data1 != nil {
		t.Error("Should not return data yet")
	}

	// Final fragment
	data3, complete := def.AddFragment(seqNum, 2, 3, []byte("!"))
	if !complete {
		t.Fatal("Should be complete after all 3 fragments")
	}

	expected := "Hello World !"
	if string(data3) != expected {
		t.Errorf("Got %q, want %q", string(data3), expected)
	}
	t.Logf("DefragmentBuffer: reassembled %d bytes", len(data3))
}

// TestFragmentPDU tests fragmentation of large PDUs.
func TestFragmentPDU(t *testing.T) {
	// Create a large PDU
	largePDU := make([]byte, 3000)
	largePDU[0] = 1 // Entity State PDU type

	fragments, err := FragmentPDU(largePDU, 1400, 100)
	if err != nil {
		t.Fatalf("FragmentPDU failed: %v", err)
	}

	if len(fragments) != 3 {
		t.Errorf("Fragment count: got %d, want 3", len(fragments))
	}

	for i, frag := range fragments {
		if frag.SequenceNumber != 100 {
			t.Errorf("Fragment %d: bad sequence number", i)
		}
		if frag.FragmentIndex != uint8(i) {
			t.Errorf("Fragment %d: bad index", i)
		}
		if frag.TotalFragments != 3 {
			t.Errorf("Fragment %d: bad total", i)
		}
	}

	t.Logf("FragmentPDU: 3000 bytes -> %d fragments", len(fragments))
}

// TestFragmentPackUnpack tests fragment header packing.
func TestFragmentPackUnpack(t *testing.T) {
	frag := &FragmentedPDU{
		SequenceNumber: 12345,
		FragmentIndex:  2,
		TotalFragments: 5,
		Data:          []byte("test data"),
	}

	buf := make([]byte, 256)
	n := PackFragmentedPDU(frag, buf)
	if n == 0 {
		t.Fatal("PackFragmentedPDU returned 0")
	}

	unpacked, n2 := UnpackFragmentedPDU(buf)
	if unpacked == nil {
		t.Fatal("UnpackFragmentedPDU returned nil")
	}

	if unpacked.SequenceNumber != frag.SequenceNumber {
		t.Errorf("SequenceNumber: got %d, want %d", unpacked.SequenceNumber, frag.SequenceNumber)
	}
	if unpacked.FragmentIndex != frag.FragmentIndex {
		t.Errorf("FragmentIndex: got %d, want %d", unpacked.FragmentIndex, frag.FragmentIndex)
	}
	if unpacked.TotalFragments != frag.TotalFragments {
		t.Errorf("TotalFragments: got %d, want %d", unpacked.TotalFragments, frag.TotalFragments)
	}

	t.Logf("Fragment pack/unpack: %d bytes header + %d bytes data", n2-len(unpacked.Data), len(unpacked.Data))
}
