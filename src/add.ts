import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import { confirm, select } from "@inquirer/prompts";
import { REGISTRY_BASE, REGISTRY_URL } from "./constants.js";
import { fetchRegistry, findItem, resolveDependency } from "./registry.js";

async function fetchFile(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch file: ${url} (${res.status})`);
  return res.text();
}

type ConflictResolution = "overwrite" | "skip" | "overwrite-all" | "skip-all";

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

  const queue: { category: string; name: string }[] = names.map((name) => ({
    category,
    name,
  }));
  const processed = new Set<string>();
  let sessionResolution: ConflictResolution | null = null;

  while (queue.length > 0) {
    const { category: currentCategory, name: currentName } = queue.shift()!;
    
    const found = findItem(registry, currentCategory, currentName);
    if (!found) {
      console.log(chalk.red(`✖ "${currentName}" not found in ${currentCategory}`));
      continue;
    }

    const { item, key } = found;
    if (processed.has(key)) continue;
    processed.add(key);

    const outDir = path.resolve(
      process.cwd(),
      currentCategory === "components" ? "components/ui" : currentCategory,
    );
    await fs.ensureDir(outDir);

    let shouldProcessFiles = true;

    // 1. Conflict Check First
    for (const file of item.files) {
      const fileName = path.basename(file);
      const filePath = path.join(outDir, fileName);

      if (await fs.pathExists(filePath)) {
        if (sessionResolution === "overwrite-all") {
          // continue
        } else if (sessionResolution === "skip-all") {
          shouldProcessFiles = false;
          break;
        } else {
          const answer = await select({
            message: `File "${path.relative(process.cwd(), filePath)}" already exists. What would you like to do?`,
            choices: [
              { name: "Overwrite", value: "overwrite" },
              { name: "Skip", value: "skip" },
              { name: "Overwrite All", value: "overwrite-all" },
              { name: "Skip All", value: "skip-all" },
            ],
          });

          if (answer === "overwrite-all") {
            sessionResolution = "overwrite-all";
          } else if (answer === "skip-all") {
            sessionResolution = "skip-all";
            shouldProcessFiles = false;
            break;
          } else if (answer === "skip") {
            shouldProcessFiles = false;
            break;
          }
        }
      }
    }

    // 2. Download Files
    if (shouldProcessFiles) {
      for (const file of item.files) {
        const url = `${REGISTRY_BASE}/${file}`;
        try {
          const content = await fetchFile(url);
          const fileName = path.basename(file);
          const filePath = path.join(outDir, fileName);
          await fs.outputFile(filePath, content);
          console.log(chalk.green(`✔ Added ${item.name} → ${filePath}`));
        } catch (error) {
          console.log(chalk.red(`✖ Failed to download ${file}`));
        }
      }
    } else {
      console.log(chalk.yellow(`⚠ Skipped ${item.name} (file exists)`));
    }

    // 3. Handle Requirements AFTER processing files
    for (const req of item.requires) {
      const resolved = resolveDependency(req);
      if (!resolved) continue;

      if (resolved.type === "external") {
        console.log(chalk.blue(`ℹ "${item.name}" requires "${resolved.value}". Please ensure it is installed.`));
      } else {
        // Registry item
        if (!processed.has(resolved.name)) {
          const shouldAdd = await confirm({
            message: `"${item.name}" requires "${req}". Would you like to add it?`,
            default: true,
          });

          if (shouldAdd) {
            queue.push({ category: resolved.category, name: resolved.name });
          }
        }
      }
    }
  }
}
