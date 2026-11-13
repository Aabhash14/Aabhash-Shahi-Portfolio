# Ask Aabhash: chatbot datasets

Labelled example questions for the portfolio chatbot (`chat.js`). They teach it the many ways visitors phrase a question, and measure how often it picks the right answer.

## Files

| File | What it is |
|---|---|
| `intents.json` | **Source of truth.** About 1,040 hand-written seed questions across 33 intents (32 topics plus `out_of_scope`). Edit this file. |
| `build.mjs` | Expands the seeds into the datasets below and regenerates `../chat-data.js`. |
| `eval.mjs` | Scores the real `chat.js` matcher on held-out questions. |
| `train.jsonl` | About 11,000 rows: seeds plus third-person rewrites, conversational prefixes and suffixes, typos and casing noise. |
| `dev.jsonl` / `test.jsonl` | About 1,600 and 1,500 rows. Their seeds never appear in train, so the scores are honest. |
| `all.jsonl` | Every row with its `split`, for use in other tools. |
| `stats.json` | Row counts per intent and split. |

Each row: `{"text": "...", "intent": "api", "source": "seed|third_person|...+aug"}`.

## Workflow

```bash
node datasets/build.mjs            # regenerate datasets + chat-data.js
node datasets/eval.mjs             # accuracy with the settings shipped in chat.js
node datasets/eval.mjs --sweep     # tune MIN_SIM / KW_WEIGHT / NN_WEIGHT on dev
node datasets/eval.mjs --errors    # list every misclassified test question
```

Seeds are split 60/20/20 into train, dev and test **before** augmentation, so variants of a test question never leak into training. The website's `chat-data.js` uses **all** seeds, so real-world accuracy is higher than the held-out score.

## Adding a topic

1. Add an entry with an `id`, keywords (`k`) and an answer (`a`) to `KB` in `chat.js`.
2. Add at least 25 varied seed questions under the same id in `intents.json`.
3. Run build, then eval. Check the per-intent score and the top confusions.

Answers must only restate what is on the portfolio. Never add invented figures.
