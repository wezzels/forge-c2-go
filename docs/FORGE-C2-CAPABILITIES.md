# FORGE-C2 Capabilities & Benefits

**Version:** 2026-04-11  
**Status:** 80% Implementation Complete  
**Protocols:** JREAP (98%), DIS (90%), HLA (75%), TENA (55%)

---

## Executive Summary

FORGE-C2 is a multi-protocol C2 (Command and Control) framework that bridges Link 16 (JREAP), DIS (Distributed Interactive Simulation), HLA (High Level Architecture), and TENA (Test and Training Enabling Architecture). This document describes what can be tested and proven with the implemented capabilities.

---

## 1. JREAP (Link 16) Capabilities

### 1.1 Message Types (J0-J31)

| Message | Purpose | Testable Scenario |
|---------|---------|-------------------|
| **J0** | Track Management | Track initiation, confirmation, ownership transfer, deletion |
| **J1** | Network Initialization | Network join, leave, participant status changes |
| **J2** | Surveillance | Air track detection, position updates, platform identification |
| **J3** | Track Update | Position, velocity, heading updates for tracked platforms |
| **J4** | Engagement Order | Weapons employment orders from C2 to platforms |
| **J5** | Engagement Status | Fire commands, engagement results |
| **J6** | Sensor Registration | Radar/sensor system registration |
| **J7** | Platform Data | Platform-specific state information |
| **J8** | Radio | Voice/data communications, message relay |
| **J9** | Electronic Warfare | Jamming, ESM, electronic attack |
| **J10** | Relative Navigation | Offset calculations between tracks |
| **J11** | Data Transfer | File/image/feature data distribution |
| **J12** | Alert | Threat warnings, air defense alerts |
| **J13** | Precision Participant | High-precision position reporting |
| **J14** | Process Specification | Order of battle, force structure |
| **J15** | Command | Operational commands |
| **J16** | Acknowledge | Message acknowledgment |
| **J17** | Initiate Transfer | Data transfer initiation |
| **J18** | Space Track | Satellite position updates |
| **J19-J25** | Specialized Tracks | Component, Air, Surface, Subsurface, Land, Foreign Equipment, Production |
| **J26-J27** | Time | Test messages and time sync |
| **J28-J31** | Satellite/Symbology | OPIR, IFF, file transfer |

### 1.2 Benefits

✅ **Full Link 16 Simulation** - Test C2 systems without expensive radio hardware  
✅ **Track Lifecycle Testing** - Verify track creation → update → deletion flows  
✅ **Multi-Domain Tracks** - Air, surface, subsurface, land, space track types  
✅ **Quality Indicator Propagation** - Test track quality through processing chain  
✅ **Correlation ID Tracking** - End-to-end message correlation across network  

### 1.3 Testable Scenarios

1. **Track Correlation**: Multiple sensors report same target → single track maintained
2. **Engagement Flow**: J4 Order → J5 Fire → J3 Update → J12 Alert
3. **Network Participation**: J1 Join/Leave → track distribution verification
4. **Quality Degradation**: Poor tracking → quality bits set → filtered by consumers

---

## 2. DIS (IEEE 1278.1) Capabilities

### 2.1 PDU Types

| PDU | Purpose | Testable Scenario |
|-----|---------|-------------------|
| **Entity State** | Entity position/orientation/velocity | Moving platforms, formation changes |
| **Fire** | Munition launch | Weapons firing, ballistics |
| **Detonation** | Impact/miss events | Target hits, near misses, collateral |
| **Collision** | Entity collisions | Vehicle collisions, ramming |
| **Service Request** | Logistics requests | Ammo, fuel, repair requests |
| **Resupply** | Logistics delivery | Resupply operations |
| **Create/Remove Entity** | Entity spawning | Mission start/end, teleport |
| **Start/Stop/Freeze** | Simulation control | Pause, resume, time control |
| **Data Query/Set/Data** | State queries | Database synchronization |
| **EM Emission** | Electronic warfare | Radar, jamming state |
| **Designator** | Laser designation | Target illumination |
| **Environmental** | Weather/terrain state | Environmental effects |

### 2.2 Variable Parameters

- **Articulated Parts**: Turret rotation, gun elevation, antenna positioning
- **Attached Parts**: Fuel tanks, missiles, external stores

### 2.3 Benefits

✅ **Interoperability Testing** - COTS DIS compatibility verification  
✅ **Weapon System Testing** - Fire/detonation/collision events  
✅ **Logistics Simulation** - Resupply, repair, service requests  
✅ **Entity Lifecycle** - Spawn, update, destroy entity workflows  
✅ **Dead Reckoning** - Position extrapolation algorithms  

### 2.4 Testable Scenarios

1. **Weapons Engagement**: Entity State → Fire PDU → Detonation PDU
2. **Entity Collision**: Two Entity State PDUs → Collision PDU
3. **Logistics Chain**: Service Request → Resupply Offer → Resupply Received
4. **Entity State w/ Articulated Parts**: Tank turret rotation, missile deployment

---

## 3. HLA (IEEE 1516) Capabilities

### 3.1 Federation Management

| Capability | Description |
|-----------|-------------|
| **Create/Destroy Federation** | Federation execution lifecycle |
| **Join/Resign Federation** | Federate participation |
| **Synchronization Points** | Federation sync (demo points) |
| **Save/Restore** | State preservation |

### 3.2 Declaration Management

| Capability | Description |
|-----------|-------------|
| **Publish/Subscribe** | Object class attribute ownership |
| **Object Class** | Publication/subscription tracking |

### 3.3 Object Management

| Capability | Description |
|-----------|-------------|
| **Register Object Instance** | Register objects with federation |
| **Update/Delete Attributes** | Attribute value changes |
| **Discovery Callbacks** | Late-joining federate awareness |
| **Reflection Callbacks** | Attribute update notifications |

### 3.4 Time Management

| Capability | Description |
|-----------|-------------|
| **Time Regulation** | Constrain federate time |
| **Time Constrained** | Receive time-constrained updates |
| **Time Advance** | Logical time progression |
| **LBTS Calculation** | Lower bound time stamp |

### 3.5 Ownership Management

| Capability | Description |
|-----------|-------------|
| **Attribute Ownership** | Acquisition, divestiture |
| **Ownership Queries** | Who owns what |
| **Callbacks** | Ownership notification |

### 3.6 Data Distribution Management (DDM)

| Capability | Description |
|-----------|-------------|
| **Regions** | Routing space regions |
| **Routing Spaces** | Multi-dimensional routing |
| **Region Subscription** | Region-based interest management |

### 3.7 Benefits

✅ **Federation Integration** - Test HLA federation participation  
✅ **Time Management** - HLA time regulation/controlled federation  
✅ **Late Joiner Support** - Object discovery for joining federates  
✅ **Ownership Transfer** - Attribute ownership handover  
✅ **Scalable Routing** - DDM region-based interest filtering  

### 3.8 Testable Scenarios

1. **Federation Lifecycle**: Create → Join → Publish/Subscribe → Update → Resign → Destroy
2. **Time-Regulated Simulation**: Federate with time regulation enabled, time advance requests
3. **Late Joiner Discovery**: Federate joins, discovers existing objects
4. **Ownership Transfer**: Federate A transfers attribute to Federate B

---

## 4. TENA (Test & Training Enabling Architecture) Capabilities

### 4.1 Session Management

| Capability | Description |
|-----------|-------------|
| **Session Connection** | Connect to TENA session |
| **Heartbeat** | Keepalive mechanism |
| **Federate Registry** | Track session participants |

### 4.2 Object Management

| Capability | Description |
|-----------|-------------|
| **Object Lifecycle** | Create, update, delete tracking |
| **Object Registry** | Instance lookup |
| **Callbacks** | Lifecycle event notifications |

### 4.3 Gateway (TENA-DIS-HLA Bridge)

| Capability | Description |
|-----------|-------------|
| **TENA ↔ DIS Mapping** | Object instance translation |
| **TENA ↔ HLA Mapping** | Handle translation |
| **Cross-Realm Sync** | Update propagation |

### 4.4 Benefits

✅ **Range Federation** - TENA range integration  
✅ **Cross-Protocol Bridging** - DIS ↔ HLA ↔ TENA translation  
✅ **Object Pooling** - Performance optimization for high-frequency updates  
✅ **Heartbeat/Keepalive** - Connection health monitoring  

### 4.5 Testable Scenarios

1. **TENA Session**: Connect → Register Federate → Heartbeat → Disconnect
2. **Object Lifecycle**: Create → Update → Delete with callbacks
3. **Gateway Sync**: TENA object update → DIS entity update

---

## 5. Integrated Test Scenarios

### 5.1 C2 System Under Test

```
┌─────────────────────────────────────────────────────────────┐
│                    C2 System (SUT)                         │
│  - Receives J0 Track Mgmt messages                        │
│  - Sends J4 Engagement Orders                              │
│  - Forwards tracks to display                             │
└─────────────────────────────────────────────────────────────┘
                              │
                    FORGE-C2 Gateway
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
   ┌─────────┐          ┌─────────┐          ┌─────────┐
   │  DIS    │          │  HLA    │          │  TENA   │
   │ Sim     │          │Federation│          │ Range   │
   └─────────┘          └─────────┘          └─────────┘
```

### 5.2 Weapons Engagement Test

```
1. DIS Entity State PDU (Fighter) → FORGE-C2
2. FORGE-C2 converts to J2 Surveillance
3. C2 sends J4 Engagement Order
4. FORGE-C2 converts to DIS Fire PDU
5. Target hit → DIS Detonation PDU
6. FORGE-C2 converts to J12 Alert
```

### 5.3 Multi-Federation Test

```
HLA Federation A          HLA Federation B          DIS Network
      │                         │                      │
      ▼                         ▼                      ▼
┌─────────────┐          ┌─────────────┐      ┌─────────────┐
│  FORGE-C2   │◄────────►│  FORGE-C2   │◄────►│  FORGE-C2   │
│  Gateway    │    HLA    │  Gateway    │  DIS │  Gateway    │
└─────────────┘          └─────────────┘      └─────────────┘
```

---

## 6. Network Transport Capabilities

### 6.1 UDP Multicast

- Real UDP sockets (not mocked)
- Configurable TTL
- Read/Write buffer sizing
- Multicast group support

### 6.2 TCP

- Length-prefixed frames
- Connection keepalive
- Graceful close

### 6.3 Fragmentation

- 1400 byte MTU support
- Automatic fragmentation/reassembly
- Out-of-order handling

---

## 7. Quality Assurance Features

### 7.1 Validation

- Latitude (-90° to 90°)
- Longitude (-180° to 180°)
- Altitude (domain-specific)
- Heading (0-360°)
- Speed (domain-specific)
- Timestamp (clock skew detection)
- Track number range

### 7.2 Reassembly

- J8 Radio fragmentation
- J31 File transfer chunks

### 7.3 Edge Case Handling

- Track ownership transfer
- Track delete/expiry
- Network join/leave
- Priority changes

---

## 8. Testing Benefits Summary

| Benefit | Description |
|---------|-------------|
| **No Hardware Required** | Full Link 16 simulation in software |
| **Protocol Compliance** | IEEE 1278.1, IEEE 1516, TENA-2022 |
| **Cross-Domain** | Air, surface, subsurface, land, space |
| **Federation Ready** | HLA and TENA integration |
| **CI/CD Compatible** | Go test suite, automated validation |
| **Deterministic** | Repeatable test scenarios |
| **Scalable** | Object pooling, DDM regions |
| **Real-Time** | Time management for real-time simulation |

---

## 9. Compliance Summary

| Protocol | Coverage | Status |
|----------|----------|--------|
| **JREAP** | 98% | Near-complete |
| **DIS** | 90% | Production-ready |
| **HLA** | 75% | Core complete |
| **TENA** | 55% | Gateway ready |

---

## 10. Getting Started

```bash
# Run all tests
cd ~/forge-c2-go-src
go test ./...

# Run JREAP tests
go test ./jreap/jseries/... -v

# Run DIS tests
go test ./internal/dis/... -v

# Run HLA tests
go test ./internal/hla/... -v

# Run TENA tests
go test ./internal/tena/... -v
```

---

*Document Version: 2026-04-11*  
*FORGE-C2: 80% Implementation Complete*
