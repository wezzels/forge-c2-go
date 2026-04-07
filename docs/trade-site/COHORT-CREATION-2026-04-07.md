# Trade Site Cohort Creation Fix

**Date:** 2026-04-07
**Issue:** Second cohort should have been created on day 10 (April 5), but wasn't.

## Problem

- Program started March 26, 2026
- Day 13 when checked, only 1 cohort active
- No automated cohort creation mechanism
- `NEW_COHORT_WEEKLY = true` flag existed but no implementation

## Solution

### 1. Created `create_cohort.py` Script

Location: `/home/wez/51o8-research/scripts/create_cohort.py`

Functionality:
- Queries 51O8 database for top predictions (confidence > 50, price $1-$500)
- Filters out symbols already in active cohorts
- Selects top 10 by confidence
- Position sizing: $300 (75%+ confidence), $175 (65%+), $100 (default)
- Creates new cohort if under max (6 cohorts)

### 2. Added Cron Job

```cron
# Create new cohort every Monday at 9:15 AM MT (15:15 UTC)
15 15 * * 1 docker run --rm --network 51o8-research_fiftyone-network -v /home/wez/51o8-research/scripts:/scripts -v /home/wez/trade-site/data:/data python:3.11-slim sh -c "pip install psycopg2-binary -q && python /scripts/create_cohort.py" >> /home/wez/trade-site/logs/create_cohort.log 2>&1
```

### 3. Added Admin API Endpoint

**Endpoint:** `POST /api/admin/create-cohort`

Requires authentication. Calls `create_cohort.py` via Docker.

### 4. Added UI Button

"Create New Cohort" button visible to admins on dashboard.

## Results

- Created Cohort 2 on April 7, 2026 with 10 positions:
  - ADBE, PEP, WMT, GOOGL, AMZN, NVDA, IBM, AAPL, V, UNH
  - All 90-95% confidence
  - Total investment: $3000

## Files Modified

| File | Changes |
|------|---------|
| `/home/wez/51o8-research/scripts/create_cohort.py` | New script |
| `/home/wez/trade-site/src/app.js` | Added admin endpoint |
| `/home/wez/trade-site/src/views/dashboard.handlebars` | Added button + JS |
| crontab | Added weekly cohort creation |

## Current State

| Cohort | Status | Positions | Created |
|--------|--------|-----------|---------|
| 1 | Active | 10 | 2026-03-26 |
| 2 | Active | 10 | 2026-04-07 |
| 3-6 | Pending | - | Weekly creation |

## Next Cohort Schedule

- Cohort 3: April 14, 2026 (Monday)
- Cohort 4: April 21, 2026 (Monday)
- Cohort 5: April 28, 2026 (Monday)
- Cohort 6: May 5, 2026 (Monday)