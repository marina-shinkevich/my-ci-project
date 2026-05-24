const chrome = require("selenium-webdriver/chrome");
const { Builder } = require("selenium-webdriver");

function createDriver() {
    const options = new chrome.Options();

    const isCI = process.env.CI === "true";

    if (isCI) {
        // GitHub Actions
        options.addArguments("--headless=new");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--window-size=1920,1080");

        const service = new chrome.ServiceBuilder("/usr/bin/chromedriver");

        return new Builder()
            .forBrowser("chrome")
            .setChromeOptions(options)
            .setChromeService(service)
            .build();
    }

    // локально (Windows/Mac/Linux)
    return new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();
}

module.exports = createDriver;