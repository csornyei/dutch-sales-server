import puppeteer, { Page, ElementHandle } from "puppeteer";

export async function getPage(url: string) {
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36"
  );
  await page.goto(url, {
    waitUntil: "networkidle2",
  });
  return page;
}

export async function autoScroll(page: Page) {
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
  return (await getProperty(parent, selector, "textContent")).trim();
}
