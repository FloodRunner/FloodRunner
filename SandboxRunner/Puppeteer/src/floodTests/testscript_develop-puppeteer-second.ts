console.log("starting script...");

const page = await browser.newPage();
await page.goto("https://headlesstesting.com");

console.log("taking screenshot...");
await page.screenshot({ path: path.join(screenshotPath, "screenshot.png") });

console.log("completed script...");
