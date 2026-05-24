const { Builder, By } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const path = require("path");

// Функция паузы
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}



function createDriver() {
    const options = new chrome.Options();

    const isCI = process.env.CI === "true";

    if (isCI) {
        // GitHub Actions / Linux CI
        options.setChromeBinaryPath("/usr/bin/google-chrome");

        options.addArguments("--headless=new");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--window-size=1920,1080");
    } else {
        // Локальный запуск (Windows/macOS/Linux)
        options.addArguments("--start-maximized");
    }

    return new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();
}
// Автоматическое получение пути к index.html
const filePath = "file://" + path.resolve("index.html");

// Тест: пустые поля
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
                `Тест 1 не пройден. Получено: ${text}`
            );

        }

        console.log("Тест 1 пройден");

    } finally {

        await driver.quit();

    }
}

// Тест: корректный ввод
async function testCorrectInput() {

    let driver = await createDriver();

    try {

        await driver.get(filePath);

        await sleep(1000);

        // Ввод имени
        await driver
            .findElement(By.id("name"))
            .sendKeys("Марина");

        // Ввод email
        await driver
            .findElement(By.id("email"))
            .sendKeys("test@test.com");

        await sleep(500);

        // Нажатие кнопки
        let button = await driver.findElement(By.css("button"));

        await button.click();

        await sleep(500);

        // Получение текста
        let text = await driver
            .findElement(By.id("message"))
            .getText();

        if (text !== "Форма отправлена") {

            throw new Error(
                `Тест 2 не пройден. Получено: ${text}`
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

// Старт
runTests();