// Electron Code
const { app, BrowserWindow } = require('electron');
require('dotenv').config();

let mode = process.env.PRODUCTION_ENV == "dev" ? true : false;
function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            devTools: mode
        }
    });

    win.loadFile('index.html');
}

app.whenReady().then(createWindow, _ => console.log("Error, \"whenReady\" promise not returned"));

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

