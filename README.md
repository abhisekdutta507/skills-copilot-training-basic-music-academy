# Basic Music Academy

A starter application for a music academy website, built for hackathons. The project is intentionally straightforward so teams can use GitHub Copilot to refactor, extend, and restructure it with confidence.

## Features

- Browse instrument classes with monthly fees displayed in INR
- Book demo classes
- Enroll in paid classes
- Filter the class catalog
- Persist recent submissions in browser local storage

## Tech Stack

- Next.js 15 (App Router)
- React 18
- Bootstrap 5 (via npm)
- Plain CSS (custom design tokens)

## Project Structure

- `src/app/layout.jsx` — root layout (Navbar, Footer, Bootstrap)
- `src/app/page.jsx` — homepage (server component)
- `src/app/classes/page.jsx` — class catalog (client component, calls API)
- `src/app/enroll/page.jsx` + `EnrollContent.jsx` — enrollment flow (client component, calls API)
- `src/app/api/classes/route.js` — `GET /api/classes`
- `src/app/api/classes/[id]/route.js` — `GET /api/classes/:id`
- `src/data/classes.js` — seed data (ESM, consumed by API routes)
- `src/utils/format.js` — INR currency formatter
- `src/hooks/useSubmissions.js` — localStorage submissions hook
- `src/components/` — Navbar, Footer, ClassCard, and form components
- `css/style.css` — custom styles layered on top of Bootstrap

## Running Locally

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

To build and run for production:

```bash
npm run build
npm start
```

## Included Seed Data

The starter ships with sample programs for:

- Guitar
- Piano
- Violin
- Drums
- Flute
- Keyboard
- Vocals

## Suggested Refactor Directions

- [x] Migrate to the Next.js framework
- [x] Break rendering into reusable UI components
- [x] Replace seed data with a real API
- [x] Add authentication and admin workflows
- [x] Connect forms to a backend and database
- [x] Integrate payment processing

## Setup (with Auth + DB)

```bash
npm install
echo 'DATABASE_URL="file:./prisma/dev.db"' > .env.local
npx prisma migrate dev --name init   # create SQLite DB
node prisma/seed.js                  # seed courses + admin user
npm run dev
```

Admin panel at `http://localhost:3000/admin`:
- **Email:** `admin@musicacademy.com`
- **Password:** `Admin@1234`

> Change the admin password before deploying to production.

## Notes

- All fees are monthly prices in Indian rupees (INR).
- Form submissions are stored in the browser only — nothing is sent to a server.
- The enrollment flow includes a card-style demo checkout UI before activation.
- No real payment credentials are needed; the integration does not contact a live payment gateway.
- Demo checkout always succeeds to keep the enrollment flow predictable.
- The code prioritises readability over optimisation and abstraction.
