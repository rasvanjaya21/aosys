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
var totalSeconds = 0;
var datas;

async function fetchExam(question) {
	try {
		const response = await fetch("https://raw.githubusercontent.com/rasvanjaya21/aosys/master/assets/data.json");
		const exam = await response.json();
		return exam;
	} catch (error) {
		console.error(error);
	}
}

async function renderExam() {
	datas = await fetchExam();
}

function startExam() {
	startExamBtn.disabled = true;
	startExamBtn.innerHTML = "Ujian Sedang Berlangsung"
	secondsLabel.innerHTML = "00";
	minutesLabel.innerHTML = "00";
	question.innerHTML = datas.q1.question;
	firstLabelOption.innerHTML = datas.q1.options[0];
	secondLabelOption.innerHTML = datas.q1.options[1];
	thirdLabelOption.innerHTML = datas.q1.options[2];
	fourthLabelOption.innerHTML = datas.q1.options[3];
	timerExam.style.display = "inline-block";
	formQuestion.style.display = "block";
	nextExamBtn.style.display = "block";
	setInterval(startTimer, 1000);
}

function nextExam() {
	clearTimer()
}

function startTimer() {
	++totalSeconds;
	secondsLabel.innerHTML = pad(totalSeconds % 60);
	minutesLabel.innerHTML = pad(parseInt(totalSeconds / 60));
}

function clearTimer() {
	secondsLabel.innerHTML = "00";
	minutesLabel.innerHTML = "00";
	totalSeconds = 0;
}

function pad(val) {
	return val > 9 ? val : "0" + val;
}

renderExam();
startExamBtn.addEventListener("click", startExam);
nextExamBtn.addEventListener("click", nextExam);