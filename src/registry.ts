export type RegistryItem = {
  group: string;
  description: string;
  files: string[];
  dependencies: string[];
  devDependencies: string[];
  requires: string[];
};

export type Registry = {
  version: string;
  categories: {
    [category: string]: {
      [name: string]: RegistryItem;
    };
  };
};

export async function fetchRegistry(url: string): Promise<Registry> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch registry: ${res.status}`);
  return res.json();
}

export function findItem(
  registry: Registry,
  category: string,
  name: string,
): RegistryItem | null {
  return registry.categories[category]?.[name] ?? null;
}
