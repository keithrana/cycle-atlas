# LookAtU: Product Plan (PRD)

## What is it? (the 4th-grade version)
LookAtU is a helper for parents. The parent has an app. The child has an app. The parent can see where the child is, see what the child does on the phone, choose which apps the child can use, and check calls and messages. If the child is in danger, the child taps a big **panic button** and the parent gets an alert right away.

## Who is it for?
- **Parents** of kids who have their own phone.
- **Kids**, who need a simple way to ask for help.

## Core features
1. **Live location**: the parent sees where the child is, any time.
2. **Activity monitor**: which apps are used and for how long.
3. **App control**: the parent can allow, block, or limit apps, and approve new installs.
4. **Calls and messages**: the parent can check call history and messages.
5. **Panic button**: the child taps once. The parent gets an alert with the child's location.

## Trust and safety rules (built in from day one)
- The child **knows** the app is on their phone. No hidden spying. This is the honest way to do it, and app stores require it.
- The parent signs in with a real account and a strong password.
- Data is private and encrypted. Only the parent sees it.
- Rules about monitoring messages differ by country and by the child's age. We must check the law for each country before launch.

## Phased roadmap

### Phase 1: Quick win (TODAY)
A good-looking website (one page) that explains LookAtU and collects sign-ups.
- Hero, 5 feature cards, "how it works", trust section, FAQ
- Waitlist form that checks the email is real-looking
- Works on phones and computers
- **Done when:** page loads with no errors and the form and buttons work.

### Phase 2: Make it real
- Connect the waitlist form to a real service so emails are saved.
- Add animations (Framer Motion) and better pictures.
- Add privacy and terms pages.

### Phase 3: Parent accounts
- Sign up and log in.
- A simple parent dashboard (website).
- Link a parent to a child.

### Phase 4: Phone apps
- Child app and parent app (Android first, then iPhone).
- Live location and the panic button with alerts (push notifications and SMS).

### Phase 5: Monitoring and control
- App usage, app blocking and install approval.
- Call and message history (after legal review).

## How we test at every phase
1. Page loads with **no errors**.
2. Buttons and forms **work**.
3. Real services (database, email, maps, alerts) **work**.
4. **Security check**: passwords, private data, no secrets in code.

## Open questions for the owner
- Which countries first?
- Free or paid? (price)
- Android first, or iPhone first?
- Final name and logo?
