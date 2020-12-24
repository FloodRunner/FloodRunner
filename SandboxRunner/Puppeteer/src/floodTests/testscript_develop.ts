// const browser = await puppeteer.connect({
//   browserWSEndpoint: "wss://chrome.headlesstesting.com",
// });

const browser = await puppeteer.launch({
  product: "chrome",
  headless: true,
});

const page = await browser.newPage();
await page.goto("https://headlesstesting.com");
await page.screenshot({ path: "screenshot.png" });
browser.close();
