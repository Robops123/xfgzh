<template>
	<view class="center">
		<!-- <view class="logo" 
			@click="goLogin" 
			:hover-class="!login ? 'logo-hover' : ''">
			<image class="logo-img" 
				:src="login ? (uerInfo.avatarUrl ? uerInfo.avatarUrl:avatarUrl) :avatarUrl">
			</image>
			<view class="logo-title">
				<text class="uer-name">Hi，{{login ? uerInfo.name : '您未登录'}}</text>
				<text class="go-login navigat-arrow" v-if="!login">&#xe65e;</text>
			</view>
		</view> -->
		<view class="center-list" v-if="usertype=='gr'">
			<view class="center-list-item " @click="goDevice">
				<!-- <text class="list-icon">&#xe60f;</text> -->
				<image src="../../static/img/mine/icon.png" mode=""></image>
				<text class="list-text">我的设备</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			<view class="center-list-item" @click="goRepair">
				<image src="../../static/img/mine/icon1.png" mode=""></image>
				<text class="list-text">我的报修</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			
		</view>
		<view class="center-list">
			<view class="center-list-item" >
				<image src="../../static/img/mine/icon2.png" mode=""></image>
				<text class="list-text">意见反馈</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
		</view>
		<!-- <view class="center-list">
			<view class="center-list-item border-bottom" @click="goWarnhistroy" v-if="usertype=='gr'">
				<text class="list-icon">&#xe60b;</text>
				<text class="list-text">告警历史</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			<view class="center-list-item border-bottom" @click="toDwLogin" v-if="usertype=='gr'">
				<text class="list-icon">&#xe65f;</text>
				<text class="list-text">监管账号绑定</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			<view class="center-list-item" @click="open"  v-if="usertype=='dw'">
				<text class="list-icon">&#xe65f;</text>
				<text class="list-text">分享</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
		</view> -->
		
		<!-- <view class="share-box" v-if="show">
			<view class="share-wrapper" @click="close"></view>
			<view class="share-content">
				<view class="share-title">
					<text style="margin: 0 auto;">分享到</text>
				</view>
				<view class="share-item">
					<image src="../../static/img/wx.png" mode="" @click="share"></image>
					<image src="../../static/img/pyq.png" mode="" @click="share"></image>
					<image src="../../static/img/qq.png" mode="" @click="share"></image>
				</view>
			</view>
		</view> -->
	</view>
</template>

<script>
	import global from '../../static/js/global.js';
	import request from '../../api/request.js'
	import wx from 'jweixin-module';
	export default {
		data() {
			return {
				login: false,
				avatarUrl: "../../static/headPortrait.png",
				uerInfo: {},
				show:false,
				usertype:''
			}
		},
		onLoad(){
			var data={
								url:encodeURIComponent(window.location.href.split('#')[0])
							}
							request.apiGet('/toc/tocUser/getSignature',data).then((res) =>{
								console.log(res)
								if(res.code=='0'){
									wx.config({
									    appId: 'wxcd55667b480dfd2c', // 必填，企业号的唯一标识，此处填写企业号corpid
									    timestamp: res.timestamp, // 必填，生成签名的时间戳
									    nonceStr: res.nonceStr, // 必填，生成签名的随机串
									    signature: res.signature,// 必填，签名，见附录1
									    jsApiList: ['updateAppMessageShareData', // 分享给朋友”及“分享到QQ
			'updateTimelineShareData', // 分享到朋友圈”及“分享到QQ空间
			]// 分享到QQ空间] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
									});
									
								}
							}).catch(reason =>{
								global.showToast(reason)
							})
		},
		onShow(){
			this.usertype=uni.getStorageSync('usertype')
			if(uni.getStorageSync('userinfo').openId){
				this.login=true
			}else{
				this.login=false
			}
		},
		methods: {
			goLogin() {
				if (this.login) {
					return
				}else{
					this.tologin()
				}
			},
			goRepair() {
				// if (this.login) {
					uni.navigateTo({
						url:'/pages/repair/repairList'
					})
				// }else{
				// 	this.tologin()
				// }
			},
			goDevice() {
				// if (this.login) {
					// uni.navigateTo({
					// 						url:"/pages/personCenter/mydevice"
					// 					})
					uni.switchTab({
						url:'../index/index'
					})
				// }else{
				// 	this.tologin()
				// }
			},
			goWarnhistroy() {
				// if (this.login) {
					uni.navigateTo({
						url:"/pages/personCenter/warnhistroy"
					})
				// }else{
				// 	this.tologin()
				// }
			},
			tologin(){
				uni.navigateTo({
					url:"/pages/login/login"
				})
			},
			toDwLogin(){
				uni.navigateTo({
					url:"/pages/login/loginDW"
				})
			},
			close(){
				this.show=false
			},
			open(){
				this.show=true
			},
			share(){
				wx.ready(function () {   //需在用户可能点击分享按钮前就先调用
				  wx.updateAppMessageShareData({ 
				    title: '111', // 分享标题
				    desc: '物联网消防', // 分享描述
				    link: 'http://www.baidu.com', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
				    imgUrl: '', // 分享图标
				    success: function (s) {
						console.log(s)
				      // 设置成功
				    },
					fail:function(e){
						console.log(e)
					}
				  })
				});
			}
		}
	}
</script>

<style>
	@font-face {
		font-family: texticons;
		font-weight: normal;
		font-style: normal;
		src: url('https://at.alicdn.com/t/font_984210_5cs13ndgqsn.ttf') format('truetype');
	}

	page,
	view {
		display: flex;
	}

	page {
		background-color: #f8f8f8;
	}

	.center {
		flex-direction: column;
		position: relative;
	}

	.logo {
		width: 750upx;
		height: 240upx;
		padding: 20upx;
		box-sizing: border-box;
		/* background-color: #4cd964; */
		background-color: #FA436A;
		flex-direction: row;
		align-items: center;
	}

	.logo-hover {
		opacity: 0.8;
	}

	.logo-img {
		width: 150upx;
		height: 150upx;
		border-radius: 150upx;
	}

	.logo-title {
		height: 150upx;
		flex: 1;
		align-items: center;
		justify-content: space-between;
		flex-direction: row;
		margin-left: 20upx;
	}

	.uer-name {
		height: 60upx;
		line-height: 60upx;
		font-size: 38upx;
		color: #FFFFFF;
	}

	.go-login.navigat-arrow {
		font-size: 38upx;
		color: #FFFFFF;
	}

	.login-title {
		height: 150upx;
		align-items: self-start;
		justify-content: center;
		flex-direction: column;
		margin-left: 20upx;
	}

	.center-list {
		/* background-color: #FFFFFF; */
		margin-top: 20upx;
		width: 750upx;
		flex-direction: column;
	}

	.center-list-item {
		flex-direction: row;
		padding: 20upx;
		align-items: center;
		margin: 30upx 20upx 0;
		background-color: #fff;
	}
	
	.center-list-item image{
		width: 70upx;
		height: 70upx;
	}

	.border-bottom {
		border-bottom-width: 1upx;
		border-color: #c8c7cc;
		border-bottom-style: solid;
	}

	.list-icon {
		width: 40upx;
		height: 90upx;
		line-height: 90upx;
		font-size: 34upx;
		color: #FA436A;/* #4cd964; */
		text-align: center;
		font-family: texticons;
		margin-right: 20upx;
	}

	.list-text {
		height: 90upx;
		line-height: 90upx;
		font-size: 34upx;
		color: #555;
		flex: 1;
		text-align: left;
	}

	.navigat-arrow {
		height: 90upx;
		width: 40upx;
		line-height: 90upx;
		font-size: 34upx;
		color: #555;
		text-align: right;
		font-family: texticons;
	}
	
	.share-box{
		position: fixed;
		width: 100%;
		height: 100%;
		z-index: 1000;
	}
	.share-wrapper{
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background: #A0A0A0;
		opacity: 0.8;
	}
	.share-content{
		border-radius: 10px 10px 0 0;
		display: inline-block;
		    z-index: 1;
		    width: 100%;
		    position: absolute;
		    bottom: 0;
		    height: 200px;
		    background: white;
	}
	.share-item{
		padding: 20px 15px;
		
	}
	.share-title{
		text-align: center;
		padding: 10px 0;
		    font-weight: bolder;
		    font-size: 16px;
			border-bottom: 1px solid #3C3C3C;
	}
	.share-item image{
		width: 50px;
		height: 50px;
		border-radius: 50%;
		margin-right: 20px;
	}
</style>