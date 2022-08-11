import { parse, format, add } from "date-fns";
import { nl } from "date-fns/locale";
import logger from "../logger";
import { getProperty, getTextContent, Scrapper } from "../scrapper";
import { SalesList, SupportedSites } from "../utils/types";

export async function getEkoplazaSales() {
  try {
    const scrapper = new Scrapper(SupportedSites.ekoplaza);
    await scrapper.init();

    const resultsByCategory: SalesList = {};

    const dateContainer = await scrapper.$(
      ".product-header-title>.sub-wrapper>.sub-title"
    );
    const dateContent = await (
      await dateContainer?.getProperty("textContent")
    )?.jsonValue();

    const [from, until] = (dateContent as string)
      .split("t/m")
      .map((s) => s.trim());

    await scrapper.autoScroll();

    const salesSections = await scrapper.$$(
      ".product-section-group>:not(.d-none)"
    );

    for (const section of salesSections) {
      const sectionTitle = (await getTextContent(section, "h3")).trim();
      if (sectionTitle.length === 0) continue;
      if (!(sectionTitle in resultsByCategory)) {
        resultsByCategory[sectionTitle] = [];
      }
      const sectionCards = await section.$$(".product-tile");

      for (const card of sectionCards) {
        const link = await getProperty(card, "a", "href");
        const image = await getProperty(card, "a img", "src");
        const title = await getTextContent(card, "h4.title");
        const subtitle = await getTextContent(card, ".product-tile-body>p");
        const tag = await getTextContent(card, ".product-tag");
        const currentPriceEuro = await getTextContent(
          card,
          ".product-price>p>strong"
        );
        const currentPriceCent = await getTextContent(
          card,
          ".product-price>p>sup"
        );
        const oldPrice = await getTextContent(card, ".product-price>small");
        const price =
          `${currentPriceEuro},${currentPriceCent}` +
          (oldPrice.length > 0 ? ` ~~${oldPrice}~~` : "");
        resultsByCategory[sectionTitle].push({
          site: SupportedSites.ekoplaza,
          image,
          link,
          category: sectionTitle,
          tag,
          title,
          subtitle,
          from,
          until,
          price,
          ttl: add(new Date(), { weeks: 2 }),
        });
      }
    }

    return resultsByCategory;
  } catch (error) {
    logger.log("error", `error while getting Ekoplaza sales`, error);
    return {};
  }
}
