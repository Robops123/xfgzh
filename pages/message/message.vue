<template>
	<view class='purchase-list'>
		<my-tabs @change="tapChange" :modelData="modelData" :initIndex="initIndex"></my-tabs>
		<scroll-view class="purchase-body" scroll-y="true" @scrolltolower="scrolltolower" style="height: calc(100vh - 260upx);"
		 @scrolltoupper="scrolltoupper"  @touchstart="touchstart" @touchend="touchend">
			<!-- <my-unit v-for="(item,index) in 1" :key="index" :info="item"></my-unit> -->
			<view class="list">
				<view class="flex_col"  :class="{'active':pickerUserIndex==index}"  v-for="(item,index) in userList"
				 :key="index" :data-index="index">
					<image :src="item.iconUrl" mode="aspectFill"></image>
					<view class="flex_grow">
						<view class="flex_col">
							<view class="flex_grow">{{item.title}}</view>
						</view>
						<view class="flex_col">
							<view class="info flex_grow">地点:{{item.devLocation}}</view>
							
						</view>
						<view class="flex_col">
							<view class="time flex_grow">时间:{{item.updateTime}}</view>
							<!-- 故障 -->
							<view @tap="listTap(item,index,curType)" class="more" v-if="usertype=='gr'">···</view>
							<!-- <view @tap="listTap(item)" class="more" v-if="curType==1 && item.brokenStatus==0">···</view> -->
								<!-- <text style="background-color: #07BB07;" v-if="item.warnStatus===1">正常</text> -->
								
						</view>
						<text style="background-color:#DC3545;color: white;padding: 0 5px;" v-if="(curType==2 && item.status==1) || (item.type==2 && item.status==1)">故障提交</text>
						<text style="background-color:#DC3545;color: white;padding: 0 5px;" v-if="(curType==2 && item.status==2) || (item.type==2 && item.status==2)">处理中</text>
						<text style="background-color:#DC3545;color: white;padding: 0 5px;" v-if="(curType==2 && item.status==3) || (item.type==2 && item.status==3)">误报</text>
						<text style="background-color:#DC3545;color: white;padding: 0 5px;" v-if="(curType==1 && item.status===1) || (item.type==1 && item.status==1)">普通告警</text>
						<text style="background-color:#DC3545;color: white;padding: 0 5px;" v-if="(curType==1 && item.status===2) || (item.type==1 && item.status==2)">已确认</text>
						<text style="background-color:#DC3545;color: white;padding: 0 5px;" v-if="(curType==1 && item.status===3) || (item.type==1 && item.status==3)">误报</text>
					</view>
					
				</view>
			</view>
			<view class="shade" v-show="showShade" @tap="hidePop">
				<view class="pop" :style="popStyle" :class="{'show':showPop}">
					<view v-for="(item,index) in popButton" :key="index" @tap="pickerMenu" :data-index="index">{{item}}</view>
				</view>
			</view>
		</scroll-view>
		<min-action-sheet ref="as"></min-action-sheet>
		<my-loading></my-loading>
	</view>
</template>
<script>
	import myTabs from '@/components/myTabs/myTabs.vue'
	//import myUnit from '@/components/myUnits/purchaseUnit/unit.vue'
	import minActionSheet  from '@/components/comselect/comselect'
	import myPull from '@/static/js/myPull.js'
	import myLoading from '@/components/myLoading/myLoading.vue'
	import request from '../../api/request.js'
	import global from '../../static/js/global.js'
	export default {
		components:{myTabs,myPull,myLoading,minActionSheet},
		data() {
			return {
				refresh:false,
				userList: [],
				/* 显示遮罩 */
				showShade: false,
				/* 窗口尺寸 */
				winSize: {},
				/* 显示操作弹窗 */
				showPop: false,
				/* 弹窗按钮列表 */
				popButton: ["误报", "报修"],
				/* 弹窗定位样式 */
				popStyle: "",
				/* 选择的用户下标 */
				pickerUserIndex: -1,
				
				curType:0,
				page:1,
				total:1,
				usertype:''
			}
		},
		onShow(){
			this.usertype=uni.getStorageSync('usertype')
			if(this.refresh){
				this.refresh=false
				this.getWindowSize();
						
				// #ifdef H5
				document.onLong = function(e) {
					var e = e || window.event;
					e.preventDefault();
				};
				// #endif
			}
		},
		onLoad() {
			
			this.getListData('/toc/deviceWarn/listNews')
			this.getWindowSize();
		
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
					this.initIndex=val
					this.curType=val
					this.page=1
					this.total=0
					this.userList=[]
					if(this.curType==0){
						this.getListData('/toc/deviceWarn/listNews')
					}else if(this.curType==1){
						this.getListData('/toc/deviceWarn/listWarn')
					}else if(this.curType==2){
							// 故障
						this.getListData('/toc/deviceBroken/list')
					}else if(this.curType==3){
						// 离线
						this.getListData('/toc/device/listOff')
					}
				}
				
			},
			
			listTap(item,index,curType) {
				if (this.showShade) {
					return;
				}
				var that=this
				console.log(item)
				this.$refs.as.handleShow({
					actions: [
					{
						name: '误报',
						icon: 'iconfont active',
						color: '#007aff',
						image: '/static/img/MiniGgasMonitor.png'
					},
					{
						name: '报修',
						icon: 'iconfont active',
						color: '#007aff',
						image: '/static/img/MiniSmokeTrans.png'
					}
				],
				success: (res) => {
				  switch (res.id) {
					// -1代表取消按钮
					case -1:
					  console.log(-1)
					  break
					case 0:
					// 误报
					global.showLoading()
						var param = {
							openId:uni.getStorageSync('openid'),
							id:item.devId,
							type:curType
						}
						if(item.type){
							param.type=item.type
						}
						request.apiGet('/toc/deviceBroken/update',param).then((res) =>{
							if(res.code == '0'){
								uni.showToast({
									title: '状态修改成功'
								});
								item.status=3
					// 			if(this.curType==0){
					// 				this.getListData('/toc/deviceWarn/listNews')
					// 			}else if(this.curType==1){
					// 				this.getListData('/toc/deviceWarn/listWarn')
					// 			}else if(this.curType==2){
					// 					// 故障
					// 				this.getListData('/toc/deviceBroken/list')
					// 			}else if(this.curType==3){
					// 	// 离线
					// 	this.getListData('/toc/device/listOff')
					// }
							}else{
								global.showToast('修改失败')
							}
							global.hideLoading()
						}).catch((reason) =>{
							global.hideLoading()
							global.showToast('网络错误')
						})
					  break
					case 1:
					var that=this
					uni.$on('update',function(res){
						that.userList[res].status=1
					})
					 uni.navigateTo({
					 	url:"/pages/repair/repairEdit?item="+JSON.stringify(item)+'&index='+index
					 })
					  break
				  }
				}
			  })
			},
			/* 获取列表数据 */
			getListData(url) {
				global.showLoading()
				var that = this
				var param = {
					openId:uni.getStorageSync('openid'),
					page:this.page,
					limit:10
				}
				request.apiGet(url,param).then((res) =>{
					if(res.code == '0'){
						that.userList=that.userList.concat(res.data)
						that.total=res.total
						global.hideLoading()
					}
				})
			},
			scrolltolower(){
				console.log(this.userList.length,this.total)
				if(this.userList.length<this.total){
					this.page++
					if(this.curType==0){
						this.getListData('/toc/deviceWarn/listNews')
					}else if(this.curType==1){
						this.getListData('/toc/deviceWarn/listWarn')
					}else if(this.curType==2){
						// 故障
						this.getListData('/toc/deviceBroken/list')
					}else if(this.curType==3){
							// 离线
							this.getListData('/toc/device/listOff')
						}
				}
			},
			/* 获取窗口尺寸 */
			getWindowSize() {
				uni.getSystemInfo({
					success: (res) => {
						this.winSize = {
							"witdh": res.windowWidth,
							"height": res.windowHeight
						}
					}
				})
			},
			/* 长按监听 */
			onLongPress(e) {
				let [touches, style, index] = [e.touches[0], "", e.currentTarget.dataset.index];
			
				/* 因 非H5端不兼容 style 属性绑定 Object ，所以拼接字符 */
				if (touches.clientY > (this.winSize.height / 2)) {
					style = `bottom:${this.winSize.height-touches.clientY}px;`;
				} else {
					style = `top:${touches.clientY}px;`;
				}
				if (touches.clientX > (this.winSize.witdh / 2)) {
					style += `right:${this.winSize.witdh-touches.clientX}px`;
				} else {
					style += `left:${touches.clientX}px`;
				}
			
				this.popStyle = style;
				this.pickerUserIndex = Number(index);
				this.showShade = true;
				this.$nextTick(() => {
					setTimeout(() => {
						this.showPop = true;
					}, 10);
				});
			},
			/* 隐藏弹窗 */
			hidePop() {
				this.showPop = false;
				this.pickerUserIndex = -1;
				setTimeout(() => {
					this.showShade = false;
				}, 250);
			},
			/* 选择菜单 */
			pickerMenu(e) {
				var that=this
				let index = Number(e.currentTarget.dataset.index);
				console.log(`第${this.pickerUserIndex+1}个用户,第${index+1}个按钮`);
				// 在这里开启你的代码秀
				if(index==0)
				{
					
				}
				if(index==1)
				{
					uni.navigateTo({
						url:"/pages/repair/repairEdit"
					})
				}
				// uni.showToast({
				// 	title: `第${this.pickerUserIndex+1}个用户,第${index+1}个按钮`,
				// 	icon: "none",
				// 	mask: true,
				// 	duration: 600
				// });
				/* 
				 因为隐藏弹窗方法中会将当前选择的用户下标还原为-1,
				 如果行的菜单方法存在异步情况，请在隐藏之前将该值保存，或通过参数传入异步函数中
				 */
				this.hidePop();
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
	
	/* 列表 */
	.list {
		background-color: #fff;
		font-size: 28upx;
		color: #333;
		user-select: none;
		touch-callout: none;
		.more{
			float: right;
			/* font-size: 1rem; */
		}
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
					/* width: 150upx; */
					/* text-align: right; */
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
