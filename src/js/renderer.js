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
        DOM.onclick = () => this.click();

        optionsElm.appendChild(DOM);
    }
    click() {
        console.log(this.id);
    }
}


// Init
var root = document.querySelector(':root');
var qIndex = 0;
var quiz;
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