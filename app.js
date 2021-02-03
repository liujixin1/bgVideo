//app.js
App({
  onLaunch: function() {
    const that = this;
    //初始化数据库
    wx.cloud.init({
      env: "home-4gev7v2if54f1e14"
    })
    

    //获取导航高度
    wx.getSystemInfo({
      success: res => {
        this.globalData.navHeight = res.statusBarHeight + 46;
      },
      fail(err) {
        console.log(err);
      }
    })
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.globalData.userInfo = userInfo;
    }
  
    //获取屏幕高度
    // wx.getSystemInfo({
    //   success(res) {
    //     console.log(res)
    //     that.globalData.screenHeight = res.screenHeight;
    //     that.globalData.windowHeight = res.windowHeight;

    //   }
    // })
  },
  //添加测试人数
  putData(id, dataCenter) {
    const that = this;
    wx.cloud.callFunction({
      name: 'sum',
      data: {
        _id: id,
        dataCenter: parseInt(dataCenter.sum) + 1
      },
      success: res => {
        wx.switchTab({
          url: `/pages/index/index?`,
          success: function (e) {
            var page = getCurrentPages().pop();
            if (page == undefined || page == null) return
            page.onLoad();
          }
        })
      }
    })
  },
  /*方法说明
   *@method userAuthorization 检测用户信息授权(供“我的”页面授权链接调用)
   *@return {promise} resolve 成功回调
   *@return {promise} reject 失败回调
   */
  userAuthorization() {
    const that = this;
    return new Promise((resolve, reject) => {
      if (that.globalData.userInfo) {
        resolve(true)
      } else {
        wx.showModal({
          content: '您还没有登录哟,请先登录',
          showCancel: false,
          confirmText: '我知道了',
          confirmColor: '#ff5151'
        })
        reject(false)
      }
    })
  },
  /*方法说明
   *@method publicAuthorization 检测用户信息授权(供“详情”页面授权链接调用)
   *@return {promise} resolve 成功回调
   *@return {promise} reject 失败回调
   */
  publicAuthorization() {
    const that = this;
    return new Promise((resolve, reject) => {
      if (that.globalData.userInfo) {
        resolve(true)
      } else {
        wx.navigateTo({
          url: `/pages/login/login`
        })
        reject(false)
      }
    })
  },
  /*方法说明
   *@method login 登录，获取openid
   */
  login(e, callback) {
    const that = this;
    wx.cloud.callFunction({
      name: 'login',
      success: res => {
        e.detail.userInfo.openid = res.result.event.userInfo.openId;
        that.globalData.userInfo = e.detail.userInfo;
        callback()
        wx.setStorageSync('userInfo', e.detail.userInfo)
        wx.setStorageSync('sum', 2)
        let startTime = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
        // 当天0点
        wx.setStorageSync('date', Date.parse(startTime))
      }
    })
  },
  globalData: {
    userInfo: null,
    screenHeight: null
  }
})