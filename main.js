const {app, BrowserWindow, Menu, dialog, ipcMain} = require('electron');
const path = require('path');
const fs = require('fs');

//ipcMain
//dialog

function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    //  enableRemoteModule: true,
    }
  });

  // Load the index.html file
  win.loadFile('index.html');


  win.on('closed', () => {
    app.quit();
  });

  win.webContents.openDevTools();
}

ipcMain.on("show-context-menu", (event) => {
  const menu = Menu.buildFromTemplate([
    { label: "Rename", click: () => console.log("Option 1 clicked") },
    { label: "Color", click: () => console.log("Option 2 clicked") },
    { type: "separator" },
    { label: "Exit", role: "quit" }
  ]);

  menu.popup({ window: BrowserWindow.getFocusedWindow() });
});

// When the app is ready, create the window
app.whenReady().then(() => {
  createWindow();

  // On macOS, re-create the window when clicking the app's icon in the dock
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  const menu = Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        {
          label: 'Save',
          click: () => {
            saveFile();
          },
        },
        {
          label: 'Load',
          click: () => {
            loadFile();
          },
        },
      ],
    },
  ]);

  Menu.setApplicationMenu(menu);
});

// Quit the app when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Save function
function saveFile() {
  dialog.showSaveDialog(win, {
    title: 'Save File',
    defaultPath: 'data.json',
    filters: [{ name: 'JSON Files', extensions: ['json'] }],
  }).then((file) => {
    if (!file.canceled) {
      win.webContents.send('request-data'); // Ask renderer process for data
      // Listen for data from renderer
      const { ipcMain } = require('electron');
      ipcMain.once('send-data', (event, data) => {
        fs.writeFileSync(file.filePath.toString(), JSON.stringify(data, null, 2));
      });
    }
  });
}

// Load function
function loadFile() {
  dialog.showOpenDialog(win, {
    title: 'Load File',
    filters: [{ name: 'JSON Files', extensions: ['json'] }],
  }).then((file) => {
    if (!file.canceled) {
      const data = JSON.parse(fs.readFileSync(file.filePaths[0]));
      win.webContents.send('load-data', data); // Send data to renderer
    }
  });
}
