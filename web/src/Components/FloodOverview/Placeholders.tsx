export class ScriptPlaceholders {
    static puppeteerPlaceholder: string = 
`/**
* A demo Puppeteer script:
* @desc Snaps a basic screenshot of the full New York Time homepage and saves it a .png file.
*
* NB. puppeteer is automatically imported and ready for you to use
*/

const browser = await puppeteer.launch()
const page = await browser.newPage()
await page.setViewport({ width: 1280, height: 800 })
await page.goto('https://www.nytimes.com/')
await page.screenshot({ path: 'nytimes.png', fullPage: true })
await browser.close()
`;

    static elementPlaceholder: string = 
`/**
 * A demo Flood Element script:
 * @desc Snaps a basic screenshot of a YouTube video.
 */

import { step, TestSettings, Until, By, Device } from "@flood/element";
import * as assert from "assert";

export const settings: TestSettings = {
  screenshotOnFailure: true,
  stepDelay: 7.5,
  actionDelay: 7.5,
  loopCount: 1,
};

export default () => {
  step("Test: YouTube screenshot", async (browser) => {
    await browser.visit("https://www.youtube.com/watch?v=6fvhLrBrPQI");
    await browser.takeScreenshot();
  });
};
`;
  }
  


