import { SiteValues, SupportedSites } from "./types";

export const siteValues: SiteValues = {
  [SupportedSites.jumbo]: {
    url: "https://www.jumbo.com/aanbiedingen/alles",
    selector: ".jum-promotion-toggle",
  },
  [SupportedSites.albertHeijn]: {
    url: "https://www.ah.nl/bonus",
    selector: "#dropdown-list",
  },
  [SupportedSites.aldi]: {
    url: "https://www.aldi.nl/aanbiedingen.html",
    selector: ".tabs",
  },
  [SupportedSites.coop]: {
    url: "https://www.coop.nl/aanbiedingen",
    selector: ".promotions-page__sub-header",
  },
  [SupportedSites.ekoplaza]: {
    url: "https://www.ekoplaza.nl/nl/aanbiedingen",
    selector: ".product-header-title>.sub-title",
  },
};
