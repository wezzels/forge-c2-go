# FORGE-Sims Roadmap & Simulator TODO

**Last Updated:** 2026-04-16
**Repository:** `git@idm.wezzel.com:crab-meat-repos/forge-sims.git`
**GitHub:** `git@github.com:wezzels/forge-sims.git`

---

## Executive Summary

FORGE-Sims is the simulator federation for FORGE-C2 BMDS (Ballistic Missile Defense System) testing. This document defines all planned simulators, their priorities, dependencies, and implementation order.

---

## Existing Simulators

| Simulator | Repo | Status | Language | Role |
|-----------|------|--------|----------|------|
| bmd-sim-core | `bmd-sim-core` | ✅ Complete | Go | Shared physics/models library |
| bmd-sim-tpy2 | `bmd-sim-tpy2` | ✅ Complete | Go | AN/TPY-2 X-band radar |
| bmd-sim-hub | `bmd-sim-hub` | ✅ Complete | Go | C2BMC hub/battle manager |
| bmd-sim-aegis | `bmd-sim-aegis` | ✅ Complete | Go | Aegis BMD ship-based defense |
| bmd-sim-thaad | `bmd-sim-thaad` | ✅ Complete | Go | THAAD interceptor |
| bmd-sim-patriot | `bmd-sim-patriot` | ✅ Complete | Go | Patriot PAC-2/PAC-3 |
| bmd-sim-gbr | `bmd-sim-gbr` | ✅ Complete | Go | Ground-Based Radar |
| bmd-sim-dashboard | `bmd-sim-dashboard` | ✅ Complete | Go | Web dashboard |

---

## Planned Simulators

### Priority Legend
- 🔴 **Critical** — Required for basic BMDS simulation
- 🟡 **Important** — Enhances realism significantly
- 🟢 **Nice-to-have** — Advanced/corner-case capabilities

---

### 1. Space-Based Assets

#### 1.1 bmd-sim-sbirs 🔴
**SBIRS (Space-Based Infrared System) Satellite Simulator**

| Parameter | Value |
|-----------|-------|
| Role | First detection of missile launches |
| Orbit | GEO (35,786 km) + HEO |
| Sensors | IR (2.7-4.3 μm scanning + staring) |
| Coverage | 4 GEO + 2 HEO satellites |
| Detection | Launch detection, boost-phase tracking |
| Latency | < 30 seconds from launch to report |
| Track Capacity | 100+ simultaneous tracks |
| Dependencies | bmd-sim-core |
| Est. LOC | 3,000-4,000 |

**Key Features:**
- Boost-phase IR detection simulation
- Multi-satellite constellation handoff
- Cloud/terrain false alarm modeling
- Report generation (ICD messages)
- Scanning pattern simulation (scanning + staring sensors)
- Background IR clutter modeling

**ICD Messages:** SBIRS_DETECTION, SBIRS_TRACK_UPDATE, SBIRS_LAUNCH_REPORT, SBIRS_ALERT

---

#### 1.2 bmd-sim-stss 🔴
**STSS (Space Tracking & Surveillance System)**

| Parameter | Value |
|-----------|-------|
| Role | Low-earth orbit tracking, midcourse discrimination |
| Orbit | LEO (1,350 km) |
| Sensors | IR + visible (dual-band) |
| Satellites | 2+ operational |
| Track Capacity | 200+ tracks |
| Dependencies | bmd-sim-core |
| Est. LOC | 2,500-3,500 |

**Key Features:**
- LEO satellite constellation tracking
- Midcourse object discrimination (warhead vs. decoy)
- Birth-to-death tracking
- Handoff to engagement radar
- Dual-band IR/visible sensor modeling

**ICD Messages:** STSS_TRACK, STSS_DISCRIMINATION, STSS_HANDOFF

---

#### 1.3 bmd-sim-dsp 🟡
**DSP (Defense Support Program) Legacy Satellite**

| Parameter | Value |
|-----------|-------|
| Role | Legacy early warning (pre-SBIRS) |
| Orbit | GEO (35,786 km) |
| Sensors | IR spinning scanner |
| Coverage | 3+ satellites |
| Detection | Strategic missile launches |
| Dependencies | bmd-sim-core |
| Est. LOC | 1,500-2,000 |

**Key Features:**
- Spinning scanner simulation (10 RPM)
- Lower resolution than SBIRS
- Strategic launch detection
- Cross-referencing with SBIRS for correlation

**ICD Messages:** DSP_DETECTION, DSP_REPORT, DSP_ALERT

---

### 2. Radar Systems (Missing)

#### 2.1 bmd-sim-lrdr 🔴
**LRDR (Long Range Discrimination Radar)**

| Parameter | Value |
|-----------|-------|
| Role | Midcourse discrimination, kill assessment |
| Frequency | S-band (2-4 GHz) |
| Range | 5,000+ km |
| Location | Clear, Alaska |
| Track Capacity | 1,000+ simultaneous |
| Dependencies | bmd-sim-core |
| Est. LOC | 3,000-4,000 |

**Key Features:**
- S-band radar range equation
- Multi-target discrimination
- Kill assessment reporting
- Clutter and terrain masking
- Coherent integration modeling
- 360° azimuth scanning

**ICD Messages:** LRDR_TRACK, LRDR_DISCRIMINATION, LRDR_KILL_ASSESSMENT, LRDR_SEARCH

---

#### 2.2 bmd-sim-uewr 🔴
**UEWR (Upgraded Early Warning Radar)**

| Parameter | Value |
|-----------|-------|
| Role | Early warning, attack assessment |
| Frequency | UHF (420-450 MHz) |
| Range | 5,500 km (detection), 3,000 km (tracking) |
| Locations | Beale AFB, Fylingdales, Clear, Cape Cod |
| Track Capacity | 500+ tracks |
| Dependencies | bmd-sim-core |
| Est. LOC | 2,500-3,500 |

**Key Features:**
- UHF phased array modeling
- Multiple site simulation (Beale, Fylingdales, Clear, Cape Cod)
- Attack size estimation
- Threat cloud tracking
- Object correlation across sites
- Radar range equation with atmospheric loss

**ICD Messages:** UEWR_TRACK, UEWR_ATTACK_ASSESSMENT, UEWR_OBJECT_MAP, UEWR_HANDOFF

---

#### 2.3 bmd-sim-cobra-judy 🟡
**Cobra Judy / Cobra Judy Replacement (CJR)**

| Parameter | Value |
|-----------|-------|
| Role | Sea-based X-band radar, collection platform |
| Frequency | X-band and S-band (dual) |
| Platform | Ship-based (USNS Observation Island / USNS Howard O. Lorenzen) |
| Range | 2,000+ km |
| Dependencies | bmd-sim-core |
| Est. LOC | 2,000-2,500 |

**Key Features:**
- Dual-band radar simulation
- Sea-based platform motion modeling
- Data collection and signature analysis
- Handoff to land-based radars

---

#### 2.4 bmd-sim-jrsc 🟡
**JREAP Range Extension Simulator**

| Parameter | Value |
|-----------|-------|
| Role | JREAP-A/B/C protocol simulation |
| Protocols | JREAP-A (SATCOM), JREAP-B (Line-of-Sight), JREAP-C (Link 16) |
| Dependencies | bmd-sim-core, FORGE-C2 (JREAP module) |
| Est. LOC | 2,000-3,000 |

**Key Features:**
- JREAP-A satellite communication simulation
- JREAP-B line-of-sight data link
- JREAP-C Link 16 message generation/parsing
- Message latency modeling (SATCOM ~500ms, LOS ~10ms)
- Bandwidth-limited message queuing
- Integration with FORGE-C2 JREAP encoder/decoder

---

### 3. Interceptors (Missing)

#### 3.1 bmd-sim-gmd 🔴
**GMD (Ground-Based Midcourse Defense) Interceptor**

| Parameter | Value |
|-----------|-------|
| Role | Homeland defense interceptor (GBI) |
| Range | 5,000+ km |
| Speed | Mach 20+ (exo-atmospheric) |
| KV | EKV (Exoatmospheric Kill Vehicle) |
| Bases | Fort Greely (AK), Vandenberg (CA) |
| PK | 0.85 (single shot) |
| Dependencies | bmd-sim-core |
| Est. LOC | 3,500-4,500 |

**Key Features:**
- Three-stage booster modeling
- EKV kill vehicle guidance
- Homing logic (proportional navigation, IIR seeker)
- Kill vehicle release point optimization
- Intercept geometry calculation
- Multiple kill vehicle variants (CE-I, CE-II)
- Launch site selection (Alaska vs. California)
- Commit point calculation

**ICD Messages:** GMD_LAUNCH, GMD_STATUS, GMD_INTERCEPT, GMD_KILL_ASSESSMENT, GMD_ENGAGEMENT_PLAN

---

#### 3.2 bmd-sim-sm3 🔴
**Standard Missile-3 (SM-3) Interceptor**

| Parameter | Value |
|-----------|-------|
| Role | Sea-based midcourse interceptor |
| Variants | Block IA, Block IB, Block IIA |
| Range | Block IA: 500 km, Block IIA: 2,500+ km |
| Speed | Mach 10-13 |
| KV | Lightweight Exo-Atmospheric Projectile (LEAP) |
| Platform | Aegis-equipped ships |
| PK | 0.90 (Block IIA) |
| Dependencies | bmd-sim-core, bmd-sim-aegis |
| Est. LOC | 3,000-4,000 |

**Key Features:**
- Block IA/IB/IIA variant modeling
- Aegis launch platform integration
- Kinetic kill vehicle (LEAP) guidance
- Sea-based launch dynamics
- Interceptor-flyout trajectory modeling
- Engagement zone calculation
- Multi-target engagement scheduling

**ICD Messages:** SM3_LAUNCH, SM3_STATUS, SM3_INTERCEPT, SM3_ENGAGEMENT_ZONE

---

#### 3.3 bmd-sim-sm6 🟡
**Standard Missile-6 (SM-6) Dual-Role Interceptor**

| Parameter | Value |
|-----------|-------|
| Role | Sea-based terminal defense + air defense |
| Range | 240+ km |
| Speed | Mach 3.5 |
| Warhead | High-explosive fragmentation |
| Platform | Aegis-equipped ships |
| PK | 0.80 (BMD mode) |
| Dependencies | bmd-sim-core, bmd-sim-aegis |
| Est. LOC | 2,000-2,500 |

**Key Features:**
- Dual-mode: BMD terminal + air defense
- Active radar homing terminal guidance
- Aegis integration for launch/control
- Anti-air warfare (AAW) mode
- Sea-based terminal defense layer
- Network-enabled weapon system

---

#### 3.4 bmd-sim-thaad-er 🟢
**THAAD Extended Range**

| Parameter | Value |
|-----------|-------|
| Role | Extended THAAD interceptor |
| Range | 600+ km (extended from 300 km) |
| Altitude | 150+ km |
| PK | 0.92 |
| Dependencies | bmd-sim-core, bmd-sim-thaad |
| Est. LOC | 1,500-2,000 |

**Key Features:**
- Extended range booster
- Same KV as standard THAAD
- Larger engagement envelope
- Improved target discrimination

---

### 4. Threat Simulators

#### 4.1 bmd-sim-icbm 🔴
**ICBM (Intercontinental Ballistic Missile) Threat Simulator**

| Parameter | Value |
|-----------|-------|
| Role | Simulate ICBM threat trajectories |
| Range | 10,000+ km |
| Speed | Mach 24 (reentry) |
| Stages | 3-stage |
| RVs | 1-10 MIRVs |
| Countermeasures | Decoys, chaff, jammers |
| Dependencies | bmd-sim-core |
| Est. LOC | 3,000-4,000 |

**Key Features:**
- 3-stage boost phase modeling
- MIRV deployment simulation
- Post-boost vehicle maneuvering
- Penetration aids (balloons, chaff, jammers)
- Multiple reentry vehicle trajectories
- Trajectory perturbation for realism
- Target area selection and impact prediction
- Signature modeling (RCS, IR)

**ICD Messages:** THREAT_LAUNCH, THREAT_MIRV_DEPLOY, THREAT_RV_TRAJECTORY, THREAT_DECOY_DEPLOY

---

#### 4.2 bmd-sim-irbm 🔴
**IRBM (Intermediate Range Ballistic Missile) Threat Simulator**

| Parameter | Value |
|-----------|-------|
| Role | Simulate IRBM threat trajectories |
| Range | 3,000-5,500 km |
| Speed | Mach 15-20 |
| Stages | 2-stage |
| Dependencies | bmd-sim-core |
| Est. LOC | 2,000-2,500 |

**Key Features:**
- 2-stage boost phase
- Single or multiple RVs
- Maneuverable reentry vehicle (MaRV)
- Shorter flight time than ICBM
- Terrain-masked launch points

---

#### 4.3 bmd-sim-slcm 🟡
**SLCM (Sea-Launched Cruise Missile) Threat Simulator**

| Parameter | Value |
|-----------|-------|
| Role | Simulate low-altitude cruise missile threats |
| Range | 1,500+ km |
| Speed | Mach 0.8-3.0 |
| Altitude | 10-50 m (sea-skimming) |
| Dependencies | bmd-sim-core |
| Est. LOC | 2,000-2,500 |

**Key Features:**
- Low-altitude terrain-following flight profiles
- Sea-skimming mode
- Waypoint navigation
- Radar cross-section modeling (stealth)
- Terminal maneuvering (pop-up)
- Anti-ship and land-attack modes

---

#### 4.4 bmd-sim-hgv 🔴
**HGV (Hypersonic Glide Vehicle) Threat Simulator**

| Parameter | Value |
|-----------|-------|
| Role | Simulate hypersonic glide vehicle threats |
| Speed | Mach 5-25 |
| Altitude | 30-80 km |
| Range | 8,000+ km |
| Maneuverability | High (pull-up, dive, lateral) |
| Dependencies | bmd-sim-core |
| Est. LOC | 3,500-4,500 |

**Key Features:**
- Boost-glide trajectory modeling
- Lateral and longitudinal maneuver profiles
- Variable speed/altitude profiles
- Radar signature reduction modeling
- Pull-up and dive maneuvers
- Unpredictable trajectory generation
- Sensor detection challenge modeling (low altitude + high speed)
- Intercept geometry challenges

**ICD Messages:** HGV_LAUNCH, HGV_TRAJECTORY, HGV_MANEUVER, HGV_ALERT

---

#### 4.5 bmd-sim-decoy 🟡
**Countermeasure/Decoy Simulator**

| Parameter | Value |
|-----------|-------|
| Role | Simulate threat countermeasures |
| Types | Balloons, chaff, jammers, RCS enhancers |
| Dependencies | bmd-sim-core |
| Est. LOC | 1,500-2,000 |

**Key Features:**
- Balloon decoy deployment (post-boost)
- Chaff corridor generation
- Radar frequency jamming
- IR signature simulation
- Decoy discrimination difficulty modeling
- Correlation tracking challenges

---

### 5. Command & Control

#### 5.1 bmd-sim-c2bmc 🔴
**C2BMC Full Emulation (Extended)**

| Parameter | Value |
|-----------|-------|
| Role | Full C2BMC system emulation (not just interface) |
| Federates | 6 (SBIRS, UEWR, TPY-2, Aegis, THAAD, GMD) |
| Track Capacity | 10,000+ |
| Dependencies | bmd-sim-core, bmd-sim-hub (extended) |
| Est. LOC | 5,000-8,000 |

**Key Features:**
- Full track correlation engine (multi-source)
- Sensor tasking and management
- Engagement planning and scheduling
- Weapons allocation optimization
- Kill assessment fusion
- Battle damage assessment
- Communication network simulation (JREAP, Link 16)
- Operator console simulation
- Rules of engagement enforcement
- Deconfliction logic

**ICD Messages:** C2BMC_TASKING, C2BMC_ENGAGEMENT_PLAN, C2BMC_WEAPON_ALLOCATION, C2BMC_BDA, C2BMC_DECONFLICT

---

#### 5.2 bmd-sim-gfcb 🟡
**GFCB (Ground-based Fire Control Battalion)**

| Parameter | Value |
|-----------|-------|
| Role | THAAD fire control and engagement management |
| Dependencies | bmd-sim-core, bmd-sim-thaad |
| Est. LOC | 2,000-3,000 |

**Key Features:**
- THAAD engagement planning
- Fire control solution computation
- Launch authorization simulation
- Kill assessment for THAAD intercepts
- Communication with THAAD radar and launchers

---

#### 5.3 bmd-sim-ifxb 🟢
**IFX (Integrated Fire X-band) Radar Control**

| Parameter | Value |
|-----------|-------|
| Role | X-band fire control radar |
| Frequency | X-band (8-12 GHz) |
| Dependencies | bmd-sim-core |
| Est. LOC | 1,500-2,000 |

---

### 6. Communications

#### 6.1 bmd-sim-link16 🟡
**Link 16 Terminal Emulator**

| Parameter | Value |
|-----------|-------|
| Role | Simulate Link 16 JTIDS/MIDS terminal |
| Messages | J-series (J0-J31) |
| Data Rate | 28.8-115.2 kbps |
| Dependencies | bmd-sim-core, FORGE-C2 |
| Est. LOC | 2,000-3,000 |

**Key Features:**
- Full J-series message generation (J0-J31)
- Time slot allocation modeling
- Network participation group simulation
- TDMA slot assignment
- Message priority queuing
- Latency modeling (0.3-10 seconds)
- Integration with FORGE-C2 JREAP encoder/decoder
- Crypto modeling (TRANSEC)

---

#### 6.2 bmd-sim-jreap 🟡
**JREAP Protocol Simulator**

| Parameter | Value |
|-----------|-------|
| Role | JREAP-A/B/C protocol simulation |
| Protocols | JREAP-A (SATCOM), JREAP-B (LOS), JREAP-C (Link 16) |
| Dependencies | bmd-sim-core |
| Est. LOC | 1,500-2,500 |

**Key Features:**
- JREAP-A: SATCOM message formatting with 500ms+ latency
- JREAP-B: Line-of-sight with 10ms latency
- JREAP-C: Link 16 with J-series formatting
- Message queuing and prioritization
- Bandwidth-limited transmission modeling
- Integration with FORGE-C2 JREAP-C transport layer

---

### 7. Environmental

#### 7.1 bmd-sim-space-weather 🟢
**Space Weather Effects Simulator**

| Parameter | Value |
|-----------|-------|
| Role | Model solar weather impact on sensors |
| Dependencies | bmd-sim-core |
| Est. LOC | 1,500-2,000 |

**Key Features:**
- Solar flare modeling (X1-X10 class)
- Ionospheric scintillation effects on radar
- Auroral clutter modeling
- Radar degradation factors
- IR sensor background modeling
- Kp-index effects on detection probability

---

#### 7.2 bmd-sim-jamming 🟡
**Electronic Warfare / Jamming Simulator**

| Parameter | Value |
|-----------|-------|
| Role | GPS spoofing, radar jamming, IR countermeasures |
| Dependencies | bmd-sim-core |
| Est. LOC | 2,000-3,000 |

**Key Features:**
- GPS spoofing/jamming simulation
- Radar jamming (barrage, spot, swept)
- IR flare and chaff deployment
- Noise floor elevation modeling
- Detection probability degradation
- ECCM effectiveness modeling

---

#### 7.3 bmd-sim-atmospheric 🟢
**Atmospheric Effects Simulator**

| Parameter | Value |
|-----------|-------|
| Role | Atmospheric modeling for radar/IR propagation |
| Dependencies | bmd-sim-core |
| Est. LOC | 1,000-1,500 |

**Key Features:**
- Refractivity modeling (radar beam bending)
- Atmospheric absorption (IR window modeling)
- Weather effects (rain, clouds, fog)
- Seasonal/diurnal variations
- Clutter modeling (ground, sea, rain)

---

## Implementation Order

### Phase 1: Critical BMDS Coverage (Weeks 1-4)
**Goal: End-to-end BMDS kill chain simulation**

| # | Simulator | Priority | Est. LOC | Depends On |
|---|-----------|----------|----------|------------|
| 1 | bmd-sim-sbirs | 🔴 | 3,500 | bmd-sim-core |
| 2 | bmd-sim-uewr | 🔴 | 3,000 | bmd-sim-core |
| 3 | bmd-sim-gmd | 🔴 | 4,000 | bmd-sim-core |
| 4 | bmd-sim-sm3 | 🔴 | 3,500 | bmd-sim-core, bmd-sim-aegis |
| 5 | bmd-sim-icbm | 🔴 | 3,500 | bmd-sim-core |
| 6 | bmd-sim-hgv | 🔴 | 4,000 | bmd-sim-core |
| 7 | bmd-sim-c2bmc | 🔴 | 6,000 | bmd-sim-core, bmd-sim-hub |

### Phase 2: Enhanced Capabilities (Weeks 5-8)
| # | Simulator | Priority | Est. LOC | Depends On |
|---|-----------|----------|----------|------------|
| 8 | bmd-sim-lrdr | 🔴 | 3,500 | bmd-sim-core |
| 9 | bmd-sim-stss | 🔴 | 3,000 | bmd-sim-core |
| 10 | bmd-sim-irbm | 🔴 | 2,500 | bmd-sim-core |
| 11 | bmd-sim-sm6 | 🟡 | 2,500 | bmd-sim-core, bmd-sim-aegis |
| 12 | bmd-sim-jamming | 🟡 | 2,500 | bmd-sim-core |

### Phase 3: Full Spectrum (Weeks 9-12)
| # | Simulator | Priority | Est. LOC | Depends On |
|---|-----------|----------|----------|------------|
| 13 | bmd-sim-link16 | 🟡 | 2,500 | bmd-sim-core, FORGE-C2 |
| 14 | bmd-sim-jreap | 🟡 | 2,000 | bmd-sim-core |
| 15 | bmd-sim-dsp | 🟡 | 1,800 | bmd-sim-core |
| 16 | bmd-sim-cobra-judy | 🟡 | 2,000 | bmd-sim-core |
| 17 | bmd-sim-decoy | 🟡 | 1,800 | bmd-sim-core |
| 18 | bmd-sim-slcm | 🟡 | 2,000 | bmd-sim-core |
| 19 | bmd-sim-gfcb | 🟡 | 2,500 | bmd-sim-core, bmd-sim-thaad |

### Phase 4: Advanced / Nice-to-have (Weeks 13-16)
| # | Simulator | Priority | Est. LOC | Depends On |
|---|-----------|----------|----------|------------|
| 20 | bmd-sim-thaad-er | 🟢 | 1,800 | bmd-sim-core, bmd-sim-thaad |
| 21 | bmd-sim-ifxb | 🟢 | 1,800 | bmd-sim-core |
| 22 | bmd-sim-space-weather | 🟢 | 1,800 | bmd-sim-core |
| 23 | bmd-sim-atmospheric | 🟢 | 1,200 | bmd-sim-core |

---

## Architecture

### Shared Library (bmd-sim-core)

All simulators depend on `bmd-sim-core` for:
- ICD message types and serialization
- Vector3/Matrix math
- Ballistic and guided trajectory modeling
- Radar range equation
- Proportional navigation guidance
- Interceptor engagement physics
- Scenario playback infrastructure
- Common configuration and logging

### ICD Message Protocol

All simulators communicate via a common ICD (Interface Control Document) message protocol, compatible with FORGE-C2's JREAP-C encoder/decoder:

```
Message Flow:
SBIRS → [SBIRS_DETECTION] → C2BMC → [TRACK_UPDATE] → TPY-2 → [DISCRIMINATION] → C2BMC → [ENGAGEMENT_ORDER] → THAAD → [KILL_ASSESSMENT] → C2BMC
```

### FORGE-C2 Integration

Each simulator connects to FORGE-C2 via one of:
1. **REST API** — `/api/inject/sensor` for simple injection
2. **JREAP-C** — Full J-series protocol (UDP/TCP)
3. **Kafka** — Sensor event streaming
4. **WebSocket** — Real-time track updates

---

## Naming Convention

- `bmd-sim-{name}` — All repos follow this pattern
- Go module: `bmd-sim-{name}`
- Binary: `bmd-sim-{name}`
- Main package: `cmd/{name}/main.go`
- API package: `api/`
- Internal logic: `internal/`
- Shared types: `pkg/models/`

---

## Stats Summary

| Category | Count | Total LOC (est.) |
|----------|-------|-------------------|
| Existing | 8 | ~15,000 |
| 🔴 Critical | 8 | ~29,500 |
| 🟡 Important | 8 | ~18,600 |
| 🟢 Nice-to-have | 3 | ~4,800 |
| **Total** | **27** | **~67,900** |

---

*This roadmap will be updated as simulators are completed.*