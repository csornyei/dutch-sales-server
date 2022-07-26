import puppeteer, { Page, ElementHandle } from "puppeteer";
import { JumboSales } from "./types";

export async function getJumboSales() {
  const url = "https://www.jumbo.com/aanbiedingen/alles";
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--proxy-server=http://51.15.8.75:3738"],
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36"
    );
    await page.goto(url, {
      waitUntil: "networkidle2",
    });

    console.log(await page.content());

    const acceptButton = await page.$("button#onetrust-accept-btn-handler");
    await acceptButton?.click();

    const resultsByCategory: JumboSales = {};

    const toggleButtons = await page.$$(
      ".jum-promotion-toggle>button:not(.disabled)"
    );
    for (const button of toggleButtons) {
      await button.click();
      await autoScroll(page);

      const promotionGrids = await page.$$(
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
            image: fixRelativeLinks(image),
            tag,
            title,
            link: fixRelativeLinks(titleLink),
            subtitle,
            from: from ? from.trim() : "",
            until: until ? until.trim() : "",
          });
        }
      }
    }

    return resultsByCategory;
  } catch (err) {
    console.error(err);
    return {};
  }
}

async function autoScroll(page: Page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve(null);
        }
      }, 50);
    });
  });
}

async function getProperty(
  parent: ElementHandle,
  selector: string,
  propertyName: string
) {
  const el = await parent.$(selector);
  const textContent = await el?.getProperty(propertyName);
  const text = (await textContent?.jsonValue()) as string;
  return text;
}

async function getTextContent(parent: ElementHandle, selector: string) {
  return (await getProperty(parent, selector, "textContent")).trim();
}

function fixRelativeLinks(link: string) {
  if (link.includes("https")) return link;
  return `https://www.jumbo.com${link}`;
}
