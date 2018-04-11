import * as echarts from '../../ec-canvas/echarts';

let chart = null;
var that

Page({
  data: {
    ec: {
      lazyLoad: true
    },
    isLogin: true,
    week:''
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
        isLogin: true,
        week:getApp().globalData.chartData.week
      })
    }
  },
  onReady() {
    var that = this
    this.ecComponent = this.selectComponent('#mychart-dom-bar');
    setTimeout(function () {
      console.log(chart)
      lazyLoad(that)
    }, 3000);
  }
});

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

/**
 * 懒加载图表配置
 */
function setOption(chart) {
  var chartData = getApp().globalData.chartData
  var names = []
  for (var key in chartData.sum) {
    names.push(key)
  }
  var option = {
    animation: false,
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
        margin: 4
      },
      axisLine: {
        symbol: ['none', 'arrow'],
        symbolSize: ['5', '8'],
        lineStyle: {
          color: 'rgba(30, 30, 30,0.8)'
        }
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: false
      }
    },
    yAxis: {
      name: '姓名',
      type: 'category',
      data: names,
      axisLabel: {
        margin: 2
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(30, 30, 30,0.8)'
        }
      },
      axisTick: {
        show: false
      },
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
        barMaxWidth: 30
      }
    ]
  };
  chart.setOption(option);
}

/**
 * 懒加载图表初始化
 */
function lazyLoad(that) {
  that.ecComponent.init((canvas, width, height) => {
    // 获取组件的 canvas、width、height 后的回调函数
    // 在这里初始化图表
    const chart = echarts.init(canvas, null, {
      width: width,
      height: height
    });
    setOption(chart)

    // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
    that.chart = chart

    that.setData({
      isLoaded: true,
      isDisposed: false
    });

    // 注意这里一定要返回 chart 实例，否则会影响事件处理等
    return chart;
  })
}