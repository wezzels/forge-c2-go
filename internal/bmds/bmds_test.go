package bmds

import (
	"testing"
)

func TestBMDSEmulator(t *testing.T) {
	bmds := NewBMDSEmulator()

	if bmds.TPY2.Range != 6304000 {
		t.Errorf("TPY2 range should be 6304000, got %f", bmds.TPY2.Range)
	}
	if bmds.GBR.Range != 67115000 {
		t.Errorf("GBR range should be 67115000, got %f", bmds.GBR.Range)
	}
	if bmds.Aegis.SPY1Range != 31605000 {
		t.Errorf("Aegis range should be 31605000, got %f", bmds.Aegis.SPY1Range)
	}
	if bmds.THAAD.PK != 0.90 {
		t.Errorf("THAAD PK should be 0.90, got %f", bmds.THAAD.PK)
	}
	if bmds.Patriot.PAC3PK != 0.75 {
		t.Errorf("Patriot PAC-3 PK should be 0.75, got %f", bmds.Patriot.PAC3PK)
	}
	if bmds.C2BMC.Federates != 6 {
		t.Errorf("C2BMC federates should be 6, got %d", bmds.C2BMC.Federates)
	}

	t.Logf("BMDS Emulator: TPY2=%dm, GBR=%dm, Aegis=%dm, THAAD=%dm, Patriot=%dm",
		int(bmds.TPY2.Range), int(bmds.GBR.Range), int(bmds.Aegis.SPY1Range),
		int(bmds.THAAD.Range), int(bmds.Patriot.Range))
}

func TestTPY2Emulator(t *testing.T) {
	tpy2 := NewTPY2Emulator()

	if tpy2.Sectors != 24 {
		t.Errorf("TPY2 sectors should be 24, got %d", tpy2.Sectors)
	}

	t.Logf("AN/TPY-2 Emulator: range=%d km, sectors=%d", int(tpy2.Range)/1000, tpy2.Sectors)
}

func TestGBREmulator(t *testing.T) {
	gbr := NewGBREmulator()

	if gbr.Range != 67115000 {
		t.Errorf("GBR range should be 67115000, got %f", gbr.Range)
	}

	t.Logf("GBR Emulator: range=%d km", int(gbr.Range)/1000)
}

func TestAegisEmulator(t *testing.T) {
	aegis := NewAegisEmulator()

	if aegis.SPY1Range != 31605000 {
		t.Errorf("SPY-1 range should be 31605000, got %f", aegis.SPY1Range)
	}

	t.Logf("Aegis BMD Emulator: SPY-1 range=%d km", int(aegis.SPY1Range)/1000)
}

func TestTHAADEmulator(t *testing.T) {
	thaad := NewTHAADEmulator()

	if thaad.Launchers != 6 {
		t.Errorf("THAAD launchers should be 6, got %d", thaad.Launchers)
	}
	if thaad.PK != 0.90 {
		t.Errorf("THAAD PK should be 0.90, got %f", thaad.PK)
	}

	t.Logf("THAAD Emulator: range=%d km, PK=%.0f%%, launchers=%d",
		int(thaad.Range)/1000, thaad.PK*100, thaad.Launchers)
}

func TestPatriotEmulator(t *testing.T) {
	patriot := NewPatriotEmulator()

	if patriot.Range != 150000 {
		t.Errorf("Patriot range should be 150000, got %f", patriot.Range)
	}

	t.Logf("Patriot Emulator: range=%d km, PAC-2 PK=%.0f%%, PAC-3 PK=%.0f%%",
		int(patriot.Range)/1000, patriot.PAC2PK*100, patriot.PAC3PK*100)
}

func TestC2BMCEmulator(t *testing.T) {
	c2bmc := NewC2BMCEmulator()

	if c2bmc.Federates != 6 {
		t.Errorf("C2BMC federates should be 6, got %d", c2bmc.Federates)
	}

	t.Logf("C2BMC Emulator: federates=%d", c2bmc.Federates)
}
