import puppeteer from "puppeteer";

export const browserPromise = puppeteer.launch({
  headless: true,
});
