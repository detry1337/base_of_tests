// Данные о странах и их валютах  
const countries = [  
    { country: "Россия", currency: "Рубль", flag: "img/russia.png" },  
    { country: "США", currency: "Доллар США", flag: "img/usa.png" },  
    { country: "Франция", currency: "Евро", flag: "img/france.webp" },  
    { country: "Италия", currency: "Евро", flag: "img/italy.png" },  
    { country: "Германия", currency: "Евро", flag: "img/germany.webp" },  
    { country: "Япония", currency: "Йена", flag: "img/japan.svg" },  
    { country: "Китай", currency: "Юань", flag: "img/china.webp" },  
    { country: "Бразилия", currency: "Бразильский реал", flag: "img/brazil.png" },  
    { country: "Испания", currency: "Евро", flag: "img/spain.png" },  
    { country: "Канада", currency: "Канадский доллар", flag: "img/canada.webp" },  
    { country: "Индия", currency: "Индийская рупия", flag: "img/india.png" },  
    { country: "Швейцария", currency: "Швейцарский франк", flag: "img/switzerland.png" },  
    { country: "Австралия", currency: "Австралийский доллар", flag: "img/australia.svg" },  
    { country: "Мексика", currency: "Мексиканское песо", flag: "img/mexico.png" },  
    { country: "Египет", currency: "Египетский фунт", flag: "img/egypt.png" }  
];  

// Переменные для отслеживания состояния теста  
let correctAnswers = 0;  
let incorrectAnswers = 0;  
let currentIndex = 0;  
const usedIndexes = [];  

// Счетчики на странице  
const correctCounter = document.getElementById("correct-counter");  
const incorrectCounter = document.getElementById("incorrect-counter");  

// Случайное перемешивание массива  
function shuffle(array) {  
    return array.sort(() => Math.random() - 0.5);  
}  

// Загрузка следующего вопроса  
function loadQuiz() {  
    if (usedIndexes.length === countries.length) {  
        finishQuiz();  
        return;  
    }  

    // Генерируем новый индекс вопроса  
    do {  
        currentIndex = Math.floor(Math.random() * countries.length);  
    } while (usedIndexes.includes(currentIndex));  

    usedIndexes.push(currentIndex);  

    const correctCountry = countries[currentIndex];  
    const otherCountries = countries.filter((_, i) => i !== currentIndex);  
    const options = shuffle([correctCountry, ...shuffle(otherCountries).slice(0, 2)]);  

    // Устанавливаем флаг  
    document.getElementById("flag").src = correctCountry.flag;  

    // Устанавливаем текст и значения вариантов ответов  
    const answers = document.querySelectorAll("#quiz-form div");  
    answers.forEach((div, i) => {  
        const radio = div.querySelector("input");  
        const label = div.querySelector("label");  
        radio.value = options[i].currency; // Устанавливаем валюту  
        radio.checked = false; // Сброс выбора  
        label.textContent = options[i].currency; // Отображаем валюту  
    });  

    document.getElementById("result").textContent = "";  
}  

// Проверка ответа  
function checkAnswer() {  
    const selectedAnswer = document.querySelector("input[name='answer']:checked");  

    if (!selectedAnswer) {  
        document.getElementById("result").textContent =  
            "Пожалуйста, выберите вариант ответа.";  
        document.getElementById("result").style.color = "orange";  
        return;  
    }  

    const userAnswer = selectedAnswer.value;  
    const correctAnswer = countries[currentIndex].currency;  

    if (userAnswer === correctAnswer) {  
        correctAnswers++;  
        document.getElementById("result").textContent = "Верно!";  
        document.getElementById("result").style.color = "green";  
    } else {  
        incorrectAnswers++;  
        document.getElementById("result").textContent =  
            "Неверно. Правильный ответ: " + correctAnswer;  
        document.getElementById("result").style.color = "red";  
    }  

    // Обновляем счетчики  
    correctCounter.textContent = correctAnswers;  
    incorrectCounter.textContent = incorrectAnswers;  

    // Переходим к следующему вопросу  
    setTimeout(loadQuiz, 300);  
}  

// Завершение теста  
function finishQuiz() {  
    const resultMessage =  
        incorrectAnswers > correctAnswers  
            ? "Тест не пройден. Попробуйте снова!"  
            : "Поздравляем! Вы прошли тест!";  

    // Показываем всплывающее окно  
    const resultBox = document.createElement("div");  
    resultBox.style.position = "fixed";  
    resultBox.style.top = "50%";  
    resultBox.style.left = "50%";  
    resultBox.style.transform = "translate(-50%, -50%)";  
    resultBox.style.padding = "20px";  
    resultBox.style.backgroundColor = "#fff";  
    resultBox.style.border = "2px solid #0078d7";  
    resultBox.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";  
    resultBox.style.textAlign = "center";  
    resultBox.style.zIndex = "1000";  

    // Итоговые данные  
    const resultText = document.createElement("p");  
    resultText.textContent = resultMessage;  
    resultBox.appendChild(resultText);  

    const scoreText = document.createElement("p");  
    scoreText.textContent = `Правильных ответов: ${correctAnswers} из ${countries.length}`;  
    resultBox.appendChild(scoreText);  

    // Стили кнопок  
    const buttonStyle = {  
        backgroundColor: "#0078d7",  
        color: "#fff",  
        border: "none",  
        padding: "10px 20px",  
        borderRadius: "5px",  
        cursor: "pointer",  
        margin: "10px",  
        fontSize: "16px",  
    };  

    // Кнопка повторного прохождения теста  
    const retryButton = document.createElement("button");  
    retryButton.textContent = "Пройти тест ещё раз";  
    Object.assign(retryButton.style, buttonStyle);  
    retryButton.onclick = () => {  
        document.body.removeChild(resultBox);  
        resetQuiz();  
    };  
    resultBox.appendChild(retryButton);  

    // Кнопка возврата к списку тестов  
    const backButton = document.createElement("button");  
    backButton.textContent = "Вернуться к списку тестов";  
    Object.assign(backButton.style, buttonStyle);  
    backButton.onclick = () => {  
        window.location.href = "tests.html";  
    };  
    resultBox.appendChild(backButton);  

    document.body.appendChild(resultBox);  
}  

// Сброс теста  
function resetQuiz() {  
    correctAnswers = 0;  
    incorrectAnswers = 0;  
    usedIndexes.length = 0;  
    correctCounter.textContent = correctAnswers;  
    incorrectCounter.textContent = incorrectAnswers;  
    loadQuiz();  
}  

// Инициализация теста  
loadQuiz();