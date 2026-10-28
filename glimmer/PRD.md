# PRD: Glimmer (an Adobe-Firefly-style image maker, our own design)

## Purpose
Type a sentence, get pictures. Same purpose as Adobe Firefly, different look and name.

## Core features
1. Text-to-image (prompt box)
2. Style choice
3. Aspect ratio (square, wide, tall)
4. Several variations at once
5. Gallery/history, favorites
6. Download PNG
7. Later: edit/fill an area, recolor, text effects, video, reference image, accounts

## Roadmap (test each step: page loads -> buttons work -> real API -> security)
- Phase 0 (today): static site, built-in pattern maker (DEMO, not AI). Gallery in browser only.
- Phase 1: small server holds the secret API key; real AI image model replaces pattern maker.
- Phase 2: accounts, saved gallery in a database, usage limits.
- Phase 3: edit tools (fill, erase, recolor), reference image.
- Phase 4: text effects, short video, content labels ("made by AI").
- Phase 5: payments, teams, security review.

## Security rules
No API keys in the browser. User text is never inserted as HTML. Prompt length capped.

## Added request: video generation
- Phase 0: Video type = 4-second looping animated clip from the pattern maker; play in page; download .webm.
- Phase 2: real AI video model through the server (text-to-video, image-to-video), with usage limits (video is costly).
