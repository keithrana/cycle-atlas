# Keith's Claude Rules (paste into every new project/chat)

Short on purpose, so Claude can keep all of it in memory. Imperative = do it.

## 1. Who I am and how to talk to me
- I am NOT a coder. Explain at a 4th-grade level. No jargon without a one-line plain meaning.
- Tell me what you are doing and WHY. When you need something from me, give exact click-by-click steps.
- Be honest: if a test fails, a step was skipped, or something is unverified, say so plainly.
- Ask before anything hard to undo or outward-facing (deleting, publishing, pushing, spending money).

## 2. How to work (every project)
1. List the core features first.
2. Write a PRD with a phased roadmap: a quick win TODAY, then add complexity step by step.
3. Get my OK on the plan before building.
4. Test in this order: page loads with no errors -> buttons/forms work -> real APIs work -> security check.
5. Report results as a short pass/fail table, then what I must do next.

## 3. Where code lives (permanent rule)
- My home **Gitea** is the permanent home for ALL projects and work. Gitea is the source of truth.
- Do NOT create GitHub-specific files (`.github/`, GitHub Actions). Use `.gitea/workflows/` for CI.
- If a cloud session can only reach GitHub, treat it as a temporary transfer only, and tell me.
- Cloud sessions cannot reach my home network: give me copy-paste commands to move work into Gitea.
- Each new project = its own repo. Add a `CLAUDE.md` in it with these rules.

## 4. My setup (seen in past sessions - verify before relying on it)
- Runs at home on a **Windows server machine**. Give Windows steps (`.bat` start files, `SETUP-WINDOWS.md`).
- Home apps: open to home network only, **password required**, API locked too.
- AI image API: **laozhang.ai** (OpenAI-compatible, base `https://api.laozhang.ai`). Key lives in an env var
  (`LAOZHANG_API_KEY`) / a `.env` file, handled with Windows line endings and quotes. Confirm model name in my dashboard.
- Past hosting/tools mentioned: Hostinger (upload zip to `public_html`), Vercel, Remotion/HyperFrames (video), Capacitor (Android).
- Android apps: debug APK for my own phone first; Google Play signing is a later phase.

## 5. Security rules
- NEVER put API keys, passwords or tokens in code, chat, commits or this file. Use `.env` (git-ignored) + `.env.example`.
- Keys stay on the server; the browser never sees them. Rate-limit and size-limit anything that calls a paid API.
- Show user text as plain text (never raw HTML). Add basic security headers. Run `npm audit` on dependencies.
- Don't expose services to the public internet without a password.

## 6. Naming and legal
- Don't copy other companies' logos, text or code. Home-use projects may use a working name; pick a new name before publishing.
- Use a different Android app id from any real app so they never clash.

## 7. Defaults I like
- Look: clean, bright, Material 3, big tap targets, smooth motion, respect "reduce motion".
- Android: Back button must work (close sheet, go back a screen), safe-area padding, works offline.
- Deliver files I can open: write them in the project folder and send them to me.

## Not known yet (ask me once, then save here)
- My Gitea address (`https://...`) and username (never the password/token).
- Windows server name/IP and which ports are free.
