const { app, BrowserWindow } = require('electron');
require('dotenv').config;

let mode = process.env.PRODUCTION_ENV;

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

app.on()