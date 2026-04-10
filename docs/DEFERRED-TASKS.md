# FORGE-C2 Deferred Tasks
## Saved for later continuation

**Last Updated:** 2026-04-10

---

## 📋 Remaining Work (Not Started)

### 1. Push Documentation to GitLab Web UI
**Priority:** Medium
**Status:** Not started

**Task:** Push FORGE-C2 docs to stsgym-forge GitLab project on darth
- URL: `http://100.92.94.92:30880/root/stsgym-forge`
- Token: `glpat-6gKpQwXhUUBH-PGAL4__`
- Docs to push:
  - `docs/FORGE-C2-TECHNICAL-PAPER.md`
  - `docs/ROADMAP.md`
  - `docs/PACK-BUGS.md`
  - `TODO.md`

**Commands:**
```bash
# Clone stsgym-forge and copy docs
git clone http://root:glpat-6gKpQwXhUUBH-PGAL4__@100.92.94.92:30880/root/stsgym-forge.git /tmp/stsgym-forge
cp docs/*.md /tmp/stsgym-forge/docs/
cd /tmp/stsgym-forge && git add . && git commit && git push
```

---

### 2. Create PPTX from Markdown
**Priority:** Medium
**Status:** Not started

**Task:** Convert markdown slides to actual PowerPoint file

**Files needed:**
- `docs/FORGE-C2-TECHNICAL-PAPER.md` (already has slide-like structure)

**Commands:**
```bash
python3 -m venv /tmp/pptx-venv
source /tmp/pptx-venv/bin/activate
pip install python-pptx
# See scripts/generate-pptx.py pattern
```

**Slide structure from paper:**
1. Title: "FORGE-C2: Link 16 JREAP-C Missile Defense Simulation"
2. Architecture Overview
3. J-Series Message Hierarchy
4. Encoder/Decoder System
5. Data Flow Diagrams
6. Integration Points
7. Testing & CI/CD
8. Roadmap & Phases
9. References

---

### 3. Phase 3 Integration Tasks
**Priority:** High
**Status:** Not started (In Progress was ~20%)

#### 3.1 Full Encoder/Decoder Registry Wiring
- [ ] Register J8 through J31 in encoder registry
- [ ] Register J8 through J31 in decoder registry
- [ ] Add error return for unregistered message types
- [ ] Use type assertion with ok-check pattern
- [ ] Add integration test: encode then decode J8-J31 types

#### 3.2 QualityFlags Pipeline
- [ ] Define `QualityFlags` type in `mdpa/metadata.go`
- [ ] Add `QualityFlags` field to `FORGETrackExtension` struct
- [ ] In `correlator.go`: set QualityFlags on outgoing metadata
- [ ] In `kafka.go`: carry QualityFlags to JREAP output
- [ ] Add roundtrip test: track with known flags → encode → decode → verify flags preserved

#### 3.3 CorrelationID Propagation
- [ ] Generate UUID for CorrelationID on track creation
- [ ] Add `CorrelationID` field to `FORGETrackExtension`
- [ ] In `correlator.go`: assign CorrelationID on new tracks
- [ ] In `server.go`: propagate CorrelationID through JREAP output
- [ ] Add test: sensor event → correlator → track → verify CorrelationID set

#### 3.4 J0/J1 Network Management Wiring
- [ ] Define network events that trigger J0/J1 generation
- [ ] Wire J0 into `track_mgr_handler.go`
- [ ] Wire J1 into `network_handler.go`
- [ ] Add J0/J1 integration tests

#### 3.5 Remaining Roundtrip Tests
- [ ] J8 Radio roundtrip at 3 lengths (0, 128, 256)
- [ ] J14-J17 Command roundtrip
- [ ] J18 SpaceTrack roundtrip
- [ ] J28-J31 roundtrip

#### 3.6 Internal Handlers Integration
- [ ] Wire encoder into `track_mgr_handler.go`
- [ ] Wire decoder into `jreap_consumer.go`
- [ ] Wire encoder into `alert_handler.go`
- [ ] Wire encoder into `engagement_handler.go`
- [ ] Add kafka → decoder → handler → encoder → kafka test

---

### 4. Phase 4 Gateway Expansion
**Priority:** Medium
**Status:** Not started

#### 4.1 DIS Gateway
- [ ] Entity State PDU encoder
- [ ] Fire/Detonation PDU encoder
- [ ] DIS Header encoder
- [ ] DIS Decoder (incoming)

#### 4.2 HLA Gateway
- [ ] RTI interface wrapper
- [ ] Object Model encoder
- [ ] Federation config

#### 4.3 TENA Integration
- [ ] TENA middleware integration
- [ ] Range interconnect config

---

### 5. Phase 5 MDPAF Compliance
**Priority:** Low
**Status:** Not started

- [ ] Full MDPAF metadata mapping
- [ ] RMF compliance documentation
- [ ] STIGs checklist
- [ ] Accreditation artifacts

---

### 6. Phase 6 Production Hardening
**Priority:** Low
**Status:** Not started

- [ ] Kubernetes Deployment manifests
- [ ] HA proxy config
- [ ] Prometheus metrics
- [ ] Grafana dashboard
- [ ] Performance tuning

---

## Current State (2026-04-10)

### ✅ Complete
- Phase 1-2: Core JREAP + J-series coverage
- 13 roundtrip tests passing (J0, J1, J2, J3, J4, J5, J6, J7, J9, J10, J11, J12, J13, J26, J27)
- Bug fixes: J0PayloadSize, J2 SensorID, J3PayloadSize, J6 lat/lon, J11 offset, J11/J26 sizes
- CI/CD pipeline (`.gitlab-ci.yml`)
- Documentation: Technical Paper, Roadmap, TODO.md v2.0, PACK-BUGS.md

### 🚧 Next Up
- Phase 3 Integration (~20% complete per TODO, but most work remains)

### 📋 Repo Info
- **Repo:** `git@idm.wezzel.com:crab-meat-repos/forge-c2-go.git`
- **Local:** `~/forge-c2-go-src/`
- **Tests:** `go test ./jreap/...` (all passing)

---

*This file serves as a bookmark for deferred work.*
*Move tasks to TODO.md as they become active.*
