const { Builder, By } = require("selenium-webdriver");

const chrome = require("selenium-webdriver/chrome");

const path = require("path");

// Путь к chromedriver в Linux
const service = new chrome.ServiceBuilder("/usr/bin/chromedriver");

// Пауза
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Создание драйвера
function createDriver() {

    let options = new chrome.Options();

    options.addArguments("--headless");
    options.addArguments("--no-sandbox");
    options.addArguments("--disable-dev-shm-usage");
    options.addArguments("--window-size=1920,1080");

    return new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .setChromeService(service)
        .build();
}

// Путь к HTML
const filePath = "file://" + path.resolve("index.html");

// Тест пустых полей
async function testEmptyFields() {

    let driver = await createDriver();

    try {

        await driver.get(filePath);

        await sleep(1000);

        let button = await driver.findElement(By.css("button"));

        await button.click();

        await sleep(500);

        let text = await driver
            .findElement(By.id("message"))
            .getText();

        if (text !== "Заполните все поля") {

            throw new Error(
                `Тест 1 не пройден: ${text}`
            );

        }

        console.log("Тест 1 пройден");

    } finally {

        await driver.quit();

    }
}

// Тест корректного ввода
async function testCorrectInput() {

    let driver = await createDriver();

    try {

        await driver.get(filePath);

        await sleep(1000);

        await driver
            .findElement(By.id("name"))
            .sendKeys("Марина");

        await driver
            .findElement(By.id("email"))
            .sendKeys("test@test.com");

        await sleep(500);

        let button = await driver.findElement(By.css("button"));

        await button.click();

        await sleep(500);

        let text = await driver
            .findElement(By.id("message"))
            .getText();

        if (text !== "Форма отправлена") {

            throw new Error(
                `Тест 2 не пройден: ${text}`
            );

        }

        console.log("Тест 2 пройден");

    } finally {

        await driver.quit();

    }
}

// Запуск тестов
async function runTests() {

    console.log("Начинаем выполнение тестов...");

    await testEmptyFields();

    await sleep(1000);

    await testCorrectInput();

    console.log("Все тесты успешно завершены!");

}

runTests();