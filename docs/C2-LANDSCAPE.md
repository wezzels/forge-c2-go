# FORGE-C2 in the C2 Landscape — Comparable Systems

**Version:** 2026-04-15  
**Classification:** UNCLASSIFIED / Open Source Reference

---

## Overview

FORGE-C2 implements a full-spectrum Ballistic Missile Defense System (BMDS) Command & Control capability. This document maps FORGE-C2 against real-world systems it emulates and competes with.

---

## Real-World Systems FORGE-C2 Emulates

### C2BMC — Command, Control, Battle Management & Communications

| Attribute | Detail |
|-----------|--------|
| **Operator** | Missile Defense Agency (MDA) |
| **Prime Contractor** | Lockheed Martin |
| **Latest Contract** | $847M (April 2024) |
| **Role** | Integrates all BMDS sensors (SBIRS/DSP OPIR, TPY-2, GBR, Aegis SPY-1) to shooters (GBI, THAAD, SM-3, Patriot) |
| **Protocol** | Link 16 (J-Series), DIS, HLA, proprietary |
| **FORGE-C2 Mapping** | FORGE-C2's C2BMC interface (`internal/c2bmc/`) implements the same integration role — correlating multi-sensor tracks, issuing engagement orders, and maintaining battlespace awareness |

**What FORGE-C2 replicates:**
- Multi-sensor track correlation (TPY-2, GBR, OPIR, Aegis)
- Engagement order generation (fire commands to shooters)
- DEFCON-aware response logic
- Real-time track state management with age-based pruning

### FORGE — Future Operationally Resilient Ground Evolution

| Attribute | Detail |
|-----------|--------|
| **Operator** | U.S. Space Force (SSC) |
| **Prime Contractor** | BAE Systems (Scitor subsidiary) |
| **Latest Contract** | $151M (March 2025) |
| **Role** | Ground processing for OPIR (Overhead Persistent Infrared) sensor data — missile warning, tracking, and characterization |
| **Key Milestone** | Operational Acceptance achieved 2025 |
| **FORGE-C2 Mapping** | FORGE-C2's Kafka bridge + OPIR simulation replicates FORGE's sensor data pipeline — ingesting raw sensor events, processing into tracks, and distributing to C2 |

**What FORGE-C2 replicates:**
- OPIR sensor event ingestion via Kafka (`vimi.sensors.raw` topic)
- Sensor data processing and track formation
- Multi-source correlation (OPIR + TPY-2 + GBR fusion)
- Real-time distribution to downstream consumers

### Cobra Dane Radar System

| Attribute | Detail |
|-----------|--------|
| **Operator** | USAF / Space Force |
| **Location** | Shemya Island, AK (Eareckson Air Station) |
| **Role** | Long-range phased-array radar for early warning and tracking |
| **FORGE-C2 Mapping** | FORGE-C2's TPY-2 Alaska sensor simulates the same Aleutian radar coverage pattern |

---

## Comparable Defense C2 Platforms

### Aegis Combat System (ABIS — Aegis Baseline)

| Domain | Sea-based BMD |
|--------|---------------|
| **Operator** | US Navy |
| **Prime** | Lockheed Martin |
| **Role** | Ship-based missile defense — integrates SPY-1/SPY-6 radar with SM-3/SM-6 interceptors |
| **C2BMC Integration** | Via Link-16 (JREAP) — same J-Series messages FORGE-C2 implements |
| **Relevance** | FORGE-C2's Aegis shooter simulation uses the same fire control logic |

### MEADS — Medium Extended Air Defense System

| Domain | Theater air defense |
|--------|---------------------|
| **Operator** | NATO / Germany (IRIS-T SL) |
| **Role** | Medium-range air and missile defense C2 |
| **Relevance** | Similar track correlation + fire control architecture to FORGE-C2 |

### ICBS — Integrated Command & Battle System (Israel)

| Domain | Multi-layer air defense |
|--------|--------------------------|
| **Systems** | Iron Dome, David's Sling, Arrow 2/3 |
| **Role** | Real-time threat assessment, prioritization, and interceptor assignment |
| **Relevance** | FORGE-C2's threat-level classification and engagement priority mirrors ICBS logic |

### THAAD Fire Control

| Domain | Terminal BMD |
|--------|-------------|
| **Operator** | MDA / US Army |
| **Prime** | Lockheed Martin |
| **Role** | THAAD battery-level C2 — track management, fire control, kill assessment |
| **Relevance** | FORGE-C2's THAAD shooter implements comparable engagement logic |

### 9K720 Iskander C2

| Domain | Tactical missile (adversary) |
|--------|------------------------------|
| **Operator** | Russian Armed Forces |
| **Role** | Short-range ballistic missile C2 |
| **Relevance** | Threat profile that FORGE-C2 defends against in simulation |

---

## FORGE-C2 vs Real Systems — Feature Matrix

| Capability | C2BMC | FORGE | FORGE-C2 | Aegis | ICBS |
|-----------|-------|-------|----------|-------|------|
| **Multi-sensor fusion** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Track correlation** | ✅ | ❌ | ✅ | ✅ | ✅ |
| **Engagement orders** | ✅ | ❌ | ✅ | ✅ | ✅ |
| **OPIR processing** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Link 16 / JREAP** | ✅ | ❌ | ✅ | ✅ | ✅ |
| **DIS (IEEE 1278)** | ✅ | ❌ | ✅ | ❌ | ❌ |
| **HLA (IEEE 1516)** | ✅ | ❌ | ✅ | ❌ | ❌ |
| **TENA** | ✅ | ❌ | ✅ | ❌ | ❌ |
| **Kafka streaming** | ❌ | ✅ | ✅ | ❌ | ❌ |
| **WebSocket real-time** | ❌ | ❌ | ✅ | ❌ | ❌ |
| **REST API** | ❌ | ❌ | ✅ | ❌ | ❌ |
| **BMDS dashboard** | ✅ | ❌ | ✅ | ✅ | ✅ |
| **Open source** | ❌ | ❌ | ✅ | ❌ | ❌ |

---

## Architecture Comparison

### C2BMC Architecture
```
Sensors (OPIR, TPY-2, GBR, Aegis)
    ↓ Link 16 / J-Series / DIS
C2BMC (Track Correlation + Battle Management)
    ↓ Engagement Orders
Shooters (GBI, THAAD, SM-3, Patriot)
```

### FORGE-C2 Architecture
```
Sensors (OPIR, TPY-2, GBR, Aegis simulators)
    ↓ Kafka (vimi.sensors.raw) / J-Series / DIS / HLA
FORGE-C2 (Track Correlation + C2BMC Interface)
    ↓ WebSocket / REST API
Dashboard + Shooters (THAAD, Patriot, Aegis simulators)
```

### FORGE (Space Force) Architecture
```
OPIR Satellites (SBIRS, Next-Gen)
    ↓ Raw Sensor Data
FORGE Processing (Data Correlation, Track Formation)
    ↓ Processed Tracks
C2BMC / Operators
```

---

## Key Differentiators

### What FORGE-C2 has that real systems don't:
1. **Open-source, runnable on a laptop** — real C2BMC requires classified networks
2. **Multi-protocol bridge** — DIS + HLA + JREAP + TENA + Kafka in one binary
3. **Modern API stack** — REST + WebSocket alongside legacy protocols
4. **BMDS dashboard** — real-time visualization out of the box
5. **Rapid scenario prototyping** — spin up multi-threat scenarios in seconds

### What real systems have that FORGE-C2 doesn't (yet):
1. **Live hardware integration** (Phase 5.2 — deferred)
2. **Classified crypto** (Type 1, Suite A)
3. **Formal verification** (DO-178C, Common Criteria)
4. **SATCOM/Link-16 actual RF** (requires MDA test range access)
5. **Formal accreditation** (authority to operate on classified networks)

---

## References

1. **C2BMC** — Northrop Grumman (prime 2002-2018), Lockheed Martin (prime 2018+): https://www.northropgrumman.com/space/command-control-battle-management-and-communications-c2bmc/
2. **FORGE** — Space Systems Command, BAE Systems: https://www.ssc.spaceforce.mil/Newsroom/Article-Display/Article/4089766/
3. **Aegis BMD** — Lockheed Martin: https://www.lockheedmartin.com/en-us/products/aegis.html
4. **MEADS** — NATO: https://missiledefenseadvocacy.org/
5. **ICBS** — Israel Missile Defense Organization: https://missilethreat.csis.org/defsys/c2bmc/
6. **MDA C2BMC Contract** — Breaking Defense ($847M, April 2024): https://breakingdefense.com/2024/04/mda-launches-missile-defense-battle-management-upgrade-with-847m-order-to-lockheed-martin/
7. **BAE FORGE Contract** — GovCon Wire ($151M, March 2025): https://www.govconwire.com/2025/03/bae-systems-151-million-space-force-contract-forge-development/

---

*FORGE-C2: Where C2BMC meets modern cloud-native architecture.*