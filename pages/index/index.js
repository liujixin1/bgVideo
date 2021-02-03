// pages/index/index.js
const db = wx.cloud.database();
const time = require('../../utils/util.js');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    banner: [],
    page: 0,
    isEnd: false,
  },
  toArticleDetail(e) {
    const src = e.currentTarget.dataset.src;
    wx.navigateTo({
      url: `/pages/detail/detail?&img=${src}`
    })
  },
  getData() {
    const that = this;
    that.setData({
      page: 0
    })
    let PAGE = 6;
    let page = 0;
    wx.showLoading({
      title: '加载中...',
    })
    db.collection('test').where({
      show: true,
      banner: false
    }).skip(page * PAGE).limit(PAGE).orderBy('date', 'desc').get().then(res => {
      wx.hideLoading();
      wx.stopPullDownRefresh();
      wx.hideNavigationBarLoading();
      res.data.forEach(res => {
        res.date = time.formatTime(res.date)
      })
      that.setData({
        listData: res.data,
        isEnd: false,
        // status: 1
      })
    })
    db.collection('test').where({
      banner: true,
      show: true
    }).orderBy('date', 'desc').get().then(res => {
      that.setData({
        banner: res.data
      })
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    that.setData({
      navH: app.globalData.navHeight
    })
    that.getData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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
    that.getData();
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
    const PAGE = 6;
    // if (that.data.status == 1) {
    db.collection('test').where({
      show: true,
      banner: false
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
    // } else if (that.data.status == 0) {
    //   db.collection('articleLists').skip(page * PAGE).limit(PAGE).orderBy('date', 'desc').get().then(res => {
    //     wx.hideLoading();
    //     wx.stopPullDownRefresh();
    //     wx.hideNavigationBarLoading();
    //     if (res.data.length == 0) {
    //       that.setData({
    //         isEnd: true
    //       })
    //     } else {
    //       const listData = that.data.listData;
    //       res.data.forEach(res => {
    //         res.date = time.formatTime(res.date);
    //         listData.push(res)
    //       })
    //       that.setData({
    //         page,
    //         listData
    //       })
    //     }

    //   })
    // }


  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const that = this;
    return {
      title: '微信红包封面',
      imageUrl: that.data.banner[0].img
    }
  }
})