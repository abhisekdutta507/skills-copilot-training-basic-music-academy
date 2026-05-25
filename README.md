# Basic Music Academy

Bootstrap starter application for a music academy website. The project is intentionally simple so a hackathon group can use GitHub Copilot to refactor, extend, and restructure it.

## Scope

- Browse instrument classes with monthly fees shown in INR
- Book demo classes
- Register for paid classes
- Filter the classes catalog
- Store recent submissions in browser local storage

## Stack

- Plain HTML
- Plain CSS
- Plain JavaScript
- Bootstrap 5 via CDN

## Project Structure

- `index.html` - landing page with featured classes and calls to action
- `pages/classes.html` - catalog page with filters
- `pages/enroll.html` - demo booking and registration forms
- `css/style.css` - custom styles layered on Bootstrap
- `js/data.js` - seeded class data
- `js/app.js` - shared rendering and catalog behavior
- `js/forms.js` - form handling and local storage submission history

## Run Locally

Because this is a static project, you can open `index.html` directly in a browser.

If you prefer serving it locally, use a simple static server. For example with Python:

```bash
python -m http.server 5500
```

Then open `http://localhost:5500`.

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

- [ ] Convert the project to React, Vue, or another framework
- [ ] Split rendering into reusable UI modules
- [ ] Replace seeded data with an API
- [ ] Add authentication and admin workflows
- [ ] Connect forms to a real backend and database
- [ ] Add payment integration

## Notes

- All fees are monthly prices in Indian rupees.
- Form submissions are stored only in the local browser.
- The code is designed to be easy to read before it is optimized or abstracted.