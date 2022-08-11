import logger from "../logger";
import { getProperty, getTextContent, Scrapper } from "../scrapper";
import { SalesList, SupportedSites } from "../utils/types";

export async function getAHSales() {
  try {
    const scrapper = new Scrapper(SupportedSites.albertHeijn);
    await scrapper.init();

    const resultsByCategory: SalesList = {};

    await scrapper.autoScroll();

    const dropdownButton = await scrapper.$("#dropdown-button");
    let date = "";
    if (dropdownButton) {
      date = await getTextContent(dropdownButton, "span");
    }

    const [from, until] = date.split("t/m").map((s) => s.trim());

    const salesSections = await scrapper.$$("section");

    for (const section of salesSections) {
      const sectionTitle = (await getTextContent(section, "h3")).trim();
      if (sectionTitle.length === 0) continue;
      if (!(sectionTitle in resultsByCategory)) {
        resultsByCategory[sectionTitle] = [];
      }
      const sectionCards = await section.$$("a");

      for (const card of sectionCards) {
        const link = await (await card.getProperty("href")).jsonValue();
        const image = await getProperty(card, "picture>img", "src");
        const title = await getTextContent(card, "div>p>span");
        const tag = await getTextContent(card, "div>div>p");
        resultsByCategory[sectionTitle].push({
          site: SupportedSites.albertHeijn,
          image,
          link: typeof link === "string" ? link : "",
          category: sectionTitle,
          tag,
          title,
          subtitle: "",
          from,
          until,
        });
      }
    }
    await scrapper.close();
    return resultsByCategory;
  } catch (error) {
    logger.log("error", `error while getting AH sales`, error);
    return {};
  }
}
