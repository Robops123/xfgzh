<template>
    <view class='my-unit' >
		<view class="unit-head" @click="showOrder">
			<text>1通知消息通知消息通知消息通知消息</text>
			<text>通知消息通知消息通知消息通知消息</text>
		</view>
		<view class="unit-head" @click="showOrder">
			<text>2通知消息通知消息通知消息通知消息</text>
			<text>通知消息通知消息通知消息通知消息</text>
		</view>
		<view class="unit-head" @click="showOrder">
			<text>3通知消息通知消息通知消息通知消息</text>
			<text>通知消息通知消息通知消息通知消息</text>
		</view>
    </view>
</template>
	
<script>
	import request from '../../../api/request.js'
	import global from '../../../static/js/global.js'
    export default{
        data() {
            return {
				warningList:[]
            }
        },
        methods:{
			showOrder(){
				uni.navigateTo({
					url: "/pages/workorder/showOrder"
				})
			},
			doHandle(){
				uni.navigateTo({
					url: "/pages/workorder/editOrder"
				})
			},
			doTransfer(){
				uni.navigateTo({
					url: "/pages/workorder/transferOrder"
				})				
			},
			doDel(){
				this.$store.commit("switch_loading")
			},
			getlist:function(){
				var self = this
				self.gridList = self.list
				
				var param = {
					openId:'wx123456789'	,
					warnType:''
				}
				request.apiGet('/toc/deviceWarn/listWarn',param).then((res) =>{
					if(res.code == '0'){
						this.warningList=res.data
					}
				})
			}
        },
		computed:{
			
		},
		created() {
			this.getlist()
		},
    }
</script>
<style lang='scss'>
    .my-unit{
		margin: 20upx 0;
		background-color: #ffffff;
		font-size: 28upx;
		transform: all 1s;
		
		.unit-head{
			padding: 20upx;
			height: 110upx;
			box-sizing: border-box;
			border-bottom: 2upx solid #f5f5f5;
		}
		.unit-body{
			padding: 20upx;
			display: flex;
			flex-wrap: wrap;
			
			text{
				width: 50%;
				font-size: 28upx;
				line-height: 55upx;
			}
		}
		.unit-foot{
			height: 88upx;
			padding: 0 20upx;
			border-top: 2upx solid #f5f5f5;
			border-bottom: none;
			line-height: 88upx;
			
			.btn{
				float: left;
				height: 60upx;
				font-size: 28upx;
				line-height: 60upx;
				margin: 14upx 30upx;
			}
		}
	}
</style>