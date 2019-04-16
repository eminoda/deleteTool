const { ipcRenderer } = require('electron');
let deletePath;

// 打开文件夹
document.getElementById('openFile').onclick = function() {
	ipcRenderer.send('sendToMain', {
		event: 'openFileDialog'
	});
};

// 删除文件
document.getElementById('deleteFile').onclick = function() {
	ipcRenderer.send('sendToMain', {
		event: 'deleteFile',
		data: {
			path: deletePath
		}
	});
};
ipcRenderer.on('sendToRender', (event, arg) => {
	if (arg.event == 'successChooseFile') {
		deletePath = arg.data.path;
		document.getElementById('deletePath').innerText = deletePath;
	} else if (arg.event == 'failChooseFile') {
	} else if (arg.event == 'deleteFile') {
		console.log('删除成功');
	}
});
