# AI build history — FINN

This summarizes the AI-assisted build work. It is not a replacement for exporting or sharing the original conversation history requested in the assignment.

## Session record

- Request: solve the ENAM AI Engineer Build Challenge and prepare recommended submission deliverables.
- Inputs reviewed: the main challenge PDF and its companion announcement-category / financial-glossary reference PDF.
- Requirement interpretation: the main PDF defines deliverables and evaluation goals. The companion reference explains the domain; its taxonomy is explicitly optional.
- Product decisions: demonstrate push and pull in one compact mobile-first experience; rank the feed; let users choose digest window and priority filter; configure thresholds; show research themes and foreground primary-source provenance.
- Implementation choice: single-file static HTML/CSS/JS, no external runtime dependencies or API keys, responsive styles, and localStorage for alert thresholds.
- Data-integrity choice: mark sample prices, announcements, summaries, and fundamentals as illustrative. Do not represent them as live, sourced, or investment advice.
- Known limitation: the demo is not connected to exchange sources and does not ingest annual reports or transcripts. It cannot provide verified analysis for arbitrary tickers.
- Work completed: created runnable prototype and package documentation. No hosted deployment, GitHub publication, or original transcript export was performed.
- Follow-up implementation: added Vercel serverless routes for Yahoo Finance EOD bars and NSE's public RSS announcements feed, plus research links to company Screener pages. Live fetch is opt-in with a refresh button; sample mode remains available when API routes are not deployed or sources fail.
- Remaining data limitation: annual reports and earnings-call transcripts are linked for discovery but are not downloaded, indexed, or used to generate the sample research dossier. The research metrics remain clearly illustrative.

## Original conversation evidence

Before emailing ENAM, attach an export or share link for the actual coding-agent conversation if the assessment team requires original AI build history. This file is a concise process summary prepared for the package.
