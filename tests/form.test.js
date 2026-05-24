const { Builder, By } = require("selenium-webdriver");

// Функция для создания паузы
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function testEmptyFields() {
    
    let driver = await new Builder().forBrowser("chrome").build();
    
    try {
        await driver.get("file:///D:/3курс6сем/ТПО/lab11/my-ci-project/index.html");
        
        // Пауза перед кликом (страница открыта 2 секунды)
        await sleep(2000);
        
        // Медленное нажатие на кнопку
        let button = await driver.findElement(By.css("button"));
        await driver.executeScript("arguments[0].click();", button);
        
        // Пауза после клика
        await sleep(1000);
        
        let text = await driver.findElement(By.id("message")).getText();
        
        if (text !== "Заполните все поля") {
            throw new Error("Тест не пройден");
        }
        
        console.log("Тест 1 пройден");
        
        // Дополнительная пауза перед закрытием
        await sleep(1500);
        
    } finally {
        await driver.quit();
    }
}

async function testCorrectInput() {
    let driver = await new Builder().forBrowser("chrome").build();
    
    try {
        await driver.get("file:///D:/3курс6сем/ТПО/lab11/my-ci-project/index.html");
        
        // Пауза перед вводом данных
        await sleep(1000);
        
        // Медленный ввод имени (каждая буква с задержкой)
        let nameField = await driver.findElement(By.id("name"));
        await nameField.click();
        const name = "Марина";
        for (let char of name) {
            await nameField.sendKeys(char);
            await sleep(300); // Задержка между символами
        }
        
        // Пауза между полями
        await sleep(800);
        
        // Медленный ввод email
        let emailField = await driver.findElement(By.id("email"));
        await emailField.click();
        const email = "test@test.com";
        for (let char of email) {
            await emailField.sendKeys(char);
            await sleep(150); // Задержка между символами
        }
        
        // Пауза перед отправкой
        await sleep(1000);
        
        // Медленное нажатие на кнопку
        let button = await driver.findElement(By.css("button"));
        await driver.executeScript("arguments[0].click();", button);
        
        // Пауза после отправки
        await sleep(1000);
        
        let text = await driver.findElement(By.id("message")).getText();
        
        if (text !== "Форма отправлена") {
            throw new Error("Тест не пройден");
        }
        
        console.log("Тест 2 пройден");
        
        // Финальная пауза перед закрытием
        await sleep(2000);
        
    } finally {
        await driver.quit();
    }
}

async function runTests() {
    console.log("Начинаем выполнение тестов...");
    
    await testEmptyFields();
    
    console.log("Ожидание между тестами...");
    await sleep(3000); // Пауза между тестами
    
    await testCorrectInput();
    
    console.log("Все тесты завершены!");
}

runTests();