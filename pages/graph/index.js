import * as echarts from '../../ec-canvas/echarts';

let chart = null;
var that

Page({
  data: {
    ec: {
      onInit:initChart
    },
    isLogin: true,
    week: 1
  },
  onLoad:function(){
    that = this
    //判断是否已经登录
    if (getApp().globalData.userInfo == null) {
      this.setData({
        isLogin:false
      })
    } else {
      this.setData({
        isLogin: true
      })
    }
  },
  onReady() {
    setTimeout(function () {
      console.log(chart)
    }, 2000);
  }
});

/**
 * 绘制图表
 */
function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  var chartData = getApp().globalData.chartData
  var names = []
  for (var key in chartData.sum) {
    names.push(key)
  }
  var option = {
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      name: '时间',
      type: 'value',
      axisLabel: {
        show: true,
        formatter: function (value) {
          return timify(value)
        },
      },
      axisLine: {
        symbol: ['none', 'arrow']
      }
    },
    yAxis: {
      name: '姓名',
      type: 'category',
      data: names
    },
    series: [
      {

        type: 'bar',
        stack: '1',
        data: chartData.day1,
        barWidth: 45,
      },
      {

        type: 'bar',
        stack: '1',
        data: chartData.day2,
        barWidth: 45,
      },
      {

        type: 'bar',
        stack: '1',
        data: chartData.day3,
        barWidth: 45,
      },
      {

        type: 'bar',
        stack: '1',
        data: chartData.day4,
        barWidth: 45,
      },
      {

        type: 'bar',
        stack: '1',
        data: chartData.day5,
        barWidth: 45,
      },
      {

        type: 'bar',
        stack: '1',
        data: chartData.day6,
      },
      {

        type: 'bar',
        stack: '1',
        label: {
          normal: {
            show: true,
            position: 'right',
            formatter: function (object) {
              return timify(chartData.sum[object.name])
            },
            textStyle: {
              fontSize: 8,
              color: '#000',
              fontWeight: '900'
            }
          }
        },
        data: chartData.day7,
      }
    ]
  };

  chart.setOption(option);
  return chart;
}

/**
 * 时间格式化工具
 */
function timify(value) {
  var hour = Math.floor((value / 60))
  var min = Math.floor((value % 60))
  if (hour < 10) {
    if (min < 10) {
      return '0' + hour + ':0' + min
    } else {
      return '0' + hour + ':' + min
    }
  } else {
    if (min < 10) {
      return hour + ':0' + min
    } else {
      return hour + ':' + min
    }
  }
}