// pages/dingdanInform/dingdanInform.js
//支付
const paymentUrl = require('../../config').paymentUrl;
var app = getApp();
var Zan = require('../../dist/index');
Page(Object.assign({}, Zan.Toast, {
  data: {
    gid: "",
    attr: "",//属性
    types: "", //类型
    userMes: '',//留言信息
    num: '', //数量
    detail: ''
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    });
    var groupDetail = wx.getStorageSync("groupDetail");
    var that = this;
    var inform = options.goodsDetail;
    that.setData({
      inform1: inform,
      inform: groupDetail,
      type: options.type
    })
    wx.hideLoading()
    
  },

  onShow: function () {
    var that = this;
    //that.showZanToast('222222222222');
    var dizhi = wx.getStorageSync("dizhi");
    //console.log(dizhi);
    if (dizhi != undefined) {
      that.setData({
        dizhi: dizhi
      })
    }
    else {
    }
  },
  //地址
  nextAddress: function () {
    var that = this;
    if (wx.chooseAddress) {
      wx.chooseAddress({
        success: function (res) {
          that.setData({
            dizhi: res
          })
          wx.setStorageSync('dizhi', res);
        },
        fail: function (err) {
          console.log(JSON.stringify(err))
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  // switch
  listenerSwitch: function (e) {
    console.log('switch类型开关当前状态-----', e.detail.value);
  },
  //input
  userMesInput: function (e) {
    var that = this;

    var userMes = that.data.userMes;
    that.setData({
      userMes: e.detail.value
    })
    // console.log(userMes);
  },

  //提交订单
  formSubmit: function (e) {
    var that = this;
    var dizhi = that.data.dizhi;

    if (dizhi.length == 0) {
      that.showZanToast('请选择收货地址');
    } else {
      wx.request({
        url: 'https://shop.playonwechat.com/api/create-order?sign=' + app.data.sign + '&type=' + that.data.type + '&gbid=' + that.data.inform.gbid + '&operator_id=' + app.data.kid,
        data: {
          form_id: e.detail.formId,
          receiver: that.data.dizhi.userName,
          message: that.data.userMes,//留言
          receiver_address: that.data.dizhi.provinceName + that.data.dizhi.cityName + that.data.dizhi.countyName + that.data.dizhi.detailInfo,
          receiver_phone: that.data.dizhi.telNumber,
          detail: that.data.inform.order_detail
        },
        //detail:"gid -   attribute   - number"
        //detail:" 1  -  1:2,2:4,3:6  - 1"
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function (res) {
          // success
          // that.showZanToast('创建订单成功');
          // 支付成功跳转,先固定写死一个gbid
          
          console.log(res);
          var status = res.data.status;
          if (status == 1) {
            // 调用支付
            wx.requestPayment({
              timeStamp: res.data.data.timeStamp,
              nonceStr: res.data.data.nonceStr,
              package: res.data.data.package,
              signType: res.data.data.signType,
              paySign: res.data.data.paySign,
              'success': function (res) {
                setTimeout(function () {
                  // 支付成功跳转
                  wx.navigateTo({
                    url: '../dingdan/dingdan?status='
                  })
                }, 300)
              },
              'fail': function (res) {
              }
            })
          } else {
            that.showZanToast('创建订单失败');
          }
        },
        fail: function (res) {
          // fail
          console.log(res)
        },
        complete: function () {
          // complete
        }
      })
      // // 重置属性
      // that.setData({
      //   gid: "",
      //   attr: "",//属性
      //   types: "", //类型
      //   userMes: '',//留言信息
      //   num: '', //数量
      //   detail: ''
      // })
    }

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
}));