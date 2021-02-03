// pages/detail/detail.js
const db = wx.cloud.database();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: "",
    pop: true,
    model:''
  },
  // 登录
  getUserInfo: function(e) {
    const that = this;
    if (e.detail.errMsg == "getUserInfo:ok") {
      wx.showLoading({
        title: '加载中...'
      })
      if (app.globalData.userInfo) {
        wx.navigateTo({
          url: `/pages/prize/prize`
        })
        wx.hideLoading();
      } else {
        app.login(e, function() {
          wx.navigateTo({
            url: `/pages/prize/prize`
          })
          wx.hideLoading();
        });
      }
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this;
    db.collection('model').get().then(res => {
      that.setData({
        model:res.data[0].bool,
       
      })
    })
    wx.showLoading({
      title: '加载中...',
    })
    that.setData({
      img: options.img,
    })
    setTimeout(() => {
      that.setData({
        pop: false
      })
      wx.hideLoading();
    }, 500)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.hideLoading();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

 
})