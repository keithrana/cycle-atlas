# HelpDesk IT Support

Run locally (needs Node 22+):
    npm install
    npm run build
    ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='a-long-password' npm start
Open http://localhost:3001 (staff login: http://localhost:3001/#/staff)

For development with live reload: run `npm run server` and `npm run dev` in two terminals.

Settings are listed in `.env.example`. Data lives in `server/data/helpdesk.db`: back it up, and keep it on a persistent disk when hosting.
