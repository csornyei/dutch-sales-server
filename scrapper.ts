import axios from "axios";
import { load } from "cheerio";
import puppeteer, { Page, ElementHandle } from "puppeteer";
import { siteValues } from "./utils/constants";
import { SupportedSites } from "./utils/types";

export async function getProperty(
  parent: ElementHandle,
  selector: string,
  propertyName: string
) {
  const el = await parent.$(selector);
  const textContent = await el?.getProperty(propertyName);
  const text = (await textContent?.jsonValue()) as string;
  return text;
}

export async function getTextContent(parent: ElementHandle, selector: string) {
  try {
    return (await getProperty(parent, selector, "textContent")).trim();
  } catch (error) {
    console.error(`getTextContent ${selector}`, error);
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
      headless: false,
    });
    this.page = await browser.newPage();
    await this.page.setUserAgent(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36"
    );
    await this.page.goto(siteValues[this.site].url, {
      waitUntil: "networkidle2",
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
