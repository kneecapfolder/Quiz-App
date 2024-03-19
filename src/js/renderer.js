const questionElm = document.getElementById('question');

var quiz;

// Start function
async function start() {
    quiz = await (await fetch('../quiz.json')).json();
    
    console.log(quiz);

}

window.onload = () => start();