import * as echarts from '../../ec-canvas/echarts';

let chart = null;

Page({
  data: {
    ec: {
      onInit: initChart
    },
    isLogin: true
  },
  onLoad:function(){
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
      // 获取 chart 实例的方式
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

  var names = ['梅世祺', '刘方祥', '周仁杰', '黄深远', '谢中阳', '彭声旺', '格日勒']
  var time1 = [6000, 302, 301, 334, 3950, 330, 320]

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
        formatter: function (value, index) {
          index = index*2
          if(index<10) {
            return ('0' + index + ':00')
          } else {
            return (index + ':00')
          }
        },
        splitNumber: 18
      },
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
        data: [600, 302, 301, 334, 395, 330, 320]
      },
      {

        type: 'bar',
        stack: '1',
        data: [500, 132, 101, 134, 90, 230, 210]
      },
      {

        type: 'bar',
        stack: '1',
        data: ''
      },
      {

        type: 'bar',
        stack: '1',
        data: ''
      },
      {

        type: 'bar',
        stack: '1',
        label: {
          normal: {
            show: true,
            position: 'right',
            formatter: function () {
              return '14:22'
            },
            textStyle:{
              fontSize:8,
              color:'#000',
              fontWeight:'900'
            }
          }
        },
        data: [50, 132, 101, 134, 90, 230, 210]
      }
    ]
  };

  chart.setOption(option);
  return chart;
}