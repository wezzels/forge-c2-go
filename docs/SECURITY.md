# FORGE-C2 Security Guide

## TLS Configuration

```yaml
tls:
  enabled: true
  cert_file: /certs/server.crt
  key_file: /certs/server.key
  min_version: "1.2"
```

## mTLS (Mutual TLS)

```yaml
mtls:
  enabled: true
  ca_file: /certs/ca.crt
  verify_client: true
```

## RBAC

```yaml
rbac:
  enabled: true
  admin_role: "forge-admin"
  readonly_role: "forge-readonly"
```

## Audit Logging

```yaml
audit:
  enabled: true
  file: /var/log/forge-c2/audit.log
  events:
    - login
    - config_change
    - pdu_send
```

## Vulnerability Scanning

```bash
# Trivy scanner
trivy image --severity HIGH,CRITICAL forge-c2:latest

# Grype
grype forge-c2:latest
```
