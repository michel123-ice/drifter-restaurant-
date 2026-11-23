# Project notes

freecode reads this file before every change. Add anything it should always remember about this project.

## Drifters site
- Static single page at `index.html` + `assets/{css,js,img}`. No framework, no build step needed to run; `./build.sh` copies the needed files into `dist/` for app publishing (`wrangler.jsonc` points at `dist`).
- Images are WebP made with ffmpeg (no PIL in the image). Only the sizes referenced in `index.html` are kept; the original stock JPEGs were deleted, so re-crop from the originals if new sizes are needed.
- Credit: photos are free-licensed stock placeholders (Unsplash + Wikimedia Commons) standing in for the venue's own photography.
- Constraints from the owner: no prices, dish names, reviews, ratings, founding year, awards or opening hours. Booking link and phone number must stay exactly as written. Menu buttons open a dialog saying the menu isn't online yet — wire to PDFs later if supplied.

## GitHub
- Repo: https://github.com/michel123-ice/Drifters- (public, `main`, owned by the signed-in account `michel123-ice`).
- Auth is GitHub CLI device flow, stored at `~/.config/gh/hosts.yml`. Binary is at `~/.local/bin/gh` (not on PATH). `gh auth setup-git` is already done; without it pushes fail with "could not read Username".
- `./sync.sh "message"` commits pending changes, rebase-pulls, then pushes. Run it after edits so the repo tracks the project.
- No realtime two-way bridge exists: sync happens when this script runs, i.e. while the session is awake.

## Skills
- Installed `nextlevelbuilder/ui-ux-pro-max-skill` (commit 281e453) into `.agents/skills/`: ui-ux-pro-max, ui-styling, design, design-system, brand, banner-design, slides. Entry point is `.agents/skills/ui-ux-pro-max/SKILL.md`.
- Search CLI: `python3 .agents/skills/ui-ux-pro-max/scripts/search.py "<query>" --domain <ux|style|color|typography|icons|gsap|chart|landing|product>`, `--design-system -p "<Product>" [--format markdown]`, or `--stack <react|nextjs|vue|svelte|astro|shadcn|html-tailwind|flutter|swiftui|...>`. No external deps; run from repo root. Zero hits means retry with broader keywords and say no database match was found.
- Lockfile is `skills-lock.json` (managed by `skills` CLI). The SKILL.md files reference `${CLAUDE_PLUGIN_ROOT}/.claude/skills/<name>/...` — here that maps to `.agents/skills/<name>/`.
- Helper scripts inside these skills: `design-system/scripts/generate-tokens.cjs`, `brand/scripts/extract-colors.cjs`, `ui-styling/scripts/shadcn_add.py` and `tailwind_config_gen.py`. The logo/icon/CIP image generators in `design/` need external image API keys and should be skipped unless the user asks.
