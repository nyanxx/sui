import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { REGISTRY_BASE, REGISTRY_URL } from "./constants.js";
import { fetchRegistry, findItem } from "./registry.js";

async function fetchFile(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch file: ${url} (${res.status})`);
  return res.text();
}

export async function addItems(category: string, names: string[]) {
  let registry;
  try {
    registry = await fetchRegistry(REGISTRY_URL);
  } catch {
    console.log(
      chalk.red(
        "✖ Could not reach the registry. Check your internet connection.",
      ),
    );
    process.exit(1);
  }

  const outDir = path.resolve(
    process.cwd(),
    category === "components" ? "components/ui" : category,
  );
  await fs.ensureDir(outDir);

  for (const name of names) {
    const item = findItem(registry, category, name);

    if (!item) {
      console.log(chalk.red(`✖ "${name}" not found in ${category}`));
      console.log(chalk.dim(`  Run: @nyanxx/sui list ${category}`));
      continue;
    }

    // warn about requires
    if (item.requires.length > 0) {
      console.log(
        chalk.yellow(`  ⚠ ${name} requires: ${item.requires.join(", ")}`),
      );
    }

    // write files
    for (const file of item.files) {
      const url = `${REGISTRY_BASE}/${file}`;
      try {
        const content = await fetchFile(url);
        const fileName = path.basename(file);
        const filePath = path.join(outDir, fileName);
        await fs.outputFile(filePath, content);
        console.log(chalk.green(`✔ Added ${name} → ${filePath}`));
      } catch (error) {
        console.log(chalk.red(`✖ Failed to download ${file}`));
      }
    }
  }
}
