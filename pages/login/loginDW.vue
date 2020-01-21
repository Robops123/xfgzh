<template>
	<view class="content">
		<view class="logo"><image src="../../static/logo.png" mode=""></image></view>
		<view class="uni-form-item uni-column">
			<input type="tel" class="uni-input" v-model="loginName" name="" placeholder="请输入登录名xxx@yyy" />
		</view>
		<view class="uni-form-item uni-column">
			<input type="password" class="uni-input" v-model="password" name="" placeholder="请输入密码" />
		</view>
		<button type="primary" @tap="login">认证&绑定</button></view>
</template>

<script>
	import request from '../../api/request.js'
	import global from '../../static/js/global.js'
	export default {
		data() {
			return {
				loginName:'root@yz0001',
				password:123456
			}
		},
		onLoad() {
			
		},
		methods: {
			login: function () {
				// if(this.loginName!=''){
				// 	if(this.password==''){
				// 		global.showToast('请输入登录密码')
				// 	}else{
				// 		var that=this
				// 		global.showLoading()
				// 		var param = {
				// 			openId:'wx123456',
				// 			loginName:this.loginName,
				// 			password:this.password
				// 		}
				// 		request.apiPost('/toc/user/login',param).then((res) =>{
				// 			if(res.code == '0'){
								uni.setStorageSync('usertype','dw')
								// uni.setStorageSync('userinfo',res.data)
								uni.switchTab({
									url: '/pages/index/index'
								});
				// 				global.hideLoading()
				// 			}
				// 			// else if(res.code == '2'){
								
				// 			// }
				// 			else{
				// 				global.hideLoading()
				// 				global.showToast(res.msg)
				// 			}
				// 		}).catch((reason) =>{
				// 			global.hideLoading()
				// 			global.showToast(reason)
				// 		})
				// 	}
				// }else{
				// 	global.showToast('请输入用户名')
				// }
			},
			gotoRegistration: function () {
				uni.navigateTo({url: 'registration'});
			},
			gotoForgetPassword: function () {
				uni.navigateTo({url: 'forget-password'});
			}
		}
	}
</script>

<style lang="scss" scoped>
	$color-primary: #FA436A;
	.content{
		padding: 100upx;
	}
	.logo{
	    text-align: center;
		image{
		    height: 200upx;
		    width: 200upx;
		    margin: 0 0 60upx;
		}
	}
	.uni-form-item{
		margin-bottom: 40upx;
		padding: 0;
		border-bottom: 1px solid #e3e3e3;
		.uni-input{
			font-size: 30upx;
			padding: 2px 0;
		}
	}
	button[type="primary"]{
		background-color: $color-primary;
		border-radius: 0;
		font-size: 34upx;
		margin-top: 60upx;
	}
	.links{
		text-align: center;
		margin-top: 40upx;
		font-size: 26upx;
		color: #999;
		view{
			display: inline-block;
			vertical-align: top;
			margin: 0 10upx;
		}
		.link-highlight{
			color: $color-primary
		}
	}
</style>
