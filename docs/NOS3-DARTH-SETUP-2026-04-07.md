# NOS3 Setup on darth — 2026-04-07

## Overview
NOS3 (NASA Operational Simulator for Space Systems) cloned to `~/nos3` on darth (10.0.0.117).
Ground station: COSMOS 5.0.5 running at http://localhost:2900

## Build Status
| Component | Status | Output |
|-----------|--------|--------|
| `make config` | ✅ Done | `~/nos3/cfg/build/` |
| `make prep` | ✅ Done | `~/.nos3/42/` (spacecraft dynamics) |
| `make build-sim` | ✅ Done | `~/nos3/sims/build/lib/*.so` |
| `make build-fsw` | ✅ Done | `~/nos3/fsw/build/exe/cpu1/core-cpu1` |
| `make build-gsw` | ✅ Done | `~/nos3/gsw/build/libcryptolib.so` + 41 GSW targets |
| `make launch` | ⚠️ TODO | Requires 10Hz 42 sim connection |

## Critical Fixes Discovered

### 1. MISSIONCONFIG must be RELATIVE path
**Problem:** MISSIONCONFIG with absolute path causes doubled path (`/home/wez/nos3/fsw/home/wez/nos3/cfg/build/nos3_defs`).

**Fix:** Use relative path when running cmake from `fsw/build/`:
```bash
cmake -DCMAKE_INSTALL_PREFIX=exe -DCMAKE_BUILD_TYPE=debug \
    -DMISSIONCONFIG=../cfg/build/nos3 ../cfe
```

### 2. hwlib submodule not auto-initialized
**Problem:** `fsw/apps/hwlib` empty even after `git submodule update --init`.

**Fix:**
```bash
git submodule update --init --force fsw/apps/hwlib
```

### 3. FSW build: use `mission-install` target
**Problem:** `make -C amd64-nos3/default_cpu1` fails with missing `cfe_module_version_table.c`.

**Fix:** Use the `mission-install` target from the top-level build directory:
```bash
make -j$(nproc) && make mission-install
```

### 4. Pre-create tables/staging directory
**Problem:** `make install` fails if `tables/staging` doesn't exist.

**Fix:**
```bash
mkdir -p ~/nos3/fsw/build/tables/staging
```

## Build Command (Tested)

```bash
# Clean build dir
sudo rm -rf ~/nos3/fsw/build && sudo mkdir -p ~/nos3/fsw/build && sudo chown -R wez:wez ~/nos3/fsw/build

# Init submodules
git submodule update --init --force
git submodule update --init --force fsw/apps/hwlib

# CMake + build (from inside Docker with proper user mapping)
docker run --rm -u $(id -u):$(id -g) \
    -v ~/nos3:/home/wez/nos3 \
    -w /home/wez/nos3/fsw/build \
    ivvitc/nos3-64:20251107 \
    bash -c 'cmake -DCMAKE_INSTALL_PREFIX=exe -DCMAKE_BUILD_TYPE=debug -DMISSIONCONFIG=../cfg/build/nos3 ../cfe && make -j$(nproc) && make mission-install'
```

## File Locations
- **FSW binary:** `~/nos3/fsw/build/exe/cpu1/core-cpu1`
- **Sim libs:** `~/nos3/sims/build/lib/lib*.so`
- **42 sim:** `~/.nos3/42/`
- **COSMOS 5:** `~/cosmos5/` (running via docker-compose on darth)
- **NOS3 repo:** `~/nos3/`

## COSMOS 5 (Ground Station)
- Running at http://localhost:2900
- Containers: cosmos-operator, cosmos-cmd-tlm-api, cosmos-script-runner-api, cosmos-redis, cosmos-minio, cosmos-traefik
- Local bin: `~/cosmos5/` (extracted source)

## Components Built (20 hardware simulators)
generic_radio, generic_adcs, generic_eps, generic_css, generic_fss, generic_imu, generic_mag, generic_reaction_wheel, generic_star_tracker, generic_torquer, arducam, novatel_oem615, onair, sample, mgr, cryptolib, plus cFS core apps (es, evs, fs, sb, tbl, time, msg, sbr, resourceid, config)

## GSW (Ground Software) Build

CryptoLib + 41 COSMOS targets copied to `~/nos3/gsw/cosmos/COMPONENTS/`:
- All hardware simulator targets (generic_radio, generic_adcs, generic_eps, etc.)
- XTCE telemetry definitions
- SIM_CMDBUS_BRIDGE

**Note:** The NOS3 GSW build system expects COSMOS 4.5.0 (ballaerospace/cosmos:4.5.0).
COSMOS 5 is running separately as a Docker Compose stack for the ground station UI.

## Next Steps
1. ✅ FSW build complete → test running `core-cpu1`
2. ✅ GSW build artifacts ready (COSMOS 4.5.0 targets)
3. Run `make launch` to connect simulators to COSMOS 5
4. Test end-to-end: COSMOS cmd → cFS → simulators → COSMOS tlm

**Launch command:**
```bash
cd ~/nos3 && make launch
```
This runs `nos3` launcher which starts:
- 42 truth simulator (spacecraft dynamics)
- Hardware simulators (generic_*, etc.)
- cFS FSW (core-cpu1)
- COSMOS 5 GSW bridge

## Key Paths
- Docker image: `ivvitc/nos3-64:20251107`
- User mapping: `-u $(id -u):$(id -g)` (critical for file ownership)
- Build dir: `~/nos3/fsw/build/`
- MISSIONCONFIG: `../cfg/build/nos3` (relative!)
