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

async function start() {
    quiz = await (await fetch('./quiz.json')).json();
    
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
        break;
    }
}

onload = start;