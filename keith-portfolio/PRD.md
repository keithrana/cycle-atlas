# PRD: Keith Rana Portfolio (built from the "Jack 3D Creator" template)

## The restaurant analogy
| Stage | Restaurant | This project |
|---|---|---|
| Phase 1 (done) | Food stand: one great dish, open today | The full single-page site with Keith's real content, photos and animations |
| Phase 2 | Small restaurant: a few tables, a real menu | Make it easy to edit (content in one file), better mobile + accessibility |
| Phase 3 | Full restaurant: front of house + back of house | Real contact form, email, project pages, CMS, analytics |

Front of house = what visitors see. Back of house = forms, email, storage, security.

## Core features
1. Hero: giant "Hi, i'm jack" title, nav, magnetic portrait, Contact button
2. Marquee: two rows of GIFs sliding left/right as you scroll
3. About: floating 3D icons + words that light up as you scroll
4. Services: white panel, 5 numbered services
5. Projects: 3 cards that stack and shrink as you scroll
6. Reusable parts: ContactButton, LiveProjectButton, FadeIn, Magnet, AnimatedText

## Phased roadmap
**Phase 1 — Food stand (today).** Static site, all 5 sections, all animations, responsive.
Done when: builds with no errors; page loads with no console errors; every button/link works; all image URLs load.

**Phase 2 — Small restaurant.** Nav links smooth-scroll to sections, Contact Me opens a mailto, content moved into editable data files, reduced-motion support, alt text, SEO tags, image fallbacks.

**Phase 3 — Full restaurant.** Contact form with a backend (server-side validation, spam protection, rate limits), project detail pages, CMS, analytics, hosting.

## Test ladder (each step must pass before the next)
1. Page loads with no errors
2. Buttons / links / forms work
3. Real external APIs/assets work (images load)
4. Security check (no secrets in code, safe external links, dependency audit)

## Security notes
Phase 1 has no forms, no logins, no secrets, so risk is low. External links use rel="noopener noreferrer". When Phase 3 adds a form, validation and spam protection must live on the server, and API keys must never be in front-end code.

## Phase 1 status (done)
- Content comes from Keith's existing portfolio: profile, 8 capabilities, 3 roles + 5 earlier roles, 4 projects, 10 certifications, contact details (all in `src/data/content.ts`).
- Sections: Hero (portrait), scrolling photo/skills rows, About, Capability, Experience, Projects (stacking cards), Credentials, Contact.
- Photos and the Kanit font ship inside the site (no outside image hosts needed).
- Tested at 360, 390, 768, 1024, 1440 and 1920 px wide: no sideways scroll, no console errors, all images load.
- Cloud preview: `node scripts/build-preview.mjs out.html` builds one self-contained page.

## Not used yet
- `it_helpdesk.db` (87 IT help-desk FAQs) was supplied but is not portfolio content. Candidate for a Phase 2 FAQ section if wanted.
