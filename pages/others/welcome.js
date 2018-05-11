const hSwiper = require('../../components/hSwiper/hSwiper.js');
var option = {
  data: {
    //swiper插件变量
    hSwiperVar: {}
  },
  onLoad: function () {
  },
  onReady: function () {
    var swiper = new hSwiper({
      reduceDistance: 0, varStr: 'hSwiperVar', list: ['http://p40kjburh.bkt.clouddn.com/18-5-12/10393758.jpg', 'http://p40kjburh.bkt.clouddn.com/18-5-12/91841557.jpg', 'http://p40kjburh.bkt.clouddn.com/18-5-12/63683104.jpg'] });
    swiper.onFirstView = function (data, index) {
      console.log('当前是第' + (index + 1) + '视图', '数据是' + data);
    };
    swiper.onLastView = function (data, index) {
      console.log('当前是第' + (index + 1) + '视图', '数据是：' + data);
    };
    swiper.afterViewChange = function (data, index) {
      console.log('当前是第' + (index + 1) + '视图', '数据是：' + data);
    };
    swiper.beforeViewChange = function (data, index) {
      console.log('当前是第' + (index + 1) + '视图', '数据是：' + data);
    };
  }
};

Page(option);