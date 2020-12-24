const fs = require("fs-extra");
 
const webConfigPath = "./build/web.config";
 
if (fs.existsSync(webConfigPath)) {
    fs.unlinkSync(webConfigPath);
}
 
fs.copySync("./webconfig/web.config", webConfigPath);