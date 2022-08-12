import crypto from "crypto";
import { add } from "date-fns";
import { siteValues } from "./constants";
import { SaleItem, SupportedSites } from "./types";

function hashSaleItem(item: SaleItem) {
  const { ttl, id, ...rest } = item;
  const hash = crypto
    .createHash("sha256")
    .update(JSON.stringify(rest))
    .digest("hex");
  return hash;
}

export function newSaleItem(site: SupportedSites, item: Partial<SaleItem>) {
  const newItem: SaleItem = {
    id: "",
    site,
    image: fixRelativeLinks(site, fixString(item.image!)),
    category: fixString(item.category),
    tag: fixString(item.tag),
    title: fixString(item.title),
    link: fixRelativeLinks(site, fixString(item.link!)),
    subtitle: fixString(item.subtitle),
    price: fixString(item.price),
    from: fixString(item.from),
    until: fixString(item.until),
    ttl: Math.floor(add(new Date(), { weeks: 2 }).getTime() / 1000),
  };
  newItem.id = hashSaleItem(newItem);
  return newItem;
}

function fixRelativeLinks(site: SupportedSites, link: string) {
  if (link.includes("https")) return link;
  return `${siteValues[site].linkStart}${link}`;
}

function fixString(str?: string) {
  if (typeof str === "undefined") {
    return "";
  }
  return str.trim();
}
