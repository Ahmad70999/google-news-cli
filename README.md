# 📰 Google News CLI

The easiest way to read the latest Google News right from your command line.

No API keys, no complicated flags, no configuration needed!

---

## ⚡ Super Easy Usage

### 1. Interactive Menu (Easiest!)
Just run:
```bash
npm start
```
*or*
```bash
node .
```
You will get an interactive menu with arrow keys:
```
? What news would you like to see?
  > 🔥 Top Stories
    💻 Technology
    💼 Business
    🌍 World News
    ⚽ Sports
    🔬 Science
    🏥 Health
    🎬 Entertainment
    🔍 Search by keyword...
    ❌ Exit
```

---

### 2. Direct Commands (No Flags Needed!)

Just type what you want directly:

```bash
# Get top news
node . 5

# Get news by topic
node . tech
node . world
node . sports
node . business

# Search for any topic or keyword directly
node . "artificial intelligence"
node . bitcoin
node . "spacex" 3
```

---

### 3. npm Shortcuts

```bash
npm run top        # Top 5 news
npm run tech       # Top 5 tech news
npm run world      # Top 5 world news
npm run business   # Top 5 business news
npm run sports     # Top 5 sports news
```

---

### 4. Advanced Options (Optional Flags)

| Command | What it does |
|---------|--------------|
| `node . -l 10` | Show 10 stories instead of 5 |
| `node . -d` | Show detailed news summaries |
| `node . --json` | Output raw JSON (great for scripts) |
| `node . --lang fr --region FR` | Get news in different languages/countries |

---

## 🚀 Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/Ahmad70999/google-news-cli.git
cd google-news-cli

# 2. Install dependencies
npm install

# 3. (Optional) Run from anywhere in your terminal
npm link
# Then you can simply run:
gnews
gnews tech
gnews "space"
```

## License

MIT
