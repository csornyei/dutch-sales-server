import axios from "axios";
import { load } from "cheerio";
import puppeteer, { Page, ElementHandle } from "puppeteer";
import logger from "./logger";
import { siteValues } from "./utils/constants";
import { SupportedSites } from "./utils/types";

export async function getProperty(
  parent: ElementHandle,
  selector: string,
  propertyName: string,
  all: boolean = false
) {
  try {
    if (all) {
      const els = await parent.$$(selector);
      const texts = [];
      for (const el of els) {
        const content = await el?.getProperty(propertyName);
        const text = (await content?.jsonValue()) as string;
        texts.push(text);
      }
      return texts.join(" ");
    } else {
      let el;
      if (selector.length === 0) {
        el = parent;
      } else {
        el = await parent.$(selector);
      }
      const textContent = await el?.getProperty(propertyName);
      const text = (await textContent?.jsonValue()) as string;
      return text;
    }
  } catch (error) {
    logger.log("error", `getProperty ${selector}`, error);
    return "";
  }
}

export async function getTextContent(
  parent: ElementHandle,
  selector: string,
  all: boolean = false
) {
  try {
    return (await getProperty(parent, selector, "textContent", all))
      .trim()
      .replace(/[\r\n\t]/gm, " ")
      .replace(/\s\s+/g, " ");
  } catch (error) {
    logger.log("error", `getTextContent ${selector}`, error);
    return "";
  }
}

export class Scrapper {
  private page: Page | null;
  constructor(private site: SupportedSites) {
    this.page = null;
  }

  async init() {
    const browser = await puppeteer.launch({
      headless: process.env.NODE_ENV === "production",
    });
    this.page = await browser.newPage();
    await this.page.setUserAgent(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36"
    );
    await this.page.goto(siteValues[this.site].url, {
      waitUntil: "networkidle2",
      timeout: 0
    });
  }

  async getHtml() {
    const { url } = siteValues[this.site];
    const { data } = await axios(url);

    return data;
  }

  getElementTextFromHtml(html: string, selector: string) {
    const $ = load(html);

    const buttons = $(selector);

    return buttons.text();
  }

  async autoScroll() {
    if (!this.page) {
      throw new Error("Call init first!");
    }
    await this.page.evaluate(async () => {
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

  async clickElement(selector: string) {
    if (!this.page) {
      throw new Error("Call init first!");
    }
    const acceptButton = await this.$(selector);
    await acceptButton?.click();
  }

  async $(selector: string) {
    if (!this.page) {
      throw new Error("Call init first!");
    }
    await this.page.waitForSelector(selector);
    return await this.page.$(selector);
  }

  async $$(selector: string) {
    if (!this.page) {
      throw new Error("Call init first!");
    }
    await this.page.waitForSelector(selector);
    return await this.page.$$(selector);
  }
}
