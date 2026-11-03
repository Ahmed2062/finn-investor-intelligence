# FINN — Investor intelligence prototype

A mobile-first prototype for the ENAM AI Engineer Build Challenge. It demonstrates a prioritized filing digest, configurable alert rules, and a primary-source-oriented company research view. On Vercel, the API routes fetch EOD bars and NSE announcement RSS data when the user clicks **Refresh live data**.

## Run

Open `index.html` in a modern browser to view the sample mode. Live API routes require Vercel deployment; they will not run when opening the HTML directly or using a static-only host. No API key or package install is required for Vercel.

## What works

- Push: ranked live NSE announcement RSS items and Yahoo Finance EOD signals, 24h / 3d / 7d windows, priority and watch filters, source labels. The announcement reader filters the NSE all-company RSS stream to the demo portfolio by issuer title to avoid counterparty false matches.
- Alerts: configurable price and volume thresholds saved to browser local storage; announcement categories grouped by urgency.
- Pull: search 20 NSE symbols including names outside the portfolio, research tabs for snapshot, trajectory, cash quality, narrative vs numbers, bull/bear, and a question box demonstrating the evidence policy.
- Responsive sidebar and mobile bottom navigation.

## Data note

The initial sample feed and all research metrics/narrative remain illustrative. The live endpoint fetches Yahoo Finance chart bars (.NS) and computes daily change and volume against the prior 20 sessions; Yahoo's chart endpoint is unofficial and can change or rate-limit. The filing endpoint reads NSE's public announcement RSS stream, filters by company-name matches in the issuer title, and preserves the item title, date, and link; an RSS match can be incomplete, so use the linked original filing for decisions. Fundamental research is not scraped into this demo: the company picker links to Screener company pages where reports and transcripts are listed. These links are discovery aids; pull-side conclusions still need direct citations to primary documents. No content here is investment advice.

## Architecture and next steps

The UI is static HTML/CSS/JS; `api/prices.js` and `api/announcements.js` provide Vercel serverless endpoints. Production would add scheduled ingestion, resilient caching/retries, robust ticker mapping, deduplication, full attachment ingestion, page-level citation retrieval over annual reports/results/transcripts, and alert delivery. The UI should never assert a result or guidance comparison without a traceable primary-source passage. Push enrichment for management bios can use public professional sources, separately from pull-side primary-source grounding.

## Demo portfolio

18 NSE-listed names across financials, technology, energy, consumer, auto, pharma, telecom, infrastructure and utilities: RELIANCE, HDFCBANK, TCS, BHARTIARTL, TATAMOTORS, SUNPHARMA, INFY, ITC, ICICIBANK, LT, MARUTI, TITAN, AXISBANK, ASIANPAINT, NTPC, POWERGRID, BAJFINANCE, HINDUNILVR. Ad-hoc coverage includes ZOMATO/Eternal and ADANIPORTS in the research picker.

