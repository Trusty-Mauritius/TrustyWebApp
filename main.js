const { app, BrowserWindow, ipcMain } = require('electron');
const { Client, LocalAuth } = require('whatsapp-web.js');
const path = require('node:path');
const fs = require('fs');





const client = new Client({
    authStrategy: new LocalAuth() // Using LocalAuth for session management
});


client.on('ready', () => {
  console.log('WhatsApp client is ready!');
  mainWindow.webContents.send('whatsapp-ready');

});

client.on('qr', (qr) => {
  // Send QR code data to frontend using IPC
  mainWindow.webContents.send('qr-code', qr);
});

const createWindow = () => {
  global.mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true, // Enable Node integration in the renderer process
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');
};

app.whenReady().then(() => {
  createWindow();
  client.initialize();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});



ipcMain.on('get-chats-request', async (event) => {
    try {
        const groupData = await getChats();
        event.reply('get-chats-response', groupData);
    } catch (error) {
        console.error('Error fetching chats:', error);
    }
});


function getChats() {
    return client.getChats().then(chats => {
        let groupChats = chats.filter(chat => chat.isGroup);
        let groupData = {};

        groupChats.forEach(groupChat => {
            // Initialize an array for each group chat if it doesn't exist
            if (!groupData[groupChat.name]) {
                groupData[groupChat.name] = {
                    id: groupChat.id._serialized,
                    participants: []
                };
            }

            groupChat.participants.forEach(participant => {
                // Add each participant to the group chat's array
                groupData[groupChat.name].participants.push({
                    number: participant.id.user // Might not be the phone number
                });
            });
        });

        return groupData;
    });
}