// splitResources.mjs
import fs from "fs";

const input = fs.readFileSync("./all_resources_completed.txt", "utf8");

// Split by headers like === insurances/aetna.json ===
const sections = input.split(/===\s*(.*?)\s*===/g).filter(Boolean);

for (let i = 0; i < sections.length; i += 2) {
  const filename = sections[i].trim();
  const content = sections[i + 1]?.trim();
  if (!filename.endsWith(".json")) continue;

  // Determine correct subfolder
  let folder = "services";
  if (filename.includes("insurances/")) folder = "insurances";
  else if (filename.includes("scholarships/")) folder = "scholarships";

  // Clean the name (remove insurances/, etc.)
  const cleanName = filename.replace(/^.*\//, "");

  // ✅ FIXED PATH — only one frontend/src
  const path = `./src/data/resources/${folder}/${cleanName}`;

  // Ensure the directory exists
  fs.mkdirSync(`./src/data/resources/${folder}`, { recursive: true });

  fs.writeFileSync(path, content, "utf8");
  console.log(`✅ Wrote: ${path}`);
}

console.log("\n🎉 All JSON files created successfully!");
