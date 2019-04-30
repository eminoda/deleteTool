if (require('electron-squirrel-startup')) return;
require('./startup');
const { app, BrowserWindow, globalShortcut, dialog, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

app.on('ready', createWindow);

function createWindow() {
	// 创建浏览器窗口
	let win = new BrowserWindow({
		width: 450,
		height: 380,
		resizable: false,
		webPreferences: {
			devTools: false,
			nodeIntegration: true
		}
	});
	win.webContents.openDevTools();
	// 然后加载 app 的 index.html.
	win.loadFile('index.html');

	globalShortcut.register('Ctrl+R', () => {
		console.log('窗口重载');
		win.reload();
	});
}

ipcMain.on('sendToMain', async (event, arg) => {
	if (arg.event == 'openFileDialog') {
		let filePath = dialog.showOpenDialog({ properties: ['openFile', 'openDirectory'] });
		if (filePath) {
			sendToRender(event, {
				event: 'SUCCESS-CHOOSE',
				success: true,
				data: {
					path: path.resolve(filePath[0])
				}
			});
		} else {
			sendToRender(event, {
				event: 'FAIL-CHOOSE',
				success: false,
				message: '文件未选择'
			});
		}
	} else if (arg.event == 'deleteFile') {
		let deletePath = arg.data.path;
		try {
			let deleteResutl = await deleteTool(deletePath);
			sendToRender(event, {
				event: 'SUCCESS-DELETE',
				success: true
			});
		} catch (err) {
			sendToRender(event, {
				event: 'FAIL-CHOOSE',
				success: false,
				message: err.message
			});
		}
	}
});

function sendToRender(event, ...sendData) {
	event.sender.send('sendToRender', ...sendData);
}
