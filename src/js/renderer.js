const pretextElm = document.getElementById('pretext');
const nextElm = document.getElementById('next');
const questionElm = document.getElementById('question');
const optionsElm = document.getElementById('options');

nextElm.onclick = () => displayQuestion();

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
        DOM.onclick = () => this.click();

        optionsElm.appendChild(DOM);
    }
    async click() {
        console.log(this.id);
        let answer = answers[qIndex];
        optionsElm.children[this.id].style.backgroundColor = 'red';
        optionsElm.children[answer].style.backgroundColor = 'lime';

        // Wait a bit before load the next question
        await new Promise(res => setTimeout(() => res(), 1000));
        qIndex++;
        if (qIndex >= questions.length) return;
        displayPretext();
    }
}


// Init
var root = document.querySelector(':root');
var qIndex = 0;
var quiz;
var pretext = [];
var questions = [];
var options = [];
var answers = [];

// Start function
async function start() {
    quiz = await (await fetch('../json/quiz.json')).json();
    console.table(quiz);

    // Apply settings
    const settings = await (await fetch('../json/settings.json')).json();
    stngs.apply(root, settings);
    
    // Init
    pretext = quiz.PreText;
    questions = quiz.Questions;
    options = quiz.Options;
    answers = quiz.Answers;

    displayPretext();
}

// Display pretext in the dom
function displayPretext() {
    pretextElm.style.display = 'flex';
    nextElm.style.display = 'flex';
    questionElm.style.display = 'none';
    optionsElm.style.display = 'none';

    pretextElm.innerText = pretext[qIndex];
}

// Display question in the dom
function displayQuestion() {
    pretextElm.style.display = 'none';
    nextElm.style.display = 'none';
    questionElm.style.display = 'flex';
    optionsElm.style.display = 'flex';

    questionElm.innerText = questions[qIndex];

    // Add the option buttons
    optionsElm.innerHTML = '';
    options[qIndex].forEach((option, id) => {
        new Option(option, id);
    });
}

// Apply settings json
async function apply() {
    const settings = await (await fetch('../json/settings.json')).json();

    // Apply root
    root.style.setProperty('--bg', settings.root.bg);
    root.style.setProperty('--box', settings.root.box);
    root.style.setProperty('--btn', settings.root.btn);
    root.style.setProperty('--btnHighlight', settings.root.btnHighlight);
    root.style.setProperty('--roundness', settings.root.roundness);
}

ipcRenderer.on(
    'settings:apply',
    async (settings) => stngs.apply(root, settings)
)

window.onload = () => start();