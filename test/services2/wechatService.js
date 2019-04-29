const HttpService = require('./httpService');
const constant = require('../util/constant');
const utilService = require('./utilService');
const jsSHA = require('jssha');

const wechatService = {
    getJSTicketFromJava: async (ctx) => {
        let data = await new HttpService({
            error: false,
        }).request({
            url: constant.API.wxGetJsTicket
        })(ctx);
        return data;
    },
    sign: (ticket, url) => {
        let ret = {
            jsapi_ticket: ticket,
            nonceStr: utilService.createNonceStr(),
            timestamp: utilService.createTimestamp(),
            url: url
        };
        let string = raw(ret),
            shaObj = new jsSHA("SHA-1", "TEXT");
        shaObj.update(string);
        ret.signature = shaObj.getHash("HEX");
        ret.appid = process.env.WX_APPID;
        ret.success = true;
        return ret;
    }
}

function raw(args) {
    let keys = Object.keys(args);
    keys = keys.sort()
    let newArgs = {};
    keys.forEach(function (key) {
        newArgs[key.toLowerCase()] = args[key];
    });

    let string = '';
    for (let k in newArgs) {
        string += '&' + k + '=' + newArgs[k];
    }
    string = string.substr(1);
    return string;
};

module.exports = wechatService;