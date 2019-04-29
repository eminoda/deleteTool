const HttpService = require('./httpService');
const constant = require('../util/constant');
const wxpromoteService = {
    /**
     * 获取活动列表
     * code：活动编码worldCup
     * wxId：微信id	1
     * page：1
     * pageSize：50
     */
    getWxpromoteList: (ctx, data = {}) => {
        return new HttpService().request({
            url: constant.API.wxpromote_list + '/' + data.code,
            data: {
                wxId: data.wxId,
                page: data.page || 1,
                pageSize: data.pageSize || 50
            }
        })(ctx);
    },
    /**
     * 用户分享信息
     * code：rank
     * wxId：微信id	1
     * page：1
     * pageSize：50
     */
    getWxpromoteRank: (ctx, data = {}) => {
        return new HttpService().request({
            url: constant.API.wxpromote_rank,
            data: {
                wxId: data.wxId,
                page: data.page || 1,
                pageSize: data.pageSize || 50
            }
        })(ctx);
    },
}

module.exports = wxpromoteService;