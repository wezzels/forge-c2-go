#!/bin/bash
# NOS3 Build Script - Runs all NOS3 builds via Docker without TTY
# Usage: ./nos3-build.sh [sim|fsw|gsw|all]
# 
# Key fixes applied:
# - MISSIONCONFIG must be RELATIVE path (../cfg/build/nos3), not absolute
# - hwlib submodule must be manually initialized before build
# - Use 'mission-install' target, NOT 'make -C amd64-nos3/default_cpu1'
# - Pre-create tables/staging directory for install

set -e
IMAGE="ivvitc/nos3-64:20251107"
NOS3_DIR="/home/wez/nos3"

# Get user info for proper file ownership
MYUID=$(id -u)
MYGID=$(id -g)

echo "=== NOS3 Build Script ==="
echo "Image: $IMAGE"
echo "NOS3 Dir: $NOS3_DIR"
echo ""

# Docker run helper - runs command with proper user mapping
docker_run() {
    docker run --rm -u "$MYUID:$MYGID" \
        -v "$NOS3_DIR:/home/wez/nos3" \
        -w "$1" \
        "$IMAGE" bash -c "$2"
}

# Full build command for FSW (cmake + make + mission-install)
FSW_CMAKE="cmake -DCMAKE_INSTALL_PREFIX=exe -DCMAKE_BUILD_TYPE=debug -DMISSIONCONFIG=../cfg/build/nos3 ../cfe"
FSW_BUILD="make -j\$(nproc) && make mission-install"

case "$1" in
    sim)
        echo "[1/3] Initializing submodules..."
        ssh -i ~/.ssh/id_rsa wez@10.0.0.117 "cd ~/nos3 && git submodule update --init --force"
        echo "[2/3] Building simulators (make build-sim)..."
        ssh -i ~/.ssh/id_rsa wez@10.0.0.117 "cd ~/nos3 && ./ops/docker_build.sh -u $MYUID:$MYGID -i $IMAGE -b build-sim -n nos3_sim"
        echo "[3/3] Sim build complete."
        ;;
    fsw)
        echo "[1/4] Initializing submodules..."
        ssh -i ~/.ssh/id_rsa wez@10.0.0.117 "cd ~/nos3 && git submodule update --init --force"
        echo "[2/4] Ensuring hwlib is checked out..."
        ssh -i ~/.ssh/id_rsa wez@10.0.0.117 "cd ~/nos3 && git submodule update --init --force fsw/apps/hwlib"
        echo "[3/4] Cleaning and creating fsw build directory..."
        ssh -i ~/.ssh/id_rsa wez@10.0.0.117 "sudo rm -rf ~/nos3/fsw/build && sudo mkdir -p ~/nos3/fsw/build && sudo chown -R $MYUID:$MYGID ~/nos3/fsw/build"
        echo "[4/4] Building flight software (cFS)..."
        docker_run "/home/wez/nos3/fsw/build" "$FSW_CMAKE && $FSW_BUILD"
        echo "FSW build complete. Binary: ~/nos3/fsw/build/exe/cpu1/core-cpu1"
        ;;
    gsw)
        echo "[1/2] Building ground software (COSMOS targets)..."
        ssh -i ~/.ssh/id_rsa wez@10.0.0.117 "cd ~/nos3 && ./ops/docker_build.sh -u $MYUID:$MYGID -i $IMAGE -b build-gsw -n nos3_gsw"
        echo "[2/2] GSW build complete."
        ;;
    all|*)
        echo "[1/6] Initializing submodules..."
        ssh -i ~/.ssh/id_rsa wez@10.0.0.117 "cd ~/nos3 && git submodule update --init --force"
        echo "[2/6] Ensuring hwlib is checked out..."
        ssh -i ~/.ssh/id_rsa wez@10.0.0.117 "cd ~/nos3 && git submodule update --init --force fsw/apps/hwlib"
        echo "[3/6] Running make config..."
        ssh -i ~/.ssh/id_rsa wez@10.0.0.117 "cd ~/nos3 && make config"
        echo "[4/6] Running make prep..."
        ssh -i ~/.ssh/id_rsa wez@10.0.0.117 "cd ~/nos3 && make prep"
        echo "[5/6] Building simulators..."
        ssh -i ~/.ssh/id_rsa wez@10.0.0.117 "cd ~/nos3 && ./ops/docker_build.sh -u $MYUID:$MYGID -i $IMAGE -b build-sim -n nos3_sim"
        echo "[6/6] Building flight software..."
        ssh -i ~/.ssh/id_rsa wez@10.0.0.117 "sudo rm -rf ~/nos3/fsw/build && sudo mkdir -p ~/nos3/fsw/build && sudo chown -R $MYUID:$MYGID ~/nos3/fsw/build"
        docker_run "/home/wez/nos3/fsw/build" "$FSW_CMAKE && $FSW_BUILD"
        echo "=== All builds complete ==="
        ;;
esac
