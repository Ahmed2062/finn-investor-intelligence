# Deployment notes

## Live project

- Demo: https://finn-investor-intelligence.vercel.app/
- Source: https://github.com/Ahmed2062/finn-investor-intelligence
- Hosting: Vercel, connected to GitHub `main`.

The app is a responsive static HTML/CSS/JavaScript page with Vercel Node.js routes for prices, announcements, and chat. Use the **Other** framework preset, repository root, no build command, and no dependency installation. `vercel.json` sets a 15-second maximum function duration.

Click **Refresh live data** on Today to fetch the push feed. In Research, select an NSE ticker to fetch that ticker's EOD history and recent NSE RSS announcements. A successful live refresh reports loaded filing and price counts. **Ask FINN** sends the question and selected-company context to `api/chat.js`.

## Repository contents

- `index.html` — responsive FINN interface.
- `api/prices.js` — portfolio and research ticker EOD history.
- `api/announcements.js` — NSE announcement RSS matching and classification.
- `api/chat.js` — source-bounded FINN chat through Vercel AI Gateway.
- `vercel.json` and `.gitignore` — deployment configuration.
- `README.md`, `DATA-SOURCES.md` — reviewer notes.

## Configure FINN chat

1. Create an AI Gateway API key in the [Vercel AI Gateway key dashboard](https://vercel.com/d?to=%2F%5Bteam%5D%2F%7E%2Fai-gateway%2Fapi-keys&title=AI+Gateway+API+Keys) and set a small spend budget for it.
2. In the Vercel project, open **Settings → Environment Variables** and add `AI_GATEWAY_API_KEY` for Production (and Preview if needed). The key is shown once; do not paste it into GitHub, the repository, or chat.
3. Redeploy after saving the variable. Chat uses `google/gemini-2.5-flash` by default. `AI_GATEWAY_MODEL` can optionally override it with another available `provider/model` ID.

The key stays on the server. The browser sends the question and selected-company context to `/api/chat`; it does not receive the key. Gateway usage may incur charges, so manage the key budget. For local use, store the key in an uncommitted `.env.local` file and run through Vercel dev.

## Data and prototype limits

- Yahoo Finance chart history is accessed through an unofficial endpoint, is end-of-day, and may change or rate-limit.
- NSE RSS issuer matching can miss items whose titles do not identify the company. Open the linked source filing before relying on it.
- Research market metrics are ticker-specific live EOD data. FINN links to Screener pages for annual reports and concall transcripts and to NSE pages for exchange sources, but does not yet download or analyze those documents. It does not assert live financial statements, cash-flow analysis, guidance tracking, or company-specific bull/bear conclusions.
- The initial Today feed, portfolio totals, and morning brief are illustrative sample content. FINN chat only sees the live market metrics and recent filing context supplied by the app; it cannot analyze documents the app has not fetched. Alert rules are stored locally in the browser; there is no scheduled alert delivery.
