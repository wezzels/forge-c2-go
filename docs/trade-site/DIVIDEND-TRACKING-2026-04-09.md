# Dividend Tracking Implementation

**Date**: 2026-04-09
**Status**: IN PROGRESS

## Overview

Adding dividend-focused investment strategy alongside the existing trading cohorts.

## Architecture

### Data Files
- `/data/dividend-portfolio.json` - Separate portfolio for dividend cohorts
- `/data/dividend-history/` - Historical snapshots for dividend tracking

### Database
- Uses existing `company_listings.dividend_yield` field (1,281 stocks with yield data)
- Yahoo Finance API for dividend payment dates and amounts

### Pages
- `/dividends` - Main dividend tracking dashboard
- `/api/dividends/refresh` - Update dividend prices and monthly income
- `/api/dividends/projected` - Calculate projected annual income

## Dividend Strategy

### Selection Criteria
- `dividend_yield >= 2%` (meaningful yield)
- `prediction_confidence >= 65%` (from 51O8 model)
- `stock_price BETWEEN $5 AND $200` (reasonable entry)
- `market_cap > $1B` (established companies)
- Exclude REITs, BDCs, MLPs (different tax treatment)

### Position Sizing
| Confidence | Yield | Position Size |
|------------|-------|---------------|
| >= 80% | >= 4% | $400 |
| >= 75% | >= 3% | $300 |
| >= 70% | >= 2% | $200 |
| >= 65% | >= 2% | $150 |

### Tracking
- Monthly dividend income (actual vs projected)
- Yield on cost (yield at entry vs current)
- DRIP toggle (reinvest or cash)
- Ex-dividend calendar
- Payment dates

## Files to Create/Modify

### New Files
1. `/home/wez/trade-site/src/routes/dividends.js` - Dividend routes
2. `/home/wez/trade-site/src/views/dividends.handlebars` - Dashboard view
3. `/home/wez/51o8-research/scripts/create_dividend_cohort.py` - Cohort creation
4. `/home/wez/trade-site/data/dividend-portfolio.json` - Initial portfolio

### Modified Files
1. `/home/wez/trade-site/src/app.js` - Add dividend routes

## Yahoo Finance API

Using the free Yahoo Finance API for dividend data:

```
GET https://query1.finance.yahoo.com/v8/finance/chart/{symbol}
  ?interval=1d
  &range=1y
```

Returns dividend events in the `events` object with:
- `dividends` - Array of dividend payments with dates and amounts

## Implementation Steps

- [x] Analyze existing trade site structure
- [x] Check 51O8 database for dividend data
- [ ] Create dividend portfolio data structure
- [ ] Create dividend cohort creation script
- [ ] Add dividend routes to app.js
- [ ] Create dividends.handlebars view
- [ ] Test dividend tracking page
- [ ] Add cron job for weekly dividend cohort creation