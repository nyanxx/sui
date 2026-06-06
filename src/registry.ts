export type RegistryItem = {
  name: string;
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
      [path: string]: RegistryItem;
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
): { item: RegistryItem; key: string } | null {
  const cat = registry.categories[category];
  if (!cat) return null;

  // Search by key (path) or by the .name property
  for (const [key, item] of Object.entries(cat)) {
    if (key === name || item.name === name) {
      return { item, key };
    }
  }

  return null;
}

export type ResolvedDependency =
  | { type: "registry"; category: string; name: string }
  | { type: "external"; value: string };

export function resolveDependency(dep: string): ResolvedDependency | null {
  if (dep.includes(":") && (dep.startsWith("lib:") || dep.startsWith("shadcn:"))) {
    return { type: "external", value: dep };
  }

  // Registry dependencies are paths like "pets/bg-pattern"
  const parts = dep.split("/");
  if (parts.length >= 2) {
    const category = parts[0];
    const name = dep; // use full path as name for lookup
    return { type: "registry", category, name };
  }

  return null;
}
