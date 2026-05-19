import fs from "fs";
import path from "path";

const gridSlugs = [
  "kitchens",
  "bathrooms",
  "living",
  "bedroom-furniture",
  "tables-chairs-stools",
  "multi-functional-modules",
  "marble-tiles",
  "lighting",
];

for (const slug of gridSlugs) {
  const dir = path.join("app/ww", slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(
    path.join(dir, "page.tsx"),
    `import type { Metadata } from "next";
import { CollectionGridRoute } from "@/components/collection/CollectionGridRoute";
import { getCollectionGridData } from "@/lib/collections";
import { site } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getCollectionGridData("${slug}");
  return {
    title: \`\${data.title} | \${site.name}\`,
    description: data.intro,
  };
}

export default function Page() {
  return <CollectionGridRoute slug="${slug}" />;
}
`,
  );
}

fs.mkdirSync("app/ww/formalia-outdoor", { recursive: true });
fs.writeFileSync(
  "app/ww/formalia-outdoor/page.tsx",
  `import type { Metadata } from "next";
import { OutdoorCollectionPage } from "@/components/collection/OutdoorCollectionPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: \`Outdoor | \${site.name}\`,
  description: "Formalia Outdoor kitchens and open-air living by Maknisa.",
};

export default function Page() {
  return <OutdoorCollectionPage />;
}
`,
);

fs.mkdirSync("app/ww/inspire-me", { recursive: true });
fs.writeFileSync(
  "app/ww/inspire-me/page.tsx",
  `import type { Metadata } from "next";
import { InspireMePage } from "@/components/collection/InspireMePage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: \`Inspire me | \${site.name}\`,
  description: "Find your interior style with the Maknisa Inspire me wizard.",
};

export default function Page() {
  return <InspireMePage />;
}
`,
);

console.log("pages written");
