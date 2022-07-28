import { readFileSync, writeFileSync } from "fs";
import { Scrapper } from "./scrapper";
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
  const { selector } = siteValues[site];
  const scrapper = new Scrapper(site);
  const html = await scrapper.getHtml();
  const state = scrapper.getElementTextFromHtml(html, selector);
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
