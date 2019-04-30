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
	ipcRenderer.send('sendToMain', {
		event: 'deleteFile',
		data: {
			path: deletePath
		}
	});
});
let $messageAnchor = $('#deleteMessage');
let $msg = $('<p></p>');
ipcRenderer.on('sendToRender', (event, arg) => {
	if (arg.success) {
		if (arg.event == 'SUCCESS_CHOOSE') {
			deletePath = arg.data.path;
			$('#deletePath').text(deletePath);
		}
		if (arg.event == 'SUCCESS_DELETE') {
			$msg.text(arg.data).prependTo($messageAnchor);
		}
	} else {
		$('#errorMessage').text(`错误信息：` + arg.message);
	}
});
