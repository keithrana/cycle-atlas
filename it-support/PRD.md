# IT Support Site: PRD (plan)

Restaurant analogy: the FAQ database is the **kitchen's recipe book**. The website is the **dining room**.

## Core features
1. Cinematic hero: looping video, glass buttons (exactly as specified)
2. Search bar in the hero: type a problem, get matching answers
3. Category chips: browse the 11 topics (Access, Network, Hardware...)
4. FAQ answer cards: question, answer, optional "official guide" link
5. Footer social icons

## Phased roadmap
- **Phase 1 – Food stand (TODAY):** hero + search + categories + 87 FAQs from the database, baked in as a JSON file. No server.
- **Phase 2 – Small restaurant (DONE, browser-only storage):** "Was this helpful?" votes, "Contact IT" ticket form, shareable links per question.
- **Phase 3 – Full restaurant:** small back-of-house server + real database, staff login, admin page to edit FAQs, ticket tracking.

## Test ladder
1. Page loads, no console errors  2. Buttons/search work  3. Real data/links work  4. Security (no raw HTML injection, safe links)
