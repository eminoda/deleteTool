const { app, BrowserWindow, globalShortcut, dialog, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

app.on('ready', createWindow);

function createWindow() {
	// 创建浏览器窗口
	let win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			devTools: true,
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

ipcMain.on('sendToMain', (event, arg) => {
	if (arg.event == 'openFileDialog') {
		let filePath = dialog.showOpenDialog({ properties: ['openFile', 'openDirectory'] });
		if (filePath) {
			event.sender.send('sendToRender', {
				event: 'successChooseFile',
				data: {
					path: path.resolve(filePath[0])
				}
			});
		} else {
			event.sender.send('sendToRender', {
				event: 'failChooseFile',
				data: '文件未选择'
			});
		}
	} else if (arg.event == 'deleteFile') {
		console.log(arg);
		let deletePath = arg.data.path;
		deleteTool(deletePath);
	}
});

function deleteTool(dir) {
	if (dirIsExist(dir)) {
		const files = readDirTree(dir);
		console.log(files);
		for (let filename of files) {
			let file = path.join(dir, filename);
			const stat = fs.statSync(file);
			try {
				if (stat.isDirectory()) {
					deleteTool(file);
				} else {
					fs.unlinkSync(file);
				}
			} catch (err) {
				throw err;
			}
		}
		fs.rmdirSync(dir);
	} else {
		console.log('dir worry');
	}
}

function readDirTree(directory) {
	let files = [];
	try {
		files = fs.readdirSync(directory);
	} catch (err) {
		console.log(directory);
		console.log(err);
		files = [];
	}
	return files;
}

function dirIsExist(directory) {
	try {
		return fs.existsSync(directory);
	} catch (err) {
		console.err(err);
		return false;
	}
}
