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

## Certificate Management (SPIFFE/SPIRE)

FORGE-C2 supports SPIFFE workload API for certificate rotation.

```yaml
spiffe:
  enabled: true
  socket_path: "/var/run/spire/socket/agent.sock"
  trust_domain: "forge-c2.internal"
```

### Manual Cert Rotation

```bash
# Rotate TLS certificate
forge-c2 cert rotate --cert /certs/server.crt --key /certs/server.key
```

## Vulnerability Scanning

```bash
# Trivy
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image forge-c2:latest --severity HIGH,CRITICAL

# Grype  
docker run -v /var/run/docker.sock:/var/run/docker.sock \
  anchore/grype:latest forge-c2:latest

# Snyk
snyk container test forge-c2:latest
```

## Penetration Testing

### Quick Test

```bash
# nmap scan
nmap -sV -p 8080,9090 localhost

# Test TLS
openssl s_client -connect localhost:8080

# Test authentication
curl -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"test"}'
```

### Security Checklist

- [ ] TLS 1.2+ enforced
- [ ] mTLS client certs validated
- [ ] RBAC roles enforced
- [ ] Audit log capturing auth events
- [ ] No default credentials
- [ ] Secrets not in config files
