//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    toptipType:'success',
    toptipTitle:'正在检查更新..',
    toptipShow:false,
    showIt:'false',
    msg:'本次共学习5分钟'
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  versionInfo: function () {
    wx.showActionSheet({
      itemList: ['当前版本：1.0.0'],
      success: function (res) {
        if (!res.cancel) {
          console.log(res.tapIndex)
        }
      }
    })
  },
  updateLog: function () {
    wx.navigateTo({
      url: 'updateLog'
    })
  },
  updateIt: {

  },
  aboutUs:function(){
    wx.showModal({
      showCancel:false,
      content: '软件作者:@LoliMay(前端)、@Watermelon(后台)',
    })
  },
  bugTo: function () {
    wx.showModal({
      showCancel: false,
      content: '请将你知道的bug反馈至：　　1404363070@qq.com',
    })
  }
})
