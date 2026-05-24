const { Builder, By } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const path = require("path");

// Пауза (оставил, но лучше минимизировать)
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



function createDriver() {
    const options = new chrome.Options();

    if (process.env.CI) {
        options.addArguments("--headless=new");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--window-size=1920,1080");
    }

    return new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();
}

module.exports = createDriver;

// путь к index.html
const filePath = "file://" + path.resolve("index.html");

// -------------------- ТЕСТ 1 --------------------
async function testEmptyFields() {
    const driver = await createDriver();

    try {
        await driver.get(filePath);
        await sleep(800);

        const button = await driver.findElement(By.css("button"));
        await button.click();

        await sleep(500);

        const text = await driver.findElement(By.id("message")).getText();

        if (text !== "Заполните все поля") {
            throw new Error(`Тест 1 не пройден. Получено: ${text}`);
        }

        console.log("Тест 1 пройден");
    } finally {
        await driver.quit();
    }
}

// -------------------- ТЕСТ 2 --------------------
async function testCorrectInput() {
    const driver = await createDriver();

    try {
        await driver.get(filePath);
        await sleep(800);

        await driver.findElement(By.id("name")).sendKeys("Марина");
        await driver.findElement(By.id("email")).sendKeys("test@test.com");

        await sleep(300);

        const button = await driver.findElement(By.css("button"));
        await button.click();

        await sleep(500);

        const text = await driver.findElement(By.id("message")).getText();

        if (text !== "Форма отправлена") {
            throw new Error(`Тест 2 не пройден. Получено: ${text}`);
        }

        console.log("Тест 2 пройден");
    } finally {
        await driver.quit();
    }
}

// -------------------- RUN --------------------
async function runTests() {
    console.log("Начинаем выполнение тестов...");

    try {
        await testEmptyFields();
        await sleep(500);

        await testCorrectInput();

        console.log("Все тесты успешно завершены!");
    } catch (err) {
        console.error("Ошибка тестов:", err);
        process.exit(1);
    }
}

runTests();