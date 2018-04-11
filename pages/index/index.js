const musicSuccess = 'http://p4yx52bfi.bkt.clouddn.com/success.mp3'
const musicError = 'http://p4yx52bfi.bkt.clouddn.com/error.mp3'
var timestart, timeend, timer1
var ToDay = getDate()

Page({
  data: {
    time1: '00:00:00',
    time2: '00:00:00',
    buttonValue: '开始签到',
    currentLocation: '未知区域',
    addressColor: 'rgba(226, 88, 80, 1)',
    message: '',
    buttonBgColor: '#2f7ff0',
    messageBgColor: '#00c100',
    resultTime: '',
    msgStatus: 'none',
    resultStatus: 'none',
    messageAnimationData: '',
    resultAnimationData:''
  },
  onLoad: function () {
    var that = this
    if (getApp().globalData.time1 != '') {
      timestart = getApp().globalData.time1 //timestart从缓存中加载时间
      this.setData({
        time1: new Date(getApp().globalData.time1).format('hh:mm:ss'),
        buttonValue: '结束自习',
        buttonBgColor: '#cc4125'
      })
    }
  },
  tapButton: function () {
    var that = this
    if (getApp().globalData.userInfo == null) {
      playAudio(musicError)
      showMessage(that, '请先登录并绑定姓名', 'rgba(226, 88, 80,1)', 1500)
    } else {
      hideResult(that)
      getGeo(that)
      var initLoading = wx.showLoading({
        title: '正在定位中',
      })
      if (this.data.buttonValue == '开始签到') {
        this.setData({
          stuAddress: '未知区域'
        })
        setTimeout(function () {//调试flag发布时请将下面的注释取消
          if (/*that.data.currentLocation == '生活区' || that.data.currentLocation == '未知区域'*/false) {
            playAudio(musicError)
            showMessage(that, '对不起,非自习区无法签到!', 'rgba(226, 88, 80,1)', 1500)
            wx.hideLoading(initLoading)
          } else { //符合签到条件
            timestart = new Date()
            wx.setStorageSync('time1', timestart)
            playAudio(musicSuccess)
            that.setData({
              time1: timestart.format('hh:mm:ss'),
              time2: '00:00:00',
              buttonValue: '结束自习',
              buttonBgColor: '#cc4125'
            })
            showMessage(that, '签到成功', '#00c100', 1500)
            wx.hideLoading(initLoading)
          }
        }, 1000)
      } else {
        setTimeout(function () {//调试flag发布时请将下面的注释取消
          if (/*that.data.currentLocation == '生活区' || that.data.currentLocation == '未知区域'*/false) {
            playAudio(musicError)
            showMessage(that, '对不起,非自习区无法签退!', 'rgba(226, 88, 80,1)', 1500)
            wx.hideLoading(initLoading)
          } else { //符合签退条件
            timeend = new Date()
            console.log('本次自习时间' + (timeend - timestart))
            wx.setStorageSync('time1', '')  //清空本地时间缓存
            showMessage(that, '签退成功', '#00c100', 1500)
            wx.hideLoading(initLoading)
            playAudio(musicSuccess)
            that.setData({
              buttonValue: '开始签到',
              buttonBgColor: '#2f7ff0',
              time2: timeend.format('hh:mm:ss')
            })
            showResult(that, dTime(timestart, timeend), 0)
            wxLogin(that,dTime2(timestart, timeend))
          }
        }, 1000)
      }
    }
  },
  tapAnimation: function () {
    fadeOut(this,1)
    fadeOut(this,2)
  }
})

/**
 * 播放MP3文件
 */
function playAudio(src) {
  var audio = wx.createInnerAudioContext()
  audio.src = src
  audio.play()
}

/**
 * 获取两点之间的距离
 */
function getDistance(x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
}

/**
 * 获取当前位置信息
 */
function getGeo(that) {
  var lati, long, r
  wx.getLocation({
    type: 'gcj02',
    success: function (res) {
      lati = res.latitude
      long = res.longitude
      console.log(res.latitude, res.longitude)
      r = getDistance(lati, long, 31.7686843626, 117.1848374605)
      if (r <= 0.002) {//优先检测博北
        that.setData({
          currentLocation: '博北',
          addressColor: 'green',
        })
        console.log('博北 ' + r)
      } else {
        r = getDistance(lati, long, 31.770643, 117.18303)
        if (r <= 0.001) {
          that.setData({
            currentLocation: '生活区',
            addressColor: 'rgba(226, 88, 80,1)',
          })
          console.log('生活区 ' + r)
        } else {
          r = getDistance(lati, long, 31.766805, 117.183195)
          if (r <= 0.0015) {
            that.setData({
              currentLocation: '文典阁',
              addressColor: 'green',
            })
            console.log('文典阁 ' + r)
          } else {
            that.setData({
              currentLocation: '未知区域',
              addressColor: 'rgba(226, 88, 80,1)',
            })
            console.log('未知区域 ' + r)
          }
        }
      }
    }
  })
}

/**
 * 与服务器交互
 */
function wxLogin(that,dTime) {
  wx.login({
    success: function (res) {
      var code = res.code;//发送给服务器的code  
      wx.getUserInfo({
        success: function (res) {
          if (code) {
            wx.request({
              url: 'https://app.lolimay.cn/qd.php',
              data: {
                code: code,
                ljsj: dTime
              },
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                console.log(res.data);
                setTimeout(function(){
                  showMessage(that, '今日共学习：'+res.data.match(/\d\S+分钟/), '#00c100', 5000)
                },5000)
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
* 时间对象的格式化   
*/
Date.prototype.format = function (format) {
  var o = {
    "h+": this.getHours(),    //hour   
    "m+": this.getMinutes(),  //minute   
    "s+": this.getSeconds(), //second
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  if (/(w+)/.test(format)) {
    fmt = fmt.replace(RegExp.$1, week[this.getDay()]);
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return format;
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
 * 计算时间差
 */
function dTime(time1, time2) {
  var time = new Date(time2.getTime() - time1.getTime() - 28800000)
  return time.getHours() + '小时' + time.getMinutes() + '分钟'
}
function dTime2(time1, time2) {
  var time = new Date(time2.getTime() - time1.getTime() - 28800000)
  return time.getHours() + ':' + time.getMinutes()
}
/**
 * 获取当前日期
 */
function getDate() {
  var time = new Date()
  return time.getDate()
}

/**
 * 淡出动画
 */
function fadeOut(that,index) {
  var animation = wx.createAnimation({
    transformOrigin: "50% 50%",
    duration: 200,
    timingFunction: 'linear',
    delay: 0
  })
  that.animation = animation
  that.animation.opacity(0).scale(0, 0).step()
  if(index==1){
    that.setData({
      messageAnimationData: animation.export()
    })
  } else {
    that.setData({
      resultAnimationData: animation.export()
    })
  }
}