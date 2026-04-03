# All Services Links and Status

## Quick Access Links

| Service | URL | Port | Status |
|---------|-----|------|--------|
| **Wezzel Dashboard** | http://10.0.0.117:31845/ | 31845 | ✅ Running |
| **GMS Mock UI** | http://10.0.0.117:3001/ | 3001 | ✅ Running |
| **GMS Simulator** | http://10.0.0.117:31595/api/stations | 31595 | ✅ Running |
| **Config Server** | http://10.0.0.117:8888/health | 8888 | ✅ Running |
| **Gateway** | http://10.0.0.117:3000/interactive-analysis-api-gateway/ | 3000 | ✅ Running |
| **SNL-GMS UI** | http://10.0.0.117:8000/ | 8000 | ✅ Running |

## Service Details

### Wezzel Dashboard (Port 31845)

**Formerly:** DoD Dashboard
**Renamed:** 2026-03-15

**Features:**
- ✅ Station monitoring
- ✅ Event visualization
- ✅ Signal detection display
- ✅ Interactive tables
- ✅ Real-time data from GMS Simulator

**Access:** http://10.0.0.117:31845/

### GMS Mock UI (Port 3001)

**Features:**
- ✅ Station table
- ✅ Events table
- ✅ Signal detections table
- ✅ Waveform display
- ✅ Map panel
- ⏳ Adding full interactivity

**Access:** http://10.0.0.117:3001/

### GMS Simulator (Port 31595)

**API Endpoints:**
- GET /api/stations - List all stations
- GET /api/events - List all events
- GET /api/detections - List all detections

**Access:** http://10.0.0.117:31595/api/stations

## Recommended Use

**For full interactivity:** Use Wezzel Dashboard (port 31845)

**For development/testing:** Use GMS Mock UI (port 3001)

**For API access:** Use GMS Simulator (port 31595)

---

*Last Updated: 2026-03-15*
*Renamed by: Wesley Robbins*
