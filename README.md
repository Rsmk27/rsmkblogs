# RSMK Blogs

## Automated Blog Pipeline

This repository includes a daily AI-powered blog automation pipeline for the static site.

What it does:
- Runs every day via GitHub Actions at 06:00 UTC.
- Picks one unused topic from `scripts/topics.json`.
- Calls Groq API (default model: `llama-3.3-70b-versatile`) using native Node.js `fetch()`.
- Downloads a topic-relevant image from the internet using relevance-scored Wikimedia results (with prompt-based fallback) and stores it in `assets/images/`.
- Saves a new HTML article in `blogs/` using your existing article layout style.
- Inserts a new blog card at the top of the blog listing page (`blogs.html`).
- Tracks used topics in `scripts/used-topics.json`.

Manual trigger:
1. Open GitHub repository Actions tab.
2. Select the **Daily AI Article** workflow.
3. Click **Run workflow**.

Add or edit topics:
- Update `scripts/topics.json` and commit your changes.
- Keep each topic as a plain string in the JSON array.

Local test:
1. Create `.env.local` in the repository root with:

```env
AI_PROVIDER=groq
GROQ_API_KEY=your_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```

2. Run:

```bash
node scripts/generate-article.mjs
```

Notes:
- The script auto-creates `scripts/used-topics.json` as `[]` if missing.
- If all topics are used, it resets `used-topics.json` and starts reusing topics.
- Optional fallback provider: set `AI_PROVIDER=anthropic` and `ANTHROPIC_API_KEY`.
- If image download fails, the script falls back to `assets/images/hero-bg.webp`.
