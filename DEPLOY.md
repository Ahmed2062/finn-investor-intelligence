# FINN deployment and submission notes

## Live project

- Demo: https://finn-investor-intelligence.vercel.app/
- Source: https://github.com/Ahmed2062/finn-investor-intelligence
- Hosting: Vercel, connected to the GitHub `main` branch. New commits to `main` trigger a deployment.

The app is a responsive static HTML/CSS/JavaScript page with two Vercel Node.js API routes: `api/prices.js` and `api/announcements.js`. The Vercel project uses the **Other** framework preset, repository root as the project root, and no build command or dependency installation step. `vercel.json` sets a 15-second maximum function duration.

To check the live data path, open the demo and click **Refresh live data**. A successful refresh changes the status to `LIVE · NSE + YAHOO` and reports the filings and prices loaded. If an upstream source is unavailable, the app keeps the sample feed visible and reports a sample or partial status.

## What is in the GitHub repository

- `index.html` — mobile-first app and research interface.
- `api/prices.js` — EOD price and volume endpoint for the 18-stock demo portfolio.
- `api/announcements.js` — NSE announcement feed endpoint with issuer matching.
- `vercel.json` and `.gitignore` — deployment configuration and ignored files.
- `README.md`, `DATA-SOURCES.md`, and `AI-build-history.md` — reviewer-facing project, provenance, and process notes.

`covering-note.txt` is kept in the submission package for use as the email write-up; it is intentionally not in the public source repository. It includes an AI conversation share link. Check that the link is accessible to the assessment team before sending.

## Data and prototype limits

- Yahoo Finance chart data is unofficial and end-of-day; the endpoint can change or rate-limit.
- NSE announcements come from its public all-announcements RSS feed. FINN matches portfolio companies by issuer title, so feed items with unclear issuer titles can be missed. Open the linked filing before relying on an item.
- The research view links to Screener company pages but does not download or analyze annual reports or earnings-call transcripts. Research metrics and narrative remain illustrative.
- Alert thresholds are configurable in the browser, but the app does not send scheduled or push notifications.
- The sample feed, portfolio totals, and research content are illustrative, not current information or investment advice.

## Email submission

Send the covering write-up and required links to `assessment@enam.com` with the subject `ENAM - IIT screening - 2027`. Include the live demo URL, the public GitHub repository URL, and the original AI build conversation share link or export as required by the challenge brief.
