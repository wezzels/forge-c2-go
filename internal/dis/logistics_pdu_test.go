package dis

import (
	"testing"
)

func TestServiceRequestPDU(t *testing.T) {
	pdu := &DISServiceRequestPDU{
		Header: DISHeader{ProtocolVersion: 7, PDUType: 5},
		RequestingEntityID: EntityID{SiteNumber: 1, ApplicationNumber: 1, EntityNumber: 100},
		Services: 3,
		ServiceTypeRequestID: 1,
		NumberOfSupplyTypes: 2,
	}

	if pdu.Services != 3 {
		t.Errorf("Services should be 3, got %d", pdu.Services)
	}
	if pdu.NumberOfSupplyTypes != 2 {
		t.Errorf("NumberOfSupplyTypes should be 2, got %d", pdu.NumberOfSupplyTypes)
	}

	t.Logf("ServiceRequestPDU: entity=%+v, services=%d", pdu.RequestingEntityID, pdu.Services)
}

func TestRepairResponsePDU(t *testing.T) {
	pdu := NewRepairResponsePDU(
		EntityID{SiteNumber: 1, ApplicationNumber: 1, EntityNumber: 100},
		EntityID{SiteNumber: 1, ApplicationNumber: 2, EntityNumber: 200},
		0, // Accepted
	)

	if pdu.Header.PDUType != 11 {
		t.Errorf("PDUType should be 11, got %d", pdu.Header.PDUType)
	}
	if pdu.RepairResult != 0 {
		t.Errorf("RepairResult should be 0, got %d", pdu.RepairResult)
	}

	t.Logf("RepairResponsePDU: result=%d", pdu.RepairResult)
}

func TestResupplyOfferPDU(t *testing.T) {
	pdu := &DISResupplyOfferPDU{
		Header: DISHeader{ProtocolVersion: 7, PDUType: 8},
		OfferingEntityID: EntityID{SiteNumber: 1, ApplicationNumber: 1, EntityNumber: 50},
		ReceivingEntityID: EntityID{SiteNumber: 1, ApplicationNumber: 2, EntityNumber: 100},
		Services: 1,
	}

	if pdu.Services != 1 {
		t.Errorf("Services should be 1, got %d", pdu.Services)
	}

	t.Logf("ResupplyOfferPDU: offering=%+v, receiving=%+v", pdu.OfferingEntityID, pdu.ReceivingEntityID)
}

func TestResupplyReceivedPDU(t *testing.T) {
	pdu := &DISResupplyReceivedPDU{
		Header: DISHeader{ProtocolVersion: 7, PDUType: 9},
		ReceivingEntityID: EntityID{SiteNumber: 1, ApplicationNumber: 1, EntityNumber: 100},
		SupplyingEntityID: EntityID{SiteNumber: 1, ApplicationNumber: 2, EntityNumber: 50},
		Services: 1,
		NumberOfSupplyTypes: 3,
	}

	if pdu.Services != 1 {
		t.Errorf("Services should be 1, got %d", pdu.Services)
	}
	if pdu.NumberOfSupplyTypes != 3 {
		t.Errorf("NumberOfSupplyTypes should be 3, got %d", pdu.NumberOfSupplyTypes)
	}

	t.Logf("ResupplyReceivedPDU: received=%d supply types", pdu.NumberOfSupplyTypes)
}

func TestActionResponsePDU(t *testing.T) {
	pdu := &DISActionResponsePDU{
		Header: DISHeader{ProtocolVersion: 7, PDUType: 40},
		RequestingEntityID: EntityID{SiteNumber: 1, ApplicationNumber: 1, EntityNumber: 100},
		ReceivingEntityID: EntityID{SiteNumber: 1, ApplicationNumber: 2, EntityNumber: 200},
		ActionID: ActionIdentifier{ActionType: 1, EntityID: EntityID{SiteNumber: 1, ApplicationNumber: 1, EntityNumber: 1}},
		ResponseResult: ActionResponseAccepted,
	}

	if pdu.Header.PDUType != 40 {
		t.Errorf("PDUType should be 40, got %d", pdu.Header.PDUType)
	}
	if pdu.ResponseResult != ActionResponseAccepted {
		t.Errorf("ResponseResult should be 0, got %d", pdu.ResponseResult)
	}

	t.Logf("ActionResponsePDU: response=%d", pdu.ResponseResult)
}
