export interface JumboSaleItem {
  title: string;
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
