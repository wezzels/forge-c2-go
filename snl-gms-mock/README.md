# SNL-GMS Mock UI

A React-based seismic monitoring interface mock, reverse-engineered from SNL-GMS Interactive Analysis.

## Features

- **Events Table** - View and manage seismic events
- **Stations Table** - Monitor station status
- **Detections Table** - View signal detections
- **Waveform Display** - Canvas 2D waveforms with gradient fill
- **3D Globe** - Cesium-based map with station markers
- **FK Analysis** - Frequency-wavenumber spectrum display
- **Spectrogram** - Time-frequency visualization
- **Location Editor** - Edit event locations with uncertainty
- **Magnitude Editor** - Edit Mb, Ms, ML, Mw magnitudes
- **Real-time WebSocket** - Live updates (when connected)

## Quick Start

```bash
# Install dependencies
npm install

# Build
npm run build

# Start development server
HOST=0.0.0.0 PORT=3001 npm run dev
```

## Project Structure

```
snl-gms-mock/
├── src/
│   ├── api/
│   │   ├── rest/           # REST API clients
│   │   └── websocket/     # WebSocket client
│   ├── components/
│   │   ├── Analysis/      # Travel time curves
│   │   ├── DetectionAssociation/
│   │   ├── DetectionDetail/
│   │   ├── EventCreation/
│   │   ├── EventDetail/
│   │   ├── Events/
│   │   ├── FK/            # FK spectrum, beam visualization
│   │   ├── History/       # Location history, magnitude time series
│   │   ├── Location/      # Location editor
│   │   ├── Magnitude/     # Magnitude editor
│   │   ├── Map/           # Cesium 3D globe
│   │   ├── SignalDetections/
│   │   ├── Spectrogram/   # Spectrogram display
│   │   ├── StationDetail/
│   │   ├── StationProperties/
│   │   ├── Toolbar/
│   │   ├── Uncertainty/   # Uncertainty ellipse
│   │   ├── Waveform/      # Canvas 2D waveforms
│   │   ├── WaveformGL/    # WebGL waveforms (TODO)
│   │   └── Wezzelos/      # Wezzelos integration
│   ├── models/            # TypeScript interfaces
│   ├── state/             # Redux store
│   └── utils/             # Utility functions
├── packages/              # SNL-GMS packages
│   ├── weavess/          # Waveform display
│   ├── weavess-core/     # Core types
│   ├── common-model/     # Shared models
│   └── common-util/      # Utilities
├── docs/                  # Documentation
└── dist/                  # Build output
```

## Components

| Component | Description |
|-----------|-------------|
| EventsTable | AG-Grid table with filtering, sorting, export |
| StationsTable | Station listing with map integration |
| DetectionsTable | Signal detections with phase filtering |
| WaveformDisplay | Canvas 2D waveforms with markers |
| CesiumMap | 3D globe with station/event markers |
| FKSpectrum | Polar plot for FK analysis |
| SpectrogramDisplay | Time-frequency spectrogram |
| LocationEditor | Lat/lon/depth with uncertainty |
| MagnitudeEditor | Mb/Ms/ML/Mw editing |
| WezzelosEmbed | iframe integration for Wezzelos |

## Packages

| Package | Version | Purpose |
|---------|---------|---------|
| @gms/weavess | 1.3.0 | WebGL waveform display |
| @gms/weavess-core | 0.1.0 | Core types and utilities |
| @gms/common-model | - | Event/detection models |
| @gms/common-util | - | Common utilities |

## Development

```bash
# Development server
npm run dev

# Production build
npm run build

# Lint
npm run lint

# Test
npm test
```

## URLs

- **Mock UI:** http://10.0.0.117:3001/
- **GMS Simulator:** http://10.0.0.117:31595/api/
- **Wezzelos Dashboard:** http://10.0.0.117:31845/

## Documentation

- [SNL-GMS vs Mock-GMS Analysis](./docs/SNL-GMS-vs-MOCK-GMS-ANALYSIS.md)
- [Wezzelos Integration](./docs/WEZZELOS-GMS-INTEGRATION.md)
- [Installer Guide](./docs/GMS-MOCK-UI-INSTALLER.md)
- [Priority Implementation](./docs/PRIORITY-IMPLEMENTATION.md)

## License

UNLICENSED - Internal use only

---

*Created: 2026-03-15*
