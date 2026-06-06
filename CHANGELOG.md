# @nyanxx/sui

## 0.3.0

### Minor Changes

- Added new categories -- "pages", "pets", "hooks", "utils".
- Added interactive dependency prompting and global file conflict resolution.
- Improved the installation flow to check for existing files before processing dependencies.
- Updated the CLI to support Registry v0.4.0, including path-based lookup and name-based listing.
- Added smart detection for external requirements like `lib:*` and `shadcn:*`.

## 0.2.0

### Minor Changes

- 5083e90: feat: fetch components and sections from remote registry

  - add <category> <name> command fetches files directly from GitHub registry
  - list command shows all available components and sections grouped by type
  - registry.json drives everything — no more hardcoded component strings
  - warns user when a component has required dependencies

## 0.1.0

### Minor Changes

- 3d51f52: working cli with starter lead and h1 components
