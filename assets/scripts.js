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
const nextExamBtn = document.getElementById("next-exam");
const result = document.getElementById("result");
const scoreText = document.getElementById("score");
const clickPerExamsText = document.getElementById("click-per-exam");
const totalClickText = document.getElementById("total-click");
const intervalPerExamsText = document.getElementById("interval-per-exam");
const totalIntervalText = document.getElementById("total-interval");
const timerInterval = setInterval(startTimer, 1000);

let exams;
let answers = [];
let pattern;
let currentQuestion = 0;
let totalScore = 0;
let currentInterval = 0;
let totalInterval = 0;
let intervalPerExams = [];
let currentClick = 0;
let totalClick = 0;
let clickPerExams = [];
let savedAnswers = [];

async function fetchExams() {
	try {
		const examsResponse = await fetch("https://raw.githubusercontent.com/rasvanjaya21/aosys/master/assets/questions.json");
		const exam = await examsResponse.json();
		return exam;
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

async function renderExam() {
	exams = await fetchExams();
	answers = await fetchAnswers();
	pattern = await fetchpattern();
}

function startExam() {
	// reset current interval and click to value 0
	currentInterval = 0;
	currentClick = 0;
	
	// hide start exam button 
	startExamBtn.style.display = "none";
	
	// display timer label
	timerExam.style.display = "inline-block";
	minutesLabel.innerHTML = "00";
	secondsLabel.innerHTML = "00";
	
	// display question and answer
	formQuestion.style.display = "block";
	question.innerHTML = exams[currentQuestion].question;
	firstLabelOption.innerHTML = exams[currentQuestion].options[0];
	secondLabelOption.innerHTML = exams[currentQuestion].options[1];
	thirdLabelOption.innerHTML = exams[currentQuestion].options[2];
	fourthLabelOption.innerHTML = exams[currentQuestion].options[3];
	
	// display next exam button 
	nextExamBtn.style.display = "block";
}

function nextExam() {
	// next question
	currentQuestion++;

	// check question is done
	if(currentQuestion > exams.length - 1) {
		finishExam();
	} else {
		// save answer and reset previous answer, reset timer, start exam again when question is undone
		saveAnswer();
		resetPrevAnswer();
		startExam();
	}
}

function saveAnswer() {
	// get current checked answer
	const selectedAnswer = document.querySelector('input[name="options"]:checked');

	// save necessary
	intervalPerExams.push(currentInterval);
	clickPerExams.push(currentClick);
	totalInterval += currentInterval;
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

function finishExam() {
	// push necessary and validate score
	intervalPerExams.push(currentInterval);
	clickPerExams.push(currentClick);
	checkScore();

	// next button : diable and change value
	nextExamBtn.disabled = true;
	nextExamBtn.innerHTML = "Selesai";

	// display result area
	result.style.display = "block";
	scoreText.innerHTML = totalScore;
	clickPerExamsText.innerHTML = "[ " + clickPerExams + " ]";
	totalClickText.innerHTML = totalClick;
	intervalPerExamsText.innerHTML = "[ " + intervalPerExams + " ]";
	totalIntervalText.innerHTML = totalInterval;
	
	// stop timer
	stopTimer();
}

function startTimer() {
	currentInterval++;
	secondsLabel.innerHTML = pad(currentInterval % 60);
	minutesLabel.innerHTML = pad(parseInt(currentInterval / 60));
}

function stopTimer() {
	clearInterval(timerInterval);
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

renderExam();
startExamBtn.addEventListener("click", startExam);
formQuestion.addEventListener("change", clickedAnswer);
nextExamBtn.addEventListener("click", nextExam);