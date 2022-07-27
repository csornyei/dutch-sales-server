import { readFileSync, writeFileSync } from "fs";
import { getPage, getTextContent } from "./puppeteer";

export enum SupportedSites {
  jumbo = "Jumbo",
}

type SiteValue = { url: string; selector: string };

type SiteValues = {
  [key in SupportedSites]: SiteValue;
};

const siteValues: SiteValues = {
  [SupportedSites.jumbo]: {
    url: "https://www.jumbo.com/aanbiedingen/alles",
    selector: ".jum-promotion-toggle>button",
  },
};

function getOldState(siteName: SupportedSites) {
  const oldState = readFileSync(`${siteName}.state`);
  return oldState.toString();
}

function updateState(siteName: SupportedSites, newState: string) {
  writeFileSync(`${siteName}.state`, newState);
}

async function getCurrentState({ url, selector }: SiteValue) {
  const page = await getPage(url);
  const selected = await page.$$(selector);
  let state = "";
  for (const elements of selected) {
    const textContent = await elements.getProperty("textContent");
    const text = (await textContent?.jsonValue()) as string;
    state += text;
  }
  return state;
}

export async function compareStates(siteName: SupportedSites) {
  const oldState = getOldState(siteName);
  const currentState = await getCurrentState(siteValues[siteName]);

  if (oldState !== currentState) {
    updateState(siteName, currentState);
    return true;
  }
  return false;
}
