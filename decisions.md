# Decisions

- 2026-01-20: Build as a Svelte + TypeScript SPA bundled with Vite and Bun to match the project spec and enable static asset deployment.
- 2026-01-20: Encode card state in URL query parameters so cards are shareable and restorable across machines.
- 2026-01-20: Store copy in per-language JSON files keyed by shared IDs, with English acting as the source-of-truth mapping.
- 2026-01-20: Separate maker and card experiences into `src/views` with routing handled centrally in `src/App.svelte` for clarity.
