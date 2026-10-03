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
