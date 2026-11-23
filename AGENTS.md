Important:
- Confirm with me before each deploy. Don't batch.
- This project uses pnpm.
- Never add, install or upgrade any dependency without asking me first (security and supply-chain safety): name the package and why it is needed, then wait for my yes.
- Never approve dependency install scripts yourself (`pnpm approve`, `pnpm approve-builds`): name the package and its script, then wait for my yes.
- Follow centralized styling conventions from `src/styles/app.css`, and update it accordingly if needed.
- Do not use external assets or dependencies in UI code or anywhere (no external SVGs, images, fonts, or links/CDNs); use only local/project resources.
- For design-oriented tasks, AI agents must follow the `frontend-design` skill.
- Git: one logical change per commit, with a one-line Conventional Commits message under 72 characters and no body (`feat: add focus timer`, `fix: ...`, `refactor: ...`, `docs: ...`, `chore: ...`).
  Commit or push only when I ask; never force-push or rewrite history on `main`, and never commit secrets or build output.
- This machine has about 7 GiB of RAM: never run `pnpm build`, `tsc` or other heavy commands while the dev server is running, and run heavy commands one at a time.
