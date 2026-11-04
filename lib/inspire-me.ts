import type { CollectionProduct } from "@/lib/collection-types";

export type InspireImage = {
  id: string;
  src: string;
  alt: string;
  tagIds: number[];
};

export const DEFAULT_INSPIRE_IMAGES: InspireImage[] = [
  {
    id: "1305",
    src: "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/69be7047-f400-4b92-a0c6-a90028140ba2/nuctwf/std/1280x0/REGOLA_pag_12.jpg",
    alt: "casual",
    tagIds: [561],
  },
  {
    id: "9593",
    src: "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/fe133f5f-0596-4b83-b732-2c565c4c73c6/nuctwf/std/1280x0/Diesel%20Open%20Workshop%20UPDATE_pag_88089.jpg",
    alt: "loft",
    tagIds: [559],
  },
  {
    id: "10593",
    src: "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/fba73b1e-77a3-4761-aa6d-3d31b6868dba/nuctwf/std/1280x0/classico-familya919.jpg",
    alt: "classic",
    tagIds: [291],
  },
  {
    id: "10010",
    src: "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/15f694a5-a7c5-45e9-a1c2-14d2f57b8d77/nuctwf/std/1280x0/Libra_pag_34300a.jpg",
    alt: "design",
    tagIds: [510],
  },
  {
    id: "10513",
    src: "https://scavolini-cdn.thron.com/delivery/public/image/scavolini/fea19c39-3a44-4e7b-8b3c-4482db1b8b69/nuctwf/std/1280x0/MIRA_pag_10-1159a1.jpg",
    alt: "open space",
    tagIds: [555],
  },
];

export const DEFAULT_INSPIRE_RESULT_PRODUCTS: CollectionProduct[] = [
  {
    id: "mira",
    title: "Mira",
    href: "/ww/kitchens",
    onlineShop: false,
    images: [DEFAULT_INSPIRE_IMAGES[4].src],
    tagIds: [555, 510],
    categoryIds: [17],
  },
  {
    id: "libra",
    title: "Libra",
    href: "/ww/kitchens",
    onlineShop: false,
    images: [DEFAULT_INSPIRE_IMAGES[3].src],
    tagIds: [510, 539],
    categoryIds: [17],
  },
];

export const inspireMeDefaults = {
  title: "Inspire me",
  metaDescription: "Find your interior style with the Maknisa Inspire me wizard.",
  wizardIntro: [
    "Browse the images and find your style.",
    "Select the images you like the most or skip those that do not match",
  ],
  seeResultsLabel: "See results",
  congratsTitle: "Congratulations!",
  congratsBody:
    "You have completed the wizard. Below are results according to your choices.",
  unsatisfiedTitle: "Not satisfied with the results?",
  tryAgainLabel: "Try again",
  images: DEFAULT_INSPIRE_IMAGES,
  resultProducts: DEFAULT_INSPIRE_RESULT_PRODUCTS,
};

export type InspireMePageContent = typeof inspireMeDefaults;
