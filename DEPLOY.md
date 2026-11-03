# Deployment and submission notes

## Live project

- Demo: https://finn-investor-intelligence.vercel.app/
- Source: https://github.com/Ahmed2062/finn-investor-intelligence
- Hosting: Vercel, connected to GitHub `main`.

The app is a responsive static HTML/CSS/JavaScript page with two Vercel Node.js routes: `api/prices.js` and `api/announcements.js`. Use the **Other** framework preset, repository root, no build command, and no dependency installation. `vercel.json` sets a 15-second maximum function duration.

Click **Refresh live data** on Today to fetch the push feed. In Research, select an NSE ticker to fetch that ticker's EOD history and recent NSE RSS announcements. A successful live refresh reports loaded filing and price counts.

## Repository contents

- `index.html` — responsive FINN interface.
- `api/prices.js` — portfolio and research ticker EOD history.
- `api/announcements.js` — NSE announcement RSS matching and classification.
- `vercel.json` and `.gitignore` — deployment configuration.
- `README.md`, `DATA-SOURCES.md`, `AI-build-history.md` — reviewer notes.
- `covering-note.txt` — email write-up; keep outside the public source repository and attach or paste it into the submission email.

## Data and prototype limits

- Yahoo Finance chart history is accessed through an unofficial endpoint, is end-of-day, and may change or rate-limit.
- NSE RSS issuer matching can miss items whose titles do not identify the company. Open the linked source filing before relying on it.
- Research market metrics are ticker-specific live EOD data. FINN links to Screener pages for annual reports and concall transcripts and to NSE pages for exchange sources, but does not yet download or analyze those documents. It does not assert live financial statements, cash-flow analysis, guidance tracking, or company-specific bull/bear conclusions.
- The initial Today feed, portfolio totals, and morning brief are illustrative sample content. Alert rules are stored locally in the browser; there is no scheduled alert delivery.

## Submission

Email the live demo URL, public GitHub repository URL, covering write-up, and original AI build conversation share link/export to `assessment@enam.com` with the subject `ENAM - IIT screening - 2027`. Make sure the AI conversation link is accessible to the assessment team. Do not upload personal contact details or private conversation contents to the public repository.
