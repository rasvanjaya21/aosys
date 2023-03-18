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

var exams;
var answers;
var patterns;

let totalSeconds = 0;
let currentQuestion = 0;
let savedAnswer = []
let totalScores = 0;

setInterval(startTimer, 1000);

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

async function fetchPatterns() {
	try {
		const patternsResponse = await fetch("https://raw.githubusercontent.com/rasvanjaya21/aosys/master/assets/patterns.json");
		const patterns = await patternsResponse.json();
		return patterns;
	} catch (error) {
		console.error(error);
	}
}

async function renderExam() {
	exams = await fetchExams();
	answers = await fetchAnswers();
	patterns = await fetchPatterns();
}

function startExam() {
	totalSeconds = 0;
	startExamBtn.disabled = true;
	startExamBtn.innerHTML = "Ujian Sedang Berlangsung"
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
		finishExam()
	} else {
		resetTimer();
		resetPrevAnswer()
		startExam();
	}
}

function saveAnswer() {
	const selectedAnswer = document.querySelector('input[name="options"]:checked');
	if (selectedAnswer != null) {
		savedAnswer.push(selectedAnswer.getAttribute("data-id"));
	} else {
		console.log("HEY")
	}
}

function resetPrevAnswer() {
	const selectedAnswer = document.querySelector('input[name="options"]:checked');
	if (selectedAnswer != null) {
		selectedAnswer.checked = false;
	}
}

function finishExam() {
	checkScore()
	alert("UJIAN SELESAI, SCORE : " + totalScores)
	return
}

function startTimer() {
	++totalSeconds;
	secondsLabel.innerHTML = pad(totalSeconds % 60);
	minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}

function resetTimer() {
	document.getElementById("minutes").innerHTML = "00";
	document.getElementById("seconds").innerHTML = "00";
	totalSeconds = 0;
}

function pad(val) {
	return val > 9 ? val : "0" + val;
}

function checkScore () {

	var decryptedAnswers = CryptoJS.AES.decrypt(answers, patterns);
	console.log(decryptedAnswers.toString(CryptoJS.enc.Utf8));

	for (i = 0; i < savedAnswer.length; i++) {
		if (savedAnswer[i] == answers[i]) {
			totalScores += 20;
			// console.log(totalScores);
		}
	}
}

renderExam();
startExamBtn.addEventListener("click", startExam);
nextExamBtn.addEventListener("click", nextExam);