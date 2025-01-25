const {app, BrowserWindow} = require('electron');
const path = require('path');
const fs = require('fs');

//ipcMain
//dialog

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
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

// When the app is ready, create the window
app.whenReady().then(() => {
  createWindow();

  // On macOS, re-create the window when clicking the app's icon in the dock
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit the app when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/*

ipcMain.handle('saveGraph', async (event, graphData) => {
  const { filePath } = await dialog.showSaveDialog({
      title: 'Save Graph',
      defaultPath: 'graph.json',
      filters: [{ name: 'JSON Files', extensions: ['json'] }],
  });

  if (filePath) {
      fs.writeFileSync(filePath, JSON.stringify(graphData, null, 2), 'utf-8');
      return filePath;
  }

  throw new Error('File save canceled');
});

// Load Graph Handler
ipcMain.handle('loadGraph', async () => {
  const { filePaths } = await dialog.showOpenDialog({
      title: 'Load Graph',
      filters: [{ name: 'JSON Files', extensions: ['json'] }],
  });

  if (filePaths && filePaths[0]) {
      const graphData = JSON.parse(fs.readFileSync(filePaths[0], 'utf-8'));
      return graphData;
  }

  throw new Error('File load canceled');
});

*/