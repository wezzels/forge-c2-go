# RMF Compliance Documentation for FORGE-C2

## Overview
This document maps NIST SP 800-53 Rev 5 Security Controls to the FORGE-C2 implementation.

---

## Security Control Families

### AC - Access Control

| Control | Description | Implementation |
|---------|-------------|----------------|
| AC-2 | Account Management | User accounts managed via auth.stsgym.com SSO; API keys for service accounts |
| AC-3 | Access Enforcement | JWT validation on all endpoints; role-based access in middleware |
| AC-6 | Least Privilege | Service accounts with minimal required permissions |
| AC-7 | Unsuccessful Logons | Failed login tracking; account lockout after 5 attempts |
| AC-8 | System Use Notification | Login banners for classified systems |
| AC-17 | Remote Access | Tailscale VPN required; SSH key-based authentication |

### AU - Audit and Accountability

| Control | Description | Implementation |
|---------|-------------|----------------|
| AU-2 | Event Logging | All J-series operations logged with timestamp, user, action |
| AU-3 | Content of Audit Records | Correlation ID, track ID, user ID, action type, timestamp |
| AU-4 | Audit Log Storage | Logs stored in /var/log/forge-c2; rotated weekly |
| AU-5 | Response to Audit Failures | Alert on log write failure; fallback to stderr |
| AU-6 | Audit Record Review | Daily log review via cron; anomalies flagged |
| AU-7 | Audit Record Reduction | Log aggregation by correlation ID |
| AU-9 | Protection of Audit Information | Root-only read; immutable append-only |

### CM - Configuration Management

| Control | Description | Implementation |
|---------|-------------|----------------|
| CM-2 | Baseline Configuration | Docker images versioned; config via environment variables |
| CM-3 | Configuration Change Control | All changes via git; code review required |
| CM-5 | Access Restrictions for Changes | sudo-only for production; peer review |
| CM-6 | Configuration Settings | Hardened OS; SELinux/AppArmor enabled |
| CM-7 | Least Functionality | Only required services running; unused ports blocked |

### IA - Identification and Authentication

| Control | Description | Implementation |
|---------|-------------|----------------|
| IA-2 | Identification and Authentication | JWT tokens from auth.stsgym.com; 24h expiry |
| IA-3 | Device Identification | Tailscale node certificates |
| IA-5 | Authenticator Management | API keys rotated quarterly; SSH keys annual |
| IA-7 | Cryptographic Module Authentication | TLS 1.3 for all external connections |

### IR - Incident Response

| Control | Description | Implementation |
|---------|-------------|----------------|
| IR-4 | Incident Handling | Incident response playbook in docs/incidents/ |
| IR-5 | Incident Monitoring | Prometheus alerts on anomalies |
| IR-6 | Incident Reporting | Automated alerts to security team |
| IR-7 | Incident Response Assistance | Security contact: wlrobbi@stsgym.com |

### SC - System and Communications Protection

| Control | Description | Implementation |
|---------|-------------|----------------|
| SC-3 | Security Function Isolation | Network namespaces; container isolation |
| SC-5 | Denial of Service Protection | Rate limiting; connection limits |
| SC-7 | Boundary Protection | Firewall rules; VPN required |
| SC-8 | Transmission Confidentiality | TLS 1.3; Link 16 encryption |
| SC-12 | Cryptographic Key Establishment | ECDSA keys for J-series signatures |
| SC-13 | Cryptographic Protection | AES-256 for data at rest; TLS for transit |
| SC-28 | Protection of Information at Rest | Encrypted volumes on production |

### SI - System and Information Integrity

| Control | Description | Implementation |
|---------|-------------|----------------|
| SI-2 | Flaw Remediation | Security patches within 72h |
| SI-3 | Malicious Code Protection | Container scanning; noexec on /tmp |
| SI-4 | System Monitoring | Prometheus metrics; alerting |
| SI-7 | Software, Firmware, Information Integrity | Code signing for releases |

---

## Data Flow Boundaries

```
Internet
   |
   v
Cloudflare WAF --> auth.stsgym.com (SSO)
   |
   v
miner:207.244.226.151
   |
   +-- bedimsecurity.com:5013 (Docker)
   +-- photos.stsgym.com:5009 (Docker)
   +-- forge-c2 (Internal Gateway)
         |
         +-- internal/dis (IEEE 1278.1)
         +-- internal/hla (IEEE 1516)
         +-- internal/tena (TENA 2022)
         +-- mdpa (MDPAF Metadata)
```

---

## Key Management

| Key Type | Algorithm | Rotation | Storage |
|----------|----------|----------|---------|
| TLS Certificates | ECDSA P-256 | 90 days | /etc/letsencrypt/ |
| API Keys | SHA-256 | Quarterly | Environment variables |
| J-series Signatures | ECDSA | Annual | HSM (future) |

---

## System Security Plan (SSP) Reference

See: `docs/mdpa/SSP-TEMPLATE.md`

---

## Compliance Verification

```bash
# Run security checks
go test ./...  # Unit tests
# TODO: Add compliance tests
```
