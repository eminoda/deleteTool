const HttpService = require('./httpService');

const tradeService = {
    getTradeTotal: function (trade = {}) {
        return trade.wfCurrPercent || trade.currPercent.assetValue || trade.wfPercent;
    },
    getTradeInfo: async (ctx)=> {
        let history = await new HttpService().request({
            url:'/trade/gettradeinfo',
            data:{
                transId: ctx.query.tradeId
            }
        })(ctx);
        history.trade.tradeTotal = tradeService.getTradeTotal(history.trade);
        return history;
   },
    gethistrasbill: (ctx) => {
        return new HttpService({method:'post'}).request({
            url: '/user/gethistrasbill',
            data: {
                page:1,
                pageSize:10000,
                tradeId: ctx.query.tradeId
            }
        })(ctx);
    },
    advert: function (ctx,params) {
        return new HttpService().request({
            url:'/product/advert',
            data:{
                type:0,
                productType: params
            }
        })(ctx);
    },
}
module.exports = tradeService;