const HttpService = require('./httpService');

const noviceService = {
    // 获取体验活动
    getExperienceList: function (ctx) {
        return new HttpService().request({
            url: '/novice/experience',
            data: {
                matchNo: 'novice'
            }
        })(ctx)
    },
    // 获取任务 0:新手任务,(1:非新手任务,2:系统任务,)3:进阶任务,4:资产任务,5:常规任务'
    getNoviceTask: (ctx) => {
        return new HttpService().request({
            url: '/novice/task',
        })(ctx)
    }
}
module.exports = noviceService;