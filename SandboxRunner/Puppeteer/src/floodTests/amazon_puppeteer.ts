/**
 * @name Amazon search
 *
 * @desc Looks for a "nyan cat pullover" on amazon.com, goes two page two clicks the third one.
 */

const puppeteer = require("puppeteer");
const _ = require("lodash");
const screenshot = "amazon_nyan_cat_pullover.png";
const fs = require("fs");

console.log(fs.readFileSync("./amazon.js"));
console.log("from inside script");
const browser = await puppeteer.launch({
  product: "chrome",
  headless: true,
});
const page = await browser.newPage();
await page.setViewport({
  width: 1280,
  height: 800,
});
await page.goto("https://www.amazon.com");
await page.screenshot({
  path: screenshot,
});
await page.type("#twotabsearchtextbox", "nyan cat pullover");
await page.click("input.nav-input");

console.log("inside script completed!!!");
await browser.close();
