const questionElm = document.getElementById('question');
const optionsElm = document.getElementById('options');

class Option {
    constructor(value, id) {
        this.id = id;
        this.value = value;
        this.createDOM();
    }
    createDOM() {
        let DOM = document.createElement('button');
        DOM.classList.add('optionBtn');
        DOM.innerText = this.value;

        optionsElm.appendChild(DOM);
    }
}

// Init
var qIndex = 0;
var quiz;
var questions = [];
var options = [];
var answers = [];


// Start function
async function start() {
    quiz = await (await fetch('../json/quiz.json')).json();
    console.table(quiz);
    
    // Init
    questions = quiz.Questions;
    options = quiz.Options;
    answers = quiz.Answers;

    displayQuestion();
}

function displayQuestion() {
    questionElm.innerText = questions[qIndex];

    options[qIndex].forEach((option, id) => {
        new Option(option, id);
    });
}

window.onload = () => start();