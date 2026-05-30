---
"@nyanxx/sui": minor
---

feat: fetch components and sections from remote registry

- add <category> <name> command fetches files directly from GitHub registry
- list command shows all available components and sections grouped by type
- registry.json drives everything — no more hardcoded component strings
- warns user when a component has required dependencies
