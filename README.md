```markdown
# TrueSpecs

A game compatibility agent that answers "will this run on my machine?" using structured community data, not just official specs.

## The Problem

Official system requirements are often misleading. A game can list an RTX 2060 as minimum, but real users with RTX 5090s still report stutters "built into the core." A game can say "Windows 10" but block Linux entirely via anti-cheat. Spec sheets are necessary, but not sufficient.

## What TrueSpecs Does

TrueSpecs queries a structured knowledge base of official specs and real user reports, then answers compatibility questions with evidence. When sources conflict, it shows both sides. It never guesses.

## How It Works

1. **Content model (Sanity):** Four content types:
   - `game` — official requirements, ProtonDB rating, known fixes
   - `userReport` — real user specs, platform, result, notes
   - `source` — where each claim came from (with trust score)
2. **Query layer:** GROQ queries traverse the relationships (game → userReport → source).
3. **Agent:** Connects to Sanity Context MCP, receives tools, answers questions using Groq's `gpt-oss-120b`.

## Data

Four games, 44 user reports, 4 sources.

- GTA Vice City – Definitive Edition
- Battlefield 6
- 007 First Light
- Star Wars Outlaws

## Setup

### Sanity

```bash
cd sanity
npm install
npm run dev
```

### Agent

```bash
cd agent
uv sync
uv run agent.py
```

Create a `.env` file with:

```
SANITY_CONTEXT_MCP_URL=your_mcp_url
SANITY_ORGANIZATION_TOKEN=your_token
OPENAI_API_KEY=your_groq_key
OPENAI_BASE_URL=https://api.groq.com/openai/v1
OPENAI_AGENTS_DISABLE_TRACING=1
```

## Sanity Project ID

`bc0hielv`

## License

MIT
```
