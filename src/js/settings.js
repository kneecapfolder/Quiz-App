const closeElm = document.getElementById('close');
const resetElm = document.getElementById('reset');
const form = document.forms[0];
var root = document.querySelector(':root');
var settings;

closeElm.onclick = () => window.close();

resetElm.onclick = async () => {
    // Load default settings
    settings.root.bg = settings.root.default[0];
    settings.root.box = settings.root.default[1];
    settings.root.btn = settings.root.default[2];
    settings.root.btnHighlight = settings.root.default[3];
    loadValues();
    stngs.apply(root, settings);
    stngs.save(settings);
}

async function start() {
    settings = await(await fetch('../json/settings.json')).json();
    console.table(settings);

    loadValues();
    stngs.apply(root, settings);
}

function loadValues() {
    form.elements['bg'].value = settings.root.bg;
    form.elements['box'].value = settings.root.box;
    form.elements['btn'].value = settings.root.btn;
    form.elements['btnHighlight'].value = settings.root.btnHighlight;
}

form.onsubmit = async (e) => {
    e.preventDefault();
    settings.root.bg = form.elements['bg'].value;
    settings.root.box = form.elements['box'].value;
    settings.root.btn = form.elements['btn'].value;
    settings.root.btnHighlight = form.elements['btnHighlight'].value;
    
    stngs.save(settings);
    stngs.apply(root, settings);
}

window.onload = () => start();