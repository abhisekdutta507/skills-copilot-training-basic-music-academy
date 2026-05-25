# Basic Music Academy

Bootstrap starter application for a music academy website. The project is intentionally simple so a hackathon group can use GitHub Copilot to refactor, extend, and restructure it.

## Scope

- Browse instrument classes with monthly fees shown in INR
- Book demo classes
- Register for paid classes
- Filter the classes catalog
- Store recent submissions in browser local storage

## Stack

- React 18 (via Vite)
- React Router DOM v6
- Bootstrap 5 (npm)
- Plain CSS (custom design tokens)

## Project Structure

- `index.html` - Vite entry point
- `src/main.jsx` - React app bootstrap
- `src/App.jsx` - router and layout shell
- `src/data/classes.js` - seeded class data (ESM)
- `src/utils/format.js` - INR price formatter
- `src/hooks/useSubmissions.js` - localStorage submissions hook
- `src/components/` - Navbar, Footer, ClassCard
- `src/pages/` - HomePage, ClassesPage, EnrollPage
- `css/style.css` - custom styles layered on Bootstrap

## Run Locally

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Then open `http://localhost:5173`.

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

- [ ] Convert the project to Next framework
- [x] Split rendering into reusable UI modules
- [ ] Replace seeded data with an API
- [ ] Add authentication and admin workflows
- [ ] Connect forms to a real backend and database
- [ ] Add payment integration

## Notes

- All fees are monthly prices in Indian rupees.
- Form submissions are stored only in the local browser.
- The code is designed to be easy to read before it is optimized or abstracted.