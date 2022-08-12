export interface SaleItem {
  id: string;
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
  ttl: number;
}

export interface SalesList {
  [key: string]: SaleItem[];
}

export enum SupportedSites {
  jumbo = "jumbo",
  albertHeijn = "albertHeijn",
  aldi = "aldi",
  ekoplaza = "ekoplaza",
}

export type SiteValue = { url: string; selector: string; linkStart: string };

export type SiteValues = {
  [key in SupportedSites]: SiteValue;
};
