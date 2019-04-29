const HttpService = require('./httpService');
const constant = require('../util/constant');
const log4js = require('log4js');

const loggerService = {
    // 记录访问日志
    recordAccessLogger: function (ctx, level, options = {}) {
        const log = log4js.getLogger('access');
        const space = ' ';
        const uid = ctx.cookies.get('uid') || '-';
        const remote_addr = ctx.ip || '-';
        const request_method = ctx.method;
        const request_data = ctx.method.toLocaleUpperCase() == 'GET' ? JSON.stringify(ctx.querystring || {}) : JSON.stringify(ctx.body || {});
        const request_url = ctx.path;
        const request_agent = ctx.headers['user-agent'] || '-';
        const http_protocol = ctx.protocol;
        const response_status = ctx.status;
        const response_time = options.response_time;
        log.info(
            uid + space +
            remote_addr + space +
            request_method + space +
            request_data + space +
            request_url + space +
            request_agent + space +
            http_protocol + space +
            response_status + space +
            response_time)
    }
}
module.exports = loggerService;