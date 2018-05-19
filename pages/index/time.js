const musicSuccess = 'http://p4yx52bfi.bkt.clouddn.com/success.mp3'
const musicError = 'http://p4yx52bfi.bkt.clouddn.com/error.mp3'
var cnt
var newTime

Page({
  /**
   * 页面的初始数据
   */
  data: {
    source: '/images/scare1.jpg',
    message: '',
    messageBgColor: '#00c100',
    resultTime: '',
    msgStatus: 'none',
    resultStatus: 'none',
    messageAnimationData: '',
    resultAnimationData: '',
    buttonOpacity:1,
    hour: '',
    min: '',
    endTime:'5:00',
    time: ''
  },
  onShow:function(){
    var that = this
    var pickerTime
    cnt = 0
    showMessage(that, '您本次连续自习超过5小时\n需要您手动确认本次自习时间', 'rgba(226, 88, 80,1)', 3000)
    getApp().globalData.isTimeSigned = false //默认关闭签退成功FLAG
    var num = Math.floor(Math.random() * 2 + 1) //生成随机图片
    var theHour = Math.floor(getApp().globalData.wholeTime / 3600000) //本次自习小时数
    newTime = dTime3(getApp().globalData.wholeTime) //默认将时间加载到全局时间
    if(theHour<10) {
      pickerTime = dTime3(getApp().globalData.wholeTime)
    } else {
      pickerTime = '10:0'
    }
    this.setData({
      source: '/images/scare' + num + '.jpg',
      hour: Math.floor(getApp().globalData.wholeTime / 3600000),
      min: Math.floor((getApp().globalData.wholeTime / 60000)%60),
      endTime: pickerTime,
      time: pickerTime
    })
  },
  confirmTime:function(){
    var that = this
    playAudio(musicError)
    wx.showModal({
      title: '再次确认',
      content: '请再次确认您的本次自习时间是否无误' + '：' + timeTransfer(newTime),
      success:function(res){
        if(res.confirm) {
          if (cnt == 0) {
            showMessage(that, '签退成功', '#00c100', 1500)
            playAudio(musicSuccess)
            showResult(that, timeTransfer(newTime), 0)
            wxLogin(that, newTime)
            cnt++//禁止第二次点击
            that.setData({
              buttonOpacity: 0.5
            })
            getApp().globalData.isTimeSigned = true //开启签退成功FLAG
            setTimeout(function () {
              wx.navigateBack({
                delta: -1
              })
            }, 5000)
          }
        }
      }
    })
  },
  bindTimeChange: function (e) {
    if(cnt==0){
      newTime = e.detail.value
    }
  }
})

/**
 * 将时间格式化为 h:m 形式
 */
function dTime3(time) {
  var t = new Date(time - 28800000)
  return t.getHours() + ':' + t.getMinutes()
}

/**
 * 将时间格式化为 h:m 形式
 */
function dTime4(time) {
  var t = new Date(time - 28800000)
  return t.getHours() + '小时' + t.getMinutes() + '分钟'
}

/**
 * 与服务器交互
 */
function wxLogin(that, dTime) {
  wx.login({
    success: function (res) {
      var code = res.code;//发送给服务器的code  
      wx.getUserInfo({
        success: function (res) {
          if (code) {
            wx.request({
              url: 'https://app.lolimay.cn/test/qd.php',
              data: {
                code: code,
                ljsj: dTime,
                stuclass: getApp().globalData.stuclass
              },
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                setTimeout(function () {
                  showMessage(that, '今日共学习：' + res.data.match(/\d\S+分钟/), '#00c100', 5000)
                }, 2000)
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
 * 显示自定义消息
 * @delay 单位:毫秒 持续时间(若为0则持续显示)
 */
function showMessage(that, msg, color, delay) {
  that.setData({
    msgStatus: 'block',
    message: msg,
    messageBgColor: color
  })
  if (delay != 0) {
    setTimeout(function () {
      fadeOut(that, 1)
    }, delay)
  }
}

/**
 * 隐藏消息
 */
function hideMessage(that) {
  that.setData({
    msgStatus: 'none'
  })
}

/**
 * 显示结果时间
 * @delay 单位:毫秒 持续时间(若为0则持续显示)
 */
function showResult(that, time, delay) {
  that.setData({
    resultStatus: 'block',
    resultTime: time,
  })
  if (delay != 0) {
    setTimeout(function () {
      that.setData({
        resultStatus: 'none'
      })
    }, delay)
  }
}

/**
 * 隐藏结果时间
 */
function hideResult(that) {
  that.setData({
    resultStatus: 'none'
  })
}

/**
 * 播放MP3文件
 */
function playAudio(src) {
  var audio = wx.createInnerAudioContext()
  audio.src = src
  audio.play()
}

/**
 * 淡出动画
 */
function fadeOut(that, index) {
  var animation = wx.createAnimation({
    transformOrigin: "50% 50%",
    duration: 200,
    timingFunction: 'linear',
    delay: 0
  })
  that.animation = animation
  that.animation.opacity(0).scale(0, 0).step()
  if (index == 1) {
    that.setData({
      messageAnimationData: animation.export()
    })
  } else {
    that.setData({
      resultAnimationData: animation.export()
    })
  }
}

/**
 * 将 hh:mm 格式时间转化为 h小时h分钟的形式
 */
function timeTransfer(time) {
  var arr = time.match(/\d{1,2}/g)
  return arr[0]+'小时'+arr[1]+'分钟'
}