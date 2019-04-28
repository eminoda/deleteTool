const packager = require('electron-packager');
const electronInstaller = require('electron-winstaller');
const path = require('path');
const options = {
	dir: './',
	name: 'deletetool',
	appVersion: '1.0.0',
	overwrite: true,
	ignore: 'out',
	out: path.join(__dirname, './out'),
	win32metadata: {
		CompanyName: 'eminoda'
	}
};
packager(options)
	.then(appPaths => {
		console.log('packager success: ', appPaths[0]);
		electronInstaller
			.createWindowsInstaller({
				appDirectory: path.join(__dirname, 'out/deletetool-win32-x64'),
				outputDirectory: path.join(__dirname, 'out/tmp/deletetool-win32-x64'),
				authors: 'eminoda',
				exe: 'deletetool.exe'
			})
			.then(data => {
				console.log('installer success: ', data);
			})
			.catch(err => {
				console.log(err);
			});
	})
	.catch(err => {
		console.log(err);
	});
