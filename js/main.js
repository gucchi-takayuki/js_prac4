'use strict'; {
  const title = document.getElementById('title');
  const info = document.getElementById('info');
  const genre = document.getElementById('genre');
  const difficulty = document.getElementById('difficulty');
  const question = document.getElementById('question');
  const start = document.getElementById('start');
  const replay = document.getElementById('replay');
  const choices = document.getElementById('choices');

  let score = 0;
  let currentNum = 0;

  info.style.display = 'none';
  replay.style.display = 'none';
  

  // 正誤判定＆得点機能
  const checkAnswer = (value, correctAnswer) => {
    if (value === correctAnswer) {
      score++;
      currentNum++;
    } else {
      currentNum++;
    }
  }

  // シャッフル機能
  const shuffle = arr => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[j], arr[i]] = [arr[i], arr[j]];
    }
    return arr;
  }

  // クイズセット機能
  const quizeSet = async (quizes) => {

    info.style.display = 'block';

    const quize = quizes[currentNum];
    const correctAnswer = quize.correct_answer;
    const incorrectAnswers = quize.incorrect_answers;

    // 問題を表示
    title.textContent = `問題${currentNum + 1}`;
    genre.textContent = quize.category;
    difficulty.textContent = quize.difficulty;
    question.textContent = quize.question;

    // 選択肢作成・表示
    setAnswers(quizes, correctAnswer, incorrectAnswers);
  }

  // 選択肢作成・表示機能
  const setAnswers = (quizes, correctAnswer, incorrectAnswers) => {
    const answers = [];

    answers.push(correctAnswer);
    incorrectAnswers.forEach(incorrectAnswer => {
      answers.push(incorrectAnswer);
    });

    const shuffledAnswers = shuffle(answers);

    // シャッフルされた選択肢を表示する
    shuffledAnswers.forEach(choice => {
      const li = document.createElement('li');
      choices.appendChild(li);

      const input = document.createElement('input');
      input.type = 'button';
      input.value = choice;

      li.appendChild(input);

      // 選択肢をクリックした時
      input.addEventListener('click', () => {
        // #choices内のliを空にする
        while (choices.firstChild) {
          choices.removeChild(choices.firstChild);
        }

        checkAnswer(input.value, correctAnswer);

        // 10問目が終わった後の処理
        if (currentNum > 9) {
          title.textContent = `あなたの正答数は${score}です！！`;
          question.textContent = '再度チャレンジしたい場合は以下をクリック！！';
          
          info.style.display = 'none';
          replay.style.display = 'block';

          return;

        } else {
          quizeSet(quizes);
        }

      });
    });
  }

  // 開始ボタン発火
  start.addEventListener('click', async () => {

    // 開始ボタンを押してから非同期処理が終了するまで、取得中画面を表示
    start.style.display = 'none';
    title.textContent = '取得中';
    question.textContent = '少々お待ちください';

    // 非同期処理により、クイズデータを取得する
    const res = await fetch('https://opentdb.com/api.php?amount=10&type=multiple');
    const contents = await res.json();
    const quizes = contents.results;

    quizeSet(quizes);
  });

  replay.addEventListener('click', () => {
    location.reload();
  });

}