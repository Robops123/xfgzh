<template>
	<view class="content">
		<uni-steps :options="steps" active-color="#0f87f5" :active="active"></uni-steps>
		<view class="logo"><image src="../../static/logo.png" mode=""></image></view>
		
		<!-- 登录 -->
		<view class="" v-if="active==0">
			<view class="uni-form-item uni-column">
				<input type="tel" class="uni-input" v-model="loginName" name="" placeholder="请输入手机号码" />
			</view>
			<view class="uni-form-item uni-column column-with-btn">
				<input type="text" class="uni-input" name="" v-model="code" placeholder="请输入验证码" />
				<button class="veribtn" @click="getCode" :disabled="!show">
					 <span v-show="show">获取验证码</span>
					 <span v-show="!show" class="count">{{count}} s</span>
				</button>
			</view>
			<button type="primary" @tap="login">登录</button>
			<button class="regBtn" type="text" @tap='gotoRegistration'>注册</button>
		</view>
		
		<!-- 绑定 -->
		<view class="" v-if="active==1">
			<view class="uni-form-item uni-column">
				<input type="tel" class="uni-input" v-model="loginName" name="" placeholder="用户名称 xxx@xxx" />
			</view>
			<view class="uni-form-item uni-column column-with-btn">
				<input type="text" class="uni-input" name="" v-model="code" placeholder="请输入密码" />
			</view>
			<button type="primary" @tap="rz">认证&绑定</button>
		</view>
	</view>
</template>

<script>
	import request from '../../api/request.js'
	import global from '../../static/js/global.js'
	import uniSteps from '@/components/uni-steps/uni-steps.vue'
	export default {
		components:{
			uniSteps
		},
		data() {
			return {
				loginName:'root@yz0001',
				password:123456,
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
			
		},
		methods: {
			login: function () {
				this.active=1
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
								// uni.setStorageSync('usertype','dw')
								// uni.setStorageSync('userinfo',res.data)
								// uni.switchTab({
								// 	url: '/pages/index/index'
								// });
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
		top: 0;
		height: 100%;
		margin-top: 0;
		line-height: initial;
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
</style>
