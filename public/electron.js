// Modules to control application life and create native browser window
const { app, shell, BrowserWindow, ipcMain, Menu } = require('electron');
const https = require('https');
const { query } = require('influx-api');
const axios = require('axios');

if (process.env.ELECTRON_IS_DEV) {
  // Enable Google Dev Tools in Electron
  const debug = require('electron-debug');
  debug();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      preload: __dirname + '/preload.js',
    },
  });

  // open all target="_blank" links in a new window
  mainWindow.webContents.on('new-window', function(event, url) {
    event.preventDefault();
    shell.openExternal(url);
  });

  // and load the index.html of the app.
  if (process.env.ELECTRON_START_URL) {
    mainWindow.loadURL(process.env.ELECTRON_START_URL);
  } else {
    mainWindow.loadFile('./build/index.html');
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  const template = [
    {
      label: 'Application',
      submenu: [
        // { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
        // { type: "separator" },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: function() {
            app.quit();
          },
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'CmdOrCtrl+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+CmdOrCtrl+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
        {
          label: 'Select All',
          accelerator: 'CmdOrCtrl+A',
          selector: 'selectAll:',
        },
      ],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function() {
  createWindow();
  // autoUpdater.checkForUpdates();
});

// Custom `influx-query` ipc event
ipcMain.on('influx-query', (event, { queryArgs, rejectUnauthorized }) => {
  const httpsAgent = new https.Agent({ rejectUnauthorized });

  const interceptor = axios.interceptors.request.use(config => {
    return {
      ...config,
      httpsAgent,
    };
  });

  query(queryArgs)
    .then(response => {
      mainWindow.webContents.send('influx-query-response', { response });
    })
    .catch(error => {
      mainWindow.webContents.send('influx-query-response', { error });
    })
    .finally(() => {
      axios.interceptors.request.eject(interceptor);
    });
});

// when the update has been downloaded and is ready to be installed, notify the BrowserWindow
// autoUpdater.on('update-downloaded', (info) => {
// mainWindow.webContents.send('updateReady');
// });

// when receiving a quitAndInstall signal, quit and install the new version ;)
// ipcMain.on('quitAndInstall', (event, arg) => {
// autoUpdater.quitAndInstall();
// });

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
