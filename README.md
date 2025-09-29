# ⚡ OneKey Deploy – Instant Deployment to Vercel

`onekey` is a simple JavaScript CLI that lets you deploy static sites or front‑end apps (HTML/CSS/JS, React, Next.js) to Vercel in one command, giving you a live URL instantly.

<p align="center">
  <img src="https://img.shields.io/badge/deploys%20to-vercel-000000?logo=vercel" alt="Vercel Badge">
  <img src="https://img.shields.io/badge/built%20with-javascript-yellow?logo=javascript" alt="JS Badge">
</p>

## 🧑‍💻 Who Is This For?

Perfect if you:

- Have a static or front‑end web project
- Want quick deployment to Vercel without signing in via browser
- Need a simple CLI workflow for demos, hackathons, or prototypes

## ✨ Features

- 🚀 Auto‑detects your project framework: HTML, React, Next.js
- 🌐 One‑command deploy to Vercel
- 💻 Returns a live URL instantly
- ⚡ Lightweight CLI with clear prompts
- 🔄 Optional `destroy` command to clean up deployments

## 📦 Prerequisites

- Node.js ≥ 14
- Vercel account
- Vercel token: Generate at https://vercel.com/account/tokens

Verify Node.js installation:

```bash
node -v
```

## 🚀 Quick Start

### 0) Clone and Install

```bash
git clone https://github.com/urjitupadhya/OneKey-Deploy.git
cd OneKey-Deploy
npm install
```

Or install the CLI globally:

```bash
npm install -g onekey-deploy
```

### 1) Prepare Project

Put your `index.html` and any assets in a folder, e.g., `my-site/`.

### 2) Initialize Project

```bash
cd my-site
onekey init
```

Prompts:

- Project name
- Deployment target → choose `vercel`
- Vercel token
- Vercel project name

### 3) Deploy Site

```bash
onekey deploy --dir .
```

- `--dir` points to your site folder (where `index.html` is located)
- CLI will deploy the site and return a live Vercel URL

### 4) Optional: Destroy Deployment

```bash
onekey destroy
```

- Cleans up deployed resources on Vercel
- Fetches project info from `config.json`

## 📁 Example Project Structure

```
my-site/
├── index.html
├── style.css
├── script.js
└── assets/
```

## 🛠 Built With

- JavaScript
- Node.js
- Vercel

## 🤝 Contributing

Contributions are welcome! Open issues or PRs on GitHub.

## ✅ Example Deployment

```bash
onekey init
onekey deploy --dir .
```

Result:

```
✅ Deployment complete!
🌐 Live URL: https://my-site-username.vercel.app
```
