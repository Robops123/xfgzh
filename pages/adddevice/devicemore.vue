<template>
	<view class='purchase-list'>
		<my-tabs @change="tapChange" :modelData="modelData" :initIndex="initIndex"></my-tabs>
		<scroll-view class="purchase-body" scroll-y="true" @scrolltolower="scrolltolower" style="height: calc(100vh - 260upx);"
		 >
			<!-- <my-unit v-for="(item,index) in 1" :key="index" :info="item"></my-unit> -->
			<view class="list">
				<view class="flex_col"  v-for="(item,index) in userList"
				 :key="index" :data-index="index">
					<image :src="item.iconUrl" mode="aspectFill"></image>
					<view class="flex_grow">
						<view class="flex_col">
							<view class="flex_grow" >
								<fa-icon class="fa-icon" type="info" style="margin-right: 10upx;" size="12" color="#000" @click="repair"></fa-icon>
								{{item.title}}
							</view>
							<!-- <view class="flex_grow" v-else>
								<fa-icon class="fa-icon" type="info" style="margin-right: 10upx;" size="12" color="#000" @click="repair"></fa-icon>
								{{item.remark}}
							</view> -->
						</view>
						<view class="info">{{item.updateTime}}
						<text class="state" style="background-color:#07BB07;color: white;float: right;" v-if="item.devState===1 && curType==0">在线</text>
						<text class="state" style="background-color:#DC3545;color: white;float: right;" v-if="item.devState===0 && curType==0">离线</text>
						<text class="state" style="background-color:#07BB07;color: white;float: right;" v-if="item.warnStatus===0 && curType==0">已解除</text>
						<text class="state" style="background-color:#DC3545;color: white;float: right;" v-if="item.warnStatus===1 && curType==0">告警</text>
						<text class="state" style="background-color:#DC3545;color: white;float: right;" v-if="item.warnStatus===2 && curType==0">已确认</text>
						<text class="state" style="background-color:#DC3545;color: white;float: right;" v-if="item.warnStatus===3 && curType==0">误报</text>
						<text class="state" style="background-color:#07BB07;color: white;float: right;" v-if="item.repairStatus===0 && curType==1">新上报</text>
						<text class="state" style="background-color:#DC3545;color: white;float: right;" v-if="item.repairStatus===1 && curType==1">已修复</text>
						</view>
						
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>
<script>
	import myTabs from '@/components/myTabs/myDeviceMore.vue'
	import myPull from '@/static/js/myDeviceMore.js'
	import faIcon from "@/components/fa-icon/fa-icon.vue"
	import request from '../../api/request.js'
	import global from '../../static/js/global.js'
	export default {
		components:{myTabs,myPull,faIcon},
		data() {
			return {
				userList: [],
				/* 显示遮罩 */
				showShade: false,
				/* 窗口尺寸 */
				winSize: {},
				page:1,
				devId:'',
				curType:'',
				total:''
			}
		},
		onLoad(e) {
			this.devId=e.id
			this.getWarnList()
		
			// #ifdef H5
			document.onLong = function(e) {
				var e = e || window.event;
				e.preventDefault();
			};
			// #endif
		},
		methods: {
			/**
			 * @name 改变tab
			 * @param val 索引
			 */
			tapChange(val){
				if(this.curType!=val){
					this.curType=val
					this.initIndex=val
					this.page=1
					this.total=''
					this.userList=[]
					if(val==0){
						this.getWarnList()
					}else if(val==1){
						this.getRepairList()
					}
				}
			},
			/* 获取列表数据 */
			getWarnList() {
				var that = this
				var param = {
					openId:uni.getStorageSync('openid'),
					devId:this.devId,
					page:this.page,
					limit:10
				}
				request.apiGet('/toc/deviceWarn/listWarnByDev/',param).then((res) =>{
					if(res.code == '0'){
						this.userList=this.userList.concat(res.data)
						this.total=res.total
					}
				})
			},
			getRepairList() {
				var that = this
				var param = {
					openId:uni.getStorageSync('openid'),
					devId:this.devId,
					page:this.page,
					limit:10
				}
				request.apiGet('/toc/deviceRepair/listRepairByDev/',param).then((res) =>{
					if(res.code == '0'){
						this.userList=this.userList.concat(res.data)
						this.total=res.total
					}
				})
			},
			scrolltolower(){
				if(this.userList.length<this.total){
					this.page++
					if(this.curType==0){
						this.getWarnList()
					}else if(this.curType==1){
						this.getRepairList()
					}
				}
			}
		},
		mixins:[myPull({})],
		
	}
</script>
<style lang='scss'>
	.purchase-list {
		background-color: #f5f5f5;
		height: 100%;
		overflow: hidden;
		
		.purchase-body{
			height: calc(100% - 88upx);
			overflow: auto
		}
	}
	
	/* 列式弹性盒子 */
	.flex_col {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: flex-start;
		align-items: center;
		align-content: center;
	}
	
	/* 弹性盒子弹性容器 */
	.flex_col .flex_grow {
		width: 0;
		-webkit-box-flex: 1;
		-ms-flex-positive: 1;
		flex-grow: 1;
	}
	
	.flex_row .flex_grow {
		-webkit-box-flex: 1;
		-ms-flex-positive: 1;
		flex-grow: 1;
	}
	
	/* 弹性盒子允许换行 */
	.flex_col.flex_wrap {
		-ms-flex-wrap: wrap;
		flex-wrap: wrap;
	}
	.state
	{
		color: #000000;
		padding:0 10upx;
	}
	/* 列表 */
	.list {
		background-color: #fff;
		font-size: 28upx;
		color: #333;
		user-select: none;
		touch-callout: none;
	
		&>view {
			padding: 24upx 30upx;
			position: relative;
	
			&:active,
			&.active {
				background-color: #f3f3f3;
			}
	
			image {
				height: 80upx;
				width: 80upx;
				border-radius: 4px;
				margin-right: 20upx;
			}
	
			&>view {
				line-height: 40upx;
	
				.time,
				.info {
					color: #999;
					font-size: 24upx;
				}
	
				.time {
					width: 150upx;
					text-align: right;
				}
	
				.info {
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
		}
	
		&>view:not(:first-child) {
			margin-top: 1px;
	
			&::after {
				content: '';
				display: block;
				height: 0;
				border-top: #CCC solid 1px;
				width: 620upx;
				position: absolute;
				top: -1px;
				right: 0;
				transform:scaleY(0.5);	/* 1px像素 */
			}
		}
	}
	
	/* 遮罩 */
	.shade {
		position: fixed;
		z-index: 100;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		-webkit-touch-callout: none;
	
		.pop {
			position: fixed;
			z-index: 101;
			width: 200upx;
			box-sizing: border-box;
			font-size: 28upx;
			text-align: left;
			color: #333;
			background-color: #fff;
			box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
			line-height: 80upx;
			transition: transform 0.15s ease-in-out 0s;
			user-select: none;
			-webkit-touch-callout: none;
			transform: scale(0, 0);
	
			&.show {
				transform: scale(1, 1);
			}
	
			&>view {
				padding: 0 20upx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				user-select: none;
				-webkit-touch-callout: none;
	
				&:active {
					background-color: #f3f3f3;
				}
			}
		}
	}
</style>
