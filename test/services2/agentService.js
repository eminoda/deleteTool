const HttpService = require('./httpService');
const constant = require('../util/constant');

const agentService = {
    getmypartner:function (ctx) {
        return new HttpService({
            error: false
        }).request({
            url: constant.API.getmypartner
        })(ctx);
    }
}

module.exports = agentService;