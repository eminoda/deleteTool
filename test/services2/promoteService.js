const HttpService = require('./httpService');
const constant = require('../util/constant');

const promoteService = {
    // 签到
    getSignInInfo: function (ctx) {
        return new HttpService({
            error: false
        }).request({
            url: constant.API.promote_signIn
        })(ctx);
    },
    // 操盘返现
    getTradeCash: function (ctx) {
        return new HttpService({
            error: false
        }).request({
            url: constant.API.promote_tradeCash
        })(ctx);
    },
    // 邀请现金
    getInvite: function (ctx) {
        return new HttpService({
            error: false
        }).request({
            url: constant.API.promote_invite
        })(ctx);
    }
}

module.exports = promoteService;