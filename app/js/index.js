let $ = require('jquery');
const { ipcRenderer } = require('electron');
let deletePath;

// 打开文件夹

$('#openFile').click(() => {
	ipcRenderer.send('sendToMain', {
		event: 'openFileDialog'
	});
});

// 删除文件
$('#deleteFile').click(() => {
	$('#deletePath').text('');
	ipcRenderer.send('sendToMain', {
		event: 'deleteFile',
		data: {
			path: deletePath
		}
	});
});
ipcRenderer.on('sendToRender', (event, arg) => {
	if (arg.success) {
		if (arg.event == 'SUCCESS-CHOOSE') {
			deletePath = arg.data.path;
			$('#deletePath').text(deletePath);
		}
		if (arg.event == 'SUCCESS-DELETE') {
			document.getElementById('deletePath').innerText = '删除成功';
		}
	} else {
		$('#errorMessage').text(`错误信息：` + arg.message);
	}
});
