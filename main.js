const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

const isDev = process.env.NODE_ENV !== 'production';
const isMac = process.platform === 'darwin';

// create window menus
const menu = [
    {
        role: 'fileMenu',
    },
    {
        label: 'settings',
        click: () => settingsWindow(),
    }
]

// Create the main application window
function createWindow() {
    const win = new BrowserWindow({
        title: 'Quiz',
        width: isDev ? 800 : 400,
        height: 700,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
        resizable: false,
    });

    // Open dev tools if in dev env
    if (isDev) {
        win.webContents.openDevTools();
    }
  
    win.loadFile(path.join(__dirname, 'src/html/index.html'));
}

// Create a seperate window for settings
function settingsWindow() {
    const settingsWin = new BrowserWindow({
        title: 'Quiz',
        width: isDev ? 800 : 400,
        height: 700,
        resizable: false,
    });

    // Open dev
    if (isDev) {
        settingsWin.webContents.openDevTools();
    }

    settingsWin.loadFile(path.join(__dirname, 'src/html/settings.html'));
}

app.whenReady().then(() => {
    createWindow()

    // Apply menu
    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);
    
    // Open a window if none are open (macOS)
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
})

// Close the app when all windows are closed (not macOs)
app.on('window-all-closed', () => {
    if (!isMac) app.quit();
});