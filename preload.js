const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('ipcRenderer', {
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, func) =>
        ipcRenderer.on(channel, (event, ...args) => func(...args)),
});

contextBridge.exposeInMainWorld('stngs', {
    save: (settings) => {
        ipcRenderer.send('settings:save', JSON.stringify(settings));
    },
    apply: (root, settings) => {
        // Apply root
        root.style.setProperty('--bg', settings.root.bg);
        root.style.setProperty('--box', settings.root.box);
        root.style.setProperty('--btn', settings.root.btn);
        root.style.setProperty('--btnHighlight', settings.root.btnHighlight);
        root.style.setProperty('--roundness', settings.root.roundness);
    },
});