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

async function deleteTool(dir) {
	if (dirIsExist(dir)) {
		const files = readDirTree(dir);
		try {
			for (let filename of files) {
				let file = path.join(dir, filename);
				// windows 快捷方式 目标目录丢失
				const stat = fs.lstatSync(file);
				if (stat.isDirectory()) {
					deleteTool(file);
				} else {
					fs.unlinkSync(file);
				}
			}
			fs.rmdirSync(dir);
		} catch (err) {
			if (err.message.indexOf('EBUSY') !== -1) {
				throw new Error('当前目录/文件被占用中...');
			}
			if (err.message.indexOf('ENOENT') !== -1) {
				throw new Error('目标文件不存在...');
			}
			throw err;
		}
	} else {
		throw new Error('请选择目录');
	}
}

function readDirTree(directory) {
	let files = [];
	try {
		files = fs.readdirSync(directory);
	} catch (err) {
		files = [];
	}
	return files;
}

function dirIsExist(directory) {
	try {
		return fs.existsSync(directory);
	} catch (err) {
		return false;
	}
}
