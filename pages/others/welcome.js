const hSwiper = require('../../components/hSwiper/hSwiper.js');
var option = {
  data: {
    //swiper插件变量
    hSwiperVar: {},
  },
  onLoad: function () {
  },
  onReady: function () {
    var swiper = new hSwiper({
      reduceDistance: 0, varStr: 'hSwiperVar', list: [[1, 'http://p40kjburh.bkt.clouddn.com/18-5-12/10393758.jpg'], [1, 'http://p40kjburh.bkt.clouddn.com/18-5-12/91841557.jpg'], [1, 'http://p40kjburh.bkt.clouddn.com/18-5-12/63683104.jpg'], [2, 'http://p40kjburh.bkt.clouddn.com/18-5-12/63683104.jpg',['17级软件工程', '17级地质学']]] });
  }
};

Page(option);