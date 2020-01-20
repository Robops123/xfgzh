<template>
	<view>
		<!-- <view class="grid-title">
			<view></view>
			<text>业务功能</text>
		</view> -->
		<view class="grid">
			<template v-if="col == 3">
				<view class="grid-item-3" 
					v-for="(item, index) in gridList" 
					:key="index" 
					@click.stop="gridClick(item, index)">
					<view style="display: flex;justify-content: space-between;margin-bottom: 10px;">
						<view  v-if="item.devState=='0'" style="color: #47CC9F;">在线</view>
						<view  v-if="item.devState=='1'" style="color: #A8A8A8;">离线</view>
						<view  v-if="item.isWarn=='0'" style="color: #464E52;">无告警</view>
						<view  v-if="item.isWarn=='1'" style="color: #FF5567;">普通告警</view>
						<view  v-if="item.isWarn=='2'" style="color: #FF5567;">超时告警</view>
					</view>
					<image src="../../static/img/cameraIcoOnline.png" v-if="item.devState=='0'" mode=""></image>
					<image src="../../static/img/cameraIcoOffline.png" v-if="item.devState=='1'" mode=""></image>
					<view>
						{{item.devName}}
					</view>
					<view @click.stop="repair(item,index)" class="repair">
						<image src="../../static/img/setIco@2x.png" mode=""></image>设备报修
					</view>
					<!-- <view @click.stop="repair(item)">
						<fa-icon class="fa-icon" type="wrench " size="12" color="#000" ></fa-icon>
					</view> -->
				</view>
			</template>
			<!-- <template v-else-if="col == 4">
				<view class="grid-item-4" v-for="(item, index) in gridList" :key="index" @click="gridClick(item, index)">
					<image :src="item.imgUrl" mode=""></image>
					<view v-text="item.name"></view>
					<view v-text="item.num"></view>
					<view v-text="item.state"></view>
					<text v-if="showTip && item.tips" v-text="item.tips"></text> 
					<fa-icon class="fa-icon" type="wrench " size="12" color="#000" @click="repair"></fa-icon>
				</view>
			</template> -->
		</view>
	</view>
</template>

<script>
	import faIcon from "@/components/fa-icon/fa-icon.vue"
	import request from '../../api/request.js'
	import global from '../../static/js/global.js'
	export default{
		components: {
			faIcon
		},
		name: 'zy-grid',
		props: {
			col: {	//每行显示格子数，支持每行3个或4个(默认为3)
				type: Number,
				value: 3
			},
			showTip: {	//格子菜单的数字角标(默认显示)
				type: Boolean,
				value: true
			},
			list: {
				type:Array,
				value:''
			},
		},
		data () {
			return {
				// gridList: [	//格子数据列表
				// 	{
				// 		name: '可燃气体监测仪',
				// 		num: 2,
				// 		state:"在线",
				// 		imgUrl: '/static/img/MiniGgasMonitor.png',
				// 		tips: 19,
				// 		rote:'/pages/workorder/workorderlist'
				// 	},
				// 	{
				// 		name: '烟感报警器',
				// 		num: 2,
				// 		state:"离线",
				// 		imgUrl: '/static/img/MiniSmokeTrans.png',
				// 		tips: 19,
				// 		rote:'/pages/workorder/workorderlist'
				// 	},
				// 	{
				// 		name: '可燃气体监测仪',
				// 		num: 2,
				// 		state:"离线",
				// 		imgUrl: '/static/img/MiniGgasMonitor.png',
				// 		tips: 19,
				// 		rote:'/pages/workorder/workorderlist'
				// 	}
				// ],
				deviceTypeList:[],
			}
		},
		created() {
			var self = this
			self.gridList = self.list
		},
		methods:{
			gridClick (item, index) {	//格子菜单点击事件
				uni.navigateTo({
					url: '/pages/adddevice/devicedetail?item='+JSON.stringify(item)
				})
			},
			repair(item)
			{
				uni.navigateTo({
					url:"/pages/repair/repairEdit?item="+JSON.stringify(item)
				})
			}
		},
		watch:{
			list(n,o){
				this.gridList=this.list
				this.$forceUpdate()
			}
		}
	}
</script>

<style lang="less" scoped>
	.grid-title{
		display: flex;
		align-items: center;
		font-size: 32upx;
		color: rgba(0,0,0,.63);
		padding: 30upx 0;
		view{
			width: 8upx;
			height: 30upx;
			background-color:  rgba(255,82,65,1);
			margin-right: 20upx;
		}
	}
	.grid{
		display: flex;
		padding: 10px 0;
		background: white;
		    display: -webkit-box;
		max-width: 99999px;
		align-items: center;
		flex-wrap: wrap;
		border-top: 2upx solid rgba(172,172,172,.2);
		.grid-item-3,.grid-item-4{
			background-color:#f7f7f7;
			box-sizing: border-box;
			width: 220upx;
			border-radius: 3px;
			margin-left: 10px;
			padding: 0 10upx;
			border-bottom: 2upx solid rgba(172,172,172,.2);
			border-right: 2upx solid rgba(172,172,172,.2);
			text-align: center;
			position: relative;
			image{
				width: 74upx;
				height: 74upx;
				vertical-align: middle;
			}
			view{
				font-size: 28upx;
				margin-top: 6upx;
				//color: #07BB07;
			}
			
		}
		.repair{
			background-color: #EDEDED;
			color: #5B6BA3;
		}
		.repair image{
			width: 16px;
			height: 16px;
		}
		.grid-item-3:nth-child(3n + 3),.grid-item-4:nth-child(4n + 4){
			border-right: none;
		}
		.grid-item-4{
			width: calc(100% / 4);
		}
		.fa-icon{
				display: block;
				padding: 4upx 8upx;
				text-align: center;
				border-radius: 36upx;
				font-size: 40upx;
				background-color: rgba(255,82,65,1);
				color: rgba(255,255,255,1);
				position: absolute;
				right: 20upx;
				top: 10upx;
			}
	}
</style>
