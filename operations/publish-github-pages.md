# Publish With GitHub Pages

## Fastest Path

This repo is now prepared for GitHub Pages with a root `index.html`.

## What You Need

- a GitHub repo for this project
- the repo pushed to GitHub

## Steps

1. Create an empty GitHub repository.
2. Add it as the remote for this local repo.
3. Push the current branch.
4. In GitHub, open `Settings -> Pages`.
5. Under `Build and deployment`, choose:
   - Source: `Deploy from a branch`
   - Branch: `master`
   - Folder: `/ (root)`
6. Save.

## Result

GitHub will publish the site from the repo root, and `index.html` will route visitors to:

- `revenue-sprint/landing-page/index.html`

## Before Publishing

Replace these placeholders in `revenue-sprint/landing-page/index.html`:

- `https://YOUR_PAYMENT_LINK_HERE`
- `https://YOUR_NEWSLETTER_SIGNUP_URL_HERE`
- `https://YOUR_FEEDBACK_FORM_URL_HERE`

## Optional Next Step

If you want the cleanest public URL, move the landing page to the root later. For now, this redirect is enough to get live quickly.
