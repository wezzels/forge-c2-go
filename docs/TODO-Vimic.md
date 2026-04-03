# TODO — Vimic: Desktop Infrastructure Command Center

**Project:** Vimic  
**Repository:** `git@idm.wezzel.com:crab-meat-repos/vimic.git`  
**Tech Stack:** Go 1.23+ · Wails v3 · Vue 3 · Fiber v2 · SQLite/Bun · libvirt/go-libvirt  
**Platforms:** Linux (amd64/arm64) · Windows (amd64) · macOS (amd64/arm64)  
**Team Size:** 4–6 engineers  
**Timeline:** 10 weeks  

---

## Overview

Vimic is a native cross-platform desktop application that replicates and enhances trooper.stsgym.com functionality. It runs entirely on the user's local machine — no server, no cloud dependency, full offline capability.

**Core Features:**
1. VM Provisioning — KVM/QEMU VMs with cloud-init
2. AI Chat — Local Ollama (no data leaves the machine)
3. AI Infrastructure Commands — Natural language → shell (docker, nginx, SSH)
4. Multi-user Auth — Local accounts, roles, full audit trail

**Vimic Repo Location:** `/tmp/vimic/` on miner (cloned from IDM)

---

## Quick Start (Dev Environment)

```bash
# Clone the repo
git clone git@idm.wezzel.com:crab-meat-repos/vimic.git
cd vimic

# Install system deps (Ubuntu 22.04+)
sudo apt-get install -y \
  libvirt-dev libgtk-3-dev libwebkit2gtk-4.0-dev \
  gcc pkg-config genisoimage qemu-utils qemu-kvm

# Install Go 1.23+
# https://go.dev/doc/install

# Install Node 20+
# https://nodejs.org/

# Install Wails v3
go install github.com/wailsapp/wails/v3/cmd/wails@latest

# Frontend deps
cd frontend && npm install && cd ..

# Run in dev mode
wails dev
```

---

## Phase 0 — Project Foundation
**Timeline:** Week 1  
**Goal:** Empty shell that compiles and runs on all 3 platforms.

### Tasks

- [ ] **[0.1] Initialize Wails v3 project**
  ```bash
  # Already done: see cmd/vimic/main.go and wails.json
  # Verify with:
  wails doctor
  # Expected: Go ✓, Node ✓, Wails ✓, GTK/WinWebView ✓
  ```

- [ ] **[0.2] Set up GitHub Actions CI**
  ```yaml
  # Already written: .github/workflows/build.yml
  # Targets: linux/amd64, linux/arm64, windows/amd64, darwin/amd64, darwin/arm64
  # Verify by checking Actions tab after pushing to main
  ```

- [ ] **[0.3] Configure SQLite database schema + migrations**
  ```bash
  # Already written: internal/database/database.go + models/models.go
  # Tables: users, sessions, audit_logs, vms, chat_messages,
  #         command_history, settings
  # Test: run the app, check ~/.vimic/vimic.db is created
  ```

- [ ] **[0.4] Implement basic auth (register, login, logout)**
  ```go
  // Already written: internal/auth/auth.go
  // Features:
  //   - JWT-based sessions (7-day expiry)
  //   - Bcrypt password hashing
  //   - First user becomes admin
  #   - Failed login lockout (5 attempts → 30min lock)
  //   - Audit log on every login/register/password change

  // Test registration flow:
  curl -X POST http://localhost:34117/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","username":"test","password":"Test1234!"}'
  ```

- [ ] **[0.5] Implement session management**
  ```go
  // Tokens stored in SQLite sessions table
  // Middleware: auth.Required() and auth.AdminOnly()
  // Sessions auto-expire after 7 days

  // Test login flow:
  curl -X POST http://localhost:34117/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"Test1234!"}'
  // Returns JWT token
  ```

- [ ] **[0.6] Build empty UI shell with sidebar navigation**
  ```bash
  # Already written: frontend/src/
  # Routes: /login, /register, / (dashboard), /vm, /vm/create,
  #         /chat, /ai, /admin, /admin/users, /admin/audit, /settings
  # Components: Sidebar.vue, all view files

  # Run frontend dev server separately:
  cd frontend && npm run dev
  # App runs at http://localhost:34117 (Wails default)
  ```

- [ ] **[0.7] Verify builds for all 3 OS targets**
  ```bash
  # Linux build
  make build-linux

  # macOS build (requires macOS)
  make build-macos

  # Windows build (requires Windows or cross-compile)
  make build-windows

  # All outputs go to dist/
  ls dist/
  # Expected: vimic-linux-amd64, vimic-linux-arm64,
  #           vimic-darwin-amd64, vimic-darwin-arm64,
  #           vimic-windows-amd64.exe
  ```

### Phase 0 Deliverables
- [x] Project structure in IDM (`vimic` repo)
- [x] GitHub Actions CI pipeline
- [x] SQLite schema + Bun models
- [x] Auth service (JWT, bcrypt, sessions)
- [ ] UI shell running
- [ ] All 5 binary targets building

---

## Phase 1 — VM Provisioning (libvirt/KVM)
**Timeline:** Weeks 2–4  
**Goal:** Full VM lifecycle using local KVM/QEMU.

### Tasks

- [ ] **[1.1] Libvirt connection pool**
  ```go
  // File: internal/vm/manager.go
  // Already written: New() connects to qemu:///system

  // Test on a machine with KVM:
  virsh list --all
  # Should show VMs if any exist

  // In Vimic logs, should see:
  // "Connecting to qemu:///system" on startup
  ```

- [ ] **[1.2] CreateVM() — virt-install wrapper**
  ```go
  // Already written: manager.go CreateVM()
  // Uses virt-install --print-xml then libvirt.DomainDefineXML
  // Creates qcow2 disk, cloud-init ISO, starts domain

  // Steps to test:
  # 1. Ensure base image exists
  ls -la /var/lib/libvirt/images/
  # Or download one:
  sudo virt-builder --download ubuntu-24.04 -o /var/lib/libvirt/images/ubuntu-24.04-cloud.img

  # 2. Run CreateVM via Wails dev console:
  vimic.CreateVM(userID, {
    name: "test-vm",
    memoryMB: 8192,
    vcpus: 4,
    diskGB: 50,
    osVariant: "ubuntu24.04",
    cloudInit: true,
    sshKey: "ssh-rsa AAAA..."
  })

  # 3. Check in another terminal:
  virsh list --all
  # Should show test-vm running

  # 4. Check VM console (Spice):
  virt-viewer test-vm
  ```

- [ ] **[1.3] StartVM() / StopVM() / DeleteVM()**
  ```go
  // Already written in manager.go
  // Test:
  vimic.StartVM("test-vm")
  sleep 5 && virsh list --all | grep test-vm  # should be running

  vimic.StopVM("test-vm")
  sleep 3 && virsh list --all | grep test-vm  # should be shut off

  vimic.DeleteVM("test-vm")
  virsh list --all | grep test-vm  # should be gone
  ```

- [ ] **[1.4] Cloud-init support**
  ```go
  // Already written: createCloudInitISO()
  // Generates user-data + meta-data, creates ISO with genisoimage
  // User gets: defined user (vimic), SSH key auth, password auth

  # Verify cloud-init ran inside VM:
  virsh console test-vm
  # Login: vimic / <password from DB>
  # Check cloud-init logs:
  sudo tail -f /var/log/cloud-init-output.log
  sudo cloud-init status
  ```

- [ ] **[1.5] GetVMIP() — DHCP lease lookup**
  ```go
  // Already written: getDHCPLease()
  // Reads /var/lib/libvirt/dnsmasq/default.leases

  # Test after VM boots:
  vimic.GetVMStatus("test-vm")
  # Should return { name: "test-vm", status: "running", ip: "192.168.x.x" }

  # If no IP, check DHCP leases:
  cat /var/lib/libvirt/dnsmasq/default.leases
  ```

- [ ] **[1.6] GPU passthrough detection (VirGL)**
  ```go
  // In manager.go CreateVM():
  // --video virtio-gl-pci enables VirGL
  // --graphics spice enables SPICE display

  # Verify GPU acceleration is available:
  lspci | grep -i vga
  # Should show: VGA compatible controller: Red Hat, Inc. Virtio GPU (rev 01)
  # OR your actual GPU if passed through

  ls /dev/dri/
  # Should show renderD128 if GPU is available

  # Test in VM:
  virsh console test-vm
  # lspci | grep -i vga
  # Should show Virtio GPU or passed-through GPU
  ```

- [ ] **[1.7] VM List UI**
  ```vue
  <!-- File: frontend/src/views/VMList.vue -->
  <!-- Already written -->

  # Should display:
  #   - VM name, status badge (running/stopped/creating/error)
  #   - IP address
  #   - Resources (vCPUs, RAM, disk)
  #   - Start/Stop/Delete buttons
  #   - Auto-refresh every 5s for creating/booting VMs
  ```

- [ ] **[1.8] VM Create form**
  ```vue
  <!-- File: frontend/src/views/VMCreate.vue -->
  <!-- Already written -->
  <!-- Fields: name, memory, vCPUs, disk, OS variant, SSH key, GPU toggle -->

  # Test form submission:
  # Fill form → Submit → Redirect to VM list → VM appears with "creating" badge
  # After 2-3 min: badge changes to "running", IP appears
  ```

- [ ] **[1.9] noVNC console (stretch goal)**
  ```bash
  # Install noVNC in frontend:
  cd frontend
  npm install @novnc/core

  # Add to VMDetail.vue:
  # Embedded noVNC connects to SPICE socket at ws://localhost:5900/<vm-uuid>
  # Requires: --graphics spice,listen=0.0.0.0 (already set)
  ```

### Phase 1 Deliverables
- [ ] User can create Ubuntu 24.04 VM with 8GB RAM, 4 vCPUs, 50GB disk
- [ ] VM boots to cloud-init completion (~2 min)
- [ ] User can start/stop/delete VM from UI
- [ ] VM list shows real-time status
- [ ] GPU acceleration available (VirGL)

---

## Phase 2 — AI Chat with Local Ollama
**Timeline:** Weeks 3–5  
**Goal:** Conversational AI using local Ollama.

### Tasks

- [ ] **[2.1] Ollama detection + health check**
  ```go
  // File: internal/ollama/client.go
  // Already written: Detect(), IsHealthy(), ListModels()

  // Test:
  # Ensure Ollama is running:
  systemctl --user status ollama
  # Or: ollama serve

  # In Vimic:
  vimic.GetOllamaStatus()
  # Expected: { healthy: true, models: [...], url: "http://localhost:11434" }

  # If Ollama not installed, prompt user:
  curl -fsSL https://ollama.com/install.sh | sh
  ollama pull llama3.1:8b
  ```

- [ ] **[2.2] Streaming chat completions**
  ```go
  // File: internal/ollama/client.go
  // Already written: ChatStream() with SSE token-by-token

  // Test:
  curl -X POST http://localhost:11434/api/chat \
    -H "Content-Type: application/json" \
    -d '{"model":"llama3.1:8b","messages":[{"role":"user","content":"Hello"}],"stream":true}'

  # Should receive newline-delimited JSON tokens
  ```

- [ ] **[2.3] Chat UI with streaming responses**
  ```vue
  <!-- File: frontend/src/views/Chat.vue -->
  <!-- Already written -->
  <!-- Features:
        - Message history stored in SQLite
        - Streaming token display (token-by-token)
        - Markdown rendering (marked + highlight.js)
        - Model selector dropdown
        - Clear chat button
        - Session management
  -->

  # Test:
  # Open chat → Select model → Send "Explain quantum computing in 2 sentences"
  # Response should stream token-by-token in <1s
  # Reload app → History should persist
  ```

- [ ] **[2.4] Bundled Ollama option (Linux)**
  ```bash
  # Option A: Detect system Ollama
  which ollama && ollama list

  # Option B: Download + install from app
  # In internal/ollama/installer.go:
  func InstallOllama() error {
    // Download from https://ollama.com/install.sh
    // Or download binary directly:
    curl -L https://ollama.com/install.sh -o /tmp/ollama-install.sh
    // Run installer or extract binary to ~/.vimic/bin/
  }

  # Download a model on first run:
  ollama pull llama3.1:8b
  # Or prompt user in UI: "Select models to download"
  ```

- [ ] **[2.5] Model management UI**
  ```vue
  <!-- Add to Settings.vue -->
  # Model list from Ollama API
  # Pull new models (ollama pull <name>)
  # Show model size and last modified
  # Set default model for chat

  # Test pulling a new model:
  # Settings → Ollama → Click "Pull" next to a model
  # Progress shown in UI
  ```

### Phase 2 Deliverables
- [ ] User opens chat, selects a model, sends a message
- [ ] Streaming response renders token-by-token
- [ ] Message history persists across app restarts
- [ ] "Ollama not running" prompt if Ollama is unavailable
- [ ] Model selector with download capability

---

## Phase 3 — AI Infrastructure Commands
**Timeline:** Weeks 5–7  
**Goal:** Natural language infrastructure management.

### Tasks

- [ ] **[3.1] Command parser — pattern matching**
  ```go
  // File: internal/executor/executor.go
  // Already written: Execute() with regex pattern matching

  # Test:
  vimic.ExecuteCommand(userID, "docker ps")
  # Should return table of running containers

  vimic.ExecuteCommand(userID, "disk space")
  # Should return df -h output

  vimic.ExecuteCommand(userID, "What's the memory usage?")
  # Should return free -h output
  ```

- [ ] **[3.2] Docker commands**
  ```bash
  # Test these exact commands in Vimic AI Commands:
  "docker ps"                    # → docker ps
  "list running docker containers"
  "show me docker logs nginx"    # → docker logs nginx --tail 50
  "restart the exerciseme container"
  "docker stats"                 # → docker stats --no-stream
  "stop container miner"         # → docker stop miner
  ```

- [ ] **[3.3] System commands**
  ```bash
  # Test:
  "disk space"                   # → df -h
  "memory usage"                 # → free -m
  "show temperature"             # → sensors (Linux) or system_profiler (macOS)
  "uptime and load"              # → uptime
  "running services"             # → systemctl list-units --type=service
  "top processes"               # → ps aux --sort=-%cpu | head -20
  ```

- [ ] **[3.4] Nginx commands**
  ```bash
  # Test:
  "nginx status"                # → systemctl status nginx
  "reload nginx"                 # → sudo systemctl reload nginx (needs confirm)
  "nginx error logs"             # → tail -50 /var/log/nginx/error.log
  "nginx access logs"            # → tail -50 /var/log/nginx/access.log
  "which sites are configured"   # → ls /etc/nginx/sites-enabled/
  ```

- [ ] **[3.5] SSL/Certbot commands**
  ```bash
  # Test:
  "show SSL certificates"        # → certbot certificates
  "renewal dry run"              # → sudo certbot renew --dry-run
  "when does stsgym.com cert expire"  # → certbot certificates | grep stsgym.com
  ```

- [ ] **[3.6] SSH to remote nodes**
  ```go
  // File: internal/executor/executor.go sshNode()
  // Uses knowledge base for node IPs and SSH keys

  # Test:
  "ssh to miner"                # → ssh wez@100.116.245.125 uptime
  "check disk on darth"         # → ssh wez@100.92.94.92 df -h
  "memory on trooper1"          # → ssh wez@100.116.156.61 free -h

  # Pre-configured nodes (from knowledge base):
  # miner: 100.116.245.125 (Tailscale), SSH: ~/.ssh/id_ed25519
  # darth: 100.92.94.92 (Tailscale), SSH: ~/.ssh/id_rsa
  # trooper1: 100.116.156.61 (Tailscale), SSH: ~/.ssh/govm
  # trooper2: 100.123.159.17 (Tailscale), SSH: ~/.ssh/id_ed25519
  ```

- [ ] **[3.7] Dangerous operation protection**
  ```go
  // File: internal/executor/executor.go IsDangerous()
  // Dangerous patterns: rm -rf, dd of=, mkfs., drop database, etc.

  # Test dangerous command:
  vimic.ExecuteCommand(userID, "delete all containers")
  # Should return error with "CONFIRM_REQUIRED"
  # Frontend shows confirmation dialog
  # User confirms → vimic.ExecuteCommandConfirm() runs the command

  # Test non-dangerous:
  vimic.ExecuteCommand(userID, "show docker containers")
  # Runs immediately, no confirmation
  ```

- [ ] **[3.8] LLM fallback for unrecognized commands**
  ```go
  // When pattern match fails, send to Ollama:
  func (e *Executor) Execute(cmd string) (string, error) {
      // Try pattern matching first...
      // If no match:
      return e.llmInterpret(cmd)
  }

  func (e *Executor) llmInterpret(cmd string) (string, error) {
      // Send to Ollama with knowledge base context:
      prompt := fmt.Sprintf(`You are a system administrator.
  Infrastructure knowledge: %s
  User command: %s
  Return the exact shell command to execute, or explain why it can't be done.`,
          e.kb.GetContext(), cmd)
      resp, _ := ollama.Chat(prompt, [], "llama3.1:8b")
      return parseLLMResponse(resp)
  }
  ```

- [ ] **[3.9] AI Commands UI**
  ```vue
  <!-- File: frontend/src/views/AICommands.vue -->
  <!-- Already written -->

  # Features:
  #   - Quick action buttons (Docker, Disk, Memory, Temp, Services)
  #   - Dark terminal-style output panel
  #   - Command input with history
  #   - Node status sidebar (ping miner/darth/trooper1/trooper2)
  #   - Confirmation modal for dangerous ops
  #   - Syntax highlighted output

  # Test quick actions:
  # Click "Docker" → should show docker ps output
  # Click "Disk" → should show df -h output
  # Type "restart nginx" → should show confirm dialog
  ```

- [ ] **[3.10] Multi-node SSH configuration UI**
  ```vue
  <!-- Add to Settings.vue -->
  # Node manager:
  #   - Pre-configured: miner, darth, trooper1, trooper2
  #   - Add custom node: IP, SSH key path, user
  #   - Test connection button
  #   - Remove node

  # Test adding a custom node:
  # Settings → Nodes → Add Node
  #   IP: 10.0.0.50
  #   SSH Key: /home/user/.ssh/id_ed25519
  #   User: admin
  # Click "Test" → should show "Connected" or error
  ```

### Phase 3 Deliverables
- [ ] User types "Show me docker containers" → sees `docker ps` output
- [ ] User types "What's disk space on miner?" → SSH → `df -h` → results displayed
- [ ] Dangerous commands require confirmation before execution
- [ ] Unrecognized commands fall back to Ollama interpretation
- [ ] Server status sidebar shows online/offline for all nodes

---

## Phase 4 — Admin Panel & Audit Trail
**Timeline:** Weeks 6–8  
**Goal:** Full admin capabilities.

### Tasks

- [ ] **[4.1] Role-based access control middleware**
  ```go
  // File: internal/auth/middleware.go
  // Already wired in: router middleware checks role

  // In app.go Wails bindings, each admin method checks:
  if user.Role != "admin" {
      return nil, ErrAccessDenied
  }

  // Test:
  # Create regular user → login as regular user
  # Try to access /admin → should redirect to dashboard
  # Try vimic.AdminListUsers() → should return error
  ```

- [ ] **[4.2] User management (admin)**
  ```go
  // File: internal/app/app.go AdminApproveUser(), AdminDeleteUser()
  // Already written in models.go

  # Test admin flow:
  # 1. Register 2 new users (both start as "pending")
  # 2. Login as first user (admin) → go to /admin/users
  # 3. See both pending users
  # 4. Click "Approve" on user 2
  # 5. User 2 can now login
  # 6. Click "Delete" on user 2 → user and their VM deleted
  ```

- [ ] **[4.3] Audit logging on every action**
  ```go
  // File: internal/database/models.go AddAuditLog()
  // Every significant action is logged:
  # user_registered, user_login, user_logout, password_changed
  # vm_created, vm_started, vm_stopped, vm_deleted
  # admin_user_approved, admin_user_deleted

  # Test:
  # Login → create VM → stop VM → logout
  # Admin → Audit Logs → see all 4+ entries with timestamps
  ```

- [ ] **[4.4] Admin dashboard with stats**
  ```vue
  <!-- File: frontend/src/views/AdminDashboard.vue -->
  <!-- Already written -->

  # Shows: total users, total VMs, running VMs
  # Links to: Manage Users, Audit Logs

  # Test:
  # Login as admin → /admin
  # Should show correct counts matching database
  ```

- [ ] **[4.5] Audit log viewer with filters**
  ```vue
  <!-- File: frontend/src/views/AdminAudit.vue -->
  <!-- Already written -->

  # Features:
  #   - Paginated table (50 per page)
  #   - Columns: When, User, Action, Details
  #   - Filter by user (dropdown)
  #   - Filter by action type (dropdown)
  #   - Date range picker

  # Test:
  # Admin → Audit Logs
  # Change page → should load next 50 records
  # Select "vm_deleted" from action filter → only VM deletions shown
  ```

### Phase 4 Deliverables
- [ ] Admin sees all users, can approve pending registrations
- [ ] Admin can delete any user (cascade deletes their VM)
- [ ] Every action logged with user, timestamp, action, details
- [ ] Audit log viewer with pagination and filters

---

## Phase 5 — Desktop Integration & Polish
**Timeline:** Weeks 7–9  
**Goal:** Native feel.

### Tasks

- [ ] **[5.1] System tray icon**
  ```go
  // File: internal/app/tray.go (new)
  // Uses Wails tray API:

  tray := winc.NewTray(iconPath)
  tray.SetMenu(&winc.Menu{
      Items: []*winc.MenuItem{
          {Text: "Show Vimic", OnClick: app.Show},
          {Text: "Quit", OnClick: app.Quit},
      },
  })

  # Test:
  # Close window → app minimizes to tray
  # Click tray icon → window restores
  # Right-click tray → context menu appears
  ```

- [ ] **[5.2] Auto-start on login**
  ```go
  // File: internal/app/autostart.go (new)

  # Linux: ~/.config/autostart/vimic.desktop
  [Desktop Entry]
  Type=Application
  Name=Vimic
  Exec=/path/to/vimic
  Hidden=false

  # macOS: LaunchAgent ~/Library/LaunchAgents/com.vimic.plist
  # Windows: Registry HKCU\Software\Microsoft\Windows\CurrentVersion\Run
  ```

- [ ] **[5.3] Native notifications**
  ```go
  // File: internal/app/notifications.go (new)
  // Uses Wails notification API:

  notification.NewNotification(&notification.Options{
      Title:   "VM Ready",
      Body:    "Your Ubuntu VM is now running at 192.168.122.156",
  }).Show()

  # Triggers:
  #   - VM creation complete
  #   - Chat response received (when backgrounded)
  #   - Ollama model downloaded
  ```

- [ ] **[5.4] Settings panel**
  ```vue
  <!-- File: frontend/src/views/Settings.vue -->
  <!-- Already written -->
  <!-- Settings: Ollama URL, default model, theme -->

  # Add:
  #   - VM creation defaults (memory, vCPUs, disk)
  #   - Notification preferences (on/off toggles)
  #   - Auto-start toggle
  #   - Change password
  ```

- [ ] **[5.5] Dark mode / light mode toggle**
  ```vue
  <!-- Already in App.vue (dark/light CSS variables) -->
  <!-- Add toggle in Settings → Appearance -->

  # Themes:
  #   - Light: white sidebar, light gray bg
  #   - Dark: dark navy sidebar, dark bg
  #   - System: follows OS preference
  ```

- [ ] **[5.6] Keyboard shortcuts**
  ```go
  // In frontend/src/App.vue:
  // Use @vueuse/core useMagicKeys

  const { ctrl_k, ctrl_n, ctrl_comma } = useMagicKeys()

  watch(ctrl_k, () => router.push('/chat'))
  watch(ctrl_n, () => router.push('/vm/create'))
  watch(ctrl_comma, () => router.push('/settings'))
  ```

- [ ] **[5.7] App update mechanism**
  ```bash
  # File: internal/app/updater.go (new)
  # Checks GitHub Releases for new versions:

  # Option A: Go native update
  #   - Download new binary from GitHub Releases
  #   - Replace current binary on restart
  #   - Show "Update available" notification

  # Option B: Wails updater plugin
  #   github.com/wailsapp/wails-plugin-updater

  # Test:
  # Tag new release: git tag v0.2.0 && git push --tags
  # App checks → sees v0.2.0 available → prompts user
  # User clicks "Update" → downloads → restarts
  ```

### Phase 5 Deliverables
- [ ] System tray icon with Show/Quit menu
- [ ] Auto-start on login option
- [ ] Native notifications for VM events
- [ ] Settings panel for all preferences
- [ ] Dark/light/system theme toggle
- [ ] Keyboard shortcuts (Ctrl+K chat, Ctrl+N new VM, Ctrl+, settings)
- [ ] Auto-update from GitHub Releases

---

## Phase 6 — Packaging & Distribution
**Timeline:** Weeks 8–10  
**Goal:** Installers for all platforms.

### Tasks

- [ ] **[6.1] Linux: .deb package**
  ```bash
  # Use dpkg-deb or fpm:
  fpm -s dir -t deb \
    -n vimic \
    -v 0.1.0 \
    -p dist/vimic_0.1.0_amd64.deb \
    -d "libgtk-3-0,libwebkit2gtk-4.0-37" \
    ./dist/vimic

  # Install and test:
  sudo dpkg -i dist/vimic_0.1.0_amd64.deb
  vimic &
  # Should appear in application menu
  ```

- [ ] **[6.2] Linux: .AppImage**
  ```bash
  # Using appimage-builder or docker-appimage:
  docker run --rm -v $(pwd):/src \
    ghcr.io/probonopd/appimage-builder:latest \
    appimage-builder --recipe AppImageBuilder.yml

  # Test:
  chmod +x dist/vimic_0.1.0_amd64.AppImage
  ./dist/vimic_0.1.0_amd64.AppImage
  # Should run on any Ubuntu 18.04+ system
  ```

- [ ] **[6.3] Linux: .rpm package**
  ```bash
  fpm -s dir -t rpm \
    -n vimic \
    -v 0.1.0 \
    -p dist/vimic_0.1.0_x86_64.rpm \
    -d "gtk3,webkit2gtk4.0" \
    ./dist/vimic
  ```

- [ ] **[6.4] macOS: .dmg installer**
  ```bash
  # Create DMG with create-dmg:
  create-dmg \
    --volname "Vimic" \
    --window-pos 200 120 \
    --size 800 \
    --app-drop-link 600 185 \
    dist/vimic-macos \
    dist/Vimic-0.1.0.dmg

  # Code sign (requires Apple Developer account):
  codesign -s "Developer ID Application: Your Name (TEAMID)" \
    dist/vimic-darwin-amd64

  # Notarize (required for Catalina+):
  xcrun notarytool submit dist/vimic-darwin-amd64 \
    --apple-id "you@email.com" \
    --password "app-specific-password" \
    --team-id "TEAMID"
  ```

- [ ] **[6.5] macOS: Homebrew tap**
  ```bash
  # Create homebrew-tap repository on GitHub: vimic/homebrew-tap

  # Formula in homebrew-tap:
  class Vimic < Formula
    desc "Desktop Infrastructure Command Center"
    homepage "https://github.com/vimic/vimic"
    url "https://github.com/vimic/vimic/releases/download/v0.1.0/vimic-darwin-arm64"
    sha256 "..."
    license "Proprietary"
    depends_on "ollama"
    def install
      bin.install "vimic-darwin-arm64" => "vimic"
    end
  end

  # User installs with:
  brew install vimic/tap/vimic
  ```

- [ ] **[6.6] Windows: .msi installer (WiX)**
  ```xml
  <!-- WiX installer XML: build/windows/vimic.wxs -->
  <!-- Use WiX Toolset v4 -->
  <Package>
    <MajorUpgrade DowngradeErrorMessage="A newer version is installed." />
    <Feature Id="ProductFeature" Title="Vimic">
      <ComponentGroupRef Id="ProductComponents" />
    </Feature>
  </Package>

  # Build:
  wix build -ext WixUIExtension \
    build/windows/vimic.wxs \
    -o dist/vimic-0.1.0.msi
  ```

- [ ] **[6.7] Windows: winget package**
  ```yaml
  # Package manifest for winget:
  # In winget-pkgs repository:
  #   manifests/v/vimic/vimic/0.1.0/vimic.yaml

  Id: Vimic.Vimic
  Version: 0.1.0
  Name: Vimic
  Publisher: STSGYM LLC
  License: Proprietary
  Installers:
    - Architecture: x64
      InstallerType: msi
      Scope: user
      InstallLocation: "{{appdir}}\Vimic"
      InstallerUrl: https://github.com/vimic/vimic/releases/download/v0.1.0/vimic-0.1.0.msi
      Sha256: ...
  ```

- [ ] **[6.8] GitHub Releases automation**
  ```bash
  # Already in .github/workflows/build.yml
  # On git tag v*:
  #   - Builds all 5 targets
  #   - Creates SHA256SUMS
  #   - Creates GitHub Release with release notes

  # Test:
  git tag v0.1.0
  git push origin v0.1.0
  # Watch Actions → Build → Release
  # Check https://github.com/vimic/vimic/releases
  ```

### Phase 6 Deliverables
- [ ] `.deb` package for Debian/Ubuntu
- [ ] `.AppImage` for universal Linux
- [ ] `.rpm` for Fedora/RHEL
- [ ] `.dmg` for macOS (signed + notarized)
- [ ] `brew install vimic/tap/vimic` working
- [ ] `.msi` for Windows
- [ ] `winget install Vimic.Vimic` working
- [ ] GitHub Releases with checksums

---

## Checklist: Pre-Development Environment Setup

Before any phase work begins, verify these on every developer's machine:

```bash
# 1. Go 1.23+
go version  # should be >= 1.23.0

# 2. Node 20+
node --version  # should be >= 20.0.0

# 3. Wails v3
wails doctor
# Expected output:
# [✓] Go:    go version go1.23.x ...
# [✓] Node:  node version v20.x.x ...
# [✓] Wails: v3.x.x ...
# [✓] GTK3:  libgtk-3.so ... (Linux only)

# 4. libvirt/KVM (Linux)
virsh list --all  # should not error
# If errors: sudo apt install qemu-kvm libvirt-daemon-system

# 5. Ollama
curl http://localhost:11434/api/tags  # should return JSON
# If not running: systemctl --user start ollama

# 6. Clone and build
git clone git@idm.wezzel.com:crab-meat-repos/vimic.git
cd vimic
make deps
make build
./dist/vimic-linux-amd64  # should open GUI
```

---

## Troubleshooting

### "cannot connect to libvirt" on Linux
```bash
# Check libvirtd is running:
sudo systemctl status libvirtd
# If not: sudo systemctl enable --now libvirtd

# Add user to libvirt group:
sudo usermod -aG libvirt $USER
# Log out and back in

# Verify:
virsh list --all
```

### "Ollama not running" prompt
```bash
# Install Ollama:
curl -fsSL https://ollama.com/install.sh | sh

# Start:
systemctl --user enable --now ollama

# Pull a model:
ollama pull llama3.1:8b

# Verify:
ollama list
```

### "WebView2 not found" on Windows
```powershell
# Install WebView2 Runtime:
# Download from: https://developer.microsoft.com/en-us/microsoft-edge/webview2/
# Or if missing on Windows 10/11, Windows Update should provide it
```

### Cross-compile Linux ARM64 on x64
```bash
sudo apt-get install -y gcc-aarch64-linux-gnu
GOOS=linux GOARCH=arm64 CGO_ENABLED=1 CC=aarch64-linux-gnu-gcc wails build
```

### macOS build on Linux
Not possible. macOS builds require macOS (Xcode). Use a Mac mini in the office or GitHub Actions macOS runners.

---

*Last updated: 2026-03-31*  
*Maintainers: Vimic Team (dev@stsgym.com)*
