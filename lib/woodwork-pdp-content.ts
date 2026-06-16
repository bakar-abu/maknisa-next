export type WoodworkMustHaveItem = {
  title: string;
  image: string;
};

export type WoodworkColourProposal = {
  name: string;
  color: string;
  image: string;
};

const DEFAULT_MUST_HAVES: Omit<WoodworkMustHaveItem, "image">[] = [
  { title: "Matt black finish bridge handle" },
  { title: "Slat door" },
  { title: "Sign accessories" },
  { title: "Assist pull-out accessories" },
  { title: "Dark steel finish Aluminium frame door" },
];

const DEFAULT_COLOUR_PROPOSALS: Omit<WoodworkColourProposal, "image">[] = [
  { name: "Powder", color: "#E8E2DC" },
  { name: "Jaipur Red", color: "#8B2E2E" },
  { name: "Venus Stone", color: "#B8B0A4" },
  { name: "Warm Oak", color: "#C6B8A3" },
  { name: "Graphite", color: "#4A4A4A" },
];

function pickImage(images: string[], index: number): string {
  if (images.length === 0) return "";
  return images[index % images.length];
}

export function getWoodworkMustHaves(images: string[]): WoodworkMustHaveItem[] {
  return DEFAULT_MUST_HAVES.map((item, index) => ({
    ...item,
    image: pickImage(images, index),
  }));
}

export function getWoodworkColourProposals(
  images: string[],
): WoodworkColourProposal[] {
  return DEFAULT_COLOUR_PROPOSALS.map((item, index) => ({
    ...item,
    image: pickImage(images, index + 1),
  }));
}

export function isWoodworkPdp(servicePageSlug?: string): boolean {
  return servicePageSlug?.toLowerCase() === "woodwork";
}
