# FINN — Investor intelligence prototype

A mobile-first prototype for the ENAM AI Engineer Build Challenge. It demonstrates a prioritized filing digest, configurable alert rules, and a primary-source-oriented company research view. On Vercel, the API routes fetch EOD bars and NSE announcement RSS data when the user clicks **Refresh live data**.

## Run

Open `index.html` in a modern browser to view the sample mode. Live API routes require Vercel deployment; they will not run when opening the HTML directly or using a static-only host. No API key or package install is required for Vercel.

## What works

- Push: ranked live NSE announcement RSS items and Yahoo Finance EOD signals, 24h / 3d / 7d windows, priority and watch filters, source labels. The announcement reader filters the NSE all-company RSS stream to the demo portfolio by text match.
- Alerts: configurable price and volume thresholds saved to browser local storage; announcement categories grouped by urgency.
- Pull: search 20 NSE symbols. Selecting a ticker loads its own Yahoo Finance EOD close, daily move, volume vs. prior 20 sessions, one-month price history, and recent NSE RSS announcements. It links to that company's Screener document page and NSE quote page.
- Responsive sidebar and mobile bottom navigation.

## Data note

The home feed's initial stories, portfolio totals, and narrative remain illustrative. Research market metrics and price history are ticker-specific live EOD data. Yahoo's chart endpoint is unofficial and can change or rate-limit. The filing endpoint reads NSE's public announcement RSS stream, matches issuer names in titles, and returns titles, dates, descriptions, and links; RSS coverage can be incomplete, so use the linked original filing. The research view also lists recent matching filings and links to Screener for company-report discovery. FINN does not yet download/parse annual reports or transcripts, so it deliberately does not assert live company fundamentals, cash-flow analysis, guidance tracking, or bull/bear conclusions. No content here is investment advice.

## Architecture and next steps

The UI is static HTML/CSS/JS; `api/prices.js` and `api/announcements.js` provide Vercel serverless endpoints. Next steps are resilient caching/retries, broader ticker coverage, deduplication, primary-document download and parsing, page-level citation retrieval over annual reports/results/transcripts, and alert delivery. The UI should never assert a result or guidance comparison without a traceable primary-source passage. Push enrichment for management bios can use public professional sources, separately from pull-side primary-source grounding.

## Demo portfolio

18 NSE-listed names across financials, technology, energy, consumer, auto, pharma, telecom, infrastructure and utilities: RELIANCE, HDFCBANK, TCS, BHARTIARTL, TATAMOTORS, SUNPHARMA, INFY, ITC, ICICIBANK, LT, MARUTI, TITAN, AXISBANK, ASIANPAINT, NTPC, POWERGRID, BAJFINANCE, HINDUNILVR. Ad-hoc coverage includes ZOMATO/Eternal and ADANIPORTS in the research picker.

## Submission

Live demo: https://finn-investor-intelligence.vercel.app/  
Source repository: https://github.com/Ahmed2062/finn-investor-intelligence

Email these links and the covering write-up to ENAM with the original AI conversation share link/export if requested. Keep the covering note and private contact details out of the public source repository. See `DEPLOY.md` for the checklist.
