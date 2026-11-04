export type ProductGallerySection =
  | { type: "full"; image: string }
  | { type: "split"; left: string; right: string; wideLeft: boolean }
  | { type: "triple"; images: [string, string, string] }
  | { type: "textLeft"; paragraph: string }
  | { type: "quoteCenter"; text: string; author: string };

type ProductGalleryTemplate =
  | { type: "full"; imageIndex: number }
  | {
      type: "split";
      leftIndex: number;
      rightIndex: number;
      wideLeft: boolean;
    }
  | { type: "triple"; indices: [number, number, number] }
  | { type: "textLeft"; key: "detail" | "crafted" }
  | { type: "quoteCenter" };

/** Maknisa PDP gallery blocks 0–9 (post-hero gallery + copy). */
const PRODUCT_GALLERY_TEMPLATES: ProductGalleryTemplate[] = [
  { type: "full", imageIndex: 0 },
  { type: "split", leftIndex: 1, rightIndex: 2, wideLeft: true },
  { type: "triple", indices: [3, 4, 5] },
  { type: "textLeft", key: "detail" },
  { type: "full", imageIndex: 6 },
  { type: "split", leftIndex: 7, rightIndex: 8, wideLeft: true },
  { type: "textLeft", key: "crafted" },
  { type: "full", imageIndex: 9 },
  { type: "split", leftIndex: 10, rightIndex: 11, wideLeft: false },
  { type: "quoteCenter" },
];

function pickImage(images: string[], index: number): string {
  if (images.length === 0) return "";
  return images[index % images.length];
}

export function buildProductGalleryBlocks(
  images: string[],
  textParagraphs: { detail: string; crafted: string },
  quote: { text: string; author: string },
): ProductGallerySection[] {
  const gallery = images.length > 0 ? images : [""];

  const sections: ProductGallerySection[] = PRODUCT_GALLERY_TEMPLATES.map(
    (template): ProductGallerySection => {
      switch (template.type) {
        case "full":
          return {
            type: "full",
            image: pickImage(gallery, template.imageIndex),
          };
        case "split":
          return {
            type: "split",
            left: pickImage(gallery, template.leftIndex),
            right: pickImage(gallery, template.rightIndex),
            wideLeft: template.wideLeft,
          };
        case "triple":
          return {
            type: "triple",
            images: [
              pickImage(gallery, template.indices[0]),
              pickImage(gallery, template.indices[1]),
              pickImage(gallery, template.indices[2]),
            ],
          };
        case "textLeft":
          return {
            type: "textLeft",
            paragraph:
              template.key === "detail"
                ? textParagraphs.detail
                : textParagraphs.crafted,
          };
        case "quoteCenter":
          return {
            type: "quoteCenter",
            text: quote.text,
            author: quote.author,
          };
        default:
          return { type: "full", image: pickImage(gallery, 0) };
      }
    },
  );

  return sections.filter((section) => {
    if (section.type === "textLeft") return Boolean(section.paragraph);
    if (section.type === "quoteCenter") return Boolean(section.text);
    if (section.type === "full") return Boolean(section.image);
    if (section.type === "triple")
      return section.images.some((image) => Boolean(image));
    return Boolean(section.left || section.right);
  });
}
