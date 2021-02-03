// pages/person/person.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  toCollect() {
    app.userAuthorization().then(() => {
      wx.navigateTo({
        url: '/pages/collects/collects'
      })
    }).catch(err =>{
      console.log(err)
    })
  },
  toPacket(){
    wx.navigateTo({
      url: `/pages/packet/packet`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
   
  },
  getUserInfo: function(e) {
    const that = this;
    if (e.detail.errMsg == "getUserInfo:ok") {
      app.login(e,function(){
        that.setData({
          userInfo: e.detail.userInfo
        })
      });
    }
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
      } else {
        app.login(e, function() {
          wx.navigateTo({
            url: `/pages/prize/prize`
          })
        });
      }
    }

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
    const that = this;
    if (app.globalData.userInfo) {
      that.setData({
        userInfo: app.globalData.userInfo
      })
    }
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})