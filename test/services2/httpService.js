// 日志
var log4js = require('log4js');
var log = log4js.getLogger('httpService');
const request = require('request');
const utilService = require('./utilService');
const Promise = require('bluebird');
const queryString = require('query-string');
const extend = require('extend');
const constant = require('../util/constant');
/**
 * HttpService 请求对象
 * @param {*} options
 * method 方法
 * envType 环境（api||空：主营业务，cms：资讯，liang：量加）
 * error 是否针对接口逻辑，更改promise状态
 * headers 请求头（默认主营业务）
 * requestAjax request promise封装
 */
function HttpService(options = {}) {
	this.method = options.method || 'get';
	this.envType = options.envType || '';
	this.error = typeof options.error == 'boolean' ? options.error : true;
	this.headers = options.headers || constant.HEADERS.DEFAULT;
	this.requestAjax = function(ctx, options) {
		let self = this;
		return new Promise((resolve, reject) => {
			// callback
			request(options, function(err, response, body) {
				try {
					if (!err && response.statusCode == 200) {
						self.setCookiesToResponse.call(self, ctx, response);
						try {
							const data = JSON.parse(body);
							if (self.error) {
								if (data.success || data.status == 'true') {
									resolve(data);
								} else {
									reject(new Error(data.resultMsg));
								}
							} else {
								resolve(data || {});
							}
						} catch (err) {
							reject(err);
						}
					} else {
						// 第三方环境，不会reject，影响主站
						if (!this.envType && !this.error) {
							resolve({});
						} else {
							reject(err || new Error(response.statusCode));
						}
					}
				} catch (err) {
					reject(err);
				}
			});
		});
	};
}
// 请求后台
HttpService.prototype.request = function(options = {}) {
	return async ctx => {
		// 处理request options
		// log.debug('ctx response>>' + ctx);
		this.headers['user-domain'] = ctx.host.split(':')[0];
		options.headers = this.headers;
		options.method = this.method;
		// cookie
		options.jar = this.getCookiesJar(this.getCookies(ctx.headers.cookie), ctx.state.COOKIE_URL);
		// url
		options.url = this.getRequestUrl(ctx, this.envType, options);
		// options.timeout = ctx.headers['user-agent'] && ctx.headers['user-agent'].indexOf('spider') != -1 ? 10 * 1000 : 2.5 * 1000;
		options.timout = 2500;
		if (options.method == 'get') {
			options.qs = options.data;
		} else {
			// post请求参数
			if (this.envType == 'cms') {
				options.body = JSON.stringify(options.data);
			} else {
				options.form = options.data;
			}
		}
		return await this.requestAjax(ctx, options);
	};
};

HttpService.prototype.getRequestUrl = function(ctx, envType, options) {
	// 根据不同环境切换访问路径
	if (!envType) {
		options.url = ctx.state.API_URL + options.url;
	} else if (envType == 'cms') {
		options.url = ctx.state.CMS_URL + options.url;
	} else if (envType == 'liang') {
		options.url = ctx.state.LIANG_URL + options.url;
	} else {
		options.url = ctx.state.API_URL + options.url;
	}
	// if (options.method === 'get') {
	//     options.url = options.url + '?' + queryString.stringify(options.data);
	// }
	log.info('请求地址>>' + options.url);
	return options.url;
};

// 获取cookies对象
HttpService.prototype.getCookies = function(sourceCookies, options = {}) {
	let cookies = {};
	if (sourceCookies) {
		// log.debug('浏览器获取到的cookies>>');
		let cookiesArr = sourceCookies.split(';');
		for (let cooStr of cookiesArr) {
			const coo = cooStr.split('=');
			if (coo.length > 1) {
				// log.debug(coo[0] + ':' + coo[1]);
				cookies[coo[0]] = coo[1];
			}
		}
	}
	return cookies;
};

// 将cookie设置到cookie空容器
HttpService.prototype.getCookiesJar = function(cookies, url) {
	// 创建空的cookie对象
	let jar = request.jar();
	for (let cookieName in cookies) {
		jar.setCookie(cookieName + '=' + cookies[cookieName], url);
	}
	return jar;
};

// 设置响应cookie到ctx response中
HttpService.prototype.setCookiesToResponse = function(ctx, response) {
	// log.debug('后台设置response cookie>>');
	let cookieArr = response.headers['set-cookie'] || [];
	// log.debug("response.headers['set-cookie']>>" + cookieArr);
	// [ 'uid=46466517220509; Domain=127.0.0.1; Path=/',...]
	for (let cooStr of cookieArr) {
		log.debug(cooStr);
		const cookieStr = cooStr.split(';');
		if (cookieStr && cookieStr.length > 0) {
			const coo = cookieStr[0].split('=');
			log.debug(coo[0] + ':' + coo[1]);
			ctx.cookies.set(coo[0], coo[1]);
		}
	}
};
module.exports = HttpService;
