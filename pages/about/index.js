const app = getApp()
var inputValue = ''

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showIt:'false',
    bindNameShow:'',
    isBinded:false,
    inputFocus:false,
    inputPlace:'请绑定姓名后使用',
    buttonShow:'block'
  },
  //事件处理函数
  onLoad: function () {
    var that = this
    //判断用户是否已经绑定用户名
    if (getApp().globalData.userInfo!=null) {
      var that = this
      that.setData({
        inputPlace: '正在加载用户信息...',
        buttonShow:'none'
      })
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
  //绑定姓名按钮
  bindName: function () {
    var that = this
    if (inputValue == '') {
      wx.showActionSheet({
        itemList: ['请先输入姓名再登录!'],
      })
    } else {
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
      itemList: ['当前版本：1.2.0'],
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
  inputChange: function(e){
    inputValue = e.detail.value
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
      inputFocus: true
    })
  },
  buttonUpdate: function(){
    this.setData({
      checkUpdate:true
    })
  },
  onReady: function () {
    //获得dialog组件
    this.dialog = this.selectComponent("#dialog");
    this.bugToDialog = this.selectComponent('#bugToDialog')
  },
  aboutUs:function() {
    this.dialog.showDialog();   
  },
  bugTo:function(){
    this.bugToDialog.showDialog();
  },
  geoTest:function(){
    wx.navigateTo({
      url: 'geoTest',
    })
  },
  questions: function(){
    wx.navigateTo({
      url: 'Questions',
    })
  },
  clearCache:function(){
    getApp().globalData.userInfo = null
    setTimeout(function(){
      wx.reLaunch({
        url: 'index',
      })
    },1000)
  }
})

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
                name: inputValue,
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
                if (res.data != '') {
                  that.setData({
                    isBinded: true,
                    inputFocus: false
                  })
                }
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