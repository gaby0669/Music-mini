// pages/video/video.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navList:[], //导航条数据
    videoList:[], //视频数据
    currentIndex:0, //记录下标
    navId:'',
    videoId: '',
    isTriggered:false,
    refresh:'' //初始化视频滚动的距离

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNavList()
  },
  // 跳转搜索页面
  toSearchPage(){
    wx.navigateTo({
      url: '/pages/serach/serach',
    })
  },
// 获取导航列表数据
  async getNavList(){
    let navData = await request('/video/group/list')
    console.log(navData);
    let navListData = navData.data.slice(0,15)
    console.log(navListData[0].id);
    this.getVideoList(navListData[0].id)
    this.setData({
      navList: navListData
    })
  },
  // 点击导航条列表触发事件
  changeNav(event){
    console.log(event);
    console.log(event.currentTarget.dataset.index);
    this.setData({
      navId:event.currentTarget.id,
      currentIndex: event.currentTarget.dataset.index
    })
    wx.showLoading({
      title: '正在加载',
    })
    this.getVideoList(this.data.navId)
    this.setData({
      refresh: 0
    })
   
  },


  //获取视频列表
  async getVideoList(navId){
    wx.hideLoading()
    let videoData = await request('/video/group',{id:navId})
    let videoListData = videoData.datas
    console.log(videoListData);
    wx.hideLoading()
    this.setData({
      videoList:videoListData,
      isTriggered :false
    })
  },


  // 获取视频id
  play(event){
    // console.log(event);
    let videoId = event.currentTarget.id
    this.setData({
      videoId
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