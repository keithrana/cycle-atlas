# Project rules

- **Source hosting: the owner's home Gitea is the permanent home for all projects and work.**
  Do not create GitHub-specific files (`.github/`), GitHub Actions workflows, or GitHub-only setup.
  Use `.gitea/workflows/` for CI. If a cloud session can only reach GitHub, push there only as a
  temporary transfer and say so; the Gitea repo is the source of truth.
- Explain things in plain, 4th-grade language. The owner is not a coder. Say what you are doing and why,
  and tell them exactly what to do when you need something.
- Before building: list core features, write a PRD with a phased roadmap (quick win first).
  Test in order: page loads with no errors -> buttons/forms work -> real APIs work -> security.
- TripNest lives in `tripnest/` (web prototype + PWA + Capacitor Android project). PRD: `docs/superpowers/specs/`.
