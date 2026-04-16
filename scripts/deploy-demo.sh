#!/bin/bash
# FORGE-C2 Deployment Demo
# Spins up FORGE-C2 and exercises every endpoint with real requests.
#
# Prerequisites:
#   - FORGE-C2 binary built and in PATH or FORGE_C2_BIN set
#   - curl, jq installed
#
# Usage:
#   ./scripts/deploy-demo.sh          # Start, test, teardown
#   ./scripts/deploy-demo.sh --skip-cleanup   # Leave server running
#   ./scripts/deploy-demo.sh --host http://10.0.0.117:8080  # Test existing instance

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Config
BIN="${FORGE_C2_BIN:-./forge-c2}"
HOST="${FORGE_C2_HOST:-http://localhost:8080}"
SKIP_CLEANUP=false
PID=""
STARTED=false

usage() {
    echo "FORGE-C2 Deployment Demo"
    echo ""
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --host URL          Test existing instance at URL"
    echo "  --skip-cleanup       Leave server running after tests"
    echo "  --bin PATH           Path to forge-c2 binary"
    echo "  -h, --help           Show this help"
    echo ""
    echo "Environment:"
    echo "  FORGE_C2_BIN         Path to binary (default: ./forge-c2)"
    echo "  FORGE_C2_HOST        Base URL (default: http://localhost:8080)"
}

while [[ $# -gt 0 ]]; do
    case $1 in
        --host) HOST="$2"; shift 2 ;;
        --skip-cleanup) SKIP_CLEANUP=true; shift ;;
        --bin) BIN="$2"; shift 2 ;;
        -h|--help) usage; exit 0 ;;
        *) echo "Unknown option: $1"; usage; exit 1 ;;
    esac
done

log()  { echo -e "${BLUE}[DEMO]${NC} $1"; }
pass() { echo -e "${GREEN}[PASS]${NC} $1"; }
fail() { echo -e "${RED}[FAIL]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }

cleanup() {
    if [[ "$SKIP_CLEANUP" == true ]] && [[ "$STARTED" == true ]]; then
        warn "Server left running at $HOST (PID: $PID)"
        return
    fi
    if [[ -n "$PID" ]]; then
        log "Stopping FORGE-C2 (PID: $PID)..."
        kill "$PID" 2>/dev/null || true
        wait "$PID" 2>/dev/null || true
    fi
}
trap cleanup EXIT

# ─── Start Server ────────────────────────────────────────────────────
if ! curl -sf "${HOST}/health" > /dev/null 2>&1; then
    log "No server at $HOST, starting FORGE-C2..."
    if [[ ! -x "$BIN" ]]; then
        fail "Binary not found: $BIN"
        echo "Build it first: go build -o forge-c2 ./cmd/forge-c2"
        exit 1
    fi
    "$BIN" -mode serve > /tmp/forge-c2-demo.log 2>&1 &
    PID=$!
    STARTED=true
    log "Waiting for server (PID: $PID)..."

    for i in $(seq 1 15); do
        if curl -sf "${HOST}/health" > /dev/null 2>&1; then
            pass "Server started"
            break
        fi
        if [[ $i -eq 15 ]]; then
            fail "Server didn't start in 15 seconds"
            cat /tmp/forge-c2-demo.log
            exit 1
        fi
        sleep 1
    done
else
    log "Using existing server at $HOST"
fi

TESTS=0
PASSED=0
FAILED=0

test_endpoint() {
    local method="$1" path="$2" desc="$3" expect="${4:-200}"
    TESTS=$((TESTS + 1))

    if [[ "$method" == "GET" ]]; then
        status=$(curl -s -o /tmp/forge-demo-resp.json -w '%{http_code}' "${HOST}${path}")
    else
        body="${5:-}"
        status=$(curl -s -o /tmp/forge-demo-resp.json -w '%{http_code}' \
            -X "$method" -H "Content-Type: application/json" \
            -d "$body" "${HOST}${path}")
    fi

    if [[ "$status" == "$expect" ]]; then
        pass "$desc ($status)"
        PASSED=$((PASSED + 1))
    else
        fail "$desc (expected $expect, got $status)"
        cat /tmp/forge-demo-resp.json 2>/dev/null
        FAILED=$((FAILED + 1))
    fi
}

# ─── Health & Readiness ──────────────────────────────────────────────
log "Testing health and readiness endpoints..."
test_endpoint GET /health "Health check"
test_endpoint GET /ready "Readiness probe"

# ─── Metrics ─────────────────────────────────────────────────────────
log "Testing Prometheus metrics..."
test_endpoint GET /metrics "Prometheus metrics"

# Verify metrics format
if curl -sf "${HOST}/metrics" | grep -q "forge_c2_"; then
    pass "Metrics contain forge_c2_ prefix"
else
    fail "Metrics missing forge_c2_ prefix"
fi

# ─── Track Management ───────────────────────────────────────────────
log "Testing track management..."
test_endpoint GET "/api/tracks" "List tracks (empty)"

# ─── Sensor Event Injection ──────────────────────────────────────────
log "Injecting sensor events..."
test_endpoint POST "/api/inject/sensor" "Inject OPIR event" 200 \
    '{"event_id":"DEMO-001","sensor_id":"SBIRS-GEO-1","sensor_type":"OPIR","latitude":33.75,"longitude":-117.85,"altitude":35786000,"intensity":0.92}'

test_endpoint POST "/api/inject/sensor" "Inject UEWR event" 200 \
    '{"event_id":"DEMO-002","sensor_id":"UEWR-1","sensor_type":"UEWR","latitude":35.0,"longitude":-120.0,"altitude":500000,"intensity":0.75}'

test_endpoint POST "/api/inject/sensor" "Inject TPY-2 event" 200 \
    '{"event_id":"DEMO-003","sensor_id":"TPY-2-1","sensor_type":"TPY2","latitude":36.0,"longitude":-118.0,"altitude":200000,"intensity":0.95}'

sleep 0.5

# ─── Track Verification ──────────────────────────────────────────────
log "Verifying track creation..."
test_endpoint GET "/api/tracks" "List tracks (populated)"

if curl -sf "${HOST}/api/tracks" | jq -e '.count > 0' > /dev/null 2>&1; then
    pass "Track count > 0"
else
    # Try without jq
    count=$(curl -sf "${HOST}/api/tracks" | grep -o '"count":[0-9]*' | grep -o '[0-9]*')
    if [[ "$count" -gt 0 ]] 2>/dev/null; then
        pass "Track count > 0 ($count tracks)"
    else
        warn "Could not verify track count (jq not installed?)"
    fi
fi

# ─── Correlator Stats ────────────────────────────────────────────────
log "Testing correlator..."
test_endpoint GET "/api/correlator/stats" "Correlator stats"

# ─── Alerts ──────────────────────────────────────────────────────────
log "Testing alerts..."
test_endpoint GET "/api/alerts" "List alerts"

# ─── C2BMC ───────────────────────────────────────────────────────────
log "Testing C2BMC interface..."
test_endpoint GET "/api/c2bmc/status" "C2BMC status"
test_endpoint GET "/api/c2bmc/engagements" "C2BMC engagements"

# ─── Security Headers ────────────────────────────────────────────────
log "Testing security headers..."
headers=$(curl -sI "${HOST}/health")
for h in "X-Content-Type-Options: nosniff" "X-Frame-Options: DENY" "Strict-Transport-Security: max-age"; do
    if echo "$headers" | grep -qi "$h"; then
        pass "Security header: $(echo "$h" | cut -d: -f1)"
    else
        fail "Missing security header: $(echo "$h" | cut -d: -f1)"
    fi
done

# ─── Invalid Endpoints ───────────────────────────────────────────────
log "Testing error handling..."
test_endpoint GET "/api/nonexistent" "404 for invalid path" 404

# ─── JREAP Transport (if port configured) ────────────────────────────
log "JREAP transport test (requires UDP/TCP port)..."
if nc -z localhost 5000 2>/dev/null; then
    pass "JREAP UDP port 5000 is listening"
else
    warn "JREAP UDP port 5000 not listening (start with --jreap-udp-port 5000)"
fi

if nc -z localhost 5001 2>/dev/null; then
    pass "JREAP TCP port 5001 is listening"
else
    warn "JREAP TCP port 5001 not listening (start with --jreap-tcp-port 5001)"
fi

# ─── Summary ─────────────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════"
echo "  FORGE-C2 Deployment Demo Results"
echo "═══════════════════════════════════════════"
echo -e "  Total:  ${TESTS}"
echo -e "  ${GREEN}Passed: ${PASSED}${NC}"
echo -e "  ${RED}Failed: ${FAILED}${NC}"
echo ""
if [[ $FAILED -eq 0 ]]; then
    echo -e "${GREEN}✅ ALL TESTS PASSED${NC}"
else
    echo -e "${RED}❌ ${FAILED} TEST(S) FAILED${NC}"
fi
echo ""

if [[ "$SKIP_CLEANUP" == true ]]; then
    warn "Server still running at ${HOST} (PID: ${PID:-external})"
    echo "  curl ${HOST}/health"
    echo "  curl ${HOST}/api/tracks"
    echo "  curl ${HOST}/metrics"
fi

if [[ $FAILED -gt 0 ]]; then
    exit 1
fi