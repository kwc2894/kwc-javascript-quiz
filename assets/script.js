//Question bank to be referenced throughout the application
const questionList = [
    {
        question: "Commonly used data types DO NOT include:",
        possibleAns: ["a. strings","b. booleans","c. alerts","d. numbers"],
        rightAnsValue: "d. numbers"
    },
    {
        question: "The condition in an if / else statement is enclosed within ___.",
        possibleAns: ["a. quotes","b. curly brackets","c. parenthesis","d. square brackets"],
        rightAnsValue: "c. parenthesis"
    },
    {
        question: "Arrays in JavaScript can be used to store?",
        possibleAns: ["a. numbers and strings","b. other arrays","c. booleans","d. all of the above"],
        rightAnsValue: "d. all of the above"
    },
    {
        question: "String values must be enclosed within ____ when being assigned to variables",
        possibleAns: ["a. commas","b. curly brackets","c. quotes","d. parentheses"],
        rightAnsValue: "c. quotes"
    },
    {
        question: "A very useful tool used during development and debugging for printing content to the debugger is",
        possibleAns: ["a. Javascript","b. terminal/bash","c. for loops","d. console.log"],
        rightAnsValue: "d. console.log"
    }
];


// Elements for quiz
var timerEl = document.querySelector("#time");
var startEl = document.querySelector(".startclass");
var startButton = document.querySelector("#start");
var questEl = document.querySelector(".questionclass");
var answerButtons = document.querySelector(".buttons");
var questionEl = document.querySelector("#question");
var rightEl = document.querySelector("#right");
var wrongEl = document.querySelector("#wrong");
var lineEL = document.querySelector("#linebreak");
var cleartextEL = document.querySelector("#erased");
var errorEL = document.querySelector("#error");
var endEl = document.querySelector(".endclass");
var finalScoreEl = document.querySelector("#final-score");
var scoreFrm = document.querySelector("#score-form");
var initsInpt = document.querySelector("#inits");
var leaderLink = document.querySelector("#leaderboard");
var leaderBoard = document.querySelector(".leaderboard");
var scoresList = document.querySelector("#scores-list");
var clearLeaderboardBtn = document.querySelector("#clear");
var backLdrBtn = document.querySelector("#go-back");

//global variables
var scores = [];
var qIndex = 0;
const maxSeconds = 60;
var secondsLeft = maxSeconds;
var timerInterval;
var resultTimer; 


// Load any high scores from local Storage before beginning the quiz
loadScores();

//functions to hide and show elements and save the elements of interest as parameters
function hide(element) {
    element.setAttribute("style", "display: none;");
}
function show(element) {
    element.setAttribute("style", "display: block;");
}

// function to end the quiz and rally the score
function endQuiz() {
    clearInterval(timerInterval);
    timerEl.textContent = 0; 
    // if statement to make sure score is not a negative number
    if(secondsLeft < 0) {
        secondsLeft = 0;
    }
    finalScoreEl.textContent = secondsLeft;
    hide(questEl);
    show(endEl);
}

//starts the quiz and timer
startButton.addEventListener("click", function(){
    hide(startEl);
    displayQuestion();
    show(questEl);
    startTimer();
});

//function to count down the timer
function startTimer() {
    timerInterval = setInterval(function () {
        secondsLeft--; 
        timerEl.textContent = secondsLeft; 
        if(secondsLeft === 0) {
            clearInterval(timerInterval);
            endQuiz();
        }
    }, 1000)
}

// function to display the question and their possible answers
function displayQuestion() {
      var currQuestion = questionList[qIndex]; 
    questionEl.textContent = currQuestion.question; 
    var possibleAnswers = currQuestion.possibleAns;
    //answers to be looped through and displayed based on the current question
    for (var i = 0; i < possibleAnswers.length; i++) {
        answerButtons.children[i].textContent = possibleAnswers[i];
    }
 
}
  
// function to load the next question
function nextQuestion() {
    // conditional to check if there are more questions
    if(qIndex != questionList.length - 1) {
        qIndex++;
        displayQuestion();
    } else {
        setTimeout(function () {
            endQuiz();
        }, 500)

    }
}

// checks answer and displays right or wrong
function checkAnswer(answer) {
    //if conditional to check if the timer was right and displays a notification for a certain amount of time
    if(questionList[qIndex].rightAnsValue === answer) {
        hide(wrongEl);
        clearTimeout(resultTimer);
        rightEl.setAttribute("class", "right");
        rightEl.textContent = "Right!";
        show(lineEL);
        show(rightEl);
        resultTimer = setTimeout(function () {
            hide(lineEL);
            hide(rightEl);
        }, 1000);
    }
        //if conditional to check if the timer was wrong, subtracts from the timer/score and displays a notification for a certain amount of time 
    else {
        hide(rightEl);
        secondsLeft -= 10;
        clearTimeout(resultTimer);
        wrongEl.setAttribute("class", "wrong");
        wrongEl.textContent = "Wrong.";
        show(lineEL);
        show(wrongEl);
        resultTimer = setTimeout(function () {
            hide(lineEL);
            hide(wrongEl);
        }, 1000);
    }
    // calls nextQuestion to load the next question
    nextQuestion();
}

// Event listener for the four answer buttons - runs checkAnswer to check for right/wrong
answerButtons.addEventListener("click", function (event) {
    var element = event.target;
    //if conditional to check when a button has been clicked
    if(element.matches("button")) {
        checkAnswer(element.textContent);
    }
})

//function to compare scores for sorting in the array of scores
function compareScores(a, b) {
    return b.score - a.score;
}
//function to hide all elements and sorts the scores
function renderScores() {
    hide(questEl);
    hide(endEl);
    hide(startEl);
    scoresList.innerHTML = "";
    scores.sort(compareScores);
    // for loop to render scores on page in ordered lists
    for (var i = 0; i < scores.length; i++) {
        var li = document.createElement("li");
        li.textContent = `${scores[i].inits} - ${scores[i].score}`;
        scoresList.appendChild(li);
    }
    show(leaderBoard);
}

// updates localStorage with scores array
function storeScore() {
    localStorage.setItem("scores", JSON.stringify(scores));
}

// checks for scores in localStorage and loads them into the scores array
function loadScores() {
    var storedScores = JSON.parse(localStorage.getItem("scores"));
    if(storedScores) {
        scores = storedScores;
    }
}

//cleares the scores when erase button is clicked
clearLeaderboardBtn.addEventListener("click", function () {
    //if the scores length is 0, it returns a message that there is nothing to erase
    if(scores.length == 0)
    {
        renderScores();
        errorEL.setAttribute("class", "error");
        errorEL.textContent = "Error: nothing to erase";
        show(lineEL);
        show(errorEL);
        resultTimer = setTimeout(function () {
            hide(lineEL);
            hide(errorEL);
    }, 1000);
    }
    //else statement to clear the scores and indicate that it is complete
    else {
        localStorage.clear();
        scores = [];
        renderScores();
        cleartextEL.setAttribute("class", "erased");
        cleartextEL.textContent = "High Scores Erased";
        show(lineEL);
        show(cleartextEL);
        resultTimer = setTimeout(function () {
                hide(lineEL);
                hide(cleartextEL);
        }, 1000);
    }
})

// goes back to the starting part of the application and resets all variables
backLdrBtn.addEventListener("click", function () {
    clearInterval(timerInterval);
    qIndex = 0;
    secondsLeft = maxSeconds;
    timerEl.textContent = secondsLeft;
    hide(leaderBoard);
    show(startEl);
})

// method to add to the leaderboard and store it in localstorage
scoreFrm.addEventListener("submit", function (event) {
    event.preventDefault();
    var inits = initsInpt.value.trim();
    // conditional to make sure form is not blank
    if(inits == "") {
        return;
    }
    var initsScore = { inits: inits, score: secondsLeft };
    scores.push(initsScore);
    initsInpt.value = "";

    storeScore();
    renderScores();
})

// method to call when the user clicks on the top left to display the leaderboards
leaderLink.addEventListener("click", function () {
    clearInterval(timerInterval);
    renderScores();
})