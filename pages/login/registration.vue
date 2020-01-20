<template>
	<view class="content">
		<view class="logo"><image src="../../static/logo.png" mode=""></image></view>
		<view class="uni-form-item uni-column">
			<input type="tel" class="uni-input" name="" v-model="phone" placeholder="请输入手机号" />
		</view>
		<view class="uni-form-item uni-column column-with-btn">
			<input type="number" class="uni-input" name="" v-model="code" placeholder="请输入验证码" />
			<button :class="{active : !disableCodeBtn}" :disabled="disableCodeBtn" @tap="sendCode">{{codeBtn.text}}</button>
		</view>
		<view class="uni-form-item uni-column">
			<input type="password" class="uni-input" name="" v-model="password" placeholder="请输入密码" />
		</view>
		<button type="primary" @tap='register'>注册</button>
		<view class="links">已有账号？<view class="link-highlight" @tap="gotoLogin">点此登陆</view></view>
	</view>
</template>

<script>
	import global from '../../static/js/global.js';
	import request from '../../api/request.js'
	export default {
		data() {
			return {
				seconds: 10,
				codeBtn: {
					text: '获取验证码',
					waitingCode: false,
					count: this.seconds
				},
				phone:'',
				code:'',
				password:''
			}
		},
		onLoad() {

		},
		methods: {
			sendCode: function () {
				this.codeBtn.waitingCode = true;
				this.codeBtn.count = this.seconds;
				this.codeBtn.text = this.codeBtn.count + 's';
				
				let countdown = setInterval( () => {
					this.codeBtn.count--;
					this.codeBtn.text = this.codeBtn.count + 's';
					if( this.codeBtn.count < 0 ){
						clearInterval(countdown);
						this.codeBtn.text = '重新发送';
						this.codeBtn.waitingCode = false;
					}
				},1000);
			},
			register:function(){
				var regexp=/^1[3456789]\d{9}$/
				if((regexp.test(this.phone))){
					if(this.password){
						global.showLoading()
						var param={
							openId:uni.getStorageSync('openid'),
							phone:this.phone,
							code:this.code,
							password:this.password
						}
						request.apiPost('/toc/tocUser/register',param).then((res) =>{
							if(res.code == '0'){
								uni.switchTab({
									url:'/pages/index/index'
								});
								global.hideLoading()
							}else{
								global.hideLoading()
								global.showToast(res.msg)
							}
						}).catch((reason) =>{
							global.hideLoading()
							global.showToast(reason)
						})
					}else{
						global.showToast('请输入密码')
					}
				}else{
					global.showToast('请输入正确手机号')
				}
			},
			gotoLogin: function () {
				uni.navigateTo({
					url: 'login'
				})
			}
		},
		computed: {
			disableCodeBtn: function (){
				return this.codeBtn.waitingCode < 4;
			} 
		}
	}
</script>

<style lang="scss" scoped>
	$color-primary: #FA436A;
	.content{
		padding: 60upx 100upx 100upx;
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
			color: $color-primary
		}
	}
</style>
