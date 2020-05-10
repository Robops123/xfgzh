<template>
	<view class="login-bg">
		<view class="appname" style="margin-top: 100upx;">
			锡消宝
		</view>
		<view class="content">
			<view class="uni-form-item uni-column">
				<view>账号</view>
				<input type="tel" class="uni-input" v-model="phone" name="" placeholder="请输入手机号" />
			</view>
			<view class="uni-form-item uni-column">
				<view>短信验证码</view>
				<view style="position: relative;padding: 10upx 0;">
					<input type="text" class="uni-input" name="" v-model="code" placeholder="短信验证码" />
					<button class="veribtn" @click="getCode" :disabled="!show">
						 <span v-show="show">获取验证码</span>
						 <span v-show="!show" class="count">{{count}} s</span>
					</button>
				</view>
			</view>
			<view class="uni-form-item uni-column">
				<view>验证码</view>
				<view style="position: relative;padding: 10upx 0;">
					<input type="text" class="uni-input" name="" v-model="picCode" placeholder="请输入验证码" />
					<image :src="pic" mode="" class="veribtn veripic" @click="changePic"></image>
				</view>
			</view>
			<button type="primary"  class="login-btn" @tap='register'>注册</button>
			<!-- <view class="links">已有账号？<view class="link-highlight" @tap="gotoLogin">点此登录</view></view> -->
		</view>
		
		<!-- <button @click="test">返回</button> -->
	</view>
</template>

<script>
	import global from '../../static/js/global.js';
	import request from '../../api/request.js'
	export default {
		data() {
			return {
				seconds: 10,
				count:60,
				timer:null,
				show:true,
				phone:'',
				code:'',
				picCode:'',
				password:'',
				t:'',
				userType:'',
				openId:''
			}
		},
		onLoad(p) {
			this.userType=p.userType
				this.t=this.generateRandom()
				this.openId=uni.getStorageSync('openid')
				// this.getPic(t)
		},
		methods: {
			getCode() {
			       //axios请求
			      // 验证码倒计时
				  if(this.picCode==''){
					  global.showToast('请填写图中验证码中的内容')
					  return ;
				  }
				global.showLoading()
			     var data={
			     	phone:this.phone,
					t:this.t,
					captchaCode:this.picCode
			     }
				var that=this
			     request.apiGet('/weixin/sendVaildMsg',data).then((res) =>{
			     	if(res.code == '0'){
						that.settimer()
			     	}else{
			     		global.showToast(res.msg)
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
							  },
			register:function(){
				var regexp=/^1[3456789]\d{9}$/
				var that=this
				if((regexp.test(this.phone))){
					// if(this.password){
						global.showLoading()
						var param={
							openId:uni.getStorageSync('openid'),
							phone:this.phone,
							code:this.code,
							userType:this.userType
							// password:this.password
						}
						request.apiPost('/toc/tocUser/register',param).then((res) =>{
							if(res.code == '0'){
								if(that.userType==0){
									// 个人
									uni.setStorageSync('usertype','gr')
									uni.setStorageSync('openid',that.openId)
									uni.setStorageSync('userinfo',res.data)
									uni.switchTab({
										url:'/pages/index/index'
									});
								}else{
										// 单位
										uni.$emit('registered')
										uni.redirectTo({
											url:'./loginDW'
										})
								}
								global.hideLoading()
							}else{
								global.hideLoading()
								global.showToast(res.msg)
							}
						}).catch((reason) =>{
							global.hideLoading()
							global.showToast(reason)
						})
					// }else{
					// 	global.showToast('请输入密码')
					// }
				}else{
					global.showToast('请输入正确手机号')
				}
			},
			gotoLogin: function () {
				uni.navigateTo({
					url: 'login'
				})
			},
			generateRandom(){
				var str='abcdefghijklmnopqrstuvwxyz1234567890',pattern='',l=str.length
				for(var i=0;i<4;i++){
					pattern+=str[Math.floor(Math.random()*l)]
				}
				return pattern;
			},
			changePic(t){
				this.t=this.generateRandom()
			}
		},
		computed: {
			disableCodeBtn: function (){
				return this.codeBtn.waitingCode < 4;
			},
			pic(){
				return request.baseURL+'/weixin/captcha?t='+this.t
			}
		}
	}
</script>

<style lang="scss" scoped>
	$color-primary: #FA436A;
	.content {
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
		    margin: 0 0 40upx;
		}
	}
	.uni-form-item{
		margin-bottom: 40upx;
		padding: 0;
		border-bottom: 1px solid #e3e3e3;
		.uni-input{
			font-size: 30upx;
			padding: 7px 0;
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
	.img-captcha{
		width: 150upx;
		height: 60upx;
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
			color: #3f87ff;
		}
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
	.veribtn{
		position: absolute;
		right: 0;
		top: 20upx;
		height: 70%;
		margin-top: 0;
		line-height: 56upx;
		background-color: #fff;
		color: #3F87FF;
		border: 1px solid #3F87FF;
		}
		.veripic{
			width: 230upx;
		}
</style>
