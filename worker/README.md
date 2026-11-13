# Ask Aabhash: AI backend (optional)

The chat widget (`chat.js`) works on its own with a built-in knowledge base.
This Worker is an optional upgrade: it lets Claude answer free-form questions, grounded in `src/profile.js`.
The API key stays on Cloudflare and never reaches the browser.

## Deploy

```bash
cd worker
npm install
npx wrangler login
npx wrangler secret put ANTHROPIC_API_KEY   # paste your key when prompted
npx wrangler deploy
```

Wrangler prints a URL such as `https://ask-aabhash.<subdomain>.workers.dev`.
Paste it into `ASK_ENDPOINT` at the top of `../chat.js`, then commit and push.

## Settings (`wrangler.toml`)

- `ALLOWED_ORIGINS`: the only sites allowed to call the Worker. To test locally, add `http://127.0.0.1:5174`.
- `MODEL`: defaults to `claude-opus-5-5`. Set it to `claude-haiku-5-5` for a much cheaper bot.
- `ratelimits`: 15 questions per minute per IP. Also set a monthly spend limit in the Anthropic Console.

## Keeping it accurate

When you change the portfolio, update `src/profile.js` (AI mode) and the `KB` list in `../chat.js` (local mode).
Never put private data in either file. Everything in them is public.
