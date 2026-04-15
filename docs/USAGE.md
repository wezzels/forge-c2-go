# FORGE-C2 Usage Guide

**Version:** 1.0 | **Date:** 2026-04-15 | **Classification:** Unclassified // FOUO

---

## Table of Contents

1. [Quick Start](#1-quick-start)
2. [REST API](#2-rest-api)
3. [WebSocket API](#3-websocket-api)
4. [JREAP Interface](#4-jreap-interface)
5. [DIS Gateway](#5-dis-gateway)
6. [HLA Gateway](#6-hla-gateway)
7. [TENA Gateway](#7-tena-gateway)
8. [Monitoring](#8-monitoring)
9. [Security](#9-security)
10. [Message Types Reference](#10-message-types-reference)

---

## 1. Quick Start

```bash
# Start server
./forge-c2 serve --port 8080 --jreap-udp-port 5000

# Check it's running
curl http://localhost:8080/health
# → {"status":"ok","uptime":"2s","active_tracks":0,...}
```

---

## 2. REST API

All endpoints return JSON. Base URL: `http://localhost:8080`

### System Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check with subsystem status |
| GET | `/ready` | Readiness probe |
| GET | `/metrics` | Prometheus-format metrics |
| GET | `/api/status` | Server status |

### Track Management

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/tracks` | List all active tracks |
| GET | `/api/tracks/{id}` | Get a specific track |
| POST | `/api/tracks` | Create a track (JSON body) |
| GET | `/api/correlator/stats` | Correlator statistics |

### Engagement & Alerts

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/alerts` | List active alerts |
| GET | `/api/c2bmc/status` | C2BMC interface status |
| GET | `/api/c2bmc/engagements` | List active engagements |

### Sensor Event Injection (Testing)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/inject/sensor` | Inject a test sensor event |

#### Example: Inject Sensor Event

```bash
curl -X POST http://localhost:8080/api/inject/sensor \
  -H "Content-Type: application/json" \
  -H "X-CSRF-Token: your-token" \
  -d '{
    "event_id": "TEST-001",
    "sensor_id": "SBIRS-GEO-1",
    "sensor_type": "OPIR",
    "latitude": 33.75,
    "longitude": -117.85,
    "altitude": 35786000,
    "intensity": 0.92
  }'
```

#### Example: Get Tracks

```bash
curl http://localhost:8080/api/tracks | jq .
# → {"tracks":[...],"count":3}
```

---

## 3. WebSocket API

Connect to receive real-time track updates.

### Endpoints

| Path | Description |
|------|-------------|
| `ws://localhost:8080/ws/c2` | C2 dashboard updates (tracks, engagements) |
| `ws://localhost:8080/ws/alerts` | Alert notifications |

### Message Types (ws/c2)

**Track Update:**
```json
{
  "type": "track_update",
  "is_new": true,
  "track": {
    "track_id": "TRK-0001",
    "track_number": 1,
    "status": "NEW",
    "latitude": 33.75,
    "longitude": -117.85,
    "altitude": 10000,
    "speed": 250,
    "heading": 180,
    "threat_level": 3,
    "force_type": "HOSTILE",
    "quality_flags": 24,
    "correlation_id": "SBIRS-GEO-1-0001-1710300000000"
  }
}
```

**Track Dropped:**
```json
{
  "type": "track_dropped",
  "track_id": "TRK-0001"
}
```

**C2BMC State:**
```json
{
  "type": "c2bmc_state",
  "engagements": [...],
  "weapons": [...]
}
```

### JavaScript Example

```javascript
const ws = new WebSocket('ws://localhost:8080/ws/c2');

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.type === 'track_update') {
    console.log(`Track ${msg.track.track_id}: ${msg.track.force_type}`);
  }
};

ws.onerror = (err) => console.error('WS error:', err);
```

---

## 4. JREAP Interface

FORGE-C2 sends and receives MIL-STD-3011 JREAP-C messages over UDP and TCP.

### Transport

| Protocol | Default Port | Use Case |
|----------|-------------|----------|
| UDP | 5000 | Low-latency track updates, fire/detonation |
| TCP | 5001 | Reliable engagement orders, file transfers |

### JREAP-C Header Format

```
Octets 0-1:  Protocol Flags (0x0001 = JREAP-C)
Octet 2:     Message Type (J0=0, J1=1, ..., J31=31)
Octet 3:     Reserved (0x00)
Octets 4-7:  Message Length (network byte order)
Octets 8-N:  J-series Payload
Last 2:      CRC-16 (Ethernet polynomial)
```

### Sending JREAP Messages

```go
import (
    "forge-c2/jreap"
    "forge-c2/jreap/jseries"
    "forge-c2/mdpa"
)

// Create encoder
enc := jreap.NewEncoder("node1", "app1")

// Encode a J0 Track Management message
j0 := &jseries.J0TrackManagement{
    TrackNumber: 42,
    ForceType:   2, // HOSTILE
    Time:        time.Now().UTC(),
    Latitude:    38.0,
    Longitude:   -77.0,
    Altitude:    10000,
    Speed:       300,
    Heading:     270,
}
encoded, err := enc.EncodeUsing(jreap.J0_TrackManagement, j0)

// Send via UDP
conn, _ := net.DialUDP("udp", nil, &net.UDPAddr{Port: 5000})
conn.Write(encoded)
```

### Receiving JREAP Messages

```go
// Create decoder
dec := jreap.NewDecoder("node1", "app1")

// Decode incoming message
msg, msgType, err := dec.DecodeUsing(receivedBytes)
switch msgType {
case jreap.J0_TrackManagement:
    j0 := msg.(*jseries.J0TrackManagement)
    fmt.Printf("Track %d at (%.4f, %.4f)\n", j0.TrackNumber, j0.Latitude, j0.Longitude)
case jreap.J12_Alert:
    j12 := msg.(*jseries.J12Alert)
    fmt.Printf("Alert type %d severity %d\n", j12.AlertType, j12.Severity)
}
```

### High-Level Encoding

```go
// Sensor event → J28 OPIR message
meta := mdpa.NewMDPAMetadata("node1", "OPIR-INGEST", "corr-001", "SECRET//NOFORN")
encoded, err := enc.EncodeSensorEvent(sensorEvent, meta)

// Track → J3 Track Update
encoded, err := enc.EncodeTrack(track, meta)
```

---

## 5. DIS Gateway

The DIS gateway receives IEEE 1278.1 PDUs on UDP and bridges them to JREAP.

### Configuration

```bash
./forge-c2 serve --dis-port 3000
```

### PDU Mapping

| DIS PDU | → | JREAP Message |
|---------|---|---------------|
| Entity State (Type 1) | → | J0 Track Management |
| Fire (Type 3) | → | J4 Engagement Order |
| Detonation (Type 4) | → | J5 Engagement Status |
| Entity State Update (Type 2) | → | J0 Track Management |

### Callbacks (Go API)

```go
gw := gateway.NewDISGateway(config, encoder, meta)

gw.OnEntityState = func(pdu *dis.DISEntityStatePDU) {
    fmt.Printf("Entity %d at (%.2f, %.2f)\n",
        pdu.EntityNumber, pdu.Latitude, pdu.Longitude)
}

gw.OnFire = func(pdu *dis.DISFirePDU) {
    fmt.Printf("Fire from %d → %d\n",
        pdu.FiringEntityNumber, pdu.TargetEntityNumber)
}

gw.Start()
```

### Sending DIS PDUs

```go
pdu := dis.NewEntityStatePDU(1, 2, 42)
pdu.SetLocation(38.0, -77.0, 10000)
pdu.SetVelocity(300, 0, 0)
gw.SendEntityState(pdu)
```

### J-Series → DIS

```go
disPdu := gateway.J0ToDIS(j0Message, siteID, appID)
gw.SendEntityState(disPdu)
```

---

## 6. HLA Gateway

### Starting the HLA Gateway

```go
config := gateway.DefaultHLAGatewayConfig()
config.FederationName = "FORGE-Federation"
config.FederateName = "FORGE-C2-HLA"

gw := gateway.NewHLAGateway(config, encoder, meta)
gw.Start()
```

### Publishing Entities

```go
entity := hla.NewEntity(1, 2, 42)
entity.SetLocation(38.0, -77.0, 10000)
entity.SetVelocity(300, 0, 0)
entity.ForceID = hla.ForceOpposing

handle, _ := gw.PublishEntity(entity)
```

### Subscribing to Updates

```go
gw.OnReflectAttrs = func(handle uint32, attrs map[uint32][]byte, tag []byte) {
    fmt.Printf("HLA update for object %d\n", handle)
}
```

### J0 → HLA Conversion

```go
entity := gateway.J0ToHLA(j0Message, siteID, appID)
gw.PublishEntity(entity)
```

### Time Management

```go
gw.AdvanceTime(time.Now())
logicalTime := gw.QueryLogicalTime()
```

---

## 7. TENA Gateway

### Starting the TENA Gateway

```go
config := gateway.DefaultTENAGatewayConfig()
config.SessionID = 1

gw := gateway.NewTENAGateway(config, encoder, meta)
gw.Start()
```

### Cross-Protocol Registration

```go
// Register TENA instance → DIS entity
gw.RegisterTENAToDIS(tenaInstanceID, disEntityID)

// Register TENA instance → HLA object
gw.RegisterTENAToHLA(tenaInstanceID, hlaObjectHandle)

// Synchronize
gw.SyncTENAToDIS(tenaInstanceID)
gw.SyncTENAToHLA(tenaInstanceID, attrs)
```

### Discovery

```go
gw.OnDiscoverGateway = func(ann *tena.GatewayAnnouncement) {
    fmt.Printf("Discovered gateway: %s\n", ann.GatewayID)
}

gateways := gw.DiscoverGateways()
```

### J0 → TENA Conversion

```go
trackData := gateway.J0ToTENA(j0Message, sessionID)
```

---

## 8. Monitoring

### Prometheus Metrics

Endpoint: `GET /metrics`

| Metric | Type | Description |
|--------|------|-------------|
| `forge_c2_sensor_events_processed_total` | counter | Sensor events ingested |
| `forge_c2_tracks_created_total` | counter | New tracks created |
| `forge_c2_tracks_updated_total` | counter | Track updates |
| `forge_c2_tracks_dropped_total` | counter | Tracks dropped |
| `forge_c2_jreap_messages_encoded_total` | counter | JREAP messages encoded |
| `forge_c2_jreap_messages_decoded_total` | counter | JREAP messages decoded |
| `forge_c2_jreap_encode_errors_total` | counter | JREAP encode failures |
| `forge_c2_jreap_decode_errors_total` | counter | JREAP decode failures |
| `forge_c2_dis_pdus_sent_total` | counter | DIS PDUs sent |
| `forge_c2_dis_pdus_received_total` | counter | DIS PDUs received |
| `forge_c2_hla_updates_sent_total` | counter | HLA updates sent |
| `forge_c2_hla_updates_received_total` | counter | HLA updates received |
| `forge_c2_engagement_orders_total` | counter | Engagement orders |
| `forge_c2_engagement_complete_total` | counter | Engagements completed |
| `forge_c2_alerts_generated_total` | counter | Alerts generated |
| `forge_c2_active_tracks` | gauge | Current track count |
| `forge_c2_active_ws_clients` | gauge | WebSocket connections |
| `forge_c2_active_engagements` | gauge | Active engagements |
| `forge_c2_jreap_encode_latency_avg_us` | gauge | Avg encode latency (μs) |
| `forge_c2_jreap_decode_latency_avg_us` | gauge | Avg decode latency (μs) |
| `forge_c2_uptime_seconds` | gauge | Server uptime |

### Grafana Dashboard

Import `deploy/grafana/forge-c2.json` into Grafana for a pre-built dashboard with 10 panels.

### Alerting Rules

See `deploy/alertmanager/prometheus-rules.yml` for 6 built-in alert rules:

| Alert | Severity | Trigger |
|-------|----------|---------|
| FORGEC2InstanceDown | critical | Prometheus can't reach /metrics |
| FORGEC2NoSensorEvents | critical | Zero events for 10 min |
| FORGEC2NoTracks | warning | Zero tracks for 10 min |
| FORGEC2HighErrorRate | warning | JREAP errors > 10/min for 5 min |
| FORGEC2HighLatency | warning | Encode latency > 10ms for 5 min |
| FORGEC2RateLimitExceeded | warning | HTTP errors > 100/min |

---

## 9. Security

### CSRF Protection

State-changing requests (POST, PUT, DELETE) require an `X-CSRF-Token` header matching the `csrf_token` cookie.

```bash
# Get CSRF cookie from a GET request, then include token in POST
curl -c cookies.txt http://localhost:8080/api/tracks
curl -b cookies.txt -X POST http://localhost:8080/api/tracks \
  -H "X-CSRF-Token: $(grep csrf_token cookies.txt | awk '{print $NF}')" \
  -H "Content-Type: application/json" \
  -d '{"track_id":"TRK-001",...}'
```

### CORS

Set `SECURITY_ALLOWED_ORIGINS` to restrict cross-origin access:

```bash
export SECURITY_ALLOWED_ORIGINS=https://forge.example.com,https://stsgym.com
```

### Rate Limiting

Default: 60 requests/minute per IP, burst of 10. Adjust via:

```bash
export SECURITY_RATE_LIMIT=200
export SECURITY_RATE_BURST=30
```

### Security Headers (automatic)

All responses include:
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Content-Security-Policy: default-src 'self'`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

---

## 10. Message Types Reference

### J-Series Messages (J0-J31)

| Type | Name | Payload Size | Key Fields |
|------|------|-------------|------------|
| J0 | Track Management | 48 B | Track#, Force, Lat/Lon/Alt, Speed, Heading |
| J1 | Network Initialize | 24 B | NetworkID, ParticipantCount, Status |
| J2 | Surveillance | 44 B | Track#, Lat/Lon/Alt, SignalIntensity, SNR |
| J3 | Track Update | 36 B | Track#, Lat/Lon/Alt, Speed, Heading |
| J4 | Engagement Order | 28 B | EngagementID, Track#, Priority, Weapon, InterceptProb |
| J5 | Engagement Status | 32 B | EngagementID, Stage, InterceptResult |
| J6 | Sensor Registration | 28 B | SensorType, PlatformType, Lat/Lon, MaxRange |
| J7 | Platform Data | 32 B | PlatformType, Status, Lat/Lon |
| J8 | Radio | Variable | Track#, Subtype, MessageLength/Text |
| J9 | Electronic Attack | 40 B | EA Type, Status |
| J10 | Offset | 20 B | Offset data |
| J11 | Data Transfer | Variable | Transfer data |
| J12 | Alert | 45 B | AlertID, AlertType, Severity, Lat/Lon |
| J13 | Precise Participant | 28 B | Participant data |
| J14 | Process Spec | 20 B | Process specification |
| J15 | Command | 24 B | Command data |
| J16 | Acknowledge | 16 B | Acknowledgment |
| J17 | Initiate Transfer | 24 B | Transfer initiation |
| J18 | Space Track | 44 B | Track#, Lat/Lon/Alt (orbital) |
| J19 | Component | 52 B | Track#, ComponentID, Lat/Lon/Vel |
| J20 | Air Track | 34 B | Track#, Lat/Lon/Alt, Speed, IFF |
| J21 | Surface Track | 36 B | Track#, ShipType, CourseOverGround |
| J22 | Subsurface Track | 36 B | Track#, Depth, SonarType |
| J23 | Land Track | 34 B | Track#, VehicleType, Formation |
| J24 | Foreign Equipment | 34 B | EquipmentType, Nation |
| J25 | Production Level | 36 B | SystemType, Throughput, Utilization |
| J26 | Test | 16 B | Test message |
| J27 | Time | 8 B | Time reference |
| J28 | Satellite OPIR | 48 B | SatelliteID, IR Intensity, BackgroundTemp |
| J29 | Symbology | 32 B | Symbology data |
| J30 | IFF | 24 B | IFF mode/data |
| J31 | File Transfer | Variable | File data |

### DIS PDU Types

| Type | Name | FORGE-C2 Bridge |
|------|------|-----------------|
| 1 | Entity State | ↔ J0 Track Management |
| 2 | Entity State Update | → J0 Track Management |
| 3 | Fire | ↔ J4 Engagement Order |
| 4 | Detonation | ↔ J5 Engagement Status |

### MDPAF Metadata Fields

Every message carries these metadata fields:

| Field | Type | Description |
|-------|------|-------------|
| ProcessingNodeID | string | FORGE node that processed the message |
| IngestTimestamp | time.Time | When received (UTC) |
| QualityFlags | uint8 bitfield | Quality/SNR/Correlated/Fused indicators |
| Classification | string | Security classification marking |
| ApplicationID | string | MDPAF app (e.g., "OPIR-INGEST", "TRK-INIT") |
| CorrelationID | string | End-to-end tracking identifier |

---

*FORGE-C2 v1.0 — STSGYM*