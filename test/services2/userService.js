const HttpService = require('./httpService');
const constant = require('../util/constant');
const userService = {
	login: function(ctx, options = {}) {
		return new HttpService({
			method: 'post'
		}).request({
			url: constant.API.user_login,
			data: {
				username: options.username,
				password: options.password
			}
		})(ctx);
	},
	getbalance: function(ctx) {
		return new HttpService({
			error: false
		}).request({
			url: constant.API.user_getbalance
		})(ctx);
	},
	getmybank: async ctx => {
		let data = await new HttpService().request({
			url: constant.API.user_getmybank
		})(ctx);
		return data.banks;
	},
	// 银行卡列表
	getBanks: async ctx => {
		let data = await new HttpService().request({
			url: constant.API.user_getbank
		})(ctx);
		return data.banks;
	},
	// 查询省市
	getCitys: async (ctx, options = {}) => {
		let data = await new HttpService().request({
			url: constant.API.user_getcity,
			data: {
				parentId: options.parentId || 0
			}
		})(ctx);
		return data.city;
	},
	//查询个人资产
	getaccountrpt: async ctx => {
		let data = await new HttpService().request({
			url: constant.API.user_getaccountrpt
		})(ctx);
		return data;
	},
	//获取推广信息
	getTrackInfo: async ctx => {
		let data = await new HttpService().request({
			url: constant.API.user_gettrackinfo
		})(ctx);
		return data;
	},
	getMyCoupon: async ctx => {
		let data = await new HttpService().request({
			url: constant.API.user_coupon
		})(ctx);
		return data;
	},
	getCouponList: async ctx => {
		let data = await new HttpService().request({
			url: constant.API.coupon_model
		})(ctx);
		return data;
	}, //获取公告消息
	// getNewsList: async (ctx, options = {}) => {
	//     let data = await new HttpService({
	//         method: 'post'
	//     }).request({
	//         url: constant.API.user_newsList,
	//         form: {
	//             page: options.page || 1,
	//             pageSize: options.pageSize || 10,
	//             type: options.type || '800001'
	//         }
	//     });
	//     return data;
	// },
	wxlogin: async (ctx, options = {}) => {
		let data = await new HttpService({
			method: 'post',
			error: false //不判断返回错误信息（success status逻辑冲突）
		}).request({
			url: constant.API.user_wxlogin,
			data: {
				code: options.code,
				useOpen: options.useOpen
			}
		})(ctx);
		return data;
	},
	zoneLimit: async (ctx, options = {}) => {
		let data = await new HttpService({
			method: 'get',
			error: false //不判断返回错误信息（success status逻辑冲突）
		}).request({
			url: constant.API.user_zone_limit,
			data: {
				ip: options.ip
			}
		})(ctx);
		return data;
	}
};

module.exports = userService;
