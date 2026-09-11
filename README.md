# jctsang27.github.io

Personal site for Jonathan Tsang — Vite + React, deployed to GitHub Pages.

**Live:** https://jtsang27.github.io/jctsang27.github.io/

## Develop

```bash
cd jct-react
npm install
npm run dev
```

## Build

```bash
cd jct-react
npm run build      # outputs to jct-react/dist
npm run preview    # serve the production build locally
```

## Deploy

Every push to `main` triggers `.github/workflows/deploy.yml`, which builds
`jct-react/` and publishes `dist/` to GitHub Pages.

Because the repo name is not `<user>.github.io`, this is a **project page**:
`vite.config.js` sets `base: '/jctsang27.github.io/'` so asset paths resolve
correctly. If the repo is ever renamed to `jtsang27.github.io`, change `base`
back to `'/'`.
