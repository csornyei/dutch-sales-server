import { readFileSync, writeFileSync } from "fs";
import { getPage, getTextContent } from "./puppeteer";
import { siteValues } from "./utils/constants";
import { SupportedSites } from "./utils/types";

function getOldState(siteName: SupportedSites) {
  const oldState = readFileSync(`${siteName}.state`);
  return oldState.toString();
}

function updateState(siteName: SupportedSites, newState: string) {
  writeFileSync(`${siteName}.state`, newState);
}

async function getCurrentState(site: SupportedSites) {
  const { selector } = siteValues[site];
  const page = await getPage(site);
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
  const currentState = await getCurrentState(siteName);

  if (oldState !== currentState) {
    updateState(siteName, currentState);
    return true;
  }
  return false;
}
