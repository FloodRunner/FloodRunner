// const browser = await puppeteer.connect({
//   browserWSEndpoint: "wss://chrome.headlesstesting.com",
// });

console.log("starting script...");
const browser = await puppeteer.launch({
  product: "chrome",
  headless: true,
});

const page = await browser.newPage();
await page.goto("https://headlesstesting.com");
await page.screenshot({ path: "screenshot.png" });

console.log("completed script...");
browser.close();
