#!/bin/bash
# GMS Mock UI Build Script
cd /home/wez/stsgym-work/snl-gms-mock

case "$1" in
    install)
        npm install
        ;;
    build)
        npm run build
        ;;
    dev)
        nohup npm run dev > /tmp/gms-mock-dev.log 2>&1 &
        sleep 5
        curl -s http://localhost:3001/ >/dev/null && echo 'Running on port 3001' || echo 'Failed to start'
        ;;
    stop)
        pkill -f 'webpack.*snl-gms-mock' || true
        ;;
    status)
        pgrep -f 'webpack.*snl-gms-mock' && echo 'Running' || echo 'Stopped'
        ls -la dist/bundle.*.js 2>/dev/null | head -1
        ;;
    *)
        echo 'Usage: $0 {install|build|dev|stop|status}'
        ;;
esac
