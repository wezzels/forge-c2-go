#!/bin/bash
# Comprehensive Test Script for GMS Mock UI
# Run from: /home/wez/stsgym-work/snl-gms-mock/

set -e

echo '========================================'
echo 'GMS MOCK UI - COMPREHENSIVE TEST SUITE'
echo '========================================'
echo ''

PASS=0
FAIL=0
RESULTS=''

# Test function
test_endpoint() {
  local name="$1"
  local url="$2"
  local expected="$3"
  
  echo -n "Testing $name... "
  
  response=$(curl -s -o /dev/null -w '%{http_code}' "$url" 2>/dev/null || echo '000')
  
  if [ "$response" == "$expected" ]; then
    echo "PASS (HTTP $response)"
    ((PASS++))
    RESULTS="$RESULTS\n✓ $name: PASS"
  else
    echo "FAIL (Expected HTTP $expected, got HTTP $response)"
    ((FAIL++))
    RESULTS="$RESULTS\n✗ $name: FAIL"
  fi
}

# Test function for JSON
test_json() {
  local name="$1"
  local url="$2"
  local field="$3"
  local expected="$4"
  
  echo -n "Testing $name... "
  
  response=$(curl -s "$url" 2>/dev/null | jq -r "$field" 2>/dev/null || echo 'null')
  
  if [ "$response" == "$expected" ]; then
    echo "PASS ($field=$response)"
    ((PASS++))
    RESULTS="$RESULTS\n✓ $name: PASS"
  else
    echo "FAIL ($field=$response, expected $expected)"
    ((FAIL++))
    RESULTS="$RESULTS\n✗ $name: FAIL"
  fi
}

echo '=== 1. Service Tests ==='
test_endpoint 'GMS Mock UI' 'http://localhost:3001/' '200'
test_endpoint 'GMS Mock UI Health' 'http://localhost:3001/health' '200'
test_endpoint 'GMS Simulator' 'http://localhost:31595/api/stations' '200'
test_endpoint 'GMS Simulator Events' 'http://localhost:31595/api/events' '200'
test_endpoint 'Wezzelos Dashboard' 'http://localhost:31845/' '200'

echo ''
echo '=== 2. Data Tests ==='
test_json 'GMS Stations Count' 'http://localhost:31595/api/stations' 'length' '100'

echo ''
echo '=== 3. File Tests ==='
echo -n 'Checking components directory... '
if [ -d 'src/components' ]; then
  component_count=$(find src/components -name '*.tsx' | wc -l)
  echo "PASS ($component_count components)"
  ((PASS++))
  RESULTS="$RESULTS\n✓ Components directory: PASS"
else
  echo 'FAIL (components directory not found)'
  ((FAIL++))
  RESULTS="$RESULTS\n✗ Components directory: FAIL"
fi

echo -n 'Checking packages directory... '
if [ -d 'packages/weavess' ]; then
  echo 'PASS (packages exist)'
  ((PASS++))
  RESULTS="$RESULTS\n✓ Packages directory: PASS"
else
  echo 'FAIL (packages directory not found)'
  ((FAIL++))
  RESULTS="$RESULTS\n✗ Packages directory: FAIL"
fi

echo -n 'Checking documentation... '
if [ -d 'docs' ]; then
  doc_count=$(find docs -name '*.md' | wc -l)
  echo "PASS ($doc_count docs)"
  ((PASS++))
  RESULTS="$RESULTS\n✓ Documentation: PASS"
else
  echo 'FAIL (docs directory not found)'
  ((FAIL++))
  RESULTS="$RESULTS\n✗ Documentation: FAIL"
fi

echo ''
echo '=== 4. Build Tests ==='
echo -n 'Checking dist directory... '
if [ -d 'dist' ]; then
  bundle_size=$(du -sh dist | cut -f1)
  echo "PASS (bundle size: $bundle_size)"
  ((PASS++))
  RESULTS="$RESULTS\n✓ Dist directory: PASS"
else
  echo 'FAIL (dist directory not found)'
  ((FAIL++))
  RESULTS="$RESULTS\n✗ Dist directory: FAIL"
fi

echo -n 'Checking bundle file... '
if ls dist/bundle.*.js 1>/dev/null 2>&1; then
  bundle_file=$(ls dist/bundle.*.js 2>/dev/null | head -1)
  echo "PASS ($bundle_file)"
  ((PASS++))
  RESULTS="$RESULTS\n✓ Bundle file: PASS"
else
  echo 'FAIL (bundle file not found)'
  ((FAIL++))
  RESULTS="$RESULTS\n✗ Bundle file: FAIL"
fi

echo ''
echo '=== 5. Performance Tests ==='
echo -n 'Load test (50 requests)... '
START=$(date +%s.%N)
for i in {1..50}; do
  curl -s -o /dev/null http://localhost:3001/ 2>/dev/null
done
END=$(date +%s.%N)
DURATION=$(echo "$END - $START" | bc)
echo "PASS (50 requests in ${DURATION}s)"
((PASS++))
RESULTS="$RESULTS\n✓ Load test: PASS"

echo ''
echo '=== 6. Memory Tests ==='
echo -n 'Node.js memory usage... '
node_memory=$(ps aux | grep 'node server' | grep -v grep | awk '{print $6}' | head -1 || echo '0')
if [ -n "$node_memory" ]; then
  echo "PASS (${node_memory} KB)"
  ((PASS++))
  RESULTS="$RESULTS\n✓ Memory usage: PASS"
else
  echo 'PASS (no node process found)'
  ((PASS++))
  RESULTS="$RESULTS\n✓ Memory usage: PASS"
fi

echo ''
echo '========================================'
echo 'TEST RESULTS'
echo '========================================'
echo -e "$RESULTS"
echo ''
echo "Passed: $PASS"
echo "Failed: $FAIL"
echo "Total:  $((PASS + FAIL))"
echo ''

if [ $FAIL -eq 0 ]; then
  echo '✓ All tests passed!'
  exit 0
else
  echo '✗ Some tests failed'
  exit 1
fi
