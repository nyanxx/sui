import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

const COMPONENTS: Record<string, string> = {
  lead: `export function Lead({ children }: { children: React.ReactNode }) {
  return <p className="text-xl text-muted-foreground">{children}</p>;
}`,
  h1: `export function H1({ children }: { children: React.ReactNode }) {
  return <h1 className="text-4xl font-bold">{children}</h1>;
}`,
};

export async function addComponents(names: string[]) {
  const outDir = path.resolve(process.cwd(), "components/ui");
  await fs.ensureDir(outDir);

  for (const name of names) {
    if (!COMPONENTS[name]) {
      console.log(chalk.red(`✖ Unknown component: ${name}`));
      continue;
    }
    const filePath = path.join(outDir, `${name}.tsx`);
    await fs.writeFile(filePath, COMPONENTS[name]);
    console.log(chalk.green(`✔ Added ${name} → ${filePath}`));
  }
}
