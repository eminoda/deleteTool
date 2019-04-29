const moment = require('moment');
const numeral = require('numeral');
const tdk = require('../util/tdk');

const utilService = {
    getUserAgent: function () {
        // 项目名_IOS/ANDRIOD/WINCLIENT/MACCLIENT/H5/PC_版本号  项目名：数字+字母
        return '9niu_pc_0.0.0';
    },
    // [strToArr 字符串转数组 1,2,3,4->[1,2,3,4,5]]
    strToArr: function (str, format) {
        if (str) {
            return str.split(format || ',');
        } else {
            return [];
        }
    },
    // 四舍五入
    round: function (str, digit) {
        try {
            digit = digit || 2;
            if (str) {
                return Number(str).toFixed(digit)
            } else {
                return str;
            }
        } catch (err) {
            return str;
        }
    },
    // 金额显示，人民币
    money: function (value, format = '0,0.00') {
        return numeral(value).format(format);
    },
    // 百分比
    percent: function (value, format = '%,0.00') {
        return numeral(value).format('%,0.00');
    },
    // [timeFormat 时间格式化：2017-6-18 22:24:53 --> YYYY.MM.DD]
    timeFormat: function (time, format) {
        return time ? moment(time).format(format || 'YYYY-MM-DD') : '';
    },
    // [timeUnixFormat 时间格式化：1497796154759 -->2017-6-18 22:24:53]
    timeUnixFormat: function (time, format) {
        return time ? moment.unix(time).format(format || 'YYYY-MM-DD HH:mm:ss') : '';
    },
    // 银行卡脱敏
    convertCardNo: function (cardNo) {
        if (cardNo && new RegExp(/^(\d{12}|\d{16,22})$/).test(cardNo)) {
            return ' **** ***** **** ' + cardNo.substring(cardNo.length - 4, cardNo.length);
        }
        return cardNo;
    },
    /**
     * [生成分页参数]
     * @Author   ShiXingHao
     * @DateTime 2016-08-05
     * @param    {[type]}   currentPage [当前页]
     * @param    {[type]}   totalCount  [总记录数]
     * @param    {[type]}   pageSize    [每页显示条数]
     * @param    {[type]}   pageCount   [总页数]
     */
    generatePageInfo: function (currentPage, totalCount, pageSize, pageCount) {
        var totalPage = pageCount;

        var numeric = this.getPageList(Number(currentPage), Number(totalPage));

        return {
            currentPage: Number(currentPage),
            totalCount: Number(totalCount),
            pageSize: Number(pageSize),
            pageList: numeric,
            totalPage: Number(totalPage)
        };
    },
    // 获取分页显示列表
    getPageList: function (currentPage, totalPage) {
        var pages = [];
        var visiblePages = 5 > totalPage ? totalPage : 5;
        var half = Math.floor(visiblePages / 2);
        var start = currentPage - half + 1 - visiblePages % 2;
        var end = currentPage + half;

        // handle boundary case
        if (start <= 0) {
            start = 1;
            end = visiblePages;
        }
        if (end > totalPage) {
            start = totalPage - visiblePages + 1;
            end = totalPage;
        }

        var itPage = start;
        while (itPage <= end) {
            pages.push(itPage);
            itPage++;
        }
        return pages;
    },
    getEnvSetting: function () {
        return process.env;
    },
    wordLimit: function (value) {
        if (value.length > 20) {
            return value.slice(0, 15) + '...'
        } else {
            return value
        }
    },
    couponType: function (coupons) {
        var couponType = {
            management: 0,
            capital: 0
        }
        for (var i = 0; i < coupons.length; i++) {
            if (coupons[i].couponTypeCode === '310001') {
                couponType.management++
            }
            if (coupons[i].couponTypeCode === '310002') {
                couponType.capital++
            }
        }
        return couponType;
    },
    freeProduct: function (arr) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].list.length == 2) {
                return arr[i].list
            }
        }
    },
    buildTdk: function (key) {
        if (!key || !tdk[key]) {
            key = 'common';
        }
        return {
            title: tdk[key].title || '',
            description: tdk[key].description || '',
            keywords: tdk[key].keywords || ''
        };
    },
    createNonceStr: () => {
        return Math.random().toString(36).substr(2, 15);
    },
    createTimestamp: () => {
        return parseInt(new Date().getTime() / 1000) + '';
    }
}

module.exports = utilService;