## Engineering Preferences

- Pragmatic over perfect. Solve the problem at hand.
- Choose the simplest implementation that fully meets the current requirements. Avoid speculative abstractions, configuration, and indirection.
- Grow the system in layers. Start from the smallest version that works end-to-end, and add each new capability on top of a product that already works. Never trade a working product for unfinished complexity.
- Keep components modular and concerns clearly separated.
- Minimal abstractions. Extract only when a pattern appears 3+ times.
- Explicit over clever. Prefer clear names over comments. Avoid long comments that explain what the code does.
- Write expressive, readable code in React and backend code. Prefer clear names and explicit control flow over shorthand expressions.
- DRY in data-fetching and shared components. Not in one-off pages.
- No unnecessary files. Only create helpers/utils if used in 2+ places.
- Prefer regular functions over arrow functions.
- Keep comments short and limited to intent that clear code cannot express.
- Keep values in the narrowest scope that uses them. Promote a value to a module constant only when it is shared, configurable, or a stable domain concept.

## Talking to Human

- When speaking English, always talk in ASD-STE100 Simplified Technical English.
- Constraint yourself not to use C1-C2 sentences and vocabularies. Keep your responses in plain English.

## Next.js App (`apps/web`)

- For every change in `apps/web`, read `.agents/skills/nextjs-app-architecture/SKILL.md` and follow its architecture workflow and verification checklist. Read the relevant skill references for the work at hand.
- Use `apps/web/AGENTS.md` and the installed Next.js docs at `apps/web/node_modules/next/dist/docs` for version-specific framework behavior and APIs.
