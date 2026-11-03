# GitHub and live deployment

## Upload these project files to GitHub

Upload the contents of the `FINN-submission` folder (not just the ZIP):

- `index.html`
- `api/prices.js`
- `api/announcements.js`
- `vercel.json`
- `.gitignore`
- `README.md`
- `DEPLOY.md`
- `DATA-SOURCES.md`
- `DATA-SOURCES.md`
- `AI-build-history.md`
- `covering-note.txt` (optional; keep private or omit if you do not want your draft email public)

Do not publish private personal contact details, account credentials, API keys, or the original AI transcript publicly. Add the transcript/share link separately in the submission email if required.

## Create the GitHub repository

1. Sign in to GitHub and create a new repository named `finn-investor-intelligence` (or another name you prefer).
2. Set it **Public** if ENAM needs to review the code without access approval. Do not include personal data in the public repo.
3. Use **Add file → Upload files** and upload the listed project files, retaining the `api` subfolder. Or use Git locally:

   ```bash
   cd FINN-submission
   git init
   git add index.html api vercel.json .gitignore README.md DEPLOY.md DATA-SOURCES.md AI-build-history.md
   git commit -m "Build FINN investor intelligence prototype"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/finn-investor-intelligence.git
   git push -u origin main
   ```

4. Copy the repository URL from the browser, for example `https://github.com/YOUR-USERNAME/finn-investor-intelligence`.

## Deploy the working prototype on Vercel

Use Vercel rather than GitHub Pages for this version: the `/api` routes need a serverless runtime, which static-only GitHub Pages does not provide.

1. Sign in to Vercel and choose **Add New → Project**.
2. Import the GitHub repository you just created and authorize access if prompted.
3. Keep the project root at the repository root. Framework preset: **Other**. No build command is needed; there is no dependency installation step.
4. Deploy. Vercel serves `index.html` and the two Node API routes. Open the resulting `*.vercel.app` URL on desktop and phone.
5. In FINN, click **Refresh live data**. The status should change from sample mode to live; if a source is unavailable, it reports that and leaves the sample feed visible.
6. Send both the live `*.vercel.app` URL and the GitHub repository URL in your email. After future changes, push to `main`; Vercel automatically builds a new deployment.

## Data and coverage limits to disclose

- Yahoo Finance chart bars are accessed through an unofficial endpoint and are end-of-day; the endpoint can change or rate-limit. Price data is for demo use.
- NSE's official RSS page lists announcement feeds; the app consumes the public all-announcements RSS XML and matches portfolio company names in the item text. Name matching can miss items and the feed is not a complete normalized filing database. Open the original exchange filing before relying on an item.
- The research view links to Screener company pages, but this prototype does not download or analyze annual reports or earnings-call transcripts. Its displayed research metrics and narrative are illustrative. Do not describe pull-side research as live or verified until document ingestion and source citations are implemented.
- Vercel deployments do not create a scheduled alert service. Current thresholds are saved in the browser and are configuration UI only; live alerts would need a scheduled backend and delivery channel.
