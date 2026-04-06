# ONBOARDING.md - 51O8 Research Platform Worker Guide

## Welcome to the 51O8 Research Platform

This guide will help you get started with collecting company and commodity research data. You will be assigned a set of companies to research and will enter data into the 51O8 database.

---

## Getting Started

### 1. Access Requirements
Before starting, ensure you have:
- [ ] Database access credentials (provided by admin)
- [ ] Access to the 51O8 web interface at https://51o8.stsgym.com
- [ ] Research tools: Yahoo Finance, LinkedIn, SEC EDGAR
- [ ] This ONBOARDING.md document

### 2. Account Setup
1. Log in to https://51o8.stsgym.com using your assigned credentials
2. Navigate to your assigned companies list
3. Verify your worker ID is correctly assigned

### 3. Research Tools
| Tool | URL | Purpose |
|------|-----|---------|
| Yahoo Finance | https://finance.yahoo.com | Stock prices, financials, company info |
| SEC EDGAR | https://www.sec.gov/edgar/search | Filings, executives, CIK numbers |
| LinkedIn | https://www.linkedin.com | Executive profiles, company pages |
| MarketWatch | https://www.marketwatch.com | Additional financial data |
| Crunchbase | https://www.crunchbase.com | Private company background |

---

## Data Collection Instructions

### Step 1: Company Identification

For each assigned company, collect the following:

| Field | How to Find | Example |
|-------|-------------|---------|
| Stock Symbol | Yahoo Finance search | AAPL |
| Company Name | SEC EDGAR company search | Apple Inc. |
| CIK Number | SEC EDGAR (10-K filing) | 0000320193 |
| Exchange | Yahoo Finance summary | NASDAQ |
| Sector | Yahoo Finance Profile | Technology |
| Industry | Yahoo Finance Profile | Consumer Electronics |
| Founded Year | Company "About" page | 1976 |
| Headquarters | Company "About" page | Cupertino, CA |
| Company Type | SEC filing type | Public |
| Description | Company website (2-3 sentences) | Apple Inc. designs and manufactures smartphones... |

**Data Entry:**
1. Navigate to "Add Company" in the 51O8 interface
2. Enter all required fields
3. Click "Save" to create the company record
4. Note the Project ID for next steps

---

### Step 2: Executive Leadership

**Minimum Required:** 5 executives per company
**Target:** 10+ executives for Very High confidence

#### Executive Roles to Research
| Priority | Role | Required |
|----------|------|----------|
| 1 | CEO | Yes |
| 2 | CFO | Yes |
| 3 | COO | No (if exists) |
| 4 | CTO/CIO | If tech company |
| 5 | Board Chairman | Yes |
| 6 | President | No (if exists) |
| 7 | Chief Strategy Officer | No |
| 8 | Chief Marketing Officer | If B2C company |
| 9 | Chief People Officer | No |
| 10 | Key Division Heads | If large company |

#### How to Find Executives
1. **SEC EDGAR DEF 14A (Proxy Statement)**
   - Search company name on SEC EDGAR
   - Find most recent DEF 14A filing
   - Lists all executive officers and directors

2. **LinkedIn Company Page**
   - Search company on LinkedIn
   - Click "People" tab
   - Filter by "Current Company" and title containing "C-level"

3. **Company Website**
   - Navigate to "Leadership" or "About Us" page
   - Executive bios usually available

4. **Yahoo Finance Profile**
   - Go to company profile
   - Scroll to "Key Executives" section

#### Data to Collect Per Executive
| Field | How to Find | Example |
|-------|-------------|---------|
| Name | SEC filing, LinkedIn | Timothy D. Cook |
| Title | SEC filing, LinkedIn | Chief Executive Officer |
| Department | Standard categorization | Executive Leadership |
| LinkedIn URL | LinkedIn search | https://www.linkedin.com/in/timcook/ |
| Influence Score | Estimate 1-10 | 9.5 |
| Notes | Press releases, bio | CEO since 2011, succeeded Steve Jobs |

**Influence Score Guide:**
| Score | Criteria |
|-------|----------|
| 9-10 | Household name, Fortune 500 CEO, 1M+ LinkedIn followers |
| 7-8 | Well-known in industry, frequently quoted in press |
| 5-6 | Respected leader, moderate press coverage |
| 3-4 | Standard executive, limited press |
| 1-2 | New or low-profile executive |

**Data Entry:**
1. Navigate to company project
2. Click "Add Employee"
3. Enter all required fields
4. Click "Save"
5. Repeat for each executive

---

### Step 3: Social Media Accounts

**Minimum Required:** 3 accounts per company
**Target:** 5+ accounts for Very High confidence

#### Required Platforms
| Priority | Platform | Required |
|----------|----------|----------|
| 1 | Twitter/X | Yes |
| 2 | LinkedIn Company Page | Yes |
| 3 | Facebook | If B2C company |
| 4 | Instagram | If B2C company |
| 5 | YouTube | If exists |
| 6 | TikTok | If B2C, younger audience |
| 7 | Pinterest | If retail company |

#### How to Find Social Accounts
1. **Company Website Footer**
   - Scroll to bottom of company website
   - Look for social media icons
   - Click each to verify accounts

2. **Google Search**
   - Search: "[Company name] Twitter"
   - Search: "[Company name] LinkedIn company page"
   - Verify official account (blue checkmark)

3. **Twitter Search**
   - Search company name on Twitter
   - Filter by "Verified" accounts
   - Look for official company logo

#### Data to Collect Per Account
| Field | How to Find | Example |
|-------|-------------|---------|
| Platform | Manual | Twitter |
| Handle | Profile URL | Apple |
| URL | Direct link | https://twitter.com/Apple |
| Followers Count | Profile page | 8,500,000 |
| Verified | Check mark | Yes |

**Data Entry:**
1. Navigate to company project
2. Click "Add Social Media"
3. Enter all required fields
4. Click "Save"
5. Repeat for each platform

---

### Step 4: Financial Data

**Minimum Required:** 4 quarters (current year)
**Target:** 8+ quarters for Very High confidence

#### How to Find Financials
1. **SEC EDGAR 10-K (Annual Report)**
   - Search company on SEC EDGAR
   - Find most recent 10-K
   - Extract: Revenue, Net Income, Assets, Liabilities

2. **SEC EDGAR 10-Q (Quarterly Report)**
   - Find quarterly 10-Q filings
   - Extract quarterly financials

3. **Yahoo Finance Financials**
   - Go to company page
   - Click "Financials" tab
   - Click "Income Statement", "Balance Sheet"
   - Copy values

#### Data to Collect Per Quarter
| Field | Source | Example |
|-------|--------|---------|
| Fiscal Year | SEC filing | 2024 |
| Fiscal Quarter | SEC filing | 4 (Q4) |
| Revenue | Income Statement | 383,285,000,000 |
| Net Income | Income Statement | 96,995,000,000 |
| Total Assets | Balance Sheet | 352,583,000,000 |
| Total Liabilities | Balance Sheet | 290,437,000,000 |
| Stock Price | Yahoo Finance (end of quarter) | 185.50 |
| Market Cap | Yahoo Finance | 2,850,000,000,000 |
| P/E Ratio | Yahoo Finance | 28.5 |
| EPS | Income Statement | 6.16 |
| Dividend Yield | Yahoo Finance | 0.52 |
| Source | Citation | Apple Q4 2024 10-K |

**Data Entry:**
1. Navigate to company project
2. Click "Add Financial"
3. Enter all required fields
4. Click "Save"
5. Repeat for each quarter

---

### Step 5: Market Data (Optional but Recommended)

| Field | How to Find | Example |
|-------|-------------|---------|
| 52-Week High | Yahoo Finance Summary | 199.62 |
| 52-Week Low | Yahoo Finance Summary | 164.08 |
| Average Volume | Yahoo Finance Summary | 58,000,000 |
| Beta | Yahoo Finance | 1.28 |
| Short Interest | Yahoo Finance | 1.5% |
| Institutional Ownership | Yahoo Finance | 72.3% |

---

## Confidence Score Calculation

Your work will be scored based on data completeness:

```
Confidence = MIN(95, (employees × 2.5) + (social × 5) + (financials × 10) + 30)
```

### Score Examples
| Employees | Social | Financials | Confidence |
|-----------|--------|------------|------------|
| 10 | 5 | 8 | 95% (Very High) |
| 5 | 3 | 4 | 78% (High) |
| 3 | 2 | 2 | 58% (Medium) |
| 1 | 1 | 1 | 43% (Low) |

### Achieving High Scores
- Add more executives (especially from DEF 14A)
- Add more social media platforms
- Add more quarters of financials
- Quality notes on executives increase value

---

## Quality Standards

### Do's
- [ ] Verify all data against primary sources (SEC, company website)
- [ ] Use full legal names (not nicknames)
- [ ] Include LinkedIn URLs for all executives
- [ ] Cite source for all financial data
- [ ] Check social media accounts are official (verified badge)
- [ ] Add meaningful notes on executives

### Don'ts
- [ ] Don't copy data from Wikipedia
- [ ] Don't use estimated/rounded financial figures
- [ ] Don't add duplicate executives
- [ ] Don't add personal social media accounts
- [ ] Don't skip required fields

---

## Workflow Example: Apple Inc.

### Time Estimate: 25-30 minutes

1. **Company Identification (5 min)**
   - Search "AAPL" on Yahoo Finance
   - Search "Apple Inc." on SEC EDGAR
   - Copy CIK: 0000320193
   - Founded: 1976, HQ: Cupertino, CA

2. **Executive Research (10 min)**
   - Find DEF 14A on SEC EDGAR
   - Extract 10 executives:
     - Tim Cook (CEO)
     - Luca Maestri (CFO)
     - Jeff Williams (COO)
     - etc.
   - Find LinkedIn URLs for each

3. **Social Media (5 min)**
   - Apple.com footer links
   - Twitter: @Apple (8.5M followers)
   - LinkedIn: apple (12M followers)
   - Facebook: Apple (15M followers)
   - Instagram: apple (32M followers)
   - YouTube: Apple (8M subscribers)

4. **Financials (5 min)**
   - Yahoo Finance Financials tab
   - Copy 8 quarters of data
   - Note sources as "Apple Q4 2024 10-K"

5. **Final Score**
   - 10 employees + 5 social + 8 financials
   - Confidence: 95% (Very High)

---

## Troubleshooting

### Common Issues

**Issue:** Can't find CIK number
**Solution:** Use SEC EDGAR company search, or search 10-K filing

**Issue:** LinkedIn URL not working
**Solution:** Some executives have private profiles. Note "Private profile" in notes.

**Issue:** Company has multiple social media accounts
**Solution:** Add only the official verified account (blue checkmark)

**Issue:** Financials in different currency
**Solution:** Note currency in source field, convert to USD if possible

**Issue:** Company is REIT/MLP/Trust
**Solution:** Note company type as "REIT", "MLP", or "Trust"

---

## Progress Tracking

### Daily Checklist
- [ ] Log in to 51O8 platform
- [ ] Check assigned companies list
- [ ] Complete research for X companies
- [ ] Update progress in tracking spreadsheet
- [ ] Report any blockers to coordinator

### Weekly Review
- [ ] Review confidence scores
- [ ] Address low-scoring companies
- [ ] Submit completed companies for QA review
- [ ] Receive new assignments

---

## Support

### Questions?
- Technical issues: Contact platform admin
- Data questions: Review TODO.md
- Process questions: Review this ONBOARDING.md

### Resources
- TODO.md - Full project scope and requirements
- MEMORY.md - Project history and decisions
- 51O8 Platform: https://51o8.stsgym.com

---

## Quick Reference Card

### Minimum Data Requirements
| Category | Minimum | Target |
|----------|---------|--------|
| Executives | 5 | 10+ |
| Social Media | 3 | 5+ |
| Financial Quarters | 4 | 8+ |
| Confidence Score | 50% | 85%+ |

### Key URLs
| Resource | URL |
|----------|-----|
| Yahoo Finance | https://finance.yahoo.com |
| SEC EDGAR | https://www.sec.gov/edgar/search |
| LinkedIn | https://www.linkedin.com |
| 51O8 Platform | https://51o8.stsgym.com |

### Confidence Formula
```
Score = (employees × 2.5) + (social × 5) + (financials × 10) + 30
Max: 95%
```

---

*Last Updated: 2026-03-27*
*Version: 1.0*
*51O8 Research Platform*