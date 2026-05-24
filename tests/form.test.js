const { By } = require("selenium-webdriver");
const path = require("path");
const createDriver = require("./driver");

async function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

const filePath = "file://" + path.resolve("index.html");

// ---------------- TEST 1 ----------------
async function testEmptyFields() {
    const driver = await createDriver();

    try {
        await driver.get(filePath);
        await sleep(800);

        await driver.findElement(By.css("button")).click();
        await sleep(500);

        const text = await driver.findElement(By.id("message")).getText();

        if (text !== "Заполните все поля") {
            throw new Error(`Тест 1 не пройден: ${text}`);
        }

        console.log("Тест 1 пройден");
    } finally {
        await driver.quit();
    }
}

// ---------------- TEST 2 ----------------
async function testCorrectInput() {
    const driver = await createDriver();

    try {
        await driver.get(filePath);
        await sleep(800);

        await driver.findElement(By.id("name")).sendKeys("Марина");
        await driver.findElement(By.id("email")).sendKeys("test@test.com");

        await driver.findElement(By.css("button")).click();
        await sleep(500);

        const text = await driver.findElement(By.id("message")).getText();

        if (text !== "Форма отправлена") {
            throw new Error(`Тест 2 не пройден: ${text}`);
        }

        console.log("Тест 2 пройден");
    } finally {
        await driver.quit();
    }
}

// ---------------- RUN ----------------
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