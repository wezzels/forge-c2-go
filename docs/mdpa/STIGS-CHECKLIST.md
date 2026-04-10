# STIGs Checklist for FORGE-C2

## Linux System STIGs (V-250521 - V-250548)

### Password Requirements (V-250521)

| Requirement | Current Status | Implementation |
|-------------|----------------|----------------|
| Minimum 15 characters | ✅ Met | /etc/security/pwquality.conf |
| Password history | ✅ 24 passwords | /etc/security/pwquality.conf |
| Maximum password age | ✅ 90 days | /etc/login.defs |
| Minimum password age | ✅ 1 day | /etc/login.defs |
| Password complexity | ✅ 3 of 4 classes | /etc/security/pwquality.conf |

### Audit Logging (V-250530)

| Requirement | Current Status | Implementation |
|-------------|----------------|----------------|
| Auditd enabled | ⚠️ Verify | `systemctl status auditd` |
| Log partition size | ✅ 10GB | Separate /var/log partition |
| Audit log immutable | ⚠️ Configure | `/etc/audit/auditd.conf` |
| Successful/unsuccessful logins | ✅ Enabled | pam_unix, system-auth |

### Network Settings (V-250543)

| Requirement | Current Status | Implementation |
|-------------|----------------|----------------|
| IP forwarding disabled | ✅ /proc/sys/net/ipv4/ip_forward = 0 | Default off |
| ICMP redirects | ✅ Disabled | /etc/sysctl.conf |
| Source packet routing | ✅ Disabled | net.ipv4.conf.all.accept_source_route |
| Broadcast ICMP | ✅ Ignored | net.icmp.icmp_echo_ignore_broadcasts |

### System File Permissions (V-250547)

| File/Directory | Required | Current | Status |
|----------------|----------|---------|--------|
| /etc/shadow | 0400 | 0640 | ⚠️ Should be root:shadow |
| /etc/passwd | 0644 | 0644 | ✅ OK |
| /etc/group | 0644 | 0644 | ✅ OK |
| /etc/gshadow | 0400 | 0640 | ⚠️ Should be root:shadow |
| /etc/ssh/sshd_config | 0600 | 0644 | ⚠️ Should be 0600 |
| boot/grub/grub.cfg | 0400 | 0644 | ⚠️ Should be 0400 |

### Container STIGs (V-257241 - V-257260)

| Control | Requirement | Implementation |
|---------|-------------|----------------|
| V-257241 | Container privilege | `--privileged` not used |
| V-257242 | Container host namespace | Host network not shared |
| V-257243 | Container seccomp | Default profile used |
| V-257244 | Container capabilities | NET_BIND_SERVICE only |
| V-257245 | Container root | Running as non-root user |
| V-257246 | Container tmp | tmpfs mount for /tmp |
| V-257247 | Container readonly | Readonly root filesystem |
| V-257248 | Container cgroups | cgroups v2 enforced |

### Docker Runtime Settings

| Setting | Value | File |
|---------|-------|------|
| seccomp | default | /etc/docker/seccomp.json |
| userns-remap | default | /etc/docker/daemon.json |
| live-restore | enabled | /etc/docker/daemon.json |
| log-driver | json-file | /etc/docker/daemon.json |
| log-opts max-size | 10m | /etc/docker/daemon.json |
| log-opts max-file | 3 | /etc/docker/daemon.json |

---

## Kubernetes STIGs (V-254760 - V-254800)

### Pod Security

| Control | Requirement | Status |
|---------|-------------|--------|
| V-254777 | No privileged pods | ⚠️ Review needed |
| V-254778 | Pod security context | ✅ securityContext set |
| V-254779 | Network policies | ✅ Default deny |
| V-254780 | Resource limits | ✅ limits set |
| V-254781 | Service account auto-mount | ⚠️ Disable auto-mount |

### API Server

| Control | Requirement | Status |
|---------|-------------|--------|
| V-254783 | Anonymous auth disabled | ✅ --anonymous-auth=false |
| V-254784 | API server TLS | ✅ TLS 1.2+ |
| V-254785 | Audit logging | ✅ Enabled |
| V-254786 | Service account tokens | ⚠️ Disable where not needed |

---

## Verification Commands

```bash
# Password policy
grep "^minlen\|^minclass" /etc/security/pwquality.conf

# Audit status
auditctl -s
auditctl -l

# Network hardening
sysctl net.ipv4.conf.all.accept_redirects
sysctl net.ipv4.conf.all.accept_source_route

# Docker security
docker info | grep -i seccomp
docker ps --format "{{.Names}} {{.Command}}"

# Kubernetes pod security
kubectl get psp
kubectl describe psp restricted
```

---

## TODO: Remediation Items

1. [ ] Set /etc/shadow to 0400
2. [ ] Set /etc/gshadow to 0400  
3. [ ] Set /etc/ssh/sshd_config to 0600
4. [ ] Configure auditd log immutable
5. [ ] Review privileged pods
6. [ ] Disable auto-mount SA tokens
