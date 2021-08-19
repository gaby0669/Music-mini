
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList:[],//轮播图数据
    navItem:[
      {iconClass:"iconfont icon-dianzan",iconName:"每日推荐"},
      {iconClass:"iconfont icon-a-tupianyihuifu-05",iconName:"私人FM"},
      {iconClass:"iconfont icon-gedan",iconName:"歌单"},
      {iconClass:"iconfont icon-paixingbang",iconName:"排行榜"},
      {iconClass:"iconfont icon-zhuanji",iconName:"数字专辑"},
      {iconClass:"iconfont icon-zhuanzhu-copy",iconName:"专注冥想"},
      {iconClass:"iconfont icon-ktv",iconName:"歌房"},
      {iconClass:"iconfont icon-youxi",iconName:"游戏专区"}, 
    ],
    recommendList:[], //推荐歌曲数据
    topList:[], //排行榜数据

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 获取轮播图数据
    let bannerListData = await request('/banner',{type:2})
    // console.log(bannerListData);
    this.setData({
      bannerList: bannerListData.banners
    })
    // 获取推荐歌曲数据
    let recommendListData = await request('/personalized')
    // console.log(recommendListData);
    this.setData({
      recommendList: recommendListData.result
    })
    // 获取排行榜的数据
    let index = 0
    let resultArr=[]
    while(index<10){
      let topListData = await request('/top/list',{idx:index++})
      let topListItem = {name:topListData.playlist.name,tracks:topListData.playlist.tracks.slice(0,5)}
      // console.log(topListData);
      resultArr.push(topListItem)
    }
    console.log(resultArr);
    this.setData({
      topList: resultArr
    })
  },
  toRecommendSong(e){
    console.log(e);
    if(e.currentTarget.dataset.name=="每日推荐"){
      wx.navigateTo({
        url: '/songPackage/pages/recommendSong/recommendSong',
      })
    }
  },
  toSongDetail(e){
    // console.log(e);
    wx.navigateTo({
      url: '/songPackage/pages/songDetail/songDetail?musicId='+e.currentTarget.dataset.id,
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})