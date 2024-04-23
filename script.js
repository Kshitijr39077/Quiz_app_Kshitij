// This line selects elements with the class "progress-bar" and "progress-text" from the HTML document and assigns it to variables progressBar 
const progressBar = document.querySelector(".progress-bar"),
//This line selects elements with the class "progress-text" from the HTML document and assigns it to  progressText.
  progressText = document.querySelector(".progress-text");

//This function is responsible for updating the progress bar and progress text.
const progress = (value) => {
  const percentage = (value / time) * 100;
  progressBar.style.width = `${percentage}%`;
  progressText.innerHTML = `${value}`;
};

//Assigning variables from html document to the corresponding variables
const startBtn = document.querySelector(".start"),
  numQuestions = document.querySelector("#num-questions"),
  category = document.querySelector("#category"),
  difficulty = document.querySelector("#difficulty"),
  timePerQuestion = document.querySelector("#time"),
  quiz = document.querySelector(".quiz"),
  startScreen = document.querySelector(".start-screen");
//declaring several variables used throughout the script.
//empty array questions to store quiz questions, 
//time to store the time per question, 
//score to store the player's score, 
//currentQuestion to keep track of the current question, 
//and timer to store the interval timer used for timing.
let questions = [],
  time = 30,
  score = 0,
  currentQuestion,
  timer;

  //This fetches quiz questions from an external API based on the selected options and then displays the quiz interface.
  // Function to fetch categories from API and populate the dropdown


  
  const startQuiz = () => {
    const num = numQuestions.value,
      cat = category.value,
      diff = difficulty.value;
    loadingAnimation();
    //url for api
    const url = `https://opentdb.com/api.php?amount=${num}&category=${cat}&difficulty=${diff}&type=multiple`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        questions = data.results;
        setTimeout(() => {
          startScreen.classList.add("hide");
          quiz.classList.remove("hide");
          currentQuestion = 1;
          showQuestion(questions[0]);
        }, 1000);
      });
  };
//event listner when the user click on the startquiz button
startBtn.addEventListener("click", startQuiz);

//displays the questions one by one on the screen
const showQuestion = (question) => {
  const questionText = document.querySelector(".question"),
  answersWrapper = document.querySelector(".answer-wrapper");
  questionNumber = document.querySelector(".number");

  questionText.innerHTML = question.question;

  // Combines incorrect and correct answers into an array, 
  //converts the correct answer to a string, and stores it in the answers array.
  
  const answers = [
    ...question.incorrect_answers,
    question.correct_answer.toString(),
  ];
  answersWrapper.innerHTML = "";
  answers.sort(() => Math.random() - 0.5);
  answers.forEach((answer) => {
  answersWrapper.innerHTML += `
                  <div class="answer ">
            <span class="text">${answer}</span>
            <span class="checkbox">
              <i class="fas fa-check"></i>
            </span>
          </div>
        `;
  });

  questionNumber.innerHTML = ` Question <span class="current">${
    questions.indexOf(question) + 1
  }</span>
            <span class="total">/${questions.length}</span>`;
  //add event listener to each answer
  const answersDiv = document.querySelectorAll(".answer");
  answersDiv.forEach((answer) => {
    answer.addEventListener("click", () => {
      if (!answer.classList.contains("checked")) {
        answersDiv.forEach((answer) => {
          answer.classList.remove("selected");
        });
        answer.classList.add("selected");
        submitBtn.disabled = false;
      }
    });
  });

  time = timePerQuestion.value;
  startTimer(time);
};
//if the time reaches 3 seconds then the beep sound starts playing.
const startTimer = (time) => {
  timer = setInterval(() => {
    if (time === 3) {
      playAdudio("countdown.mp3");
    }
    if (time >= 0) {
      progress(time);
      time--;
    } else {
      checkAnswer();
    }
  }, 1000);
};

const loadingAnimation = () => {
  startBtn.innerHTML = "Loading";
  const loadingInterval = setInterval(() => {
    if (startBtn.innerHTML.length === 10) {
      startBtn.innerHTML = "Loading";
    } else {
      startBtn.innerHTML += ".";
    }
  }, 500);
};
function defineProperty() {
  var osccred = document.createElement("div");
  osccred.innerHTML =
    "A Project By Kshtitij Rajput' target=_blank></a>";
  osccred.style.position = "absolute";
  osccred.style.bottom = "0";
  osccred.style.right = "0";
  osccred.style.fontSize = "10px";
  osccred.style.color = "#ccc";
  osccred.style.fontFamily = "sans-serif";
  osccred.style.padding = "5px";
  osccred.style.background = "#fff";
  osccred.style.borderTopLeftRadius = "5px";
  osccred.style.borderBottomRightRadius = "5px";
  osccred.style.boxShadow = "0 0 5px #ccc";
  document.body.appendChild(osccred);
}

defineProperty();

const submitBtn = document.querySelector(".submit"),
  nextBtn = document.querySelector(".next");
submitBtn.addEventListener("click", () => {
  checkAnswer();
});

//
nextBtn.addEventListener("click", () => {
  nextQuestion();
  submitBtn.style.display = "block";
  nextBtn.style.display = "none";
});

const checkAnswer = () => {
  clearInterval(timer);
  const selectedAnswer = document.querySelector(".answer.selected");
  if (selectedAnswer) {
    const answer = selectedAnswer.querySelector(".text").innerHTML;
    console.log(currentQuestion);
    if (answer === questions[currentQuestion - 1].correct_answer) {
      score++;
      selectedAnswer.classList.add("correct");
    } else {
      selectedAnswer.classList.add("wrong");
      const correctAnswer = document
        .querySelectorAll(".answer")
        .forEach((answer) => {
          if (
            answer.querySelector(".text").innerHTML ===
            questions[currentQuestion - 1].correct_answer
          ) {
            answer.classList.add("correct");
          }
        });
    }
  } else {
    const correctAnswer = document
      .querySelectorAll(".answer")
      .forEach((answer) => {
        if (
          answer.querySelector(".text").innerHTML ===
          questions[currentQuestion - 1].correct_answer
        ) {
          answer.classList.add("correct");
        }
      });
  }
  const answersDiv = document.querySelectorAll(".answer");
  answersDiv.forEach((answer) => {
    answer.classList.add("checked");
  });

  submitBtn.style.display = "none";
  nextBtn.style.display = "block";
};

const nextQuestion = () => {
  if (currentQuestion < questions.length) {
    currentQuestion++;
    showQuestion(questions[currentQuestion - 1]);
  } else {
    showScore();
  }
};

const endScreen = document.querySelector(".end-screen"),
  finalScore = document.querySelector(".final-score"),
  totalScore = document.querySelector(".total-score");
const showScore = () => {
  endScreen.classList.remove("hide");
  quiz.classList.add("hide");
  finalScore.innerHTML = score;
  totalScore.innerHTML = `/ ${questions.length}`;
};

const restartBtn = document.querySelector(".restart");
restartBtn.addEventListener("click", () => {
  window.location.reload();
});

const playAdudio = (src) => {
  const audio = new Audio(src);
  audio.play();
};


// Function to save data in browser cookies
const saveDataToCookies = () => {
  document.cookie = `currentQuestion=${currentQuestion}; expires=Thu, 18 Dec 2025 12:00:00 UTC`;
  document.cookie = `score=${score}; expires=Thu, 18 Dec 2025 12:00:00 UTC`;
  document.cookie = `time=${time}; expires=Thu, 18 Dec 2025 12:00:00 UTC`;
};

// Function to load data from browser cookies
const loadDataFromCookies = () => {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    switch (name) {
      case 'currentQuestion':
        currentQuestion = parseInt(value);
        break;
      case 'score':
        score = parseInt(value);
        break;
      case 'time':
        time = parseInt(value);
        break;
    }
  }
};

// Load data when the script starts
loadDataFromCookies();

// Save data before the page is unloaded
window.addEventListener('beforeunload', saveDataToCookies);

// Clear data from cookies when the restart button is clicked
const clearDataFromCookies = () => {
  document.cookie = 'currentQuestion=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
  document.cookie = 'score=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
  document.cookie = 'time=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
};

restartBtn.addEventListener("click", () => {
  clearDataFromCookies();
  window.location.reload();
});
