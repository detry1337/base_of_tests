// Данные о странах из вкладки "Информация о странах"
const countries = [
  { country: "Россия", flag: "img/russia.png" },
  { country: "США", flag: "img/usa.png" },
  { country: "Франция", flag: "img/france.webp" },
  { country: "Италия", flag: "img/italy.png" },
  { country: "Германия", flag: "img/germany.webp" },
  { country: "Япония", flag: "img/japan.svg" },
  { country: "Китай", flag: "img/china.webp" },
  { country: "Бразилия", flag: "img/brazil.png" },
  { country: "Испания", flag: "img/spain.png" },
  { country: "Канада", flag: "img/canada.png" },
  { country: "Индия", flag: "img/india.png" },
  { country: "Швейцария", flag: "img/switzerland.png" }, // Новая страна
  { country: "Австралия", flag: "img/australia.png" }, // Новая страна
  { country: "Мексика", flag: "img/mexico.png" }, // Новая страна
  { country: "Египет", flag: "img/egypt.png" } // Новая страна
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
  const options = shuffle([
    correctCountry,
    ...shuffle(otherCountries).slice(0, 2),
  ]);

  // Устанавливаем флаг
  document.getElementById("flag").src = correctCountry.flag;

  // Устанавливаем текст и значения вариантов ответов
  const answers = document.querySelectorAll("#quiz-form div");
  answers.forEach((div, i) => {
    const radio = div.querySelector("input");
    const label = div.querySelector("label");
    radio.value = options[i].country;
    radio.checked = false; // Сброс выбора
    label.textContent = options[i].country;
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
  const correctAnswer = countries[currentIndex].country;

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
  resultBox.textContent = resultMessage;
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

  document.body.appendChild(resultBox);
}

// Инициализация теста
loadQuiz();
