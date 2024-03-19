const { app, BrowserWindow } = require('electron');
const path = require('path');

const isDev = process.env.NODE_ENV !== 'production';
const isMac = process.platform === 'darwin';

// Create the main application window
function createWindow() {
    const win = new BrowserWindow({
        width: isDev ? 800 : 400,
        height: 700,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
    });

    // Open dev tools if in dev env
    if (isDev) {
        win.webContents.openDevTools();
    }
  
    win.loadFile(path.join(__dirname, 'src/html/index.html'));
}

app.whenReady().then(() => {
    createWindow()
    
    // Open a window if none are open (macOS)
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
})

// Close the app when all windows are closed (not macOs)
app.on('window-all-closed', () => {
    if (!isMac) app.quit();
});