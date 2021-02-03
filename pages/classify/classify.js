// pages/find/find.js
const db = wx.cloud.database();
const time = require('../../utils/util.js');
const app = getApp();
Page({
  data: {
    navid: '2',
    navH: '',
    listData: [],
    page: 0,
    isEnd: false
  },
  navClick(e) {
    let that = this;
    that.setData({
      navid: e.currentTarget.id,
      listData:[],
      page:0,
      isEnd:false
    })
    wx.showLoading({
      title: '加载中...',
    })
    that.getData(that.data.navid)
  },
  toArticleDetail(e) {
    const id = e.currentTarget.dataset.id;
    const status = e.currentTarget.dataset.status;
    if (status == 2) {
      wx.navigateTo({
        url: `/pages/video/video?id=${id}`
      })
    } else if (status == 1) {
      wx.navigateTo({
        url: `/pages/articleDetail/articleDetail?id=${id}`
      })
    }

  },
  getData(nav) {
    const that = this;
    const PAGE = 8;
    let page = that.data.page;
    wx.showLoading({
      title: '加载中...',
    })
    switch (nav) {
      case '1':
        db.collection('articleLists').where({
          status: 1
        }).skip(page * PAGE).limit(PAGE).orderBy('date', 'desc').get().then(res => {
          wx.hideLoading();
          wx.stopPullDownRefresh();
          wx.hideNavigationBarLoading();
          res.data.forEach(res => {
            res.date = time.formatTime(res.date)
          })
          that.setData({
            listData: res.data,
            isEnd: false
          })
        })
        return;
      case '2':
        db.collection('articleLists').where({
          status: 2
        }).skip(page * PAGE).limit(PAGE).orderBy('date', 'desc').get().then(res => {
          wx.hideLoading();
          wx.stopPullDownRefresh();
          wx.hideNavigationBarLoading();
          res.data.forEach(res => {
            res.date = time.formatTime(res.date)
          })
          that.setData({
            listData: res.data,
            isEnd: false
          })
        })
        return;
      
    }

  },
  onLoad: function (options) {
    const that = this;
    that.setData({
      navH: app.globalData.navHeight
    })
    that.getData(that.data.navid)
  },
/**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    const that = this;
    that.setData({
      page: 0
    })
    wx.showNavigationBarLoading()
    that.getData(that.data.navid);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    const that = this;
    if (!that.data.isEnd) {
      wx.showLoading({
        title: '加载中...',
      })
    }
    let page = that.data.page;
    page++;
    const PAGE = 8;
    db.collection('articleLists').where({
      status: parseInt(that.data.navid)
    }).skip(page * PAGE).limit(PAGE).orderBy('date', 'desc').get().then(res => {
      wx.hideLoading();
      wx.stopPullDownRefresh();
      wx.hideNavigationBarLoading();
      if (res.data.length == 0) {
        that.setData({
          isEnd: true
        })
      } else {
        const listData = that.data.listData;
        res.data.forEach(res => {
          res.date = time.formatTime(res.date);
          listData.push(res)
        })
        that.setData({
          page,
          listData
        })
      }

    })

  },
})
