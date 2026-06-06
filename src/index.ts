#!/usr/bin/env node
import { Command } from "commander";
import { NAME, VERSION, DESCRIPTION } from "./constants.js";
import { addItems } from "./add.js";
import { fetchRegistry } from "./registry.js";
import { REGISTRY_URL } from "./constants.js";
import chalk from "chalk";

const program = new Command();

program.name(NAME).description(DESCRIPTION).version(VERSION);

program
  .command("add <category> [names...]")
  .description("Add components or sections to your project")
  .action(async (category: string, names: string[]) => {
    if (
      !["components", "sections", "pages", "pets", "hooks", "utils"].includes(
        category,
      )
    ) {
      console.log(chalk.red(`✖ Unknown category: "${category}"`));
      console.log(chalk.dim("  Available: components, sections"));
      process.exit(1);
    }
    await addItems(category, names);
  });

program
  .command("list [category]")
  .description("List available categories")
  .action(async (category?: string) => {
    let registry;
    try {
      registry = await fetchRegistry(REGISTRY_URL);
    } catch {
      console.log(chalk.red("✖ Could not reach the registry."));
      process.exit(1);
    }

    const categories = category ? [category] : Object.keys(registry.categories);

    for (const cat of categories) {
      const items = registry.categories[cat];
      if (!items) {
        console.log(chalk.red(`✖ Unknown category: "${cat}"`));
        continue;
      }

      console.log(chalk.bold(`\n${cat}`));

      // group by group field
      const groups: Record<string, string[]> = {};
      for (const item of Object.values(items)) {
        const g = item.group ?? "other";
        if (!groups[g]) groups[g] = [];
        groups[g].push(item.name);
      }

      for (const [group, itemNames] of Object.entries(groups)) {
        console.log(chalk.dim(`  ${group}`));
        for (const itemName of itemNames) {
          // Find the original item to get the description
          const item = Object.values(items).find(i => i.name === itemName);
          console.log(
            `    ${chalk.cyan(itemName)}  ${chalk.dim(item?.description ?? "")}`,
          );
        }
      }
    }
  });

program.parse();
