## Travel Cards

Travel Cards is a Svelte + TypeScript single-page app that lets travelers build printable cards containing translated health or dietary information.

### Tech

- Svelte + TypeScript SPA
- Vite for bundling, Bun for package management and scripts
- Static build output in `dist`
- Language data stored in JSON under `src/lib/data`

### Development

```bash
bun install
bun run dev
```

### Build

```bash
bun run build
bun run preview
```

### Data Model

Each language has a JSON file keyed by stable numeric IDs so query parameters can re-hydrate a card without losing translation fidelity.
