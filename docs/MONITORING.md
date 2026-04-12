# FORGE-C2 Monitoring Guide

## Prometheus Metrics

FORGE-C2 exposes metrics at `http://localhost:9090/metrics`.

### Key Metrics

| Metric | Type | Description |
|--------|------|-------------|
| `forge_pdu_total` | Counter | Total PDUs processed by type |
| `forge_pdu_encode_duration_seconds` | Histogram | Encode latency |
| `forge_pdu_decode_duration_seconds` | Histogram | Decode latency |
| `forge_active_entities` | Gauge | Active DIS entities |
| `forge_hla_federates` | Gauge | Connected HLA federates |
| `forge_bmds_tracks` | Gauge | Active BMDS tracks |
| `forge_gateway_bridged_total` | Counter | Bridged messages |

### Grafana Dashboard

Import `k8s/grafana-dashboard.json` into Grafana.

## Health Check

```
GET /health
```

Returns:
```json
{
  "status": "healthy",
  "uptime": "24h",
  "version": "1.0.0"
}
```

## Structured Logging

JSON logs sent to stdout, collected by fluentd/logstash.

```json
{
  "level": "info",
  "time": "2024-01-01T12:00:00Z",
  "msg": "PDU encoded",
  "pdu_type": "EntityState",
  "duration_ms": 0.5
}
```
