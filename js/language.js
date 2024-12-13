// Данные о странах и их языках  
const countries = [  
    { country: "Россия", language: "Русский", flag: "img/russia.png" },  
    { country: "США", language: "Английский", flag: "img/usa.png" },  
    { country: "Франция", language: "Французский", flag: "img/france.webp" },  
    { country: "Италия", language: "Итальянский", flag: "img/italy.png" },  
    { country: "Германия", language: "Немецкий", flag: "img/germany.webp" },  
    { country: "Япония", language: "Японский", flag: "img/japan.svg" },  
    { country: "Китай", language: "Китайский", flag: "img/china.webp" },  
    { country: "Испания", language: "Испанский", flag: "img/spain.png" },  
    { country: "Канада", language: "Английский и Французский", flag: "img/canada.webp" },  
    { country: "Индия", language: "Хинди", flag: "img/india.png" },  
    { country: "Бразилия", language: "Португальский", flag: "img/brazil.png" },  
    { country: "Швейцария", language: "Немецкий, Французский, Итальянский", flag: "img/switzerland.png" },  
    { country: "Австралия", language: "Английский", flag: "img/australia.svg" },  
    { country: "Мексика", language: "Испанский", flag: "img/mexico.png" },  
    { country: "Египет", language: "Арабский", flag: "img/egypt.png" }  
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
        radio.value = options[i].language; // Устанавливаем язык  
        radio.checked = false; // Сброс выбора  
        label.textContent = options[i].language; // Отображаем язык  
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
    const correctAnswer = countries[currentIndex].language;  

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