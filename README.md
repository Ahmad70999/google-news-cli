# Google News CLI

A fast, lightweight Node.js command-line tool to fetch the latest Google News directly in your terminal. No API keys required.

---

## Usage

### 1. Interactive Menu
Run:
```bash
npm start
```
*or*
```bash
node .
```
You will be prompted to select a category with your arrow keys:
```text
Select a category:
> Top Stories
  Technology
  Business
  World
  Sports
  Science
  Health
  Entertainment
  Search by keyword
  Exit
```

---

### 2. Direct Commands (No Flags Needed)

```bash
# Get top news (default 5 stories)
node . 5

# Get news by topic
node . tech
node . world
node . sports
node . business

# Search for any topic or keyword
node . "artificial intelligence"
node . bitcoin
node . "spacex" 3
```

---

### 3. npm Shortcuts

```bash
npm run top        # Top 5 stories
npm run tech       # Top 5 tech stories
npm run world      # Top 5 world stories
npm run business   # Top 5 business stories
npm run sports     # Top 5 sports stories
```

---

### 4. Advanced Flags

| Flag | Description | Example |
|------|-------------|---------|
| `-l, --limit <num>` | Number of articles (1-50, default: 5) | `node . -l 10` |
| `-d, --detailed` | Display article summaries | `node . -d` |
| `-j, --json` | Output clean JSON data | `node . tech --json` |
| `--lang <code>` | Language code (default: `en-US`) | `node . --lang en-US` |
| `--region <code>` | Country code (default: `US`) | `node . --region US` |

---

## Security Features

- **Input Sanitization**: Query strings and parameters are strictly validated using `URLSearchParams` to prevent URL injection and SSRF.
- **Control Character Stripping**: Control and escape sequences (`\u0000-\u001F`, `\u007F-\u009F`) in headlines/content from upstream feeds are stripped to prevent ANSI terminal escape injection.
- **Protocol Validation**: URLs are validated to strictly enforce `http:` / `https:` protocols.
- **Request Safeguards**: Requests include timeouts and user-agent headers to prevent hanging connections.
- **Bounded Resource Consumption**: Article limits are enforced with min/max bounds (1-50) to prevent memory exhaustion.

---

## Installation

```bash
git clone https://github.com/Ahmad70999/google-news-cli.git
cd google-news-cli
npm install

# Optional: Link globally to run 'gnews' from any directory
npm link
```

## License

MIT
