const fs = require('fs');
const path = require('path');
const sendToRender = require('./util');

module.exports = deleteTool;

function deleteTool(filepath, event) {
	return new Promise((resolve, reject) => {
		// console.log('check filepath: ', filepath);
		getFileStats(filepath)
			.then(stats => {
				if (!stats.isDirectory()) {
					return deleteFile(filepath, event);
				} else {
					return readDirectory(filepath)
						.then(files => {
							return deleteFiles(files, filepath, event);
						})
						.catch(err => {
							reject(err);
						});
				}
			})
			.then(data => {
				resolve(data);
			})
			.catch(err => {
				err = adapterError(err, filepath);
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

function getFileStats(path) {
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

function deleteFile(file, event) {
	return new Promise((resolve, reject) => {
		fs.unlink(file, err => {
			if (!err) {
				sendToRender(event, {
					event: 'SUCCESS_DELETE',
					success: true,
					data: `delete file: ${file}`
				});
				resolve(true);
			} else {
				reject(err);
			}
		});
	});
}

function deleteFiles(files, filepath, event) {
	let promiseList = [];
	for (let filename of files) {
		let file = path.join(filepath, filename);
		let pFn = deleteTool(file, event);
		promiseList.push(pFn);
	}
	return Promise.all(promiseList)
		.then(() => {
			return deleteDirectory(filepath, event);
		})
		.catch(err => {
			throw err;
		});
}

function deleteDirectory(filepath, event) {
	return new Promise((resolve, reject) => {
		fs.rmdir(filepath, err => {
			if (!err) {
				sendToRender(event, {
					event: 'SUCCESS_DELETE',
					success: true,
					data: `delete dirtory: ${filepath}`
				});
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
	console.log(err);
	if (err.code == 'ENOENT') {
		return new Error(`文件/目录不存在 [${path}]`);
	} else if (err.code == 'EBUSY') {
		return new Error(`文件/目录被占用 [${path}]`);
	}
	return err;
}
