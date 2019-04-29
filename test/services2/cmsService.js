const HttpService = require('./httpService');
const constant = require('../util/constant');
const log4js = require('log4js');
const log = log4js.getLogger('cmsService');
let cmsHttpOptions = {
    envType: 'cms',
    error: false,
    method: 'post',
    headers: constant.HEADERS.JSON
}

const cmsService = {
    // 获取广告列表
    getAdsList: async (ctx, adspaceId) => {
        let banners = await new HttpService(cmsHttpOptions).request({
            url: constant.API.cms_findByAdspaceId,
            data: {
                adspaceId: adspaceId
            }
        })(ctx);
        banners.jDtos = banners ? banners.jDtos || [] : [];
        for (let i = 0; i < banners.jDtos.length; i++) {
            banners.jDtos[i].userLevel = cmsService.convertLevel(banners.jDtos[i].adName.split('-')[0]);
            banners.jDtos[i].attrValue = cmsService.convertImgUrl(ctx, banners.jDtos[i].attrValue);
            banners.jDtos[i].title = banners.jDtos[i].title;
        }
        return banners.jDtos || [];
    },
    getFriendLinks: async (ctx, siteId) => {
        let friendLinks = await new HttpService(cmsHttpOptions).request({
            url: constant.API.cms_findFriendLinks,
            data: {
                siteId: siteId
            }
        })(ctx);
        return friendLinks || [];
    },
    // 查询所有栏目
    getAllChannel: async (ctx, options = {}) => {
        // { jcContentDtos:
        //     [ { channelId: 80,
        //         channelName: '股票资讯',
        //         contentId: 44975,
        //         parentId: 0,
        //         title: '如何了解场外配资平仓线怎么算',
        //         shortTitle: '',
        //         origin: '牛壹佰',
        //         topLevel: 0,
        //         releaseDate: 1519315200,
        //         description: '',
        //         hasTitleImg: 0,
        //         views: 0,
        //         page: 1,
        //         limit: 10 }]}
        let data = await new HttpService(cmsHttpOptions).request({
            url: constant.API.cms_findAllChannel,
            data: {
                channelId: options.channelId || ctx.state.NEWS_CHANNEL,
                flag: options.flag || 0, // flag:0 全部，1 限制
                limit: options.limit || 5
            }
        })(ctx);
        return data.jcContentDtos || [];
    },
    //最近新闻
    getRecentContent: async (ctx, options = {}) => {
        let mostClickNews = await new HttpService(cmsHttpOptions).request({
            url: constant.API.cms_findRecentContent,
            data: {
                channelId: options.channelId || ctx.state.NEWS_CHANNEL,
                limit: options.limit || 10,
                page: options.page || 1,
            }
        })(ctx);
        return mostClickNews || [];
    },
    //最热资讯
    getHotContent: async (ctx, options = {}) => {
        let data = await new HttpService(cmsHttpOptions).request({
            url: constant.API.cms_findHotArticle,
            data: {
                channelId: options.channelId || ctx.state.NEWS_CHANNEL,
                limit: options.limit || 10,
                page: options.page || 1,
            }
        })(ctx);
        return data || []
    },
    //相关资讯
    getRelInfoByTag: async (ctx, options = {}) => {
        let data = await new HttpService(cmsHttpOptions).request({
            url: constant.API.cms_findRelInfoByTag,
            data: {
                channelId: options.channelId || ctx.state.NEWS_CHANNEL,
                contentId: options.contentId,
                limit: options.limit || 10,
                page: options.page || 1,
            }
        })(ctx);
        return data || []
    },
    //获取标签
    getAllTag: async (ctx, options = {}) => {
        let jcContentTags = await new HttpService(cmsHttpOptions).request({
            url: constant.API.cms_findAllTag,
        })(ctx);
        return jcContentTags || [];
    },
    //通过channelId查询
    getByChannelId: async (ctx, options = {}) => {
        let jcContentDtos = await new HttpService(cmsHttpOptions).request({
            url: constant.API.cms_findByChannelId,
            data: {
                channelId: options.channelId,
                parentId: options.parentId || ctx.state.NEWS_CHANNEL,
                page: options.page,
                limit: options.limit || 10,
            }
        })(ctx);
        return jcContentDtos || [];
    },
    //通过tagId查询
    getByTagId: async (ctx, options = {}) => {
        let jcContentDtos = await new HttpService(cmsHttpOptions).request({
            url: constant.API.cms_findByTagId,
            data: {
                page: options.page,
                limit: options.limit || 10,
                channelId: options.channelId || ctx.state.NEWS_CHANNEL,
                tagId: options.tagId,
            }
        })(ctx);
        return jcContentDtos || [];
    },
    //查询文章详情
    getByChannelIdAndContentId: async (ctx, options = {}) => {
        let content = await new HttpService(cmsHttpOptions).request({
            url: constant.API.cms_findByChannelIdAndContentId,
            data: {
                channelId: options.channelId || ctx.state.NEWS_CHANNEL,
                contentId: options.contentId,
            }
        })(ctx);
        return content || [];
    },
    //查询文章
    getByContentId: async (ctx, options = {}) => {
        let jcContentTagRelationDtos = await new HttpService(cmsHttpOptions).request({
            url: constant.API.cms_fingByContentId,
            data: {
                contentId: options.contentId,
            }
        })(ctx);
        return jcContentTagRelationDtos || [];
    },
    findAdsList: async (ctx, adspaceId) => {
        let banners = await new HttpService(cmsHttpOptions).request({
            url: constant.API.cms_findByAdspaceId,
            data: {
                adspaceId: adspaceId
            }
        })(ctx);
        for (var i = 0; i < banners.jDtos && banners.jDtos.length; i++) {
            banners.jDtos[i].userLevel = cmsService.convertLevel(banners.jDtos[i].adName.split('-')[0]);
            banners.jDtos[i].attrValue = cmsService.convertImgUrl(ctx, banners.jDtos[i].attrValue);
            banners.jDtos[i].title = banners.jDtos[i].title;
        }
        return banners || [];
    },
    // 所有栏目中提取不同栏目
    getChannelDuplicate: function (jcContentDtos) {
        var arr = [];
        var contentItems = [];
        if (jcContentDtos) {
            for (var i = 0; i < jcContentDtos.length; i++) {
                var channelId = jcContentDtos[i].channelId;
                // 没有找到相关的栏目
                if (arr.indexOf(channelId) == -1) {
                    arr.push(channelId);
                    contentItems.push({
                        channelId: channelId,
                        channelName: jcContentDtos[i].channelName,
                        // 蛋疼，cms处理不好，我们还要擦屁股
                        contentId: jcContentDtos[i].itemDescription ? jcContentDtos[i].itemDescription.split('_')[1] : '',
                        contentChannelId: jcContentDtos[i].itemDescription ? jcContentDtos[i].itemDescription.split('_')[0] : ''
                    });
                } else {
                    continue;
                }
            }
        }
        return contentItems;
    },
    // userLevel 转换
    convertLevel: function (userLevel) {
        switch (userLevel.toUpperCase()) {
            case 'A':
                userLevel = 1;
                break;
            case 'B':
                userLevel = 2;
                break;
            case 'C':
                userLevel = 3;
                break;
            case 'D':
                userLevel = 4;
                break;
            case 'V':
                userLevel = 0;
                break;
            case 'ALL':
                userLevel = 'ALL';
                break;
        }
        return userLevel;
    },
    // 处理cms图片资源
    convertImgUrl: function (ctx, url) {
        return ctx.state.CMS_IMGURL + url.split(ctx.state.CMS_IMGURL)[1];
    },
    //build面包屑
    buildCrumbs: function (status, obj) {
        let crumbs = [];
        crumbs.push(new NewsCrumb('/', '首页'));
        if (status == 'channl' && obj && obj.channelId) {
            crumbs.push(new NewsCrumb('/news', '资讯中心'));
            crumbs.push(new NewsCrumb('/news/c' + obj.channelId + '-' + 1, obj.channelName, true));
        } else if (status == 'tag' && obj) {
            crumbs.push(new NewsCrumb('/news', '资讯中心'));
            crumbs.push(new NewsCrumb('/news/tag' + obj.tagName + '-' + 1, obj.tagName, true));
        } else if (status == 'content' && obj && obj.channelId) {
            crumbs.push(new NewsCrumb('/news', '资讯中心'));
            crumbs.push(new NewsCrumb('/news/c' + obj.channelId + '-' + 1, obj.channelName));
            crumbs.push(new NewsCrumb('/news/d' + obj.contentId + '.html', obj.title, true));
        } else if (status == 'special' && obj) {
            crumbs.push(new NewsCrumb('/news', '资讯中心'));
            crumbs.push(new NewsCrumb('/news/special' + obj.channelId + '-' + 1, obj.channelName, true));
        } else {
            crumbs.push(new NewsCrumb('/news', '资讯中心', true));
        }
        return crumbs;
    }
}

function NewsCrumb(href, text, isLeaf) {
    this.href = href;
    this.text = text;
    this.isLeaf = isLeaf ? isLeaf : false;
}

module.exports = cmsService;