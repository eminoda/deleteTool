const fs = require('fs');
const path = require('path');

module.exports = deleteTool;

function deleteTool(filepath) {
	return new Promise((resolve, reject) => {
		console.log('check filepath: ', filepath);
		getFileStat(filepath)
			.then(stat => {
				if (!stat.isDirectory()) {
					return deleteFile(filepath);
				} else {
					dirtoryCache.push(filepath);
					return readDirectory(filepath)
						.then(files => {
							return deleteFiles(files, filepath);
						})
						.catch(err => {
							throw err;
						});
				}
			})
			.then(data => {
				resolve(data);
			})
			.catch(err => {
				// adapterError(err, path);
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
	console.log('delete file: ', file);
	return new Promise((resolve, reject) => {
		fs.unlink(file, err => {
			if (!err) {
				resolve(true);
			} else {
				reject(err);
			}
		});
	});
}

function deleteFiles(files, filepath) {
	let promiseList = [];
	for (let filename of files) {
		let file = path.join(filepath, filename);
		let pFn = deleteTool(file);
		promiseList.push(pFn);
	}
	return Promise.all(promiseList)
		.then(() => {
			return deleteDirectory(filepath);
		})
		.catch(err => {
			throw err;
		});
}

function deleteDirectory(filepath) {
	console.log('delete directory: ', filepath);
	return new Promise((resolve, reject) => {
		fs.rmdir(filepath, err => {
			if (!err) {
				resolve(true);
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
