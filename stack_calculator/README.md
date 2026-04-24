# Stack Calculator — VS Code Setup Guide

A full-stack expression evaluator built with:
- **Backend** — Node.js + Express REST API
- **DSA Core** — Stack, Tokenizer, Shunting-Yard, Postfix Evaluator
- **Frontend** — Vanilla HTML / CSS / JS

---

## Folder Structure

```
stack-calculator/
├── public/
│   ├── index.html       ← Frontend UI
│   └── style.css        ← Styles
├── routes/
│   └── calculate.js     ← API route handlers
├── src/
│   ├── server.js        ← Express server entry point
│   └── calculator.js    ← DSA logic (Stack, Tokenizer, Shunting-Yard, Postfix)
├── package.json
└── README.md
```

---

## Step-by-Step Setup in VS Code

### Step 1 — Install Node.js
Download and install from https://nodejs.org (choose the LTS version).

Verify it installed:
```bash
node -v
npm -v
```
Both should print a version number.

---

### Step 2 — Open the project in VS Code
1. Open VS Code
2. Go to `File → Open Folder`
3. Select the `stack-calculator` folder
4. VS Code will open the project

---

### Step 3 — Open the Terminal
Press `` Ctrl + ` `` (backtick key, top-left of keyboard)

Or go to `Terminal → New Terminal` from the menu bar.

---

### Step 4 — Install dependencies
In the terminal, type:
```bash
npm install
```

This downloads `express`, `cors`, and `nodemon` into a `node_modules/` folder.

---

### Step 5 — Start the server

**Normal mode:**
```bash
npm start
```

**Dev mode (auto-restarts on file save):**
```bash
npm run dev
```

You will see:
```
  ┌─────────────────────────────────────┐
  │       Stack Calculator Server        │
  ├─────────────────────────────────────┤
  │  ► http://localhost:3000             │
  │  Press Ctrl+C to stop               │
  └─────────────────────────────────────┘
```

---

### Step 6 — Open in browser
Go to: **http://localhost:3000**

The calculator is now live!

---

## API Endpoints

| Method   | Endpoint           | Body / Params         | Description              |
|----------|--------------------|-----------------------|--------------------------|
| `POST`   | `/api/calculate`   | `{ "expression": "" }` | Evaluate an expression  |
| `GET`    | `/api/history`     | —                     | Get last 20 results      |
| `DELETE` | `/api/history`     | —                     | Clear history            |
| `GET`    | `/health`          | —                     | Server uptime check      |

### Example API request
```bash
curl -X POST http://localhost:3000/api/calculate \
  -H "Content-Type: application/json" \
  -d '{"expression": "3 + (4 * 2) / sqrt(9)"}'
```

### Example response
```json
{
  "success": true,
  "expression": "3 + (4 * 2) / sqrt(9)",
  "tokens": [...],
  "postfix": "3 4 2 * 9 sqrt / +",
  "result": 5.666666666666667
}
```

---

## Supported Syntax

| Input      | Meaning              |
|------------|----------------------|
| `3 + 4`    | Addition             |
| `9 - 5`    | Subtraction          |
| `3 * 4`    | Multiplication       |
| `8 / 2`    | Division             |
| `7 % 3`    | Modulo               |
| `2 ** 8`   | Power (exponent)     |
| `sqrt(16)` | Square root          |
| `9(5-3)`   | Implicit multiply    |
| `-5 + 3`   | Unary minus          |

---

## Recommended VS Code Extensions

- **REST Client** (`humao.rest-client`) — test API endpoints from inside VS Code
- **Prettier** — auto-format HTML/CSS/JS on save
- **ESLint** — catch JS errors as you type
- **nodemon** — already included in devDependencies

---

## Stop the server
Press `Ctrl + C` in the terminal.
