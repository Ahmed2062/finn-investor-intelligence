# FINN — Investor intelligence prototype

A mobile-first prototype for the ENAM AI Engineer Build Challenge. It demonstrates a prioritized filing digest, configurable alert rules, and a primary-source-oriented company research view. On Vercel, the API routes fetch EOD bars and NSE announcement RSS data when the user clicks **Refresh live data**.

## Run

Open `index.html` in a modern browser to view the sample mode. Live API routes require Vercel deployment; they will not run when opening the HTML directly or using a static-only host. Live AI chat requires `AI_GATEWAY_API_KEY` configured in Vercel; no key belongs in the browser or repository. No package install is required.

## What works

- Push: ranked live NSE announcement RSS items and Yahoo Finance EOD signals, 24h / 3d / 7d windows, priority and watch filters, source labels. The announcement reader filters the NSE all-company RSS stream to the demo portfolio by text match.
- Alerts: configurable price and volume thresholds saved to browser local storage; announcement categories grouped by urgency.
- Pull: search 20 NSE symbols. Selecting a ticker loads its own Yahoo Finance EOD close, daily move, volume vs. prior 20 sessions, one-month price history, and recent NSE RSS announcements. It links to that company's Screener document page and NSE quote page.
- Responsive sidebar and mobile bottom navigation.
- FINN chat sends the selected ticker, live EOD metrics, and recent NSE filing snippets to Vercel AI Gateway. It cannot fetch or analyze annual reports or transcripts the app has not loaded.

## Data note

The home feed's initial stories, portfolio totals, and narrative remain illustrative. Research market metrics and price history are ticker-specific live EOD data. Yahoo's chart endpoint is unofficial and can change or rate-limit. The filing endpoint reads NSE's public announcement RSS stream, matches issuer names in titles, and returns titles, dates, descriptions, and links; RSS coverage can be incomplete, so use the linked original filing. The research view also lists recent matching filings and links to Screener for company-report discovery. FINN chat is limited to the live market and NSE filing context supplied by the app. It does not yet download/parse annual reports or transcripts, so it deliberately does not assert live company fundamentals, cash-flow analysis, guidance tracking, or bull/bear conclusions. AI Gateway usage may incur charges; configure a budget on the gateway key. No content here is investment advice.

## Architecture and next steps

The UI is static HTML/CSS/JS; `api/prices.js`, `api/announcements.js`, and `api/chat.js` provide Vercel serverless endpoints. The chat route calls Vercel AI Gateway server-side; `AI_GATEWAY_API_KEY` is never exposed to the browser. Next steps are resilient caching/retries, broader ticker coverage, deduplication, primary-document download and parsing, page-level citation retrieval over annual reports/results/transcripts, and alert delivery. The UI should never assert a result or guidance comparison without a traceable primary-source passage. Push enrichment for management bios can use public professional sources, separately from pull-side primary-source grounding.

## FINN chat setup

1. Create an AI Gateway API key in the [Vercel AI Gateway key dashboard](https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai-gateway%2Fapi-keys&title=AI+Gateway+API+Keys) and set a small spend budget.
2. Add `AI_GATEWAY_API_KEY` in Vercel **Settings → Environment Variables** for Production (and Preview if needed), then redeploy. Do not paste the key into GitHub, the repository, or chat.
3. FINN uses `google/gemini-2.5-flash` by default; `AI_GATEWAY_MODEL` can override it with another available model ID.

The key stays server-side. For local use, keep it in an uncommitted `.env.local` and run through Vercel dev. Gateway usage may incur charges; use the key budget to limit spend.

## Demo portfolio

18 NSE-listed names across financials, technology, energy, consumer, auto, pharma, telecom, infrastructure and utilities: RELIANCE, HDFCBANK, TCS, BHARTIARTL, TATAMOTORS, SUNPHARMA, INFY, ITC, ICICIBANK, LT, MARUTI, TITAN, AXISBANK, ASIANPAINT, NTPC, POWERGRID, BAJFINANCE, HINDUNILVR. Ad-hoc coverage includes ZOMATO/Eternal and ADANIPORTS in the research picker.

Live demo: https://finn-investor-intelligence.vercel.app/  
