import { step, TestSettings, Until, By, Device } from "@flood/element";
import * as assert from "assert";

export const settings: TestSettings = {
  device: Device.iPadLandscape,
  userAgent:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36",
  clearCache: true,
  disableCache: true,
  clearCookies: true,
  waitTimeout: 30,
  screenshotOnFailure: true,
  extraHTTPHeaders: {
    "Accept-Language": "en",
  },
  loopCount: 1,
};

/**
 * Random Test
 * @version 1.0
 */
//element run test.ts --no-headless
export default () => {
  step("Test: Random Site Navigation Login", async (browser) => {
    //visit random website
    await browser.visit("https://google.com");
  });
};
