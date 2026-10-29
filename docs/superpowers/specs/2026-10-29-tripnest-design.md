# TripNest – PRD & Design (working name)

A fresh, original travel-planner Android app inspired by how TripIt works.
Not a copy: new name, new look, no TripIt branding, text or code.

## Goal
Make trip planning feel calm, fast and smooth on a phone.
Success for Phase 1: open the prototype, add a trip, scroll a timeline, feel the motion.

## Research notes
- tripit.com was not reachable from the build environment (network blocked), so this is based on general knowledge of TripIt plus a web search.
- Public user complaints found: crashes, flaky email import, Pro features sometimes not working. Design-specific criticism was not confirmed.

## Core features (what TripIt-style apps do)
1. Trip list (upcoming / past)
2. Day-by-day timeline: flights, hotels, cars, activities
3. Add a trip / add an item (form)
4. Email import (forward a confirmation -> trip builds itself)
5. Live alerts (delays, gate changes)
6. Offline details + maps
7. Share a trip
8. Accounts

## Decisions (approved by user)
- Build type: phone-style web prototype first, then real Android app in Phase 2.
- Style: clean and bright, Material 3 (white + soft blue, big rounded cards).

## Roadmap
| Phase | Deliverable | Test gate |
|---|---|---|
| 1 (today) | Clickable prototype: trip list, timeline, add-trip form, motion | Loads with no errors; buttons/forms work |
| 2 | Installable Android app, data saved on device | Runs on real device |
| 3 | Smart email import | Real API with test emails |
| 4 | Live flight data + alerts | Real API, rate limits |
| 5 | Accounts + sharing | Security review |

## Phase 1 design
- Location: `tripnest/index.html` (single file, no build step). Existing pages untouched.
- Screens: Trips (list) -> Trip timeline -> Add trip (bottom sheet).
- Navigation: bottom bar (Trips, Add, Alerts) - thumb-friendly, big tap targets (48px+).
- Motion (all respect "reduce motion" setting):
  - cards slide/fade in with stagger
  - screen transitions slide left/right
  - bottom sheet springs up
  - plane icon flies across the header of a trip
  - timeline line draws as you scroll in
  - buttons have ripple/press feedback
- Data: sample trips in memory + saved in browser localStorage.
- Safety: user text is inserted as plain text (never raw HTML).
- Accessibility: labels on buttons, readable contrast, focus outlines.

## Test plan (Phase 1)
1. Page loads, zero console errors (headless browser check).
2. Click every button; add a trip through the form; it appears and survives reload.
3. Reduce-motion mode disables animation.
4. Security: script text typed into a form shows as text, does not run.
