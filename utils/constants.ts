import { SiteValues, SupportedSites } from "./types";

export const siteValues: SiteValues = {
  [SupportedSites.jumbo]: {
    url: "https://www.jumbo.com/aanbiedingen/alles",
    selector: ".jum-promotion-toggle",
    linkStart: "https://www.jumbo.com",
  },
  [SupportedSites.albertHeijn]: {
    url: "https://www.ah.nl/bonus",
    selector: "#dropdown-list",
    linkStart: "",
  },
  [SupportedSites.aldi]: {
    url: "https://www.aldi.nl/aanbiedingen.html",
    selector: ".tabs",
    linkStart: "https://www.aldi.nl",
  },
  [SupportedSites.ekoplaza]: {
    url: "https://www.ekoplaza.nl/nl/aanbiedingen",
    selector: ".product-header-title>.sub-wrapper>.sub-title",
    linkStart: "",
  },
};
