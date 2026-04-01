# website

Portfolio personnel servant de vitrine pour mes projets. Construit avec **Next.js** en export statique et déployé via **GitHub Pages**.

En production, le site est servi derrière le **reverse proxy Nginx** de la VM Oracle Cloud sur [martintarot.com](https://martintarot.com) (route `/`).

## Stack technique


| Couche      | Technologie                              |
| ----------- | ---------------------------------------- |
| Framework   | Next.js 16 (App Router, export statique) |
| UI          | React 19, TypeScript                     |
| Style       | Tailwind CSS v4                          |
| Animation   | Framer Motion                            |
| Déploiement | GitHub Pages (GitHub Actions)            |


## Architecture

```
push main
  │
  └─▶ GitHub Actions
        npm ci → next build → out/
        │
        └─▶ GitHub Pages (mtarotml.github.io)
              │
              └─▶ proxifié par Nginx sur la VM → martintarot.com
```

## Lancement local

```bash
npm install
npm run dev
```

Build statique :

```bash
npm run build   # génère out/
```

