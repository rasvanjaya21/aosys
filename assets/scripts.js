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
const timerInterval = setInterval(startTimer, 1000);
const resultArea = document.getElementById("result");
const scoreText = document.getElementById("score");
const clickPerExamsText = document.getElementById("click-per-exam");
const totalClickText = document.getElementById("total-click");
const intervalPerExamsText = document.getElementById("interval-per-exam");
const totalIntervalText = document.getElementById("total-interval");

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
	currentInterval = 0;
	startExamBtn.disabled = true;
	startExamBtn.style.display = "none";
	secondsLabel.innerHTML = "00";
	minutesLabel.innerHTML = "00";
	question.innerHTML = exams[currentQuestion].question;
	firstLabelOption.innerHTML = exams[currentQuestion].options[0];
	secondLabelOption.innerHTML = exams[currentQuestion].options[1];
	thirdLabelOption.innerHTML = exams[currentQuestion].options[2];
	fourthLabelOption.innerHTML = exams[currentQuestion].options[3];
	timerExam.style.display = "inline-block";
	formQuestion.style.display = "block";
	nextExamBtn.style.display = "block";
}

function nextExam() {
	currentQuestion++;
	saveAnswer();

	if(currentQuestion > exams.length -1) {
		finishExam();
	} else {
		intervalPerExams.push(currentInterval);
		totalInterval += currentInterval;
		resetTimer();
		resetPrevAnswer();
		startExam();
	}
}

function saveAnswer() {
	const selectedAnswer = document.querySelector('input[name="options"]:checked');

	if (selectedAnswer != null) {
		savedAnswers.push(selectedAnswer.getAttribute("data-id"));
	} else {
		savedAnswers.push("x");
	}
}

function resetPrevAnswer() {
	const selectedAnswer = document.querySelector('input[name="options"]:checked');

	if (selectedAnswer != null) {
		selectedAnswer.checked = false;
	}
}

function finishExam() {
	startExamBtn.innerHTML = "Ujian Telah Selesai";
	nextExamBtn.disabled = true;
	nextExamBtn.innerHTML = "Selesai";
	resultArea.style.display = "block";
	intervalPerExams.push(currentInterval);
	console.log(intervalPerExams);
	checkScore();
	scoreText.innerHTML = totalScore;
	clickPerExamsText.innerHTML = "[ " + clickPerExams + " ]";
	totalClickText.innerHTML = totalClick;
	intervalPerExamsText.innerHTML = "[ " + intervalPerExams + " ]";
	totalIntervalText.innerHTML = totalInterval;
	stopTimer();
}

function startTimer() {
	++currentInterval;
	secondsLabel.innerHTML = pad(currentInterval % 60);
	minutesLabel.innerHTML = pad(parseInt(currentInterval / 60));
}

function resetTimer() {
	currentInterval = 0;
	document.getElementById("minutes").innerHTML = "00";
	document.getElementById("seconds").innerHTML = "00";
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

function handleClick() {
	console.log("HEY");
}

renderExam();
startExamBtn.addEventListener("click", startExam);
formQuestion.addEventListener("change", handleClick);
nextExamBtn.addEventListener("click", nextExam);