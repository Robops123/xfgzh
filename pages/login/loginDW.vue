<template>
	<view class=" login-bg">
		<!-- <view class="logo"><image src="../../static/logo.png" mode=""></image></view> -->
		<view class="appname" style="margin-top: 100upx;">
			锡消宝
		</view>
		<view class="content">
			<view class="step">
				<view class="step-btn" :class="{active:active==0}">登录</view>
				<view class="line"></view>
				<view class="step-btn step-btn1" :class="{active:active==1}">认证绑定</view>
			</view>
			<!-- 登录 -->
			<view class="" v-if="active==0">
				<view class="uni-form-item uni-column">
					<view>账号</view>
					<input type="tel" class="uni-input" v-model="loginName" name="" placeholder="请输入手机号码" />
				</view>
				<view>密码</view>
				<view class="uni-form-item uni-column ">
					<view style="position: relative;padding: 10upx 0;">
						<input type="text" class="uni-input" name="" v-model="password" placeholder="请输入验证码" />
						<button class="veribtn" @click="getCode" :disabled="!show">
							 <span v-show="show">获取验证码</span>
							 <span v-show="!show" class="count">{{count}} s</span>
						</button>
					</view>
				</view>
				<button type="primary" @tap="login">登录</button>
				<!-- <button class="regBtn" type="text" @tap='gotoRegistration' v-if="!hasAccount">注册</button> -->
			</view>
			
			<!-- 绑定 -->
			<view class="" v-if="active==1 & hasAccount">
				<view class="uni-form-item uni-column">
					<view>账号</view>
					<input type="tel" class="uni-input" v-model="loginName" name="" placeholder="用户名称 xxx@xxx" />
				</view>
				<view class="uni-form-item uni-column ">
					<view>密码</view>
					<input type="text" class="uni-input" name="" v-model="password" placeholder="请输入密码" />
				</view>
				<button type="primary" @tap="login">认证&绑定</button>
			</view>
		</view>
		
		<!-- <button @click="test">到注册</button> -->
	</view>
</template>

<script>
	import request from '../../api/request.js'
	import global from '../../static/js/global.js'
	// import uniSteps from '@/components/uni-steps/uni-steps.vue'
	export default {
		components:{
			// uniSteps
		},
		data() {
			return {
				openId:'',
				hasAccount:false,
				loginName:'',
				password:'',
				active:0,
				steps:[
					{title: '登录'}, {title: '认证&绑定'}
				],
				code:'',
				seconds: 10,
				count:60,
				timer:null,
				show:true,
			}
		},
		onLoad() {
			var code=this.getUrlParam('code')
			var that=this
			if(code!=null){
				this.getOpenId(code)
			}
			uni.$once('registered',function(){
				that.hasAccount=true
				that.active=1
			})
		},
		methods: {
			// test(){
			// 	uni.redirectTo({
			// 		url:'./registration?userType=1'
			// 	})
			// },
			login: function () {
				// this.active=1
				if(this.loginName!=''){
					if(this.password==''){
						global.showToast('请输入登录密码')
					}else{
						var that=this
						global.showLoading()
						var param = {
							openId:uni.getStorageSync('openid'),
							loginName:this.loginName,
							password:this.password
						}
						request.apiPost('/tob/user/login',param).then((res) =>{
							if(res.code == '0'){
								uni.setStorageSync('usertype','dw')
								uni.setStorageSync('openid',res.data.openId)
								uni.setStorageSync('userinfo',res.data)
								uni.switchTab({
									url: '/pages/index/index'
								});
								global.hideLoading()
							}
							// else if(res.code == '2'){
								
							// }
							else{
								global.hideLoading()
								global.showToast(res.msg)
							}
						}).catch((reason) =>{
							global.hideLoading()
							global.showToast(reason)
						})
					}
				}else{
					global.showToast('请输入用户名')
				}
			
			},
			rz(){
				uni.setStorageSync('usertype','dw')
				uni.switchTab({
					url: '/pages/index/index'
				})
			},
			getCode() {
			       //axios请求
			      // 验证码倒计时
								// global.showLoading()
			     // var data={
			     // 	code:code
			     // }
							   var that=this
			     // request.apiGet('/toc/tocUser/getOpenId',data).then((res) =>{
			     // 	if(res.code == '0'){
									that.settimer()
			     	// }else{
			     	// 	global.showToast('短信获取失败')
			     	// }
			     // 	global.hideLoading()
			     // }).catch((reason) =>{
			     // 	global.hideLoading()
			     // 	global.showToast('网络错误')
			     // })
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
							  },
			gotoRegistration: function () {
				uni.navigateTo({url: 'registration'});
			},
			gotoForgetPassword: function () {
				uni.navigateTo({url: 'forget-password'});
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
			getOpenId(code){
				global.showLoading()
				var data={
					code:code
				},that=this
				request.apiGet('/toc/tocUser/getOpenId',data).then((res) =>{
					if(res.code == '0'){
						global.hideLoading()
						that.openId=res.openId
						uni.setStorageSync('openid',res.openId)
						that.findUser()
					}else{
						global.hideLoading()
						global.showToast('请在微信环境下打开')
					}
					
				}).catch((reason) =>{
					global.hideLoading()
					global.showToast('网络错误')
				})
			},
			findUser(){
				global.showLoading()
				var data={
					openId:this.openId,
					userType:1
				},that=this
				request.apiGet('/toc/tocUser/find',data).then((res) =>{
					if(res.code == '0'){
						uni.setStorageSync('usertype','dw')
						uni.setStorageSync('openid',that.openId)
						uni.setStorageSync('userinfo',res.data)
						uni.switchTab({
							url: '/pages/index/index'
						});
						// that.hasAccount=true
					}else if(res.code=='3'){
						that.active=1
						that.hasAccount=true
						// that.hasAccount=false
					}else{
						uni.redirectTo({
							url:'./registration?userType=1'
						})
					}
					global.hideLoading()
				}).catch((reason) =>{
					global.hideLoading()
					global.showToast('网络错误')
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	$color-primary: #FA436A;
	.content{
		padding: 50upx 20upx;
		margin: 0 30upx 0;
		background-color: #fff;
		border-radius: 8px 8px 0 0;
		box-shadow: 0 0 8px #ccc;
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
		position: relative;
		.uni-input{
			font-size: 30upx;
			padding: 2px 0;
		}
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
	
	.column-with-btn{
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		button{
			font-size: 24upx;
			margin: 0;
			width: 180upx;
			text-align: center;
			&:after{
				border: none
			}
			&.active{
				background-color: $color-primary;
				color: $uni-text-color-inverse;
			}
		}
	}
	.uni-column button[type="primary"]{
		background-color: #0f87f5;
		border-radius: 0;
		font-size: 34upx;
		float: right;
	}
	
	.veribtn{
		position: absolute;
		right: 0;
		top: -10upx;
		height: 100%;
		margin-top: 0;
		line-height: 56upx;
		background-color: #fff;
		color: #3F87FF;
		border: 1px solid #3F87FF;
		}
		
		.regBtn{
			background: none;
			color: #0f87f5;
			border: none !important;
			font-size: 30upx;
		}
		.regBtn::after{
			display: none;
		}
		
		
		.login-bg{
			background-image: url(../../static/img/login/bg.png);
			background-size: 100%;
			background-repeat: no-repeat;
			padding-top: 110upx;
			border-top: 0;
		}
		.login-btn{
			background:rgba(63,135,255,1) !important;
			border-radius:34px !important;
		}
		
		.step{
			display: flex;
			width: 60%;
			align-items: center;
			margin: 20upx auto;
		}
		.step-btn{
			width: 80upx;
			height: 80upx;
			line-height: 80upx;
			text-align: center;
			border-radius: 50%;
			background-color: #CBCDD0;
			color: #fff;
		}
		.step .step-btn1{
			line-height: 40upx;
		}
		.step .line{
			flex: 1;
			margin: 0 20upx;
			border-top: 1px dashed #D2C2C2;
		}
		.step-btn.active{
			background-color: #1d76fb;
		}
</style>
