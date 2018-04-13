// pages/about/geoTest.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lowValue: '',
    highValue:''
  },
  buttonLow:function(){
    getLowGeo(this)
  },
  buttonHigh:function(){
    getHighGeo(this)
  }
})

/**
 * 获取当前低精度位置信息
 */
function getLowGeo(that) {
  wx.getLocation({
    type: 'gcj02',
    success: function (res) {
      that.setData({
        lowValue: res.latitude+','+res.longitude
      })
    }
  })
}

/**
 * 获取当前高精度位置信息
 */
function getHighGeo(that) {
  wx.getLocation({
    type: 'gcj02',
    altitude: true,
    success: function (res) {
      that.setData({
        highValue: res.latitude + ',' + res.longitude
      })
    }
  })
}