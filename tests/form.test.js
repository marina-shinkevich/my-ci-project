const { Builder, By } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const path = require("path");

// Функция паузы
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Создание драйвера
function createDriver() {

    let options = new chrome.Options();

    // Headless режим для GitHub Actions
    options.addArguments("--headless");

    // Параметры для Linux/GitHub Actions
    options.addArguments("--no-sandbox");
    options.addArguments("--disable-dev-shm-usage");

    // Размер окна браузера
    options.addArguments("--window-size=1920,1080");

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