export interface JumboSaleItem {
  title: string;
  category: string;
  subtitle: string;
  image: string;
  link: string;
  tag: string;
  from: string;
  until: string;
}

export interface SalesList {
  [key: string]: JumboSaleItem[];
}

export enum SupportedSites {
  jumbo = "Jumbo",
  albertHeijn = "albertHeijn",
}

export type SiteValue = { url: string; selector: string };

export type SiteValues = {
  [key in SupportedSites]: SiteValue;
};
