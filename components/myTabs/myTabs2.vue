<template>
	<view :class="{'my-tabs':true,'space-between':formatBe}">
		<view  :class="{'tab-item':true,'active':curIndex==0}" @tap="tap(0)" style="border-radius: 90upx 0 0 90upx;">
			<text >告警</text><uni-badge :text="badges.badge0" type="error" size="small"></uni-badge>
		</view>
		<view  :class="{'tab-item':true,'active':curIndex==1}" @tap="tap(1)" style="border-radius: 0 90upx 90upx 0;">
			<text >故障</text><uni-badge :text="badges.badge1" type="error" size="small"></uni-badge>
		</view>
	<!-- 	<view  :class="{'tab-item':true,'active':curIndex==2}" @tap="tap(2)" >
			<text >离线</text><uni-badge  type="error" size="small"></uni-badge>
		</view> -->
	</view>
</template>

<script>
	import uniBadge from "@/components/uni-badge/uni-badge.vue"
	export default {
		props:['modelData','initIndex','badges'],
		components:{
			uniBadge
		},
		data() {
			return {
				curIndex:0
			}
		},
		mounted(){
			console.log(this.badges)
		},
		computed:{
			getModelData(){
				return this.modelData
			},
			formatBe(){
				return this.modelData
						?this.modelData.length>4?true:false
						:false
			},
			formatIndex(){
				return this.initIndex
			}
		},
		methods: {
			tap(index){
				this.curIndex=index
				this.$emit("change",index);
			}
		}
	}
</script>
<style lang='scss'>
	.my-tabs {
		background-color: #ffffff;
		height: 88upx;
		font-size: 28upx;
		display: flex;
		justify-content: space-around;
		box-sizing: border-box;
		/* border-top: 2upx solid #dddddd; */
		/* border-bottom: 2upx solid #dddddd; */
		/* min-width: 100%; */
		width: 80%;
		margin: 20upx auto;
		border-radius: 90upx;
		overflow-x: auto;
		
		.tab-item{
			box-sizing: border-box;
			width: 50%;
			line-height: 48upx;
			padding: 20upx 0;
			min-width: 100upx;
			display: flex;
			justify-content: center;
		}
		.tab-item.active{
			position: relative;
			background-color: #2a95f0;
			color: #fff;
		}
		.tab-item.active::after{
			content: "";
			position: absolute;
			bottom: 0;
			left:50%;
			transform: translateX(-50%);
			width: 100%;
			border-bottom: 4upx solid #3682FF;
			/* animation: test ease 1 1.5s; */
		}
	}
	.my-tabs.space-between{
		justify-content: space-between;
	}
	@keyframes test{
		0%{width: 100%}
		50%{width: 150%}
		100%{width: 100%}
	}
	uni-badge{
		display: inline-block;
	}
</style>
