# Deployment — Rohit Builds

## Source and target

- `main` is the source and working branch.
- `gh-pages` is the published GitHub Pages branch.
- GitHub Pages serves the contents of `./dist/`.
- There is no backend and no server-side runtime.

## Build

```bash
npm install
npm run astro check
npm run build
npm run preview
```

`astro preview` is for local verification only.

## Publish

1. Validate the source on `main`.
2. Build `./dist/`.
3. Copy the contents of `./dist/` onto `gh-pages`.
4. Commit and push only the deployable site to `gh-pages`.
5. Smoke-test the deployed homepage and changed routes.

Do not push source directories or Node dependencies to `gh-pages`.

## Guardrails

- Never deploy environment secrets or private keys.
- Keep `gh-pages` deployable at all times.
- Do not add GitHub Actions workflows without an explicit request.
- Preserve existing redirects and 404 behavior.
- After route or content changes, validate that collection counts and page counts do not regress.
- Update `public/llms.txt`, `public/llms-full.txt`, sitemap metadata, and route documentation when routes change.
