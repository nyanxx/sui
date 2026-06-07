# SUI (@nyanxx/sui)

A command-line interface to instantly add reusable UI components, sections, and utilities to your project. Inspired by the shadcn/ui workflow.

[![npm version](https://img.shields.io/npm/v/@nyanxx/sui.svg)](https://www.npmjs.com/package/@nyanxx/sui)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- **CLI-First**: No need to copy-paste. Add components directly from your terminal.
- **Smart Dependencies**: Automatically detects and asks to install required registry dependencies.
- **Conflict Management**: Interactive prompts to overwrite or skip existing files.
- **Multiple Categories**: Supports components, hooks, utils, sections, and more.

## Installation

You can run SUI directly using `npx`:

```bash
npx @nyanxx/sui <command>
```

Or install it globally:

```bash
npm install -g @nyanxx/sui
```

## Usage

### 1. List Available Items
Browse the registry to see what's available.

```bash
# List everything in the registry
sui list

# List items in a specific category
sui list components
sui list hooks
```

### 2. Add Items
Add one or more items to your project.

```bash
# Add a component
sui add components reveal-item

# Add multiple items at once
sui add hooks use-mobile use-toast

# Add from other categories
sui add utils cn
sui add sections hero-primary
```

## Categories & Folders

When you add an item, SUI places it in a specific directory relative to your project root:

| Category | Output Directory |
| :--- | :--- |
| `components` | `components/ui/` |
| `hooks` | `hooks/` |
| `utils` | `utils/` |
| `sections` | `sections/` |
| `pages` | `pages/` |
| `pets` | `pets/` |

## Registry

SUI fetches its components from the [nyanxx/sui-registry](https://github.com/nyanxx/sui-registry). Every item added is fully customizable once it's in your codebase.

## License

MIT © [Nayan](https://github.com/nyanxx)
