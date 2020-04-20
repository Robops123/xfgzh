<template>
	<view class="content">
		<view class="logo">
			<image src="../../static/logo.png" mode=""></image>
		</view>
		<view class="uni-form-item uni-column">
			<input type="tel" class="uni-input" v-model="phone" name="" placeholder="请输入手机号" />
		</view>
		<view class="uni-form-item uni-column">
			<input type="text" class="uni-input" name="" v-model="code" placeholder="请输入验证码" />
			<button class="veribtn" @click="getCode" :disabled="!show">
				 <span v-show="show">获取验证码</span>
				 <span v-show="!show" class="count">{{count}} s</span>
			</button>
		</view>
		<button type="primary" @tap="login">登陆</button>
		<!-- @tap="login" -->
		<!-- <view class="links">
			<view class="link-highlight" @tap="gotoRegistration">注册账号</view>
		</view> -->
		<!-- <chunLei-modal v-model="value" :mData="data" :type="type" @onConfirm="onConfirm" :maskEnable='false'  navMask>
			<div class="custom-view" @tap.stop>

			</div>
		</chunLei-modal> -->
		<button @tap="loginwx">登录微信</button>
	</view>
</template>

<script>
	import wx from 'jweixin-module'
	import chunLeiModal from '@/components/modal/modal.vue'
	import global from '../../static/js/global.js';
	import request from '../../api/request.js'
	import store from '../../store/index.js'
	export default {
		components: {
			chunLeiModal
		},
		data() {
			return {
				value: false,
				type: 'default',
				phone:'18851504776',
				code:'',
				count:60,
				timer:null,
				show:true,
				data: {},
				selectData: [{
						index: '1',
						title: '个人用户登录',
						content: '个人用户',
						icon: '/static/img/singleUser.png'
					},
					{
						index: '2',
						title: '单位用户登录',
						content: '单位用户',
						icon: '/static/img/dwUserIcon.png'
					},
				],
				inputData: {
					title: '登录',
					content: [{
							title: '手机号',
							content: '',
							type: 'number',
							placeholder: '请输入手机号'
						},
						{
							title: '密码',
							content: '',
							type: 'password',
							placeholder: '请输入密码'
						},
					]
				}
			}
		},
		onLoad(p) {
			// url=https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx72d5703c23ec2632&redirect_uri=http%3A%2F%2Fweixin.fireiot.net&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect
			// if(!isWechat){
			// 	uni.redirectTo({
			// 		url:'/pages/login/focus'
			// 	})
			// }
			var code=this.getUrlParam('code')
			if(code!=null){
				this.getOpenId(code)
			}
			this.type = "select"
			this.value = !this.value
			this.data = this.selectData
		},
		onShow(p){
			// if(code!=null){
				
			// }
			
			
			// if(this.getparams()=='gr'){
			// 	uni.setStorageSync('usertype','gr')
			// }else if(this.getparams()=='dw'){
			// 	uni.setStorageSync('usertype','dw')
			// 	uni.navigateTo({
			// 			url: '/pages/login/loginDW'
			// 		});
			// }
		},
		methods: {
			loginwx() {
				// wx72d5703c23ec2632  正式
				//wx3e1b12e0af8ae0d1
			      let appID = "wx72d5703c23ec2632";
			      let redirectUri = encodeURIComponent("http://weixin.fireiot.net");
			      let strUrl =
			        "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
			        appID +
			        "&redirect_uri=" +
			        redirectUri +
			        "&response_type=code&connect_redirect=1&scope=snsapi_base&state=STATE#wechat_redirect";
			 console.log(strUrl)
			      // this.$nextTick(() => {
			      //   window.location.href = strUrl;
			      // });
			    },
			login: function() {
				var regexp=/^1[3456789]\d{9}$/
				if((regexp.test(this.phone))){
					var that=this
					global.showLoading()
					var param = {
						// openId:uni.getStorageSync('openid'),
						openId:'oBdba1DuCx1i2_wG4DuVYWz4ZrqM',
						phone:this.phone,
						code:'123'
					}
					request.apiPost('/toc/tocUser/login',param).then((res) =>{
						if(res.code == '0'){
							uni.setStorageSync('usertype','gr')
							uni.setStorageSync('openid','oBdba1DuCx1i2_wG4DuVYWz4ZrqM')
							uni.setStorageSync('userinfo',res.data)
							uni.switchTab({
								url: '/pages/index/index'
							});
							global.hideLoading()
						}else{
							global.hideLoading()
							global.showToast('登录失败,请稍后再试')
						}
					}).catch((reason) =>{
						global.hideLoading()
						global.showToast(reason)
					})
				}else{
					global.showToast('请输入正确的手机号')
				}
			},
			getOpenId(code){
				var data={
					code:code
				}
				request.apiGet('/toc/tocUser/getOpenId',data).then((res) =>{
					if(res.code == '0'){
						uni.setStorageSync('openid',res.openId)
					}else{
						global.showToast('请在微信环境下打开')
					}
					global.hideLoading()
				}).catch((reason) =>{
					global.hideLoading()
					global.showToast('网络错误')
				})
			},
			gotoRegistration: function() {
				uni.navigateTo({
					url: 'registration'
				});
			},
			gotoForgetPassword: function() {
				uni.navigateTo({
					url: 'forget-password'
				});
			},
			onConfirm(e) {
				switch (this.type) {
					case 'default':
						uni.showToast({
							title: '确认',
							icon: 'none'
						})
						break;
					case 'select':
					{						
						if (e.index == '1')
						{
							uni.showToast({
								title: `${e.index}`,
								icon: 'none'
							})
							break;
							}
						else
						{
							uni.navigateTo({
								url: "/pages/login/loginDW"
							})
							break;
						}
					}
					case 'advert':
						uni.showToast({
							title: '广告',
							icon: 'none'
						})
						break;
					case 'share':
						uni.showToast({
							title: `${e.title}`,
							icon: 'none'
						})
						break;
					case 'input':
						console.log(e, '输入框')
						break;
					case 'multiSelect':
						console.log(e, '多选')
						break;
				}
			},
			// cancel() {
			// 	uni.showToast({title:'必须选择一类用户登录！',icon:'none'})
			// 	uni.navigateBack();  
			// },
			tapBtn(type) {
				this.type = type
				this.value = !this.value
				switch (this.type) {
					case 'default':
						this.data = this.defaultData
						break;
					case 'select':
						this.data = this.selectData
						break;
					case 'advert':
						this.data = this.advertData
						break;
					case 'share':
						this.data = this.shareData
						break;
					case 'input':
						this.data = this.inputData
						break;
					case 'multiSelect':
						this.data = this.multiSelectData
						break;
					case 'notify':
						this.data = this.notifyData
						break;
				}
			},
			skiplogin(){
				// if(this.getparams()=='gr'){
					// store.dispatch('usertype','gr')
					uni.setStorageSync('usertype','gr')
				// }else if(this.getparams()=='dw'){
				// 	// this.$store.dispatch('usertype','dw')
				// 	uni.setStorageSync('usertype','dw')
				// 	uni.navigateTo({
				// 			url: '/pages/login/loginDW'
				// 		});
				// }
				uni.switchTab({
					url: '/pages/index/index'
				});
			},
			getparams(type){
				try{
					var query=window.location.href.split('?')[1]
					return query.split('=')[1]
				}catch(e){
					//TODO handle the exception
					return 'gr'
				}
				
			},
			getUrlParam (name) {   
			  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')  
			  let url = window.location.href.split('#')[0]   
			  let search = url.split('?')[1]  
			  if (search) {  
			    var r = search.substr(0).match(reg)  
			    if (r !== null) return unescape(r[2])  
			    return null  
			  } else {  
			    return null  
			  }  
			},
			  getCode() {
			         //axios请求
			        // 验证码倒计时
					global.showLoading()
			       var data={
			       	code:code
			       }
				   var that=this
			       request.apiGet('/toc/tocUser/getOpenId',data).then((res) =>{
			       	if(res.code == '0'){
						that.settimer()
			       	}else{
			       		global.showToast('短信获取失败')
			       	}
			       	global.hideLoading()
			       }).catch((reason) =>{
			       	global.hideLoading()
			       	global.showToast('网络错误')
			       })
			      },
				  settimer(){
					  if (!this.timer) {
					    this.count = 60;
					    this.show = false;
					    this.timer = setInterval(() => {
					      if (this.count > 0 && this.count <= 60) {
					        this.count--;
					      } else {
					        this.show = true;
					        clearInterval(this.timer);
					        this.timer = null;
					      }
					    }, 1000);
					  }
				  }
		}
	}
</script>

<style lang="scss" scoped>
	$color-primary: #FA436A;

	.content {
		padding: 100upx;
	}

	.logo {
		text-align: center;

		image {
			height: 200upx;
			width: 200upx;
			margin: 0 0 60upx;
		}
	}

	.uni-form-item {
		margin-bottom: 40upx;
		padding: 0;
		border-bottom: 1px solid #e3e3e3;
		position: relative;
		.uni-input {
			font-size: 30upx;
			padding: 3px 0;
		}
	}

	button[type="primary"] {
		background-color: $color-primary;
		border-radius: 0;
		font-size: 34upx;
		margin-top: 60upx;
	}

	.links {
		text-align: center;
		margin-top: 40upx;
		font-size: 26upx;
		color: #999;

		view {
			display: inline-block;
			vertical-align: top;
			margin: 0 10upx;
		}

		.link-highlight {
			color: $color-primary
		}
	}


	button {
		margin-top: 50rpx;
	}

	.custom-view {
		overflow: hidden;

		display: flex;
		flex-direction: column;
		align-items: center;

		.hongbao {
			width: 500rpx;
			height: 700rpx;
			border-radius: 6rpx;
			background: #F35543;

			.top {
				text-align: center;
				padding: 100rpx 80rpx 0;
				height: 400rpx;
				background: #F45E4D;
				color: #FEDCAC;
				font-szie: 30px;
				border-bottom-right-radius: 60% 100rpx;
				border-bottom-left-radius: 60% 100rpx;
				box-shadow: 0 1px 4px #717171;
			}

			.bottom {
				margin-top: 80rpx;
				color: #FDC69B;
				text-align: center;
			}
		}

		.cancel {
			margin-top: 100rpx;
			width: 60rpx;
			height: 60rpx;
		}
	}
	.veribtn{
		position: absolute;
		right: 0;
		top: 0;
		height: 100%;
		margin-top: 0;
		line-height: initial;
		}
</style>


var jweixin = require('jweixin-module')

		//获取微信公众号的配置
		uni.request({
		
			url: 'xxxxxxxxxxx',
			dataType: 'text',
			data: {
				url: window.location.href.split('#')[0]
			},
			success: res => {
				var s = JSON.parse(res.data);
				console.log(s.data);
				
				 jweixin.config({
					 debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
					 appId: s.data.appId, // 必填，公众号的唯一标识
					 timestamp: s.data.timestamp, // 必填，生成签名的时间戳
					 nonceStr: s.data.nonceStr, // 必填，生成签名的随机串
					 signature: s.data.signature.toLowerCase(), // 必填，签名，见附录1
					 jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage","onMenuShareQQ","onMenuShareWeibo","onMenuShareQZone"]
				});	
				
				jweixin.ready(function () {

				 //获取“分享到QQ”按钮点击状态及自定义分享内容接口（即将废弃）
				 jweixin.onMenuShareQQ({
					 title: title, // 分享标题
					 desc: desc, // 分享描述
					 link: url, // 分享链接
					 imgUrl: imgurl, // 分享图标
					 success: function () {
						 // 用户确认分享后执行的回调函数
					 },
					 cancel: function () {
						 // 用户取消分享后执行的回调函数
					 }
				});
				
				//获取“分享给朋友”按钮点击状态及自定义分享内容接口（即将废弃）
				 jweixin.onMenuShareAppMessage({
					 title: title, // 分享标题
					 desc: desc, // 分享描述
					 link: url, // 分享链接
					 imgUrl: imgurl, // 分享图标
					 type: '', // 分享类型,music、video或link，不填默认为link
					 dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
					 success: function () {
						 // 用户确认分享后执行的回调函数
					 },
					 cancel: function () {
						 // 用户取消分享后执行的回调函数
					 }
				});
				
				//获取“分享到朋友圈”按钮点击状态及自定义分享内容接口（即将废弃）
				 jweixin.onMenuShareTimeline({
					 title: title, // 分享标题
					 desc: desc, // 分享描述
					 link: url, // 分享链接
					 imgUrl: imgurl, // 分享图标
					 type: '', // 分享类型,music、video或link，不填默认为link
					 dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
					 success: function () {
						 // 用户确认分享后执行的回调函数
					 },
					 cancel: function () {
						 // 用户取消分享后执行的回调函数
					 }
				});
				
				//获取“分享到腾讯微博”按钮点击状态及自定义分享内容接口
				 jweixin.onMenuShareWeibo({
					 title: title, // 分享标题
					 desc: desc, // 分享描述
					 link: url, // 分享链接
					 imgUrl: imgurl, // 分享图标
					 type: '', // 分享类型,music、video或link，不填默认为link
					 dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
					 success: function () {
						 // 用户确认分享后执行的回调函数
					 },
					 cancel: function () {
						 // 用户取消分享后执行的回调函数
					 }
				});
				
				 //获取“分享到QQ空间”按钮点击状态及自定义分享内容接口（即将废弃）
				 jweixin.onMenuShareQZone({
					 title: title, // 分享标题
					 desc: desc, // 分享描述
					 link: url, // 分享链接
					 imgUrl: imgurl, // 分享图标
					 type: '', // 分享类型,music、video或link，不填默认为link
					 dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
					 success: function () {
						 // 用户确认分享后执行的回调函数
					 },
					 cancel: function () {
						 // 用户取消分享后执行的回调函数
					 }
				});
			});
			},
			fail: err => {
				console.log('request fail', err);
			}
	});	