class Option {
    constructor(value, id) {
        this.value = value;
        this.id = id;
        this.optElm;

        this.add();
    }

    add() {
        this.optElm = document.createElement('div');
        this.optElm.className = 'option';
        this.optElm.innerText = this.value;
        this.optElm.onclick = () => this.click();

        DOM.get('quiz').children[1].appendChild(this.optElm);
    }

    async click() {
        if (!interactable) return;
        interactable = false;

        // Reveal the correct answer
        this.optElm.classList.add('revealed');
        let correct = DOM.get('quiz').children[1].children[answers[qIndex]-1];
        correct.classList.add('revealed');
        correct.style.backgroundColor = 'lightgreen';

        // Wait for a bit before load the next question
        await new Promise(res => setTimeout(res, 1000));
        if (this.id !== answers[qIndex]-1) {
            display('start');
            return;
        }
        qIndex++;
        if (qIndex >= questions.length) display('end');
        else display('pre');
    }
}

// DOM
const DOM = new Map()
    .set('start', document.getElementById('start'))
    .set('pre', document.getElementById('pre'))
    .set('quiz', document.getElementById('quiz'))
    .set('end', document.getElementById('end'));

const fileInput = document.getElementById('file');

fileInput.onchange = async () => {
    // Parse the input file to an Object
    let reader = new FileReader();
    reader.readAsText(fileInput.files[0]);
    reader.onload = async (e) => {
        quiz = await JSON.parse(e.target.result);
        load();
    };
}

// Init
var quiz;
var preText;
var questions;
var options;
var answers;
var qIndex = 0;
var interactable = true;

async function start() {
    quiz = await (await fetch('./quiz-template.json')).json();
    
    load();
}

function load() {
    // Load data
    preText = quiz.preText;
    questions = quiz.questions;
    options = quiz.options;
    answers = quiz.answers;

    display('start');
}

function display(state) {
    for(const key of DOM.keys()) {
        if (key === state) DOM.get(key).style.display = 'flex';
        else DOM.get(key).style.display = 'none';
    }

    let elm = DOM.get(state);

    switch(state) {
        case 'start':
            elm.children[0].innerText = quiz.title;
            elm.children[1].innerText = quiz.startPre;
            elm.children[4].innerText = fileInput.files.length ? fileInput.files[0].name : 'no file selected';
            elm.children[8].innerText = quiz.credit;

            qIndex = 0;
            interactable = true;
        break;
        case 'pre':
            elm.children[0].innerText = preText[qIndex];

            interactable = true;
        break;
        case 'quiz':
            elm.children[0].innerText = questions[qIndex];
            elm.children[1].innerHTML = '';
            options[qIndex].forEach((value, id) => new Option(value, id));
        break;
    }
}

onload = start;