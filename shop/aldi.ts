import { add, endOfWeek, format } from "date-fns";
import logger from "../logger";
import { getProperty, getTextContent, Scrapper } from "../scrapper";
import { SalesList, SupportedSites } from "../utils/types";

export async function getAldiSales() {
  try {
    const scrapper = new Scrapper(SupportedSites.aldi);
    await scrapper.init();

    const resultsByCategory: SalesList = {};

    await scrapper.autoScroll();

    const saleDays = await scrapper.$$(".mod-offers__day");

    for (const daySection of saleDays) {
      const dayDate = await daySection.evaluate((el) =>
        el.getAttribute("data-rel")
      );
      if (!dayDate) {
        continue;
      }
      const fromDate = new Date(dayDate);
      const until = format(endOfWeek(fromDate), "yyyy-MM-dd");
      const from = format(fromDate, "yyyy-MM-dd");
      const sections = await daySection.$$(".mod.mod-tile-group");

      for (const section of sections) {
        const sectionTitle = await getTextContent(section, "h2");
        if (!(sectionTitle in resultsByCategory)) {
          resultsByCategory[sectionTitle] = [];
        }
        const articleTiles = await section.$$(".mod-article-tile");
        for (const article of articleTiles) {
          const [image] = (
            await getProperty(article, ".mod-article-tile__media>img", "srcset")
          ).split(" ");
          const link = await getProperty(article, "a", "href");
          const title = await getTextContent(
            article,
            ".mod-article-tile__info>h4"
          );
          const tag = (
            await getProperty(article, ".price__label", "innerHTML", true)
          )
            .replace(/(<s .*?>)|(<\/s>)/gm, "~~")
            .replace(/(<.*?>)|(<\/.*?>)/gm, "")
            .replace(/[\r\n\t]/gm, " ")
            .replace(/\s\s+/g, " ");
          resultsByCategory[sectionTitle].push({
            site: SupportedSites.aldi,
            image: fixRelativeLinks(image),
            link,
            category: sectionTitle,
            tag,
            title,
            subtitle: "",
            from,
            until,
            ttl: add(new Date(), { weeks: 2 }),
          });
        }
      }
    }

    return resultsByCategory;
  } catch (error) {
    logger.log("error", `error while getting Aldi sales`, error);
    return {};
  }
}

function fixRelativeLinks(link: string) {
  if (link.includes("https")) return link;
  return `https://www.aldi.nl${link}`;
}
