# Accreditation Package for FORGE-C2

## Document Control

| Field | Value |
|-------|-------|
| System Name | FORGE-C2 (FORGE Command and Control) |
| Version | 1.0 |
| Classification | Unclassified // FOR OFFICIAL USE ONLY |
| Author | STSGYM Security Team |
| Date | 2026-04-10 |

---

## 1. System Description

### 1.1 Purpose
FORGE-C2 is a Link 16 J-series message encoder/decoder gateway that provides interoperability between:
- Link 16 networks (J0-J31 messages)
- DIS (Distributed Interactive Simulation) IEEE 1278.1
- HLA (High Level Architecture) IEEE 1516
- TENA (Test and Training Enabling Architecture)

### 1.2 Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                      FORGE-C2 Gateway                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────┐  │
│  │  J0-J31 │  │   DIS   │  │   HLA   │  │    TENA     │  │
│  │ Link 16 │  │ IEEE    │  │ IEEE    │  │   2022      │  │
│  │ Encoder │  │ 1278.1  │  │ 1516    │  │ Middleware  │  │
│  └────┬────┘  └────┬────┘  └────┬────┘  └──────┬──────┘  │
│       │              │            │               │          │
│  ┌────┴──────────────┴────────────┴───────────────┴────┐   │
│  │              MDPAF Metadata Framework                │   │
│  │         (End-to-End Track Correlation)              │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 1.3 Components

| Component | Technology | Location |
|-----------|------------|----------|
| J-series Encoder/Decoder | Go 1.22 | internal/jreap/ |
| DIS Gateway | Go | internal/dis/ |
| HLA Federation | Go | internal/hla/ |
| TENA Middleware | Go | internal/tena/ |
| MDPAF Metadata | Go | mdpa/ |
| Build System | Docker | Containerized |
| CI/CD | GitLab | .gitlab-ci.yml |

---

## 2. Security Controls Implementation

### 2.1 Access Control (AC)
- [x] AC-2: Account management via auth.stsgym.com
- [x] AC-3: JWT validation on all API endpoints
- [x] AC-6: Least privilege for service accounts

### 2.2 Audit and Accountability (AU)
- [x] AU-2: Event logging for all J-series operations
- [x] AU-3: Structured audit records with Correlation ID
- [x] AU-4: Log storage with rotation
- [x] AU-9: Audit information protection

### 2.3 Configuration Management (CM)
- [x] CM-2: Baseline configuration in git
- [x] CM-3: Configuration change control
- [x] CM-6: Configuration settings documented

### 2.4 Identification and Authentication (IA)
- [x] IA-2: JWT-based authentication
- [x] IA-3: Device identification via Tailscale
- [x] IA-5: Authenticator management

### 2.5 System and Communications Protection (SC)
- [x] SC-3: Security function isolation (containers)
- [x] SC-8: Transmission confidentiality (TLS)
- [x] SC-12: Cryptographic key establishment
- [x] SC-13: Cryptographic protection

---

## 3. System Boundary

### 3.1 Network Architecture
```
Internet
   |
   v
Cloudflare WAF
   |
   +-- auth.stsgym.com:443 (SSO)
   |
   v
miner.stsgym.com (Tailscale 100.116.245.125)
   |
   +-- bedimsecurity.com:443 (Docker)
   +-- photos.stsgym.com:443 (Docker)
   +-- FORGE-C2 Gateway (Internal)
         |
         +-- darth.stsgym.com:30880 (Dev K8s)
```

### 3.2 Data Flows

| Flow | Protocol | Encryption | Classification |
|------|----------|-----------|----------------|
| External API | HTTPS/TLS 1.3 | Yes | Per-content |
| Internal Gateway | gRPC | TLS | Same as content |
| Tailscale VPN | WireGuard | Yes | All |
| Log Storage | Local FS | At-rest | Per-log |

---

## 4. Risk Assessment

### 4.1 Threat Sources

| Threat Source | Motivation | Capability | Risk Level |
|---------------|------------|------------|------------|
| External Attackers | Financial/Strategic | Medium | Medium |
| Insider Threat | Revenge/Financial | High | Low |
| Nation-State | Intelligence | Very High | Low |
| Malware | Self-propagation | Medium | Low |

### 4.2 Known Vulnerabilities

| Vulnerability | CVSS | Remediation | Status |
|---------------|------|-------------|--------|
| None identified | - | - | - |

---

## 5. Test Plan

### 5.1 Unit Tests
```bash
go test ./jreap/...      # J-series roundtrip tests
go test ./internal/dis/... # DIS PDU tests
go test ./internal/hla/... # HLA tests
go test ./internal/tena/... # TENA tests
go test ./mdpa/...        # MDPAF tests
```

### 5.2 Integration Tests
```bash
go test ./internal/gateway/... # Cross-protocol tests
```

### 5.3 Security Tests
- [ ] Static analysis: `go vet ./...`
- [ ] Dependency scan: `govulncheck ./...`
- [ ] Container scan: Trivy on Docker images

---

## 6. Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Author | FORGE Team | | |
| Reviewer | Security Lead | | |
| Approver | ISSO | | |

---

## Appendix A: Test Results

See: `internal/*_test.go` for automated test results.

## Appendix B: Configuration

See: `docs/mdpa/RMF-COMPLIANCE.md`

## Appendix C: STIGs Checklist

See: `docs/mdpa/STIGS-CHECKLIST.md`
