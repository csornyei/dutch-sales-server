import { existsSync, readFileSync, writeFileSync } from "fs";
import logger from "./logger";
import { getTextContent, Scrapper } from "./scrapper";
import { siteValues } from "./utils/constants";
import { SupportedSites } from "./utils/types";

function getOldState(siteName: SupportedSites) {
  const oldState = readFileSync(`${siteName}.state`);
  return oldState.toString();
}

function updateState(siteName: SupportedSites, newState: string) {
  writeFileSync(`${siteName}.state`, newState.trim());
}

async function getCurrentState(site: SupportedSites) {
  const { selector, htmlStateCheck } = siteValues[site];
  const scrapper = new Scrapper(site);
  let state = "";
  if (htmlStateCheck) {
    const html = await scrapper.getHtml();
    state = scrapper.getElementTextFromHtml(html, selector);
  } else {
    await scrapper.init();
    const elem = await scrapper.$(selector);
    if (elem) {
      state = await getTextContent(elem, "", false);
    } else {
      logger.log("error", `can't find ${selector} on site ${site}`);
    }
    await scrapper.close();
  }
  return state.trim();
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

export function checkStateFiles() {
  Object.keys(siteValues).forEach((siteName) => {
    const fileName = `${siteName}.state`;
    if (!existsSync(fileName)) {
      writeFileSync(fileName, "");
    }
  });
}
