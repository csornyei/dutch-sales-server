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

export interface JumboSales {
  [key: string]: JumboSaleItem[];
}

export enum SupportedSites {
  jumbo = "Jumbo",
}

export type SiteValue = { url: string; selector: string };

export type SiteValues = {
  [key in SupportedSites]: SiteValue;
};
