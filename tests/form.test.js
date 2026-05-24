const { Builder, By } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const path = require("path");

// Функция паузы
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Настройка Chrome для GitHub Actions
function createDriver() {

    let options = new chrome.Options();

    // Headless режим для CI/CD
    options.addArguments("--headless");

    // Обязательные параметры для Linux/GitHub Actions
    options.addArguments("--no-sandbox");
    options.addArguments("--disable-dev-shm-usage");

    // Размер окна браузера
    options.addArguments("--window-size=1920,1080");

    return new Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();
}

// Получаем путь к index.html
const filePath = "file://" + path.resolve("index.html");

async function testEmptyFields() {

    let driver = await createDriver();

    try {

        await driver.get(filePath);

        // Пауза после открытия страницы
        await sleep(1000);

        // Поиск кнопки
        let button = await driver.findElement(By.css("button"));

        // Клик по кнопке
        await button.click();

        // Пауза после клика
        await sleep(500);

        // Получаем текст сообщения
        let text = await driver
            .findElement(By.id("message"))
            .getText();

        // Проверка результата
        if (text !== "Заполните все поля") {

            throw new Error(
                `Тест 1 не пройден. Получено: "${text}"`
            );

        }

        console.log("Тест 1 пройден");

    } finally {

        await driver.quit();

    }
}

async function testCorrectInput() {

    let driver = await createDriver();

    try {

        await driver.get(filePath);

        await sleep(1000);

        // Ввод имени
        let nameField = await driver.findElement(By.id("name"));

        await nameField.sendKeys("Марина");

        // Ввод email
        let emailField = await driver.findElement(By.id("email"));

        await emailField.sendKeys("test@test.com");

        await sleep(500);

        // Нажатие кнопки
        let button = await driver.findElement(By.css("button"));

        await button.click();

        await sleep(500);

        // Проверка сообщения
        let text = await driver
            .findElement(By.id("message"))
            .getText();

        if (text !== "Форма отправлена") {

            throw new Error(
                `Тест 2 не пройден. Получено: "${text}"`
            );

        }

        console.log("Тест 2 пройден");

    } finally {

        await driver.quit();

    }
}

async function runTests() {

    console.log("Начинаем выполнение тестов...");

    await testEmptyFields();

    await sleep(1000);

    await testCorrectInput();

    console.log("Все тесты успешно завершены!");

}

runTests();