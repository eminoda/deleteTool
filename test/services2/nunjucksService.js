const bluebird = require('bluebird');
const path = require('path');
const numeral = require('numeral');
const nunjucks = require('nunjucks');
const validator = require('../util/validator');
const constant = require('../util/constant');
const utilService = require('./utilService');
module.exports = {
    // 模板渲染中间件
    createMiddleware: function (options) {
        options.env.renderAsync = bluebird.promisify(options.env.render);
        return async (ctx, next) => {
            ctx.render = async (view, data) => {
                view += options.ext || '.html';
                return options.env.renderAsync(path.resolve(options.path, view), data).then((html) => {
                    ctx.type = 'html';
                    ctx.body = html;
                });
            };
            await next();
        };
    },
    // 创建环境
    createEnvironment: function (path, options) {
        return new nunjucks.Environment(
            new nunjucks.FileSystemLoader(path, options)
        );
    },
    setFilter: function (env) {
        // 电话脱敏
        env.addFilter('isTelephone', function (str) {
            try {
                if (str && validator.telephone.test(str)) {
                    return str.substring(0, 3) + '****' + str.substring(8);
                }
                return str
            } catch (err) {
                return str;
            }
        });
        env.addFilter('cycleType', function (cycleType) {
            return !cycleType ? constant.cycleTradeDay : constant.cycleTradeMonth;
        });
        env.addFilter('cycleType2', function (cycleType) {
            return !cycleType ? '天' : cycleType == 2 ? '周' : constant.cycleTradeMonth;
        });
        env.addFilter('money', utilService.money);
        env.addFilter('timeFormat', utilService.timeFormat);
        env.addFilter('timeUnixFormat', utilService.timeUnixFormat);
        env.addFilter('convertCardNo', utilService.convertCardNo);
        env.addFilter('wordLimit', utilService.wordLimit);
        env.addFilter('durationType', function (durationType) {
            return !durationType ? '天' : '月'
        });
        env.addFilter('openStatusText', function (openStatus) {
            return openStatus ? (openStatus == 1 ? '进行中' : '已结束') : '未开放';
        });
    }
}