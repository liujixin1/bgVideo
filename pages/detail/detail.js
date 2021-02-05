// pages/detail/detail.js
const db = wx.cloud.database();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    model: '',
    img: '',
    opType: true,
    videoPath: ""
  },
  // 登录
  getUserInfo: function (e) {
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
        app.login(e, function () {
          wx.switchTab({
            url: `/pages/prize/prize`
          })
          wx.hideLoading();
        });
      }
    }

  },
  //保存图片
  saveImage() {
    var that = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.writePhotosAlbum']) {
          wx.showLoading({
            title: '背景保存中...',
            mask: true
          })
          let link = that.data.videoPath;
          let fileName = new Date().valueOf();
          wx.downloadFile({
            url: link,
            filePath: wx.env.USER_DATA_PATH + '/' + fileName + '.mp4',
            success: res => {
              wx.hideLoading()
              console.log(res);
              let filePath = res.filePath;
              wx.saveVideoToPhotosAlbum({
                filePath,
                success: file => {
                  console.log(file)
                  let fileMgr = wx.getFileSystemManager();
                  fileMgr.unlink({
                    filePath: wx.env.USER_DATA_PATH + '/' + fileName + '.mp4',
                    success: function (prop) {
                      if (prop.errMsg == "unlink:ok") {
                        wx.showModal({
                          content: '背景保存成功',
                          showCancel: false,
                          success(){
                            wx.switchTab({
                              url: '/pages/index/index'
                            })
                            // app.putData(that.data.dataId, that.data.dataCenter)
                          }
                        })
                      }
                    },
                  })
                },
              })
            },
            fail: err => {
              console.log(err)
              wx.hideLoading()
              wx.showModal({
                title: '提示',
                content: err.errMsg,
              })
            },
            complete: res => {
              console.log(res)
            }
          })
        } else {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              wx.showLoading({
                title: '背景保存中...',
                mask: true
              })
              let link = that.data.videoPath;
              let fileName = new Date().valueOf();
              wx.downloadFile({
                url: link,
                filePath: wx.env.USER_DATA_PATH + '/' + fileName + '.mp4',
                success: res => {
                  console.log(res);
                  let filePath = res.filePath;
                  wx.saveVideoToPhotosAlbum({
                    filePath,
                    success: file => {
                      wx.hideLoading()
                      let fileMgr = wx.getFileSystemManager();
                      fileMgr.unlink({
                        filePath: wx.env.USER_DATA_PATH + '/' + fileName + '.mp4',
                        success: function (prop) {
                          if (prop.errMsg == "unlink:ok") {
                            wx.showModal({
                              content: '背景保存成功',
                              showCancel: false,
                              success() {
                                wx.navigateTo({
                                  url: '/pages/index/index'
                                })
                                // app.putData(that.data.dataId, that.data.dataCenter)
                              }
                            })
                          }
                        },
                      })
                    },
                  })
                },
                fail: err => {
                  console.log(err)
                  wx.hideLoading()
                  wx.showModal({
                    title: '提示',
                    content: err.errMsg,
                  })
                },
                complete: res => {
                  console.log(res)
                }
              })

            },
            fail() {
              that.setData({
                opType: false
              })
            }
          })

        }
      }
    })
  },
  getData(id) {
    const that = this;
    wx.showLoading({
      title: '加载中...'
    })
    db.collection('test').doc(id).get().then(res => {
      setTimeout(() => {
        wx.hideLoading()
      }, 500)
      that.setData({
        img: res.data.img,
        videoPath:res.data.video
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    wx.showLoading({
      title: '加载中...'
    })
    that.getData(options.id)
    db.collection('model').get().then(res => {
      that.setData({
        model: res.data[0].bool,

      })
    })
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.writePhotosAlbum']) {
          that.setData({
            opType: true
          })
        } else {
          console.log(2)
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideLoading();
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },


})