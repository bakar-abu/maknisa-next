export type PageSeoContent = {
  metaTitle: string;
  metaDescription: string;
  noIndex: boolean;
  noFollow: boolean;
};

export type PageContent = {
  seo: PageSeoContent;
  sections: Record<string, unknown>;
};
