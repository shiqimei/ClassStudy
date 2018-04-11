App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    time1:'',
    chartData:{}
  }
})

var time1 = wx.getStorageSync('time1')
if (time1 != '') {
  getApp().globalData.time1 = time1
}

setTimeout(function(){
  getApp().globalData.chartData = {
    week:1,
    day1: [30, 60, 90, 120, 150, 180, 210],
    day2: [10, 60, 40, 50, 50, 50, 150],
    day3: [0, 0, 0, 0, 0, 0, 0],
    day4: [0, 0, 0, 0, 0, 0, 0],
    day5: [0, 0, 0, 0, 0, 0, 0],
    day6: [0, 0, 0, 0, 0, 0, 0],
    day7: [0, 0, 0, 0, 0, 0, 0],
    sum: {
      '梅世祺': '40',
      '刘方祥': '120',
      '周仁杰': '130',
      '黄深远': '170',
      '谢中阳': '200',
      '彭声旺': '230',
      '格日勒': '360'
    }
  }
},2000)