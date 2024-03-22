const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

const isDev = process.env.NODE_ENV !== 'production';
const isMac = process.platform === 'darwin';

let win;

// Pass to renderer.js
ipcMain.on(
    'settings:save',
    (e, settings) => {
        try {
            fs.writeFile(path.join(__dirname, 'src/json/settings.json'), settings, (error) => {
                if (error) {
                  console.error(error);
                  throw error;
                }
            });
            win.webContents.send('settings:apply', JSON.parse(settings));
        }
        catch(err) {
            console.log(err);
            console.log(settings);
        }
    }
)

// create main menu
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
    win = new BrowserWindow({
        title: 'Quiz',
        width: isDev ? 800 : 400,
        height: 700,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
        resizable: false,
        alwaysOnTop: true,
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
        height: 500,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
        resizable: false,
        autoHideMenuBar: true,
        alwaysOnTop: true,
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
    
    // Remove win from memory on app close
    mainMenu.on('closed', () => (win = null));
    
    // Open a window if none are open (macOS)
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
})

// Close the app when all windows are closed (not macOs)
app.on('window-all-closed', () => {
    if (!isMac) app.quit();
});