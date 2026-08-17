type ResourceFolder = "services" | "insurances" | "scholarships" | "daycares" | "legal-advocacy";

function extractModuleData(module: unknown) {
  if (module && typeof module === "object" && "default" in module) {
    return (module as { default: unknown }).default;
  }
  return module;
}

function toRouteSlug(filename: string): string {
  if (filename.includes("-")) {
    return filename;
  }

  return filename
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase();
}

function deriveSlug(path: string): string {
  const filename = path.split("/").pop() ?? "";
  const base = filename.replace(".json", "");
  return toRouteSlug(base);
}

function buildSlugCandidates(slug: string): string[] {
  const candidates = new Set<string>();
  candidates.add(slug);

  if (slug.includes("-")) {
    const camelCase = slug
      .split("-")
      .map((part, index) =>
        index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1),
      )
      .join("");
    candidates.add(camelCase);
  } else if (/[A-Z]/.test(slug)) {
    const kebab = slug
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .toLowerCase();
    candidates.add(kebab);
  }

  return Array.from(candidates).map((candidate) => toRouteSlug(candidate));
}

function normalizeLazyModules(
  modules: Record<string, () => Promise<unknown>>,
): Record<string, () => Promise<unknown>> {
  const map: Record<string, () => Promise<unknown>> = {};
  for (const [path, loader] of Object.entries(modules)) {
    map[deriveSlug(path)] = loader;
  }
  return map;
}

const lazyModules: Record<ResourceFolder, Record<string, () => Promise<unknown>>> = {
  services: normalizeLazyModules(import.meta.glob("../data/resources/services/*.json")),
  insurances: normalizeLazyModules(import.meta.glob("../data/resources/insurances/*.json")),
  scholarships: normalizeLazyModules(import.meta.glob("../data/resources/scholarships/*.json")),
  daycares: normalizeLazyModules(import.meta.glob("../data/resources/daycares/*.json")),
  "legal-advocacy": normalizeLazyModules(import.meta.glob("../data/resources/legal-advocacy/*.json")),
};

// The database stores this service as "aba", but the page module is aba-therapy.json and
// /resources/services/aba-therapy is already indexed. Alias rather than rename so both resolve.
const SLUG_ALIASES: Partial<Record<ResourceFolder, Record<string, string>>> = {
  services: {
    aba: "aba-therapy",
  },
};

export async function loadResource(category: ResourceFolder, slug: string) {
  const modules = lazyModules[category];
  if (!modules) {
    console.error("Unknown resource category:", category);
    return null;
  }

  const resolvedSlug = SLUG_ALIASES[category]?.[slug] ?? slug;

  for (const candidate of buildSlugCandidates(resolvedSlug)) {
    const importer = modules[candidate];
    if (!importer) {
      continue;
    }

    try {
      const module = await importer();
      const data = extractModuleData(module);
      if (!data || typeof data !== "object") {
        continue;
      }

      return {
        category,
        ...(data as Record<string, unknown>),
        // After the spread: the module that actually resolved is the source of truth for the
        // slug, so an aliased request reports the canonical slug rather than the alias.
        slug: candidate,
      };
    } catch (error) {
      // Try the next candidate; ignore individual import failures.
    }
  }

  console.error("Missing resource:", category, slug);
  return null;
}

export async function loadAllResources(category: ResourceFolder) {
  const modules = lazyModules[category];
  if (!modules) {
    return [];
  }

  const entries = await Promise.all(
    Object.entries(modules).map(async ([slug, importer]) => {
      const mod = await importer();
      const data = extractModuleData(mod);
      return {
        slug,
        category,
        ...(data as Record<string, unknown>),
      };
    }),
  );

  return entries;
}
