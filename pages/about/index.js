/**
 * 与服务器交互
 */
function wxLogin(that) {
  wx.login({
    success: function (res) {
      var code = res.code;//发送给服务器的code  
      wx.getUserInfo({
        success: function (res) {
          var userNick = res.userInfo.nickName;//用户昵称  
          var avataUrl = res.userInfo.avatarUrl;//用户头像地址  
          var gender = res.userInfo.gender;//用户性别
          if (code) {
            wx.request({
              url: 'https://app.lolimay.cn/qd.php',
              data: {
                name: getApp().globalData.userName,
                code: code,
                nick: userNick,
                avaurl: avataUrl,
                sex: gender,
              },
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                console.log(res.data);
                wx.setStorageSync('name', res.data.name);//将获取信息写入本地缓存  
                wx.setStorageSync('openid', res.data.openid);
                wx.setStorageSync('imgUrl', res.data.imgurl);
                wx.setStorageSync('sex', res.data.sex);
              }
            })
          }
          else {
            console.log("获取用户登录态失败！");
          }
        }
      })
    },
    fail: function (error) {
      console.log('login failed ' + error);
    }
  })
}

/**
 * 获取用户名字
 */
function getName(that) {
  wx.login({
    success: function (res) {
      var code = res.code;//发送给服务器的code  
      wx.getUserInfo({
        success: function (res) {
          if (code) {
            wx.request({
              url: 'https://app.lolimay.cn/name.php',
              data: {
                code: code,
              },
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                console.log(res.data)
                getApp().globalData.userName = res.data
                that.setData({
                  isBinded: true
                })
              }
            })
          }
          else {
            console.log("获取用户登录态失败！");
          }
        }
      })
    },
    fail: function (error) {
      console.log('login failed ' + error);
    }
  })
}
const app = getApp()
var inputValue = ''

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    toptipType:'success',
    toptipTitle:'正在检查更新..',
    toptipShow:false,
    showIt:'false',
    bindNameShow:'',
    isBinded:false
  },
  //事件处理函数
  onLoad: function () {
    var that = this
    //判断用户是否已经绑定用户名
    if (getApp().globalData.userInfo!=null) {
      var that = this
      getName(that)
    }
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
  //登录按钮
  bindName: function () {
    var that = this
    if (inputValue == '') {
      wx.showActionSheet({
        itemList: ['请先输入姓名再登录!'],
      })
    } else {
      getApp().globalData.userName = inputValue
      wx.setStorageSync('name', inputValue) //强制将学生姓名保存至缓存中
      while (!wx.getStorageSync('name')) {
        setTimeout(function(){
          wx.setStorageSync('name', inputValue)
        },200)
      }
      wxLogin(that)
      this.setData({
        bindNameShow: 'none',
        isBinded: true,
        userInfo: getApp().globalData.userInfo
      })
    }
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
      content: '安徽大学17级软件工程班级自习自助签到系统　　　　　　\t　　软件作者:@LoliMay(前端)、@Watermelon(后台)',
    })
  },
  bugTo: function () {
    wx.showModal({
      showCancel: false,
      content: '请将你知道的bug反馈至：　　1404363070@qq.com',
    })
  },
  inputChange: function(e){
    inputValue = e.detail.value
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
