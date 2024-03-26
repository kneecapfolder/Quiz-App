const startMenuElm = document.getElementById('start');
const pretextElm = document.getElementById('pretext');
const nextElm = document.getElementById('next');
const questionElm = document.getElementById('question');
const optionsElm = document.getElementById('options');
const endMenuElm = document.getElementById('end');

const startTxt = startMenuElm.children[0];
const startBtn = startMenuElm.children[1];
const quitBtn = startMenuElm.children[2];
const endTxt = endMenuElm.children[0];
const endBtn = endMenuElm.children[1];

startBtn.onclick = () => displayPretext();
quitBtn.onclick = () => window.close();
nextElm.onclick = () => displayQuestion();
console.log(endBtn);
endBtn.onclick = () => displayStartMenu();

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
        if (!interact) return;
        interact = false;
        console.log(answers);
        let answer = answers[qIndex];
        console.log(this.id, answer);
        optionsElm.children[this.id].style.backgroundColor = '#ff6969';
        optionsElm.children[answer-1].style.backgroundColor = '#69ff8f';
        if (this.id === answer-1) correct++;

        // Wait a bit before load the next question
        await new Promise(res => setTimeout(() => res(), 1000));
        qIndex++;
        if (qIndex >= questions.length) displayEndScreen();
        else displayPretext();
    }
}


// Init
var interact = true;
var correct = 0;
var root = document.querySelector(':root');
var qIndex = 0;
var quiz;
var startText;
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
    startText = quiz.startMenu;
    pretext = quiz.PreText;
    questions = quiz.Questions;
    options = quiz.Options;
    answers = quiz.Answers;

    displayStartMenu();
}

// Start screen
function displayStartMenu() {
    qIndex = 0;
    correct = 0;
    endMenuElm.style.display = 'none';
    pretextElm.style.display = 'none';
    nextElm.style.display = 'none';
    questionElm.style.display = 'none';
    optionsElm.style.display = 'none';
    startMenuElm.style.display = 'flex';

    startTxt.innerText = startText;
}

// Display pretext in the dom
function displayPretext() {
    interact = true;
    startMenuElm.style.display = 'none';
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

function displayEndScreen() {
    startMenuElm.style.display = 'none';
    questionElm.style.display = 'none';
    optionsElm.style.display = 'none';
    endMenuElm.style.display = 'flex';

    endTxt.innerText = `you got ${correct}/${questions.length} questions right`;
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