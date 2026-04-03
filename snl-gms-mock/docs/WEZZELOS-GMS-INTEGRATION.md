# Wezzelos GMS Integration

## Overview

This document describes how to integrate GMS Mock UI with Wezzelos GMS dashboard.

---

## Current Setup

### GMS Mock UI
- **URL:** http://10.0.0.117:3001/
- **Technology:** React + TypeScript
- **Bundle:** 20.2 MB
- **Status:** Running

### Wezzelos Dashboard
- **URL:** http://10.0.0.117:31845/
- **Technology:** Node.js + Express
- **Status:** Running

### GMS Simulator
- **URL:** http://10.0.0.117:31595/api/
- **Technology:** Go
- **Status:** Running

---

## Integration Options

### Option 1: iframe Embedding (Simplest)

Embed Mock UI as iframe in Wezzelos:

```html
<iframe src="http://10.0.0.117:3001" style="width: 100%; height: 100%; border: none;"></iframe>
```

**Pros:**
- Simple implementation
- Isolated execution
- Easy to add

**Cons:**
- No shared state
- Authentication required separately
- Communication limited

### Option 2: Reverse Proxy (Recommended)

Proxy Mock UI through Wezzelos:

```nginx
# In Wezzelos nginx config
location /gms-mock/ {
    proxy_pass http://10.0.0.117:3001/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

**Pros:**
- Single domain
- Shared authentication
- Unified routing

**Cons:**
- Requires nginx configuration
- May need URL rewriting

### Option 3: Component Integration (Best)

Integrate React components directly:

```javascript
// In Wezzelos
import { EventsTable, WaveformDisplay } from 'gms-mock-ui';

function SeismicPanel() {
  return (
    <div className="seismic-panel">
      <EventsTable events={events} onEventSelect={handleSelect} />
      <WaveformDisplay channelSegments={segments} />
    </div>
  );
}
```

**Pros:**
- Best performance
- Shared state
- Integrated UI

**Cons:**
- Requires code refactoring
- Dependency management

---

## Recommended Implementation

### Phase 1: iframe Embedding (Day 1)

1. Add iframe in Wezzelos dashboard
2. Configure iframe communication
3. Test basic functionality

### Phase 2: Reverse Proxy (Day 2)

1. Configure nginx reverse proxy
2. Update Mock UI URLs
3. Test authentication flow

### Phase 3: Component Integration (Day 3-5)

1. Extract shared components
2. Create npm package
3. Integrate into Wezzelos

---

*Created: 2026-03-15*
