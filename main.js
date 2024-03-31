// DOM
const DOM = new Map()
    .set('start', document.getElementById('start'))
    .set('pre', document.getElementById('pre'))
    .set('quiz', document.getElementById('quiz'))
    .set('end', document.getElementById('end'));

// Init
var quiz;

async function start() {
    quiz = await (await fetch('./quiz.json')).json();
    console.log(quiz);

    display('end');
}

async function load() {

}

function display(state) {
    for(const key of DOM.keys()) {
        if (key === state) DOM.get(key).style.display = 'flex';
        else DOM.get(key).style.display = 'none';
    }

    switch(state) {
        case 'start':
            
        break;
    }
}

onload = start;