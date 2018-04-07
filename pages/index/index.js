Page({
  data: {
    stuAddress:'未知区域',
    time1:'00:00:00',
    time2:'00:00:00',
    buttonValue:'开始签到',
    addressColor: '',
    messageColor: '',
    buttonBgColor: '#2f7ff0'
  },
  tapButton: function(){
    var buttonValue = this.data.buttonValue === '开始签到'?'结束自习':'开始签到'
    var buttonBgColor = this.data.buttonBgColor === '#2f7ff0' ? '#cc4125' : '#2f7ff0'
    this.setData({
      buttonValue: buttonValue,
      buttonBgColor: buttonBgColor
    })
  }
})