# NOS3 + FORGE-C2/MDPAF Integration Roadmap

**Created:** 2026-04-07
**Goal:** Complete NOS3 stack on darth + integrate with FORGE-C2/MDPAF for threat simulation

---

## Executive Summary

NOS3 (NASA Operational Simulator for Space Systems) provides spacecraft dynamics (42), flight software (cFS), and simulators. FORGE-C2/MDPAF needs JREAP-C/Link 16 data from NOS3's `generic_radio_sim` for realistic threat simulation.

**Current Status:**
- COSMOS 5 Ground Station: ✅ Running at http://localhost:2900
- 42 Spacecraft Dynamics: ✅ Built (`~/.nos3/42/42`)
- Flight Software (cFS): ❌ Needs rebuild
- Simulators: ❌ Need `nos3-single-simulator` binary
- Generic Radio Sim: 🔲 Port 5015 (FORGE integration point)

---

## Phase 1: NOS3 Core Build (Week 1)

### 1.1 Fix Flight Software (cFS) Build
**Task:** Rebuild FSW with proper OSAL/BSP configuration
**Steps:**
```bash
# 1. Get all submodules via tarball (git clone blocked)
cd ~/nos3-main/fsw
curl -sL https://github.com/nasa-itc/cFE/archive/refs/heads/nos3-main.tar.gz | tar -xz
mv cFE-nos3-main cfe

# 2. Get OSAL with proper branch
curl -sL https://github.com/nasa-itc/osal/archive/refs/heads/nos3-main.tar.gz | tar -xz
mv osal-nos3-main osal

# 3. Get PSP
curl -sL https://github.com/nasa-itc/PSP/archive/refs/heads/nos3-main.tar.gz | tar -xz
mv PSP-nos3-main psp

# 4. Get all apps
for repo in CFS_CI CFS_TO CFS_IO_LIB SCH SC CF; do
  curl -sL https://github.com/nasa-itc/$repo/archive/refs/heads/nos3-main.tar.gz | tar -xz
done

# 5. Create dummy docs dir if missing
mkdir -p fsw/osal/docs/src
echo 'project(dummy)' > fsw/osal/docs/src/CMakeLists.txt

# 6. Run make config
cd ~/nos3-main
make config

# 7. Build FSW
make build-fsw
```

**Success Criteria:** `~/nos3-main/fsw/build/exe/cpu1/core-cpu1` exists and runs

**Time Estimate:** 2-4 hours

---

### 1.2 Build Simulators
**Task:** Build all simulator shared libraries and `nos3-single-simulator` binary

**Required Simulators:**
| Simulator | Purpose | FORGE Relevance |
|-----------|---------|----------------|
| `libgeneric_radio_sim.so` | Radio comms | **KEY** - JREAP/Link 16 |
| `libtruth_42_sim.so` | 42 dynamics | High - position/attitude |
| `libgeneric_css_sim.so` | CSS sensors | Medium |
| `libgeneric_eps_sim.so` | Power system | Low |
| `libgeneric_imu_sim.so` | IMU | Medium |

**Steps:**
```bash
cd ~/nos3-main
mkdir -p cfg/build/sims cfg/build/InOut
cp deployments/nos3/cfg/sims/* cfg/build/sims/
cp deployments/nos3/cfg/InOut/* cfg/build/InOut/

# Build sims
make build-sim

# Result: ~/nos3/sims/build/lib/*.so
```

**Success Criteria:** `generic_radio_sim` library built

**Time Estimate:** 1-2 hours

---

### 1.3 Configure 42 Spacecraft Dynamics
**Task:** Ensure 42 runs with proper NOS3 configuration

**Steps:**
```bash
# 42 config should be at ~/.nos3/42/NOS3InOut/
# Verify config files exist
ls ~/.nos3/42/NOS3InOut/

# Key configs:
# - Inp_Sim.txt (simulation params)
# - Inp_IPC.txt (IPC settings - should have all IPC=OFF for standalone)
# - SC.xyz (spacecraft state)

# Test run 42
cd ~/.nos3/42
./42
```

**Success Criteria:** 42 runs and produces output

**Time Estimate:** 30 minutes

---

## Phase 2: Ground Station Integration (Week 1-2)

### 2.1 Get Yamcs/GSW Running
**Task:** Get Yamcs ground station software operational

**Approach Options:**

#### Option A: Pre-built Docker (RECOMMENDED)
```bash
# Try official NASA pre-built images
docker pull ghcr.io/nasa-itc/nos3-yamcs:dev
docker pull ghcr.io/nasa-itc/nos3-base:dev

# If GHCR auth needed, use personal access token:
echo "ghcr.io_TOKEN=your_token" > ~/.docker/config.json
```

#### Option B: Build Yamcs from Source
```bash
cd ~/nos3-main/gsw/yamcs
# Build takes 15-20 minutes
mvn package -DskipTests
```

**Success Criteria:** Yamcs accessible at http://localhost:8090

**Time Estimate:** 1-2 hours (depending on approach)

---

### 2.2 Connect FSW to Ground Station
**Task:** Verify cFS connects to Yamcs/GSW

**Configuration:**
- FSW listens on specific ports for ground commands
- Yamcs provides TMTC routing
- 42 provides truth data to FSW

**Steps:**
1. Start Yamcs container
2. Start 42 with IPC enabled
3. Start FSW
4. Verify telemetry flowing

**Success Criteria:** TMTC communication working

**Time Estimate:** 1 hour

---

## Phase 3: NOS Engine Server (Week 2)

### 3.1 NOS Engine Server Setup
**Task:** Get NOS engine server running for inter-container comms

**Problem:** `nos_engine_server_standalone` requires interactive stdin

**Solution:** Run via docker-compose with proper init system
```bash
cd ~/nos3-main/deployments
docker compose up -d nos-engine-server
```

**Alternative:** Run standalone with `sleep infinity` wrapper
```bash
docker run -d --name nos-engine \
  ivvitc/nos3-64:20251107 \
  sh -c 'while true; do sleep 1; done'
```

**Success Criteria:** NOS engine listening on port 12001

**Time Estimate:** 30 minutes

---

### 3.2 Connect Simulators via NOS Engine
**Task:** Connect simulators to FSW through NOS engine

**Architecture:**
```
42 <---> NOS Engine Server <---> FSW
                         <---> Simulators
```

**Steps:**
1. Start NOS engine server
2. Configure 42 with IPC connections to NOS
3. Start simulators with NOS connections
4. Start FSW
5. Verify data flow

**Success Criteria:** All components communicating

**Time Estimate:** 1-2 hours

---

## Phase 4: FORGE-C2/MDPAF Integration (Week 2-3)

### 4.1 Identify JREAP Integration Point
**Task:** Find/configure `generic_radio_sim` for JREAP-C output

**Key Info:**
- Port: 5015 (generic_radio_sim default)
- Protocol: JREAP-C (MIL-STD-3011)
- Message Types: J3.0 (track), J4.0 (engagement), J28 (sensor)

**Configuration in `nos3-simulator.xml`:**
```xml
<simulator>
  <name>radio</name>
  <active>true</active>
  <library>libgeneric_radio_sim.so</library>
  <hardware-model>
    <type>GenericRadio</type>
    <connections>
      <connection>
        <type>udp</type>
        <port>5015</port>
      </connection>
    </connections>
  </hardware-model>
</simulator>
```

**Success Criteria:** Radio sim outputs JREAP on port 5015

**Time Estimate:** 1 hour

---

### 4.2 Connect FORGE-C2 to NOS3 Radio Sim
**Task:** Point FORGE-C2 at NOS3 radio sim for JREAP data

**Steps:**
1. Start FORGE-C2
2. Configure JREAP input to connect to `localhost:5015`
3. Verify JREAP messages being received
4. Map NOS3 track data to FORGE track format

**FORGE-C2 Config:**
```yaml
jreap:
  input:
    type: udp
    port: 5015
    bind: 0.0.0.0
```

**Success Criteria:** FORGE receiving track data from NOS3

**Time Estimate:** 2-4 hours

---

### 4.3 End-to-End Test
**Task:** Verify complete data flow

**Flow:**
```
42 (dynamics) -> NOS Engine -> FSW (cFS) -> Generic Radio Sim -> FORGE-C2
                                                           -> Ground Station (Yamcs)
```

**Steps:**
1. Start 42
2. Start NOS engine
3. Start simulators
4. Start FSW
5. Start FORGE-C2
6. Start Yamcs
7. Verify track correlation in FORGE-C2
8. Verify telemetry in Yamcs

**Success Criteria:** Full integration working

**Time Estimate:** 2-3 hours

---

## Phase 5: MDPAF Compliance (Week 3-4)

### 5.1 MDPAF Data Model Mapping
**Task:** Map NOS3 data to MDPAF-compliant format

**MDPAF Extensions Needed:**
- Track quality metrics
- Sensor pointing data
- Priority-based tracking

**Reference:** `~/stsgym-work/docs/FORGE-MDPAF-PLAN.md`

**Time Estimate:** 4-8 hours

---

### 5.2 Priority-Based Sensor Management
**Task:** Implement MDPAF priority handling for multi-sensor tracking

**Requirements:**
- Multiple sensors feeding tracks
- Priority assignment per sensor
- Track custody management

**Time Estimate:** 8-16 hours

---

## Phase 6: Testing & Documentation (Week 4)

### 6.1 Integration Testing
**Tests:**
- [ ] 42 standalone runs
- [ ] FSW boots and connects to GS
- [ ] Simulators produce valid data
- [ ] NOS engine routes messages correctly
- [ ] FORGE-C2 receives JREAP from radio sim
- [ ] Yamcs displays telemetry
- [ ] Full end-to-end scenario

### 6.2 Documentation
**Documents Needed:**
- NOS3 Setup Guide (this document)
- FORGE-NOS3 Integration Guide
- MDPAF Compliance Guide
- Troubleshooting Guide

---

## Timeline Summary

```
Week 1: Phase 1 (Core Build) + Phase 2 (GSW)
  - Days 1-2: FSW build + verify
  - Days 3-4: Simulator build
  - Days 5: Yamcs integration

Week 2: Phase 3 (NOS Engine) + Phase 4 (FORGE Integration)
  - Days 1-2: NOS engine setup
  - Days 3-4: Radio sim + FORGE connection
  - Day 5: End-to-end test

Week 3-4: Phase 5 (MDPAF) + Phase 6 (Testing)
  - MDPAF data mapping
  - Priority-based tracking
  - Full integration testing
  - Documentation
```

**Total Estimate:** 4 weeks

---

## Critical Path Items (Must Fix First)

1. **FSW Build** - Without FSW, nothing else matters
2. **NOS Engine** - Required for component communication
3. **Radio Sim** - FORGE integration point
4. **Yamcs** - Ground station visibility

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| GHCR images need auth | High | Build Yamcs from source |
| FSW build complexity | Medium | Use tarball downloads |
| 42 IPC issues | Medium | Disable IPC, run standalone |
| FORGE JREAP format mismatch | Medium | Add translation layer |

---

## Quick Start Commands

### Full NOS3 Build (when fixed)
```bash
cd ~/nos3-main

# 1. Get submodules
./scripts/get_submodules.sh  # TBD - create this script

# 2. Configure
make config

# 3. Build everything
make all

# 4. Run
docker compose up -d  # From deployments/
```

### Individual Component Start
```bash
# 42 (spacecraft dynamics)
~/.nos3/42/42 &

# FSW
~/nos3-main/fsw/build/exe/cpu1/core-cpu1 &

# Radio sim (after build)
cd ~/nos3/sims/build
./nos3-single-simulator -f nos3-simulator.xml generic-radio-sim &

# Yamcs
cd ~/nos3-main/gsw/yamcs
mvn spring-boot:run
```

---

## References

- NOS3 GitHub: https://github.com/nasa/nos3
- NOS3 Docs: https://nos3.readthedocs.io/
- FORGE-C2: `~/stsgym-work/forge-c2/`
- MDPAF Plan: `~/stsgym-work/docs/FORGE-MDPAF-PLAN.md`
