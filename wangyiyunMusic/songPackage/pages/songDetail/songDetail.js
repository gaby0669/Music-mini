import PubSub from 'pubsub-js';
import moment from 'moment'
import request from '../../../utils/request'
// 获取全局实例
const appInstance = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay:false, //音乐是否播放
    song: {},//歌曲详情对象
    musicId:'',//音乐id
    musicLink: '', //音乐的链接
    currentTime: '00:00', //实时时间
    durationTime:'00:00', //总时长
    currentWidth:0, //实时进度条的宽度
  },
  // 修改播放状态的功能函数
changePlayState(isPlay){
  //修改音乐是否播放的状态
  this.setData({
    isPlay
  })
  // 修改全局音乐播放的状态
  appInstance.globalData.isMusicPlay = isPlay
},

//点击播放/暂停的回调
handleMusicPlay(){
  let isPlay = !this.data.isPlay
  let {musicId,musicLink} = this.data
  this.musicControl(isPlay,musicId,musicLink)
},




  // 获取音乐详情的功能函数
  async getMusicInfo(musicId){
    let songData = await request('/song/detail',{ids:musicId})
    console.log(songData);
    // songData.songs[0].dt 单位ms
    let durationTime = moment(songData.songs[0].dt).format('mm:ss')
    this.setData({
      song : songData.songs[0],
      durationTime
    })
    // 动态修改窗口标题
    wx.setNavigationBarTitle({
      title: this.data.song.name,
    })
  },

// 控制音乐播放/暂停的功能函数
async musicControl(isPlay,musicId,musicLink){
  if(isPlay){//音乐播放
    if(!musicLink){
      // 获取音乐播放链接
      let musicLinkData = await request('/song/url',{id:musicId})
      musicLink = musicLinkData.data[0].url
      this.setData({
        musicLink
      })
    }
    this.backgroundAudioManager.src = musicLink
    this.backgroundAudioManager.title = this.data.song.name
  }else{//暂停音乐
    this.backgroundAudioManager.pause()
  }
},

//点击切歌的回调
handleSwitch(event){
  //获取切歌的类型
  let type = event.currentTarget.id
  // 关闭当前播放的音乐
  this.backgroundAudioManager.stop()
  // 订阅来自recommendSong页面发布的musicId消息
  PubSub.subscribe('musicId',(msg,musicId)=>{
    console.log(musicId);
    // 获取音乐详情信息
    this.getMusicInfo(musicId)
    // 自动播放当前音乐
    this.musicControl(true,musicId)
    // 取消订阅
    PubSub.unsubscribe('musicId')
  }) 
  // 发布消息数据给recommendSong页面
  PubSub.publish('switchType',type)
},


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      // console.log(options);
      let musicId = options.musicId
      this.setData({
        musicId
      })
      // 获取音乐详情
      this.getMusicInfo(musicId)

    /*
    * 问题： 如果用户操作系统的控制音乐播放/暂停的按钮，页面不知道，导致页面显示是否播放的状态和真实的音乐播放状态不一致
    * 解决方案：
    *   1. 通过控制音频的实例 backgroundAudioManager 去监视音乐播放/暂停
    *
    * */;
   //判断当前页面音乐是否在播放
   if(appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId){
    //  修改当前页面音乐播放状态为true
    this.setData({
      isPlay: true
    })
   }
  //  创建控制音乐播放的实例
  this.backgroundAudioManager = wx.getBackgroundAudioManager()
  // 监听音乐播放/暂停/停止
  this.backgroundAudioManager.onPlay(()=>{
    this.changePlayState(true)
    appInstance.globalData.musicId = musicId
  })

  this.backgroundAudioManager.onStop(()=>{
    this.changePlayState(false)
  })

  this.backgroundAudioManager.onPause(()=>{
    this.changePlayState(false) 
  })
  // 监听音乐播放自然结束
  this.backgroundAudioManager.onEnded(()=>{
    // 自动切换下一首音乐
    PubSub.publish('switchType','next')
    // 将实时进度条的长度还原成0，时间还原成0
    this.setData({
      currentTime:'00:00',
      currentWidth:0
    })
  })
  // 监听音乐实时播放的进度
  this.backgroundAudioManager.onTimeUpdate(()=>{
    // console.log('总时长: ', this.backgroundAudioManager.duration);
    // console.log('实时的时长: ', this.backgroundAudioManager.currentTime);
    // 格式化实时的播放时间
    let currentTime = moment(this.backgroundAudioManager.currentTime*1000).format('mm:ss')
    let currentWidth = this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration*450
    this.setData({
      currentWidth,
      currentTime
    })
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
    this.backgroundAudioManager.stop()
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