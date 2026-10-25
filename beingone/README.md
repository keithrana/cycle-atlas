# BeingOne

Real people. Real profiles. Real marriage.

BeingOne is a marriage website for Australians and their families. Every profile is checked to be a real person. People find matches, talk safely, and families can be part of it.

This is **Phase 1**: the front page, in its new design, with working demos that run in the browser. The people on it are made up. Nothing is saved and nothing is sent anywhere yet.

## See it

There is no build step. Open `index.html` in a browser.

## What is in this folder

| File | What it is |
| --- | --- |
| `index.html` | The page |
| `style.css` | How it looks (colours, fonts, spacing, motion) |
| `tokens.css`, `base.css` | The colour and font settings, and the basic rules |
| `app.js` | What the buttons, map, search, checks, chat and forms do |
| `images/hero.jpg` | The photo at the top of the page (swap in the original) |
| `PRD.md` | The plan: 13 features and the 8 phases |

## What the demos do

- **Search bar and map of Australia:** pick a city, ages and interests. Made-up people appear with a match score.
- **Four checks:** run the phone, photo, ID and team checks on a sample profile.
- **Photo privacy:** choose who can see a photo, and who is looking.
- **Interest and chat:** accept an interest and a private chat opens.
- **Family view and safety tools:** pick who helps you look; block, report and hide.
- **Join and log in:** forms that do not send anything yet.

## Before it goes live

- The fonts load from Google Fonts. The beach photo loads from Wikimedia Commons (CC BY-SA 4.0, credited in the footer). Download both into this folder if you want the page to make no outside calls.
- Replace `images/hero.jpg` with the original photo file.
- The paid-plan price is a blank box on the page until you decide it.
- Marriage sites hold very private details. In Australia some of them count as "sensitive information" under the Privacy Act 1988, so people must clearly agree to how it is used. Plan the privacy policy and consent step in Phase 2, and check with a lawyer before launch. This is not legal advice.

## Next: Phase 2

Real sign-up and login. This needs a hosting place (for example Vercel and Supabase) and a domain name.
