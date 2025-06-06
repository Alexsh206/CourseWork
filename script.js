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
  figurs:          'Елементарні геометричні фігури',
  triangles:       'Трикутники',
  circle:          'Коло і круг',
  quadrilaterals:  'Чотирикутники',
  polygons:        'Многокутники',
  vectors:         'Вектори',
  stereometry:     'Основи стереометрії',
  polyhedra:       'Многограники',
  solids:          'Тіла обертання'
};

document.addEventListener("DOMContentLoaded", () => {
  const topic = document.body.dataset.topic;
  if (!topic) return;

  const container = document.getElementById("quiz-container");
  let quizData = [];
  let currentIndex = 0;
  let score = 0;


  function showIntro() {
    const title = TOPIC_TITLES[topic] || formatTitle(topic);
    container.innerHTML = `
      <div class="quiz-intro">
        <h1>Тест: ${title}</h1>
        <button id="start-btn">Розпочати тест</button>
      </div>
    `;
    document.getElementById("start-btn")
        .addEventListener("click", loadQuestions);
  }

  // ————— 2. Завантаження JSON —————
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
          container.innerHTML = `<p class="error">Помилка завантаження: ${err.message}</p>`;
        });
  }

  function renderQuestion() {
    const q = quizData[currentIndex];
    container.innerHTML = `
      <div class="question-block">
        <p class="question-text">${currentIndex+1}. ${q.question}</p>
        <div class="options">
          ${q.options.map((opt,i) => {
      
      const label = typeof opt === 'string'
          ? opt
          : (opt.text ?? opt.value ?? '');
      return `<button class="option-btn" data-index="${i}">${label}</button>`;
    }).join('')}
        </div>
        <button id="next-btn" disabled>Далі</button>
        <div id="feedback"></div>
      </div>
    `;

    container.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', onAnswer);
    });

    const nextBtn = container.querySelector('#next-btn');
    nextBtn.disabled = true;
    nextBtn.addEventListener('click', onNext);
  }

  function onAnswer(e) {
    const buttons = container.querySelectorAll('.option-btn');
    const sel = +e.currentTarget.dataset.index;
    const q = quizData[currentIndex];
    const isCorrect = !!q.options[sel].correct;

    if (isCorrect) score++;


    buttons.forEach(b => b.disabled = true);


    e.currentTarget.classList.add(isCorrect ? 'correct-option' : 'wrong-option');

    if (!isCorrect) {
      const good = q.options.findIndex(o => o.correct);
      const goodBtn = container.querySelector(`.option-btn[data-index="${good}"]`);
      if (goodBtn) goodBtn.classList.add('correct-option');
    }


    const fb = document.getElementById('feedback');
    fb.textContent = isCorrect ? 'Правильно!' : 'Неправильно!';
    fb.classList.add(isCorrect ? 'feedback-correct' : 'feedback-wrong');

    document.getElementById('next-btn').disabled = false;
  }

  function onNext() {
    console.log('onNext fired:', currentIndex, 'of', quizData.length);
    currentIndex++;
    if (currentIndex < quizData.length) {
      renderQuestion();
    } else {
      showResult();
    }
  }

  function showResult() {
    container.innerHTML = `
      <div class="quiz-result">
        <h2>Тест завершено!</h2>
        <p>Ваш результат: <strong>${score}</strong> з ${quizData.length}</p>
      </div>
    `;
  }


  function formatTitle(key) {
    return key
        .split(/[-_]/)
        .map(w => w[0].toUpperCase()+w.slice(1))
        .join(' ');
  }

  // стартуємо
  showIntro();
});
