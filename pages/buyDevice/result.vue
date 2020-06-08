<template>
	<view style='text-align: center;'>
		<view class='show-banner'>
			<view>收款单位:{{data.receiveCompany}}</view>
			<view>开户行:{{data.bankName}}</view>
			<view>银行账号:{{data.bankAccount}}</view>
		</view>
		
		<view>订单已提交，请记录收款账户信息，尽快通过对公账户进行支付，谢谢！</view>
		
		<view class='btn' @click='back'>完成</view>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				data:{}
			}
		},
		onLoad(p){
			this.data=JSON.parse(p.data)
		},
		methods:{
			back(){
				uni.redirectTo({url: '/pages/buyDevice/index'})
			}
		}
	}
</script>

<style>
	.show-banner{
		width: 80%;
		padding: 10px 0;
		margin: 50px auto 30px;
		background-color: #ffcccc;
		border: 1px solid #000000;
	}
	.show-banner view{
		margin: 20upx 0;
	}
	.btn{
		width: 80%;
		margin: 20px auto;
		line-height: 30px;
		background-color: #ffcccc;
	}
</style>
