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
function getGeo() {
  wx.getLocation({
    type: 'gcj02',
    altitude:true,
    success: function (res) {
      var lati, long, r, accur = 0.00135
      lati = res.latitude
      long = res.longitude
      console.log(res.latitude, res.longitude, res.altitude)
      r = getDistance(lati, long, 31.770643, 117.18303)
      if (r <= accur) {
        console.log('生活区 '+r)
      } else {
        r = getDistance(lati, long, 31.768355, 117.184762)
        if (r <= accur) {
          console.log('博北 '+r)
        } else {
          r = getDistance(lati, long, 31.766805, 117.183195)
          if(r<=accur){
            console.log('文典阁 '+r)
          } else {
            console.log('未知区域 '+r)
          }
        }
      }
    }
  })
}

const musicSuccess = 'http://p4yx52bfi.bkt.clouddn.com/success.mp3'
const musicError = 'http://p4yx52bfi.bkt.clouddn.com/error.mp3'

Page({
  data: {
    stuAddress: '未知区域',
    time1: '00:00:00',
    time2: '00:00:00',
    buttonValue: '开始签到',
    addressColor: '',
    messageColor: '',
    buttonBgColor: '#2f7ff0'
  },
  tapButton: function () {
    getGeo()
    playAudio(musicSuccess)
    var buttonValue = this.data.buttonValue === '开始签到' ? '结束自习' : '开始签到'
    var buttonBgColor = this.data.buttonBgColor === '#2f7ff0' ? '#cc4125' : '#2f7ff0'
    this.setData({
      buttonValue: buttonValue,
      buttonBgColor: buttonBgColor
    })
  }
})