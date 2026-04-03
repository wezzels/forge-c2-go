# GMS Mock UI Installation Guide

## Quick Start

```bash
cd /home/wez/stsgym-work/snl-gms-mock
npm install
npm run dev
```

## Build Commands

```bash
# Install dependencies
./build.sh install

# Build production bundle
./build.sh build

# Start development server
./build.sh dev

# Stop server
./build.sh stop

# Check status
./build.sh status
```

## Manual Commands

```bash
# Install
npm install

# Development
npm run dev

# Production build
npm run build

# Production server
npm start
```

## Access

- Development: http://localhost:3001/
- Production: http://10.0.0.117:3001/

## Services

| Service | Port |
|---------|------|
| GMS Mock UI | 3001 |
| Gateway | 3000 |
| Config Server | 8888 |

## Troubleshooting

```bash
# Check if port is in use
ss -tlnp | grep :3001

# Kill server
pkill -f 'webpack.*snl-gms-mock'

# Reinstall
rm -rf node_modules package-lock.json
npm install
```
