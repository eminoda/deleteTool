if (require('electron-squirrel-startup')) return;
require('./startup');
const { app, BrowserWindow, globalShortcut, dialog, ipcMain } = require('electron');
const sendToRender = require('./util');
const deleteTool = require('./delete');
const path = require('path');

app.on('ready', createWindow);

function createWindow() {
	// 创建浏览器窗口
	let win = new BrowserWindow({
		width: 500,
		height: 450,
		resizable: false,
		webPreferences: {
			devTools: false,
			nodeIntegration: true
		}
	});
	win.webContents.openDevTools();
	// 然后加载 app 的 index.html.
	win.loadFile(path.join(__dirname, './index.html'));

	globalShortcut.register('Ctrl+R', () => {
		console.log('window create...');
		win.reload();
	});
}

ipcMain.on('sendToMain', async (event, arg) => {
	if (arg.event == 'openFileDialog') {
		let filePath = dialog.showOpenDialog({ properties: ['openFile', 'openDirectory'] });
		if (filePath) {
			sendToRender(event, {
				event: 'SUCCESS_CHOOSE',
				success: true,
				data: {
					path: path.resolve(filePath[0])
				}
			});
		} else {
			sendToRender(event, {
				event: 'FAIL_CHOOSE',
				success: false,
				message: '文件未选择'
			});
		}
	} else if (arg.event == 'deleteFile') {
		let deletePath = arg.data.path;
		try {
			let start = new Date().getTime();
			let deleteResutl = await deleteTool(deletePath, event);
			sendToRender(event, {
				event: 'SUCCESS_DELETE',
				success: true
			});
			console.log(new Date().getTime() - start);
		} catch (err) {
			sendToRender(event, {
				event: 'FAIL_CHOOSE',
				success: false,
				message: err.message
			});
		}
	}
});
