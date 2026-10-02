# Deploy checklist (Hostinger)

## A. Before you start
- [ ] Plan is Business Web Hosting or a Cloud plan (Node.js Web App supported)
- [ ] Gmail app password created (myaccount.google.com > Security > 2-Step Verification > App passwords)

## B. In hPanel: Websites > Add website > Node.js Web App > Import Git repository
- [ ] Repo: keithrana/cycle-atlas
- [ ] Branch: claude/sleepy-goodall-rykli1  (NOT main)
- [ ] Root/app directory: it-support  (if no such box, ask Claude to split into its own repo)
- [ ] Node version: 22.x or 24.x
- [ ] Build command: npm run build
- [ ] Start command: npm start   (entry file, if asked: server/index.js)

## C. Environment variables (type them only into Hostinger, never into chat or Git)
ADMIN_EMAIL, ADMIN_PASSWORD (10+ chars), SMTP_HOST=smtp.gmail.com, SMTP_PORT=465,
SMTP_USER, SMTP_PASS (Gmail app password), TRUST_PROXY=1, DATA_DIR=/home/<your-username>/helpdesk-data

## D. Deploy, then test in order
1. [ ] Page loads over https:// and the video plays
2. [ ] Search "wifi" shows answers; send a test ticket
3. [ ] Email arrives at rana.krunal7558@gmail.com (check Spam)
4. [ ] /#/staff login works and the ticket is listed
5. [ ] Add a test FAQ, redeploy, confirm it is still there (proves data is kept)
6. [ ] Log out; /#/staff asks for login again
