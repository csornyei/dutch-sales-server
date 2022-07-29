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
};
