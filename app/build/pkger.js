const packager = require('electron-packager');
const path = require('path');
const rootDir = process.cwd();
const options = {
	dir: path.join(rootDir, './'),
	name: 'deletetool',
	appVersion: '1.0.0',
	overwrite: true,
	ignore: 'build',
	out: path.join(rootDir, '../dist/out'),
	win32metadata: {
		CompanyName: 'eminoda'
	}
};
packager(options)
	.then(appPaths => {
		console.log('packager success: ', appPaths[0]);
	})
	.catch(err => {
		console.log(err);
	});
