const electronInstaller = require('electron-winstaller');
const path = require('path');
const rootDir = process.cwd();
electronInstaller
	.createWindowsInstaller({
		appDirectory: path.join(rootDir, '../dist/out/deletetool-win32-x64'),
		outputDirectory: path.join(rootDir, '../dist/tmp/deletetool-win32-x64'),
		authors: 'eminoda',
		exe: 'deletetool.exe',
		iconUrl: path.join(rootDir, './build/resources/icon/delete.ico'),
		setupIcon: path.join(rootDir, './build/resources/icon/install.ico'),
		skipUpdateIcon: true,
		noMsi: true,
		loadingGif: path.join(rootDir, './build/resources/load.png')
	})
	.then(() => {
		console.log('installer success');
	})
	.catch(err => {
		console.log(err);
	});
