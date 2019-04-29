const fs = require('fs');
const path = require('path');

deleteTool(path.join(__dirname, './services'))
	.then(data => {})
	.catch(err => {});

function deleteTool(dir) {
	return new Promise((resolve, reject) => {
		let dirtoryCache = [];
		getFileStat(dir)
			.then(stat => {
				if (!stat.isDirectory()) {
					return deleteFile(dir);
				} else {
					dirtoryCache.push(dir);
					return readDirectory(dir);
				}
			})
			.then(files => {
				let pmsList = [];
				if (files && files.length > 0) {
					for (let filename of files) {
						let file = path.join(dir, filename);
						let pFn = deleteTool(file);
						pmsList.push(pFn);
					}
					return Promise.all(pmsList);
				} else {
					if (dirtoryCache.length > 0) {
						return deleteDirectory(dirtoryCache[dirtoryCache.length - 1]);
					} else {
						resolve(true);
					}
				}
			})
			.then(data => {
				resolve(true);
			})
			.catch(err => {
				// adapterError(err, dir);
				reject(err);
			});
	});
}
function readDirectory(directory) {
	return new Promise((resolve, reject) => {
		fs.readdir(directory, function(err, files) {
			if (!err) {
				resolve(files);
			} else {
				reject(err);
			}
		});
	});
}

function getFileStat(path) {
	return new Promise((resolve, reject) => {
		fs.lstat(path, (err, stats) => {
			if (!err) {
				resolve(stats);
			} else {
				reject(err);
			}
		});
	});
}

function deleteFile(file) {
	return new Promise((resolve, reject) => {
		fs.unlink(file, (err, stats) => {
			if (!err) {
				resolve(file);
			} else {
				reject(err);
			}
		});
	});
}

function deleteDirectory(path) {
	return new Promise((resolve, reject) => {
		fs.rmdir(path, (err, stats) => {
			if (!err) {
				resolve(path);
			} else {
				reject(err);
			}
		});
	});
}
function dirIsExist(directory) {
	return new Promise((resolve, reject) => {
		fs.exists(directory, exists => {
			if (exists) {
				resolve(true);
			} else {
				reject(new Error('当前目录不存在'));
			}
		});
	});
}

function adapterError(err, path) {
	if (err.code == 'ENOENT') {
		throw new Error(`文件/目录不存在[${path}]`);
	}
	// if (err.message.indexOf('EBUSY') !== -1) {
	// 	throw new Error('当前目录/文件被占用中...');
	// }
	// if (err.message.indexOf('ENOENT') !== -1) {
	// 	throw new Error('目标文件不存在...');
	// }
	throw err;
}
