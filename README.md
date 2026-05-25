# Basic Music Academy

Bootstrap starter application for a music academy website. The project is intentionally simple so a hackathon group can use GitHub Copilot to refactor, extend, and restructure it.

## Scope

- Browse instrument classes with monthly fees shown in INR
- Book demo classes
- Register for paid classes
- Filter the classes catalog
- Store recent submissions in browser local storage

## Stack

- Next.js 15 (App Router)
- React 18
- Bootstrap 5 (npm)
- Plain CSS (custom design tokens)

## Project Structure

- `src/app/layout.jsx` - root layout (Navbar, Footer, Bootstrap)
- `src/app/page.jsx` - homepage (server component)
- `src/app/classes/page.jsx` - classes catalog (client component, fetches API)
- `src/app/enroll/page.jsx` + `EnrollContent.jsx` - enrollment forms (client component, fetches API)
- `src/app/api/classes/route.js` - `GET /api/classes`
- `src/app/api/classes/[id]/route.js` - `GET /api/classes/:id`
- `src/data/classes.js` - seeded class data (ESM, used by API routes)
- `src/utils/format.js` - INR price formatter
- `src/hooks/useSubmissions.js` - localStorage submissions hook
- `src/components/` - Navbar, Footer, ClassCard, form components
- `css/style.css` - custom styles layered on Bootstrap

## Run Locally

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

To build for production:

```bash
npm run build
npm start
```

## Seed Data Included

The starter includes sample programs for:

- Guitar
- Piano
- Violin
- Drums
- Flute
- Keyboard
- Vocals

## Suggested Refactor Directions

- [x] Convert the project to Next framework
- [x] Split rendering into reusable UI modules
- [x] Replace seeded data with an API
- [x] Add authentication and admin workflows
- [x] Connect forms to a real backend and database
- [x] Add payment integration

## Setup (with Auth + DB)

```bash
npm install
echo 'DATABASE_URL="file:./prisma/dev.db"' > .env.local
npx prisma migrate dev --name init   # create SQLite DB
node prisma/seed.js                  # seed courses + admin user
npm run dev
```

Admin login at `http://localhost:3000/admin`:
- **Email:** `admin@musicacademy.com`
- **Password:** `Admin@1234`

> Change the admin password before deploying to production.

## Notes

- All fees are monthly prices in Indian rupees.
- Form submissions are stored only in the local browser.
- Enrollment checkout now includes a full debit/credit card style demo UI before activation.
- No real payment credentials are required for the current integration; it does not contact a live gateway.
- Demo checkout approval is always successful to keep the enrollment flow deterministic.
- The code is designed to be easy to read before it is optimized or abstracted.