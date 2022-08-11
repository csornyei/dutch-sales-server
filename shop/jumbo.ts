import { add } from "date-fns";
import { ElementHandle } from "puppeteer";
import logger from "../logger";
import { getProperty, getTextContent, Scrapper } from "../scrapper";
import { SalesList, SupportedSites } from "../utils/types";

export async function getJumboSales() {
  try {
    const scrapper = new Scrapper(SupportedSites.jumbo);
    await scrapper.init();
    await scrapper.clickElement("button#onetrust-accept-btn-handler");

    const resultsByCategory: SalesList = {};

    const toggleButtons = await scrapper.$$(
      ".jum-promotion-toggle>button:not(.disabled)"
    );
    for (const button of toggleButtons) {
      await button.click();
      await scrapper.autoScroll();

      const promotionGrids = await scrapper.$$(
        "div.jum-card-grid.jum-card-grid-promotion"
      );

      for (const grid of promotionGrids) {
        const gridParent = await grid.getProperty("parentNode");
        const gridTitle = (
          await getTextContent(
            gridParent as ElementHandle,
            "h2.category-title-header"
          )
        ).trim();
        if (!(gridTitle in resultsByCategory)) {
          resultsByCategory[gridTitle] = [];
        }
        const promotionCards = await grid.$$(
          "div.jum-card-grid.jum-card-grid-promotion>div"
        );
        for (const card of promotionCards) {
          const image = await getProperty(card, "img", "src");
          const tag = await getTextContent(card, ".jum-tag");
          const title = await getTextContent(card, "h3.jum-heading.title");
          const titleLink = await getProperty(
            card,
            "h3.jum-heading.title>a",
            "href"
          );
          const subtitle = await getTextContent(
            card,
            "h4.jum-heading.subtitle"
          );
          const information = await getTextContent(card, ".information");
          const dates = information
            .split(title)
            .filter((s: string) => s.includes("t/m"))[0];
          const [from, until] = dates.split("t/m");

          resultsByCategory[gridTitle].push({
            site: SupportedSites.jumbo,
            image: fixRelativeLinks(image),
            category: gridTitle,
            tag,
            title,
            link: fixRelativeLinks(titleLink),
            subtitle,
            from: from ? from.trim() : "",
            until: until ? until.trim() : "",
            ttl: add(new Date(), { weeks: 2 }),
          });
        }
      }
    }

    return resultsByCategory;
  } catch (error) {
    logger.log("error", `error while Jumbo AH sales`, error);
    return {};
  }
}

function fixRelativeLinks(link: string) {
  if (link.includes("https")) return link;
  return `https://www.jumbo.com${link}`;
}
