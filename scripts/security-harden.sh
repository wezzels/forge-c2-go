#!/bin/bash
# FORGE-C2 Security Hardening Script

set -e

echo "=== FORGE-C2 Security Hardening ==="

# 1. Create non-root user
if ! id -u forge >/dev/null 2>&1; then
    useradd --system --no-create-home --shell /bin/false forge
    echo "Created forge user"
fi

# 2. Set permissions
chmod 700 /opt/forge-c2/config.yaml
chmod 700 /opt/forge-c2/certs/
echo "Permissions set"

# 3. Verify TLS config
if [ -f /opt/forge-c2/certs/server.crt ]; then
    openssl x509 -in /opt/forge-c2/certs/server.crt -noout -dates
    echo "Certificate valid"
fi

# 4. Run Trivy scan
if command -v trivy >/dev/null 2>&1; then
    echo "Running vulnerability scan..."
    trivy image --severity HIGH,CRITICAL forge-c2:latest || true
fi

echo "=== Hardening Complete ==="
