# Source conventions

Application code will move into this directory as features are introduced:

- `components/` — shared presentation and interaction components
- `config/` — validated application configuration; never commit secrets
- `features/` — feature-owned screens, components, hooks, and data access
- `services/` — external service adapters such as Firebase
- `theme/` — Figma-derived design tokens and shared styling primitives
- `types/` — types shared across more than one feature

Keep feature-specific code inside its feature folder. Add shared abstractions only after at least two real consumers exist.
