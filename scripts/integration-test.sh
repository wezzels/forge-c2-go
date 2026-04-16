#!/bin/bash
# FORGE-C2 Full Integration Test
# Tests JREAP UDP, DIS UDP, and HTTP API against a live server.
#
# Usage: ./scripts/integration-test.sh [HOST]
# Default HOST: localhost

set -euo pipefail

HOST="${1:-localhost}"
HTTP_PORT=8080
JREAP_UDP_PORT=5000
JREAP_TCP_PORT=5001
DIS_PORT=3000

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

pass() { echo -e "${GREEN}[PASS]${NC} $1"; }
fail() { echo -e "${RED}[FAIL]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
info() { echo -e "[INFO] $1"; }

TESTS=0; PASSED=0; FAILED=0

test_endpoint() {
    local name="$1" url="$2" expect="${3:-200}"
    TESTS=$((TESTS + 1))
    status=$(curl -s -o /dev/null -w '%{http_code}' "http://${HOST}:${HTTP_PORT}${url}" 2>/dev/null)
    if [[ "$status" == "$expect" ]]; then
        pass "$name ($status)"
        PASSED=$((PASSED + 1))
    else
        fail "$name (expected $expect, got $status)"
        FAILED=$((FAILED + 1))
    fi
}

info "FORGE-C2 Integration Test"
info "Target: ${HOST}"
echo ""

# ─── HTTP API ────────────────────────────────────────────────
info "HTTP API Tests"
test_endpoint "Health check" "/health"
test_endpoint "Readiness" "/ready"
test_endpoint "Metrics" "/metrics"
test_endpoint "Tracks list" "/api/tracks"
test_endpoint "Status" "/api/status"
test_endpoint "Alerts" "/api/alerts"
test_endpoint "Correlator stats" "/api/correlator/stats"
test_endpoint "C2BMC status" "/api/c2bmc/status"
test_endpoint "C2BMC engagements" "/api/c2bmc/engagements"
test_endpoint "Invalid endpoint (404)" "/api/nonexistent" "404"

# ─── Sensor Injection ────────────────────────────────────────
info "Sensor Injection Tests"
TESTS=$((TESTS + 1))
result=$(curl -sf -X POST "http://${HOST}:${HTTP_PORT}/api/inject/sensor" \
    -H "Content-Type: application/json" \
    -d '{"event_id":"INT-001","sensor_id":"SBIRS-GEO-1","sensor_type":"OPIR","latitude":33.75,"longitude":-117.85,"altitude":35786000,"intensity":0.92}' 2>/dev/null)
if [[ $? -eq 0 ]] && echo "$result" | grep -q '"consumed":true'; then
    pass "Inject OPIR sensor event"
    PASSED=$((PASSED + 1))
else
    fail "Inject OPIR sensor event"
    FAILED=$((FAILED + 1))
fi

TESTS=$((TESTS + 1))
result=$(curl -sf -X POST "http://${HOST}:${HTTP_PORT}/api/inject/sensor" \
    -H "Content-Type: application/json" \
    -d '{"event_id":"INT-002","sensor_id":"UEWR-1","sensor_type":"UEWR","latitude":35.0,"longitude":-120.0,"altitude":500000,"intensity":0.75}' 2>/dev/null)
if [[ $? -eq 0 ]] && echo "$result" | grep -q '"consumed":true'; then
    pass "Inject UEWR sensor event"
    PASSED=$((PASSED + 1))
else
    fail "Inject UEWR sensor event"
    FAILED=$((FAILED + 1))
fi

# ─── Verify Track Creation ────────────────────────────────────
info "Track Verification"
sleep 1
TESTS=$((TESTS + 1))
count=$(curl -sf "http://${HOST}:${HTTP_PORT}/api/tracks" 2>/dev/null | grep -o '"count":[0-9]*' | grep -o '[0-9]*')
if [[ -n "$count" ]] && [[ "$count" -gt 0 ]]; then
    pass "Tracks created ($count tracks)"
    PASSED=$((PASSED + 1))
else
    fail "No tracks created"
    FAILED=$((FAILED + 1))
fi

# ─── Security Headers ─────────────────────────────────────────
info "Security Header Tests"
for header in "X-Content-Type-Options: nosniff" "X-Frame-Options: DENY" "Strict-Transport-Security: max-age"; do
    TESTS=$((TESTS + 1))
    if curl -sI "http://${HOST}:${HTTP_PORT}/health" | grep -qi "$header"; then
        pass "Security header: $(echo "$header" | cut -d: -f1)"
        PASSED=$((PASSED + 1))
    else
        fail "Missing security header: $(echo "$header" | cut -d: -f1)"
        FAILED=$((FAILED + 1))
    fi
done

# ─── JREAP UDP ──────────────────────────────────────────────
info "JREAP UDP Transport Tests"
TESTS=$((TESTS + 1))
if nc -z -u -w2 "$HOST" "$JREAP_UDP_PORT" 2>/dev/null; then
    pass "JREAP UDP port $JREAP_UDP_PORT reachable"
    PASSED=$((PASSED + 1))
else
    warn "JREAP UDP port $JREAP_UDP_PORT not reachable (start with --jreap-udp-port)"
    TESTS=$((TESTS - 1))  # Don't count as failure
fi

# ─── JREAP TCP ──────────────────────────────────────────────
info "JREAP TCP Transport Tests"
TESTS=$((TESTS + 1))
if nc -z -w2 "$HOST" "$JREAP_TCP_PORT" 2>/dev/null; then
    pass "JREAP TCP port $JREAP_TCP_PORT reachable"
    PASSED=$((PASSED + 1))
else
    warn "JREAP TCP port $JREAP_TCP_PORT not reachable (start with --jreap-tcp-port)"
    TESTS=$((TESTS - 1))
fi

# ─── DIS Gateway ─────────────────────────────────────────────
info "DIS Gateway Tests"
TESTS=$((TESTS + 1))
if nc -z -u -w2 "$HOST" "$DIS_PORT" 2>/dev/null; then
    pass "DIS UDP port $DIS_PORT reachable"
    PASSED=$((PASSED + 1))
else
    warn "DIS UDP port $DIS_PORT not reachable (start with --dis-port)"
    TESTS=$((TESTS - 1))
fi

# ─── Summary ──────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════════"
echo "  FORGE-C2 Integration Test Results"
echo "═══════════════════════════════════════════════════"
echo -e "  Target:  ${HOST}"
echo -e "  Total:    ${TESTS}"
echo -e "  ${GREEN}Passed:  ${PASSED}${NC}"
echo -e "  ${RED}Failed:  ${FAILED}${NC}"
echo ""

if [[ $FAILED -eq 0 ]]; then
    echo -e "${GREEN}✅ ALL TESTS PASSED${NC}"
    exit 0
else
    echo -e "${RED}❌ ${FAILED} TEST(S) FAILED${NC}"
    exit 1
fi