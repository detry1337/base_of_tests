// Массив стран и их особенностей (с одной уникальной особенностью для каждой)  
const countries = [  
    { name: "Россия", feature: "Крупнейшая страна в мире по площади." },  
    { name: "Франция", feature: "Родина Эйфелевой башни и Лувра." },  
    { name: "Япония", feature: "Цветение сакуры - символ обновления." },  
    { name: "Германия", feature: "Октоберфест - крупнейший пивной фестиваль в мире." },  
    { name: "Италия", feature: "Родина пиццы и пасты." },  
    { name: "США", feature: "Разнообразие природы: Гранд-Каньон и Гавайи." },  
    { name: "Бразилия", feature: "Карнавалы в Рио-де-Жанейро." },  
    { name: "Канада", feature: "Природа мирового уровня: Ниагарский водопад." },  
    { name: "Швейцария", feature: "Альпы - популярное место для зимних видов спорта." },  
    { name: "Индия", feature: "Великая история и архитектура: Тадж-Махал." },  
    { name: "Китай", feature: "Древняя философия Конфуция." },  
    { name: "Австралия", feature: "Сиднейская опера — известный символ." },  
    { name: "Египет", feature: "Культурное наследие: пирамиды." },  
    { name: "Испания", feature: "Дом музея Пикассо." },  
    { name: "Мексика", feature: "Праздник День мертвых." }  
];  

// Переменные для отслеживания состояния теста  
let correctAnswers = 0;  
let incorrectAnswers = 0;  
let currentIndex = 0;  
const usedIndexes = [];  

// Счетчики на странице  
const correctCounter = document.getElementById("correct-counter");  
const incorrectCounter = document.getElementById("incorrect-counter");  

// Смешивание массива  
function shuffle(array) {  
    return array.sort(() => Math.random() - 0.5);  
}  

// Загрузка следующего вопроса  
function loadQuiz() {  
    if (usedIndexes.length >= countries.length) {  
        finishQuiz();  
        return;  
    }  

    // Сброс выбора радиокнопок  
    resetSelections();  

    // Генерируем новый индекс вопроса  
    do {  
        currentIndex = Math.floor(Math.random() * countries.length);  
    } while (usedIndexes.includes(currentIndex));  

    usedIndexes.push(currentIndex);  

    const correctCountry = countries[currentIndex];  
    const otherCountries = countries.filter((_, i) => i !== currentIndex);  
    const options = shuffle([correctCountry, ...otherCountries.slice(0, 2)]);  

    // Устанавливаем особенности  
    document.getElementById("feature").textContent = correctCountry.feature;  

    // Устанавливаем текст и значения вариантов ответов  
    const answers = document.querySelectorAll("#quiz-form div");  
    answers.forEach((div, i) => {  
        const radio = div.querySelector("input");  
        const label = div.querySelector("label");  
        radio.value = options[i].name; // Устанавливаем название страны  
        label.textContent = options[i].name; // Отображаем название страны  
    });  

    document.getElementById("result").textContent = "";  
}  

// Функция сброса выбора радиокнопок  
function resetSelections() {  
    const radios = document.querySelectorAll("input[name='answer']");  
    radios.forEach((radio) => {  
        radio.checked = false; // Сбрасываем выбор  
    });  
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
    const correctAnswer = countries[currentIndex].name;  

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

    // Кнопка повторного прохождения теста  
    const retryButton = document.createElement("button");  
    retryButton.textContent = "Пройти тест ещё раз";  
    Object.assign(retryButton.style, {  
        backgroundColor: "#0078d7",  
        color: "#fff",  
        border: "none",  
        padding: "10px 20px",  
        borderRadius: "5px",  
        cursor: "pointer",  
        margin: "10px",  
        fontSize: "16px",  
    });  
    retryButton.onclick = () => {  
        document.body.removeChild(resultBox);  
        resetQuiz();  
    };  
    resultBox.appendChild(retryButton);  

    // Кнопка возврата к списку тестов  
    const backButton = document.createElement("button");  
    backButton.textContent = "Вернуться к списку тестов";  
    Object.assign(backButton.style, {  
        backgroundColor: "#f44336",  
        color: "#fff",  
        border: "none",  
        padding: "10px 20px",  
        borderRadius: "5px",  
        cursor: "pointer",  
        margin: "10px",  
        fontSize: "16px",  
    });  
    backButton.onclick = () => {  
        document.body.removeChild(resultBox);  
        // Добавьте действие для возврата к списку тестов здесь  
        alert("Вы вернулись к списку тестов. (Здесь можно добавить логику для отображения списка.)");  
    };  
    resultBox.appendChild(backButton);  

    document.body.appendChild(resultBox);  
}  

// Функция сброса теста  
function resetQuiz() {  
    correctAnswers = 0;  
    incorrectAnswers = 0;  
    usedIndexes.length = 0; // Очищаем массив использованных индексов  
    correctCounter.textContent = "0";  
    incorrectCounter.textContent = "0";  
    loadQuiz();  
}  

// Инициализация теста  
loadQuiz();  

document.getElementById("quiz-form").onsubmit = function(e) {  
    e.preventDefault();  
    checkAnswer();  
};