#!/bin/bash
# GMS Mock UI Test Script
# Run from: /home/wez/stsgym-work/snl-gms-mock/

set -e

echo '========================================'
echo 'GMS MOCK UI TEST SUITE'
echo '========================================'
echo ''

PASS=0
FAIL=0

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
  else
    echo "FAIL (Expected HTTP $expected, got HTTP $response)"
    ((FAIL++))
  fi
}

# Test function for JSON
test_json() {
  local name="$1"
  local url="$2"
  local field="$3"
  
  echo -n "Testing $name JSON... "
  
  response=$(curl -s "$url" 2>/dev/null | jq -r "$field" 2>/dev/null || echo 'null')
  
  if [ "$response" != 'null' ] && [ -n "$response" ]; then
    echo "PASS ($field=$response)"
    ((PASS++))
  else
    echo "FAIL ($field not found)"
    ((FAIL++))
  fi
}

echo '=== 1. Service Tests ==='
test_endpoint 'GMS Mock UI Health' 'http://localhost:3001/' '200'
test_endpoint 'GMS Mock UI Bundle' 'http://localhost:3001/bundle.46170eb397171273049c.js' '200'
test_endpoint 'GMS Simulator Stations' 'http://localhost:31595/api/stations' '200'
test_endpoint 'GMS Simulator Events' 'http://localhost:31595/api/events' '200'
test_endpoint 'Wezzelos Dashboard' 'http://localhost:31845/' '200'

echo ''
echo '=== 2. API Tests ==='
test_json 'GMS Simulator Stations' 'http://localhost:31595/api/stations' '.[0].id'
test_json 'GMS Simulator Stations' 'http://localhost:31595/api/stations' 'length'

echo ''
echo '=== 3. Component Tests ==='
echo -n 'Checking components directory... '
if [ -d 'src/components' ]; then
  component_count=$(find src/components -name '*.tsx' | wc -l)
  echo "PASS ($component_count components)"
  ((PASS++))
else
  echo 'FAIL (components directory not found)'
  ((FAIL++))
fi

echo -n 'Checking packages directory... '
if [ -d 'packages/weavess' ]; then
  echo 'PASS (packages exist)'
  ((PASS++))
else
  echo 'FAIL (packages directory not found)'
  ((FAIL++))
fi

echo -n 'Checking documentation... '
if [ -d 'docs' ]; then
  doc_count=$(find docs -name '*.md' | wc -l)
  echo "PASS ($doc_count docs)"
  ((PASS++))
else
  echo 'FAIL (docs directory not found)'
  ((FAIL++))
fi

echo ''
echo '=== 4. Build Tests ==='
echo -n 'Checking dist directory... '
if [ -d 'dist' ]; then
  bundle_size=$(du -sh dist | cut -f1)
  echo "PASS (bundle size: $bundle_size)"
  ((PASS++))
else
  echo 'FAIL (dist directory not found)'
  ((FAIL++))
fi

echo -n 'Checking bundle file... '
if [ -f 'dist/bundle.*.js' ] || [ "$(ls dist/bundle.*.js 2>/dev/null | head -1)" ]; then
  bundle_file=$(ls dist/bundle.*.js 2>/dev/null | head -1)
  echo "PASS ($bundle_file)"
  ((PASS++))
else
  echo 'FAIL (bundle file not found)'
  ((FAIL++))
fi

echo ''
echo '=== 5. Service Status Tests ==='
echo -n 'Checking gms-mock-ui service... '
if systemctl is-active --quiet gms-mock-ui 2>/dev/null; then
  echo 'PASS (running)'
  ((PASS++))
else
  echo 'FAIL (not running)'
  ((FAIL++))
fi

echo -n 'Checking wezzelos-gms service... '
if systemctl is-active --quiet wezzelos-gms 2>/dev/null; then
  echo 'PASS (running)'
  ((PASS++))
else
  echo 'FAIL (not running)'
  ((FAIL++))
fi

echo ''
echo '=== 6. Port Tests ==='
echo -n 'Checking port 3001... '
if ss -tlnp | grep -q ':3001'; then
  echo 'PASS (listening)'
  ((PASS++))
else
  echo 'FAIL (not listening)'
  ((FAIL++))
fi

echo -n 'Checking port 31595... '
if ss -tlnp | grep -q ':31595'; then
  echo 'PASS (listening)'
  ((PASS++))
else
  echo 'FAIL (not listening)'
  ((FAIL++))
fi

echo -n 'Checking port 31845... '
if ss -tlnp | grep -q ':31845'; then
  echo 'PASS (listening)'
  ((PASS++))
else
  echo 'FAIL (not listening)'
  ((FAIL++))
fi

echo ''
echo '========================================'
echo 'TEST RESULTS'
echo '========================================'
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
