<template>
	<view class="content b-t">
		<view :class="{'my-tabs':true}">
			<view  :class="{'tab-item':true,'active':curIndex==0}" @tap="tap(0)" style="border-radius: 90upx 0 0 90upx;">
				<text >全部</text>
				<!-- <uni-badge text="11" type="error" size="small"></uni-badge> -->
			</view>
			<view  :class="{'tab-item':true,'active':curIndex==1}" @tap="tap(1)">
				<text >三个月内</text>
				<!-- <uni-badge text="0" type="error" size="small"></uni-badge> -->
			</view>
			<view  :class="{'tab-item':true,'active':curIndex==2}" @tap="tap(2)" style="border-radius: 0 90upx 90upx 0;">
				<text >半年内</text>
				<!-- <uni-badge text="22" type="error" size="small"></uni-badge> -->
			</view>
		</view>
		<view>
			<scroll-view   style="height: calc(100vh - 180upx);"
			class="scroll-Y" @scrolltolower="lower" scroll-y="true"   >
			                    <view class="list"  :class="{'active':pickerUserIndex==index}"  v-for="(item,index) in addressList"
			                     :key="index" :data-index="index" @click="toDetail(item.repairId)">
			                     <image src="../../static/img/message/bx.png" mode="" class="status"></image>
			                    	<view class="title">
			                    		{{item.title}}
			                    	</view>
									<view class="coffline describe">{{item.remark}}</view>
			                    	<view class="brief">
			                    		<view>
			                    			<image src="../../static/img/device/location.png" mode=""></image>
			                    		</view>
			                    		<view>
			                    			<view class="address cblue">{{item.address}}</view>
			                    			<view class="date coffline">{{item.updateTime}}</view>
			                    		</view>
			                    	</view>
			                    </view>
			                </scroll-view>
		</view>
		<!-- <text style="display:block;padding: 16upx 30upx 10upx;lihe-height: 1.6;color: #fa436a;font-size: 24upx;">
			重要：
		</text> -->
		
		<!-- <button class="add-btn" @click="addAddress('add')">新增上报故障</button> -->
	</view>
</template>

<script>
	import request from '../../api/request.js'
	import global from '../../static/js/global.js'
	import uniBadge from "@/components/uni-badge/uni-badge.vue"
	export default {
		components:{
			uniBadge
		},
		data() {
			return {
				curIndex:0,
				total:'',
				refresh:false,
				source: 0,
				curMonth:'',
				curPage:1,
				offset:null,
				limit:10,
				addressList: [
					
				],
				tabList:[
					{label:'全部',value:''},
					{label:'3个月内',value:3},
					{label:'半年内',value:6}
				]
			}
		},
		onShow(){
			if(this.refresh){
				this.refresh=false
				this.getList()
				// this.source = option.source;
			}
		},
		onLoad(option){
			this.getList()
			// this.source = option.source;
		},
		methods: {
			toDetail(id){
				uni.navigateTo({
					url: `/pages/repair/repairDetail?id=${id}`
				})
			},
			//选择地址
			checkAddress(item){
				if(this.source == 1){
					//this.$api.prePage()获取上一页实例，在App.vue定义
					this.$api.prePage().addressData = item;
					uni.navigateBack()
				}
			},
			addAddress(type, item){
				uni.navigateTo({
					url: `/pages/hidTrouble/hidTroubleEdit`
				})
			},
			gorepair(item){
				// uni.navigateTo({
				// 	url:"/pages/repair/repairEdit?item="+JSON.stringify(item)
				// })
			},
			//添加或修改成功之后回调
			refreshList(data, type){
				//添加或修改后事件，这里直接在最前面添加了一条数据，实际应用中直接刷新地址列表即可
				this.addressList.unshift(data);
			},
			//获取报修列表
			getList(){
				if(this.total!='' && this.total<=this.addressList.length){
					return
				}
				var that=this
				global.showLoading()
				var param = {
					openId:uni.getStorageSync('openid'),
					month:this.curMonth,
					page:this.curPage,
					limit:this.limit
				}
				request.apiGet('/toc/deviceRepair/listRepair',param).then((res) =>{
					if(res.code == '0'){
						that.curPage++
						var total=[]
						that.total=res.total
						total=res.data
						// res.data.forEach((item,index) =>{
						// 	total.push({
						// 		name:item.devName,
						// 		user: item.contact,
						// 		time: item.updateTime,
						// 		default: true
						// 	})
						// })
						that.addressList=that.addressList.concat(total)
						global.hideLoading()
					}else{
						global.hideLoading()
						global.showToast(res.msg)
					}
				}).catch((reason) =>{
					global.hideLoading()
					global.showToast(reason)
				})
			},
			tap(v){
				this.curIndex=v
				this.curPage=1
				this.limit=10,
				this.total=''
				this.addressList=[]
				this.getList()
			},
			lower(){
				this.getList()
			}
		}
	}
</script>

<style lang='scss'>
	page{
		background-color: #f2f2f2;
		/* padding-bottom: 120upx; */
	}
	.content{
		position: relative;
	}
	.list{
		position: relative;
		align-items: center;
		padding: 20upx 30upx;
		margin: 0 20upx 20upx 20upx;
		background: #fff;
		position: relative;
	}
	.wrapper{
		display: flex;
		flex-direction: column;
		flex: 1;
	}
	.address-box{
		display: flex;
		align-items: center;
		.tag{
			font-size: 24upx;
			color: $base-color;
			margin-right: 10upx;
			background: #fffafb;
			border: 1px solid #ffb4c7;
			border-radius: 4upx;
			padding: 4upx 10upx;
			line-height: 1;
		}
		.address{
			font-size: 30upx;
			color: $font-color-dark;
		}
	}
	.u-box{
		font-size: 28upx;
		color: $font-color-light;
		margin-top: 16upx;
		.name{
			margin-right: 30upx;
		}
	}
	.icon-bianji{
		display: flex;
		align-items: center;
		height: 80upx;
		font-size: 40upx;
		color: $font-color-light;
		padding-left: 30upx;
	}
	
	.add-btn{
		position: fixed;
		left: 30upx;
		right: 30upx;
		bottom: 16upx;
		z-index: 95;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 690upx;
		height: 80upx;
		font-size: 32upx;
		color: #fff;
		background-color: $base-color;
		border-radius: 10upx;
		box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);		
	}
	.my-tabs {
		background-color: #ffffff;
		height: 88upx;
		font-size: 28upx;
		display: flex;
		justify-content: space-around;
		box-sizing: border-box;
		width: 80%;
		margin: 20upx auto;
		border-radius: 90upx;
		overflow-x: auto;
		
		.tab-item{
			box-sizing: border-box;
			width: 33%;
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
	
	.list .title{
		max-width: 80%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.list .status{
		position: absolute;
		right: 15upx;
		top: 0;
		width: 90upx;
		height: 90upx;
	}
	.brief{
		padding-top: 0 !important;
	}
	.brief>view{
		display: inline-block;
		vertical-align: top;
	}
	.brief image{
		width: 60upx !important;
		height: 60upx !important;
	}
	.brief .address{
		font-size: 32upx;
	}
	.operate{
		display: flex;
		justify-content: space-evenly;
		padding: 20upx 0;
		border-top: 1px solid #f2f2f2;
	}
	.list .describe{
		max-width: 90%;
		margin: 10upx 0;
	}
</style>
