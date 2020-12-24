import config = require("config");
export class Keys {
  // /* Flood Element Settings */
  static showBrowser =
    process.env.NODE_ENV == "Production" ? "" : "--no-headless";
  static testResultFolderName = "testResult";
  static testScreenshotFolderName = "screenshots";
  static system_applicationLogFileName = "app.log";
  static system_systemLogFileName = "system.log";
}
