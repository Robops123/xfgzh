<template>
	<view class="content">
		<view class="lis">
			<view class="uni-flex uni-row">
				<view class="flex-item left">产品名称：</view>
				<view class="flex-item right">{{ info.tips }}</view>
			</view>
		</view>
		<view class="lis">
			<view class="uni-flex uni-row">
				<view class="flex-item left">产品价格：</view>
				<view class="flex-item right">{{ info.pris }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import wx from 'jweixin-module'
	import global from '../../static/js/global.js';
	import request from '../../api/request.js'
	import store from '../../store/index.js'
	export default {
		data() {
			return {
				pram : {openId : null,recordId :null},
				info : {tips : '',pris : ''}
			}
		},
		onLoad(p) {
			//隐藏第一个返回按钮
			
			//订单号
			var recordId = this.getUrlParam('recordId')
			//var openId = uni.getStorageSync('openid')
			var openId = "oivqowZNipwkwvFqHkRBm_HwdCvE"
			if(recordId)
			{
				if(openId)
				{
					this.pram.openId = openId
					this.pram.recordId = recordId
					//获取订单初始化参数
					this.getJSPrame()
				}else{
					//提示其没有OpenID
					global.showToast('当前没有获取到有效的OpenID')
				}
			}else{
				//提示其没有订单号
				global.showToast('没有传入有效的支付订单号')
			}
		},
		onShow(p)
		{
			
		},
		methods: {
			getJSPrame()
			{
				global.showLoading()
				var data = {url:window.location.href.split('#')[0]}
				request.apiGet('/getJsParm',data).then((res) =>{
					console.log(res)
					if(res.data.code){
						global.hideLoading()
						global.showToast(res.data.error)
					}else{
						var conf = res.data
						this.initWxConfig(conf)
					}
				}).catch((reason) =>{
					console.log(res)
					global.hideLoading()
					global.showToast('网络错误')
				})
			},
			initWxConfig(conf)//初始化微信页面参数
			{
				//初始化
				wx.config({
					debug: false, // 开启调试模式。
					appId: conf.weixin_appId, // 必填，公众号的唯一标识
					timestamp: conf.weixin_timestamp, // 必填，生成签名的时间戳
					nonceStr: conf.weixin_noncestr, // 必填，生成签名的随机串
					signature: conf.weixin_signature,// 必填，签名
					jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表
				});
				request.apiPost('/wxPayPrame',this.pram).then((res) =>{
					if(res.code == 100){
						global.hideLoading()
						global.showToast(res.data.error)
					}else{
						global.hideLoading()
						var pay = res;
						wx.ready(function(){
							wx.checkJsApi({jsApiList: ['chooseWXPay'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
								success: function(res) {}
							});
							wx.chooseWXPay({
								timestamp: pay.timeStamp, // 支付签名时间戳
								nonceStr: pay.nonceStr, // 支付签名随机串，不长于 32 位
								package: pay.package, // 提交格式如：prepay_id=\*\*\*）
								signType: pay.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
								paySign: pay.paySign, // 支付签名
								success: function (res) {
									//跳转我的订单
									uni.redirectTo({url: '/pages/pay/wxPaySucc'})
								}
							});
						});
					}
				}).catch((reason) =>{
					global.hideLoading()
					global.showToast(reason)
				})
			},
			onNavigationBarButtonTap() {  //跳转我的订单
				uni.redirectTo({url: '/'})
			},  
			getUrlParam(type){
				try{
					var query = window.location.href.split('?')[1]
					var vars = query.split("&");
				    for (var i=0;i<vars.length;i++) {
						var pair = vars[i].split("=");
						if(pair[0] == type){return decodeURI(pair[1]);}
					}
					return null
				}catch(e){
					//TODO handle the exception
					return null
				}
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	$color-primary: #FA436A;

	.content {
	    padding: 10px 5px;
	    margin: 8px;
		background-color: #fff;
	}
	
	.lis {
	    padding: 5px;
	    margin: 10px 0;
	    border-bottom: 1px solid #eee;
	}
	
	.left,.right {
	    line-height: 2;
	    font-size: 16px;
	}
	
	.left {
	    width: 90px;
	}
	
	.right {
	    width: calc(100% - 90px);
	    text-align: right;
	    overflow: hidden;
	    text-overflow: ellipsis;
	}

</style>