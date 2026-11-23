# Drifters Kitchen Bar — website

One-page site for Drifters Kitchen Bar, a family-run restaurant and bar in East Wittering, West Sussex.

Plain HTML, CSS and JavaScript — no framework and no build step required to view it. Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 3000
```

## Structure

```
index.html            the whole page
assets/css/styles.css layout, typography, responsive rules
assets/js/main.js     mobile menu, scroll reveal, menu dialog, sticky dock
assets/img/           WebP photos at the sizes used on the page
build.sh              copies the files needed for publishing into dist/
wrangler.jsonc        Worker config for publishing dist/
```

## Notes for whoever edits this

- **Content rules from the owner:** no prices, dish names, reviews, ratings, founding year, awards or opening hours anywhere on the site. The booking link and phone number must stay exactly as written.
- **Photography:** the current images are free-licensed stock placeholders (Unsplash and Wikimedia Commons) standing in for the venue's own photos. Replace the files in `assets/img/` with the real ones when available, keeping the same filenames and rough dimensions.
- **Menus:** the three "View menu" buttons open a small dialog saying the menu isn't online yet, with the phone number. Point them at PDFs or menu pages when the owner supplies them.
- **Opening hours:** deliberately absent until the owner confirms them. Add them to the Find us section when they're ready.
