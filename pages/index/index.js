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
  var lati, long, r, accur = 0.00135
  wx.getLocation({
    type: 'gcj02',
    altitude: true,
    success: function (res) {
      lati = res.latitude
      long = res.longitude
      console.log(res.latitude, res.longitude, res.altitude)
      r = getDistance(lati, long, 31.770643, 117.18303)
      if (r <= accur) {
        that.setData({
          currentLocation: '生活区',
          addressColor: 'orange',
          currentRadius: ((100 - r * 1000) * 0.74074).toFixed(2)
        })
        console.log('生活区 ' + r)
      } else {
        r = getDistance(lati, long, 31.768355, 117.184762)
        if (r <= accur) {
          that.setData({
            currentLocation: '博北',
            addressColor: 'green',
            currentRadius: ((100 - r * 1000) * 0.74074).toFixed(2)
          })
          console.log('博北 ' + r)
        } else {
          r = getDistance(lati, long, 31.766805, 117.183195)
          if (r <= accur) {
            that.setData({
              currentLocation: '文典阁',
              addressColor: 'green',
              currentRadius: ((100 - r * 1000) * 0.74074).toFixed(2)
            })
            console.log('文典阁 ' + r)
          } else {
            that.setData({
              currentLocation: '未知区域',
              currentRadius: ((100 - r * 1000) * 0.74074).toFixed(2)
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
function wxLogin(dTime){
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
                code: code,
                ljsj: dTime
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
    messageBgColor:color
  })
  if (delay != 0) {
    setTimeout(function () {
      that.setData({
        msgStatus: 'none'
      })
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
function getDate(){
  var time = new Date()
  return time.getDate()
}

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
    currentRadius: '0.00',
    addressColor: '#999',
    message: '',
    buttonBgColor: '#2f7ff0',
    messageBgColor:'#00c100',
    resultTime:'',
    msgStatus: 'none',
    resultStatus:'none',
  },
  tapButton: function () {
    var that = this
    if (getApp().globalData.userInfo==null) {
      playAudio(musicError)
      showMessage(that, '请先登录并绑定姓名', 'rgba(226, 88, 80,1)', 1500)
    } else {
      hideResult(that)
      if (this.data.buttonValue == '开始签到') {
        this.setData({
          stuAddress: '未知区域'
        })
        getGeo(that)
        var initLoading = wx.showLoading({
          title: '正在定位中',
        })
        setTimeout(function () { //调试flag：正式发布时请取消注释
          if (/*that.data.currentLocation == '生活区' ||*/ that.data.currentLocation == '未知区域') {
            playAudio(musicError)
            showMessage(that, '对不起,非自习区无法签到!', 'rgba(226, 88, 80,1)', 1500)
            wx.hideLoading(initLoading)
          } else { //符合签到条件
            timestart = new Date()
            playAudio(musicSuccess)
            that.setData({
              time1: timestart.format('hh:mm:ss'),
              time2: '00:00:00',
              buttonValue: '结束自习',
              buttonBgColor: '#cc4125'
            })
            showMessage(that, '签到成功', '#00c100', 1500)
            wx.hideLoading(initLoading)
            if (that.data.buttonValue == '结束自习') {
              var cnt = 0 //开始自习后开始累计不在自习区的次数
              timer1 = setInterval(function () {
                getGeo(that) //调试flag：正式发布时请取消注释
                if (that.data.currentLocation == '生活区' || that.data.currentLocation == '未知区域') {
                  cnt++
                }
                if (cnt == 5) {
                  timeend = new Date()
                  showMessage(that, '已连续5次检测到您不在学习区,已自动帮您结束本次签到', 'rgba(226, 88, 80,1)', 0)
                  playAudio(musicError)
                  that.setData({
                    buttonValue: '开始签到',
                    buttonBgColor: '#2f7ff0',
                    time2: timeend.format('hh:mm:ss'),
                  })
                  showResult(that, dTime(timestart, timeend), 0)
                  wxLogin(dTime2(timestart, timeend))
                  clearInterval(timer1)
                }
              }, 1000) //每60秒识别一下当前所在位置
            } //调试flag：正式发布时请将时间改为60000
          }
        }, 8000)
      } else {
        timeend = new Date()
        showMessage(that, '签退成功', '#00c100', 1500)
        playAudio(musicSuccess)
        that.setData({
          buttonValue: '开始签到',
          buttonBgColor: '#2f7ff0',
          time2: timeend.format('hh:mm:ss')
        })
        showResult(that, dTime(timestart, timeend), 0)
        wxLogin(dTime2(timestart, timeend))
      }
    }
  }
})