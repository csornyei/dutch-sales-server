export interface SaleItem {
  site: SupportedSites;
  title: string;
  category: string;
  subtitle: string;
  image: string;
  link: string;
  tag: string;
  from: string;
  until: string;
  price?: string;
}

export interface SalesList {
  [key: string]: SaleItem[];
}

export enum SupportedSites {
  jumbo = "jumbo",
  albertHeijn = "albertHeijn",
  aldi = "aldi",
  coop = "coop",
  ekoplaza = "ekoplaza",
}

export type SiteValue = { url: string; selector: string };

export type SiteValues = {
  [key in SupportedSites]: SiteValue;
};
