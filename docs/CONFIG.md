# FORGE-C2 Configuration Reference

## config.yaml

```yaml
server:
  host: "0.0.0.0"        # Bind address
  port: 8080             # HTTP port
  metrics_port: 9090     # Prometheus metrics port

# DIS (Distributed Interactive Simulation)
dis:
  enabled: true
  exercise_id: 1         # Exercise identifier
  site_number: 1          # Site number
  application_number: 1   # Application number
  multicast_group: "239.1.2.3"
  multicast_port: 3000

# HLA (High Level Architecture)
hla:
  enabled: true
  rti_host: "localhost:13988"
  federation_name: "FORGE-Federation"
  federate_name: "FORGE-C2"
  fom_path: "./fom/standard.fom"

# J-series (Link 16)
jseries:
  enabled: true
  network_number: 1
  site_number: 1
  mission_number: 1
 jtid:
    enabled: true
    host: "localhost:4000"

# TENA (Test and Training Enable)
tena:
  enabled: false
  registry_host: "localhost:5000"

# BMDS (Ballistic Missile Defense System)
bmds:
  enabled: false
  host: "localhost:8443"
  tls: true
  heartbeat_interval: 5s

# Gateway (Protocol Bridging)
gateway:
  dis_to_hla: true
  dis_to_tena: true
  hla_to_dis: true

# Optimization
swap:
  object_pool_size: 1000
  ring_buffer_size: 10000
  worker_pool_size: 10

# Logging
logging:
  level: "info"          # debug, info, warn, error
  format: "json"         # json, text
```

## Environment Variables

| Variable | Config Path | Default | Description |
|----------|-------------|---------|-------------|
| `FORGE_CONFIG` | - | `/app/config.yaml` | Config file path |
| `FORGE_LOG_LEVEL` | `logging.level` | `info` | Log level |
| `FORGE_DIS_EXERCISE` | `dis.exercise_id` | `1` | DIS exercise ID |

## CLI Flags

```
--config PATH     Config file (default: config.yaml)
--log-level LEVEL Log level (default: info)
--host ADDR       Server bind address (default: 0.0.0.0)
--port PORT       Server port (default: 8080)
```
