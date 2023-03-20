const startExamBtn = document.getElementById("start-exam");
const timerExam = document.getElementById("timer-exam");
const minutesLabel = document.getElementById("minutes");
const secondsLabel = document.getElementById("seconds");
const formQuestion = document.getElementById("form-question");
const question = document.getElementById("question");
const firstLabelOption = document.getElementById("first-label-option");
const secondLabelOption = document.getElementById("second-label-option");
const thirdLabelOption = document.getElementById("third-label-option");
const fourthLabelOption = document.getElementById("fourth-label-option");
const nextQuestionBtn = document.getElementById("next-question");
const result = document.getElementById("result");
const scoreText = document.getElementById("score");
const clickPerQuestionsText = document.getElementById("click-per-question");
const totalClickText = document.getElementById("total-click");
const durationPerQuestionsText = document.getElementById("duration-per-question");
const totalDurationText = document.getElementById("total-duration");
const timerDuration = setInterval(startTimer, 1000);

let questions;
let answers = [];
let pattern;
let currentQuestion = 0;
let totalScore = 0;
let currentDuration = 0;
let totalDuration = 0;
let durationPerQuestions = [];
let currentClick = 0;
let totalClick = 0;
let clickPerQuestions = [];
let savedAnswers = [];

async function fetchQuestions() {
	try {
		const questionsResponse = await fetch("https://raw.githubusercontent.com/rasvanjaya21/aosys/master/assets/questions.json");
		const question = await questionsResponse.json();
		return question;
	} catch (error) {
		console.error(error);
	}
}

async function fetchAnswers() {
	try {
		const answersResponse = await fetch("https://raw.githubusercontent.com/rasvanjaya21/aosys/master/assets/answers.json");
		const answer = await answersResponse.json();
		return answer;
	} catch (error) {
		console.error(error);
	}
}

async function fetchpattern() {
	try {
		const patternResponse = await fetch("https://raw.githubusercontent.com/rasvanjaya21/aosys/master/assets/pattern.json");
		const pattern = await patternResponse.json();
		return pattern;
	} catch (error) {
		console.error(error);
	}
}

async function renderQuestion() {
	questions = await fetchQuestions();
	answers = await fetchAnswers();
	pattern = await fetchpattern();
}

function startQuestion() {
	// reset current duration and click to value 0
	currentDuration = 0;
	currentClick = 0;
	
	// hide start question button 
	startExamBtn.style.display = "none";
	
	// display timer label
	timerExam.style.display = "inline-block";
	minutesLabel.innerHTML = "00";
	secondsLabel.innerHTML = "00";
	
	// display question and answer
	formQuestion.style.display = "block";
	question.innerHTML = questions[currentQuestion].question;
	firstLabelOption.innerHTML = questions[currentQuestion].options[0];
	secondLabelOption.innerHTML = questions[currentQuestion].options[1];
	thirdLabelOption.innerHTML = questions[currentQuestion].options[2];
	fourthLabelOption.innerHTML = questions[currentQuestion].options[3];
	
	// display next question button 
	nextQuestionBtn.style.display = "block";
}

function nextQuestion() {
	// next question
	currentQuestion++;

	// check question is done
	if(currentQuestion > questions.length - 1) {
		finishQuestion();
	} else {
		// save answer and reset previous answer, reset timer, start question again when question is undone
		saveAnswer();
		resetPrevAnswer();
		startQuestion();
	}
}

function saveAnswer() {
	// get current checked answer
	const selectedAnswer = document.querySelector('input[name="options"]:checked');

	// save necessary
	durationPerQuestions.push(currentDuration);
	clickPerQuestions.push(currentClick);
	totalDuration += currentDuration;
	totalClick += currentClick;

	// checked answer validation
	if (selectedAnswer != null) {
		savedAnswers.push(selectedAnswer.getAttribute("data-id"));
	} else {
		savedAnswers.push("x");
	}
}

function resetPrevAnswer() {
	// get current checked answer
	const selectedAnswer = document.querySelector('input[name="options"]:checked');
	
	// reset answer radio checked
	if (selectedAnswer != null) {
		selectedAnswer.checked = false;
	}
}

function finishQuestion() {
	// push necessary and validate score
	durationPerQuestions.push(currentDuration);
	clickPerQuestions.push(currentClick);
	checkScore();

	// next button : diable and change value
	nextQuestionBtn.disabled = true;
	nextQuestionBtn.innerHTML = "Selesai";

	// display result area
	result.style.display = "block";
	scoreText.innerHTML = totalScore;
	clickPerQuestionsText.innerHTML = "[ " + clickPerQuestions + " ]";
	totalClickText.innerHTML = totalClick;
	durationPerQuestionsText.innerHTML = "[ " + durationPerQuestions + " ]";
	totalDurationText.innerHTML = totalDuration;
	
	// stop timer
	stopTimer();
}

function startTimer() {
	currentDuration++;
	secondsLabel.innerHTML = pad(currentDuration % 60);
	minutesLabel.innerHTML = pad(parseInt(currentDuration / 60));
}

function stopTimer() {
	clearInterval(timerDuration);
}

function pad(val) {
	return val > 9 ? val : "0" + val;
}

function checkScore() {
	for (i = 0; i < savedAnswers.length; i++) {
		answers[i] = CryptoJS.AES.decrypt(answers[i], pattern).toString(CryptoJS.enc.Utf8);
		if (savedAnswers[i] == answers[i]) {
			totalScore += 20;
		}
	}
}

function clickedAnswer() {
	currentClick++;
}

renderQuestion();
startExamBtn.addEventListener("click", startQuestion);
formQuestion.addEventListener("change", clickedAnswer);
nextQuestionBtn.addEventListener("click", nextQuestion);