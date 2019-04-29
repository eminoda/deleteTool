const HttpService = require('./httpService');
const constant = require('../util/constant');
const questions = require('../util/questions');

const otherService = {
    // 获取广告列表
    getQuestionList: (ctx, index) => {
        return questions[index].list;
    },
    // 帮助中心tab
    getHelpTabs: () => ['新手必读', '风控规则', '充值提现', '合约问题']
}

module.exports = otherService;