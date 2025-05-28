const TOPIC_TITLES = {
  linear:          'Лінійні рівняння',
  quadratic:       'Квадратні рівняння',
  real:            'Дійсні числа',
  ratio:           'Відношення та пропорції',
  exponential:     'Показникова функція',
  logarithmic:     'Логарифмічна функція',
  trigonometric:   'Тригонометричні функції',
  inequalities:    'Нерівності',
  functions:       'Функції',
  derivative:      'Похідна',
  combinatorics:   'Комбінаторика',
  probability:     'Теорія ймовірності',
  figurs:         'Елементарні геометричні фігури',
  triangles:       'Трикутники',
  circle:          'Коло і круг',
  quadrilaterals:  'Чотирикутники',
  polygons:        'Многокутники',
  vectors:         'Вектори',
  stereometry:     'Основи стереометрії',
  polyhedra:       'Многограники',
  Solids:          'Тіла обертання'
};
document.addEventListener("DOMContentLoaded", () => {
  const topic = document.body.dataset.topic;
  if (!topic) return;
  const container = document.getElementById("quiz-container");
  let quizData = [], currentIndex = 0, score = 0;

  // 1️⃣ Вступний екран
  function showIntro() {
    const title = TOPIC_TITLES[topic] || topic;
    container.innerHTML = `
    <div class="quiz-intro">
      <h1>Тест: ${title}</h1>
      <button id="start-btn">Розпочати тест</button>
    </div>
  `;
    document.getElementById("start-btn")
        .addEventListener("click", loadQuestions);
  }

  // 2️⃣ Завантажуємо JSON
  function loadQuestions() {
    fetch(`questions/${topic}.json`)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then(data => {
          quizData = data;
          currentIndex = 0;
          score = 0;
          renderQuestion();
        })
        .catch(err => {
          container.textContent = `Помилка завантаження питань: ${err.message}`;
        });
  }

  // 3️⃣ Малюємо питання + опції + кнопку Далі (спочатку заблокована)
  function renderQuestion() {
    const q = quizData[currentIndex];
    container.innerHTML = `
      <div class="question-block">
        <p>${currentIndex+1}. ${q.question}</p>
        <ul>
          ${q.options.map((opt,i)=>`
            <li>
              <input type="radio" id="opt${i}" name="answer" value="${i}">
              <label for="opt${i}">${opt.text}</label>
            </li>
          `).join("")}
        </ul>
      </div>
      <button id="next-btn" disabled>
        ${currentIndex < quizData.length-1 ? "Далі" : "Показати результат"}
      </button>
    `;
    // прив'язуємо вибір відповіді
    container.querySelectorAll('input[name="answer"]')
        .forEach(input => input.addEventListener("change", onAnswer));
    document.getElementById("next-btn")
        .addEventListener("click", onNext);
  }

  // 4️⃣ Обробка вибору: показуємо фідбек, лічимо бали, розблоковуємо Далі
  function onAnswer(e) {
    const selected = parseInt(e.target.value);
    const isCorrect = quizData[currentIndex].options[selected].correct;
    if (isCorrect) score++;
    const fb = document.createElement("div");
    fb.className = `feedback ${isCorrect?"correct":"wrong"}`;
    fb.textContent = isCorrect ? "Правильно!" : "Неправильно!";
    container.append(fb);
    // забороняємо змінювати вибір
    container.querySelectorAll('input[name="answer"]')
        .forEach(i => i.disabled = true);
    document.getElementById("next-btn").disabled = false;
  }

  // 5️⃣ Переходимо до наступного або показуємо результат
  function onNext() {
    currentIndex++;
    if (currentIndex < quizData.length) {
      renderQuestion();
    } else {
      showResult();
    }
  }

  // 6️⃣ Підсумковий екран
  function showResult() {
    container.innerHTML = `
      <div class="quiz-result">
        <h2>Тест завершено!</h2>
        <p>Ваш результат: <strong>${score}</strong> з ${quizData.length}</p>
      </div>
    `;
  }

  // Утиліта для гарного заголовка
  function formatTitle(key) {
    return key
        .split(/[-_]/)
        .map(w => w[0].toUpperCase() + w.slice(1))
        .join(" ");
  }

  showIntro();
});
