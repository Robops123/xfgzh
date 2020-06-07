<template>
	<view class="content">
		<view class="eer">
			<text>恭喜您支付成功</text>
		</view>
		<view class="eer">
			<button type="primary" class="login-btn" @tap="backMineRecoed">完成</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onLoad(p) {
			
		},
		onShow(p)
		{
			
		},
		methods: {
			backMineRecoed()//返回我的订单
			{
				uni.redirectTo({url: '/pages/buyDevice/index'})
			}
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
	
	.eer{text-align: center;}

</style>