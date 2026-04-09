# Security Audit Report - April 8, 2026

## Executive Summary

| Status | Finding |
|--------|---------|
| **CRITICAL FIXED** | Fail2ban bantime was 15 seconds (useless) - now 24 hours |
| **HIGH** | 7,731 SSH failed attempts in 24 hours on miner |
| **INFO** | All SSL certificates valid (59-87 days remaining) |
| **INFO** | Wazuh SIEM operational with all agents connected |
| **INFO** | RPI42 has no firewall (UFW not installed) |

---

## Servers Audited

| Server | IP | Role | Status |
|--------|-----|------|--------|
| miner | 207.244.226.151 | Production web | Audited |
| darth | 10.0.0.117 | Wazuh SIEM, Ollama | Audited |
| RPI42 | 192.168.1.151 | OpenClaw agent | Audited |

---

## Critical Findings

### 1. FAIL2BAN BANTIME MISCONFIGURATION (FIXED)

**Issue:** Fail2ban bantime was set to `15` (15 seconds) instead of a reasonable duration.

**Impact:** Attackers could retry SSH brute force attacks after only 15 seconds. With 7,731 failed attempts in 24 hours, this was actively being exploited.

**Fix Applied:**
```bash
# Before
bantime = 15  # 15 SECONDS - WRONG!

# After
bantime = 86400  # 24 hours for sshd
bantime = 604800  # 7 days for recidive
```

**Top Attackers (last 7 days):**
| IP | Failed Attempts |
|-----|-----------------|
| 157.66.144.16 | 4,610 |
| 64.89.163.156 | 1,522 |
| 193.32.162.82 | 1,378 |
| 186.96.145.241 | 1,166 |
| 181.41.194.245 | 1,152 |

**Recommendation:** Consider adding these IPs to permanent UFW block list.

### 2. RPI42 - NO FIREWALL

**Issue:** UFW not installed on RPI42.

**Impact:** All ports exposed on local network. SSH (port 22) and Ollama (port 11434) are accessible from any device on 192.168.1.0/24.

**Risk Level:** Medium (internal network only)

**Recommendation:**
```bash
sudo apt install ufw
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow from 192.168.1.0/24 to any port 18789  # OpenClaw gateway
sudo ufw enable
```

---

## Security Status by Server

### MINER (207.244.226.151)

| Check | Status | Notes |
|-------|--------|-------|
| UFW Firewall | ACTIVE | 22 rules |
| Fail2Ban | FIXED | Bantime now 24h |
| SSH Hardening | PASS | Key-only, no root |
| SSL Certificates | VALID | 59-87 days remaining |
| Docker Containers | RUNNING | 18 containers |
| Wazuh Agent | ACTIVE | Agent 004 |
| Security Updates | APPLIED | openssl, libssl, gdk-pixbuf |

**Open Ports:**
- 22 (SSH) - Public
- 80, 443 (HTTP/HTTPS) - Public
- 25, 465, 587, 993 (Mail) - Public
- 11434 (Ollama) - Public (should restrict)

### DARTH (10.0.0.117)

| Check | Status | Notes |
|-------|--------|-------|
| UFW Firewall | ACTIVE | 21 rules |
| Fail2Ban | NOT INSTALLED | Should add |
| Wazuh Manager | RUNNING | 4 agents |
| Wazuh Indexer | GREEN | Cluster healthy |
| Docker Containers | RUNNING | 9 containers |
| Fail2Ban | MISSING | Recommend install |

**Open Ports:**
- 22 (SSH)
- 80, 443 (HTTP/HTTPS)
- 1514, 1515, 55000 (Wazuh)
- 11434 (Ollama) - Should restrict to Tailscale
- 8188 (ComfyUI) - Local only

### RPI42 (192.168.1.151)

| Check | Status | Notes |
|-------|--------|-------|
| UFW Firewall | NOT INSTALLED | Needs setup |
| SSH | EXPOSED | Port 22 open |
| OpenClaw Gateway | LOCAL | 127.0.0.1:18789 |
| Wazuh Agent | ACTIVE | Connected |

---

## Mail Server Security

**Findings:**
- Multiple SSL handshake failures from 71.6.237.48 (probe/scanner)
- Lost connections from Google Cloud IPs (legitimate mail probes)
- No authentication failures in recent logs

**Recommendation:** Monitor for auth brute force on SMTP/IMAP ports.

---

## Wazuh SIEM Status

| Agent ID | Name | Status |
|----------|------|--------|
| 001 | trooper1 | Active |
| 002 | trooper2 | Active |
| 003 | RPI42 | Active |
| 004 | mail.stsgym.com | Active |

**Indexer Health:**
- Cluster: green
- Nodes: 1
- Active shards: 7 (100%)

---

## SSL Certificates

| Domain | Expiry | Days Left |
|--------|--------|-----------|
| mail.stsgym.com | 2026-06-07 | 59 |
| joined.stsgym.com | 2026-06-08 | 60 |
| bedimsecurity.com | 2026-06-18 | 69 |
| 51o8.stsgym.com | 2026-06-22 | 74 |
| cicerone.stsgym.com | 2026-06-25 | 77 |
| auth.stsgym.com | 2026-07-05 | 87 |

All certificates valid. Auto-renewal via certbot timer confirmed.

---

## Recommendations

### Immediate Actions

1. **Install Fail2Ban on darth** - No protection currently
2. **Install UFW on RPI42** - Exposed on local network
3. **Block persistent attackers** - Add top IPs to UFW deny

### Short-term

1. **Restrict Ollama port 11434** - Should only allow from Tailscale/miner
2. **Add Wazuh agent to trooper1** - Currently shows as agent 001 but may be offline
3. **Enable automatic security updates** on all servers

### Long-term

1. **Implement GeoIP blocking** - Most attacks from non-US IPs
2. **Add 2FA for SSH** - YubiKey or TOTP
3. **Deploy crowdsec** - Collaborative threat intelligence

---

## Actions Taken

| Action | Server | Result |
|--------|--------|--------|
| Fixed fail2ban bantime | miner | 15s → 24h |
| Installed security updates | miner | openssl, libssl, gdk-pixbuf |
| Verified Wazuh agents | darth | All 4 active |
| Checked SSL certs | miner | All valid |

---

## Logs Reviewed

- `/var/log/auth.log` - SSH attempts
- `/var/log/mail.log` - SMTP/IMAP activity
- `journalctl -u ssh` - SSH daemon logs
- `journalctl -u fail2ban` - Ban actions
- OpenClaw security audit
- Wazuh alerts

---

*Audit completed: 2026-04-08 19:45 MDT*
*Auditor: Spark (OpenClaw)*