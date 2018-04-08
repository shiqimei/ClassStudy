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
    altitude:true,
    success: function (res) {
      lati = res.latitude
      long = res.longitude
      console.log(res.latitude, res.longitude, res.altitude)
      r = getDistance(lati, long, 31.770643, 117.18303)
      if (r <= accur) {
        that.setData({
          currentLocation: '生活区',
          addressColor:'orange',
          currentRadius: ((100-r*1000)*0.74074).toFixed(2)
        })
        console.log('生活区 '+r)
      } else {
        r = getDistance(lati, long, 31.768355, 117.184762)
        if (r <= accur) {
          that.setData({
            currentLocation: '博北',
            addressColor: 'green',
            currentRadius: ((100 - r * 1000) * 0.74074).toFixed(2)
          })
          console.log('博北 '+r)
        } else {
          r = getDistance(lati, long, 31.766805, 117.183195)
          if(r<=accur){
            that.setData({
              currentLocation: '文典阁',
              addressColor: 'green',
              currentRadius: ((100 - r * 1000) * 0.74074).toFixed(2)
            })
            console.log('文典阁 '+r)
          } else {
            that.setData({
              currentLocation: '未知区域',
              currentRadius: ((100 - r * 1000) * 0.74074).toFixed(2)
            })
            console.log('未知区域 '+r)
          }
        }
      }
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
function showMessage(that,msg,delay) {
  that.setData({
    msgStatus:'block',
    message:msg,
  })
  if(delay!=0){
    setTimeout(function () {
      that.setData({
        msgStatus:'none'
      })
    }, delay)
  }
}

/**
 * 隐藏消息
 */
function hideMessage(that) {
  that.setData({
    msgStaus:'none'
  })
}

const musicSuccess = 'http://p4yx52bfi.bkt.clouddn.com/success.mp3'
const musicError = 'http://p4yx52bfi.bkt.clouddn.com/error.mp3'
var timer

Page({
  data: {
    msgStatus:'none',
    time1: '00:00:00',
    time2: '00:00:00',
    buttonValue: '开始签到',
    currentLocation:'未知区域',
    currentRadius:'0.00',
    addressColor: '#999',
    message:'',
    buttonBgColor: '#2f7ff0'
  },
  tapButton: function () {
    var that = this
    // setInterval(function(){
    //   getGeo(that)
    // },1000)
    // playAudio(musicSuccess)
    // var buttonValue = this.data.buttonValue === '开始签到' ? '结束自习' : '开始签到'
    // var buttonBgColor = this.data.buttonBgColor === '#2f7ff0' ? '#cc4125' : '#2f7ff0'
    // this.setData({
    //   buttonValue: buttonValue,
    //   buttonBgColor: buttonBgColor
    // })
    if(this.data.buttonValue=='开始签到') {
      this.setData({
        stuAddress:'未知区域'
      })
      getGeo(that)
      var initLoading = wx.showLoading({
        title: '正在定位中',
      })
      setTimeout(function(){
        if (that.data.currentLocation == '博北' || that.data.currentLocation == '未知区域') {
          playAudio(musicError)
          wx.showActionSheet({
            itemList: ['对不起,非自习区无法签到!'],
          })
        } else { //符合签到条件
          var timestart = new Date().format('hh:mm:ss')
          playAudio(musicSuccess)
          that.setData({
            time1: timestart,
            time2:'00:00:00',
            buttonValue:'结束自习',
            buttonBgColor:'#cc4125'
          })
          showMessage(that,'签到成功',1500)
        }
        wx.hideLoading(initLoading)
      },8000)
    }
  }
})