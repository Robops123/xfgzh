<template>
	<view class='purchase-list' >
		<view v-if="usertype=='gr'">
			<my-tabs @change="tapChange" :modelData="modelData" :badges='badges' :initIndex="initIndex"></my-tabs>
			<scroll-view class="purchase-body" scroll-y="true" @scrolltolower="scrolltolower" style="height: calc(100vh - 260upx);"
			   @touchstart="touchstart" @touchend="touchend">
				<!-- <my-unit v-for="(item,index) in 1" :key="index" :info="item"></my-unit> -->
					<view class="list"  :class="{'active':pickerUserIndex==index}"  v-for="(item,index) in userList"
					 :key="index" :data-index="index">
					 <view class="status">
						 <!-- 红  绿  橙  灰 -->
					 	<image src="../../static/img/message/1.png" mode=""  v-if="item.status==1"></image>
						<image src="../../static/img/message/2.png" mode=""  v-if="item.status==0"></image>
					 	<image src="../../static/img/message/3.png" mode=""  v-if="item.status==2"></image>
					 	<image src="../../static/img/message/4.png" mode=""  v-if="item.status==3"></image>
					 	<text v-if="item.status==0">已解除</text>
						<text v-if="item.status==1">告警</text>
					 	<text v-if="item.status==2 & curType==0">已确认</text>
					 	<text v-if="item.status==2 & curType==1">已报修</text>
					 	<text v-if="item.status==3">误报</text>
					 </view>
						<view class="title">
							{{item.title}}
						</view>
						<view class="brief">
							<view>
								<image src="../../static/img/device/location.png" mode=""></image>
							</view>
							<view>
								<view class="address cblue">{{item.devLocation}}</view>
								<view class="date coffline">{{item.updateTime}}</view>
							</view>
						</view>
						<view class="operate" v-if='item.status==1'>
							<view class="cblue" v-if="curType==0" @click="changeStatus(item.id,0,index)">解除</view>
							<view class="cblue" @click="changeStatus(item.id,3,index)">误报</view>
							<view class="cblue" @click="toFix(item,index)" v-if="curType==1">报修</view>
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
		
		
		<view v-else>
			<my-tabelse @change="tapChange" :modelData="modelData" :badges='badges' :initIndex="initIndex"></my-tabelse>
			<scroll-view class="purchase-body" scroll-y="true" @scrolltolower="scrolltolower" style="height: calc(100vh - 260upx);"
			   @touchstart="touchstart" @touchend="touchend">
			   <view class="search-line" v-if="curType==1">
				   <input type="text" value="" @confirm='searchOwner' @change='searchOwner' v-model="ownerName" placeholder="输入要查询的单位"/>
			   </view>
				<!-- <my-unit v-for="(item,index) in 1" :key="index" :info="item"></my-unit> -->
					<view class="list"  :class="{'active':pickerUserIndex==index}"  v-for="(item,index) in userList"
					 :key="index" :data-index="index">
					 <view class="status">
						<!-- 红  绿  橙  灰 -->
						<image src="../../static/img/message/1.png" mode=""  v-if="item.status==1"></image>
						<image src="../../static/img/message/2.png" mode=""  v-if="item.status==0"></image>
						<image src="../../static/img/message/3.png" mode=""  v-if="item.status==2"></image>
						<image src="../../static/img/message/4.png" mode=""  v-if="item.status==3"></image>
						<text v-if="item.status==0">已解除</text>
						<text v-if="item.status==1">告警</text>
						<text v-if="item.status==2 & curType==0">已确认</text>
						<text v-if="item.status==2 & curType==1">已报修</text>
						<text v-if="item.status==3">误报</text>
					 </view>
						<view class="title">
							{{item.title}}
						</view>
						<view class="brief">
							<view>
								<image src="../../static/img/device/location.png" mode=""></image>
							</view>
							<view>
								<view class="address cblue">{{item.devLocation}}</view>
								<view class="date coffline">{{item.updateTime}}</view>
							</view>
						</view>
						<view class="operate" v-if='item.status==1'>
							<!-- <view class="cblue" v-if="curType==0" @click="changeStatus(item.id,0,index)">解除</view> -->
							<!-- <view class="cblue" @click="changeStatus(item.id,3,index)">误报</view> -->
							<view class="cblue" @click="openPrompt(item.tenantId)" >督办</view>
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
			<!-- 督办 -->
			<prompt :visible.sync="promptVisible2" title='督办下发' class="prompt2"  @confirm="clickPromptConfirm2" mainColor="#e74a39">
			  <!-- 这里放入slot内容-->
			 <view>督办标题</view>
			 <input type="text" class="input" value="" v-model="title" placeholder=""/>
			 <view>督办内容</view>
			 <textarea value="" placeholder="" class="input" v-model="content"/>
			</prompt>
		</view>
	</view>
</template>
<script>
	import myTabs from '@/components/myTabs/myTabs.vue'
	import myTabelse from '@/components/myTabs/myTabs.vue'
	//import myUnit from '@/components/myUnits/purchaseUnit/unit.vue'
	import minActionSheet  from '@/components/comselect/comselect'
	import myPull from '@/static/js/myPull.js'
	import myLoading from '@/components/myLoading/myLoading.vue'
	import request from '../../api/request.js'
	import global from '../../static/js/global.js'
	import Prompt from '@/components/zz-prompt/index.vue'
	export default {
		components:{myTabs,myTabelse,myPull,myLoading,minActionSheet,Prompt},
		data() {
			return {
				title:'',content:'',
				ownerName:'',
				promptVisible2:false,
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
				usertype:'',
				badges:{
					badge0:'',
					badge1:''
				},
				tenantId:''
			}
		},
		onShow(){
			
			if(this.refresh){
				this.refresh=false
				// this.getWindowSize();
						
				// #ifdef H5
				document.onLong = function(e) {
					var e = e || window.event;
					e.preventDefault();
				};
				// #endif
			}
		},
		onLoad() {
			this.usertype=uni.getStorageSync('usertype')
			if(this.usertype=='gr'){
				this.getListData('/toc/news/deviceWarn')
				this.getListBadge('/toc/news/deviceBroken')
			}else{
				this.getListData('/tob/owner/warnList')
					this.getListBadge('/tob/owner/brokenList')
			}
			
			// this.getWindowSize();
		
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
				console.log(val)
				if(this.curType!=val){
					this.initIndex=val
					this.curType=val
					this.page=1
					this.total=0
					this.userList=[]
					// if(this.curType==0){
					// 	this.getListData('/toc/deviceWarn/listNews')
					// }else
					if(this.usertype=='gr'){
						if(this.curType==0){
							this.getListData('/toc/news/deviceWarn')
						}else if(this.curType==1){
								// 故障
							this.getListData('/toc/news/deviceBroken')
						}else if(this.curType==2){
							// 离线
							this.getListData('/toc/device/listOff')
						}
					}else{
						if(this.curType==0){
							this.getListData('/tob/owner/warnList')
						}else if(this.curType==1){
								// 故障
							this.getListData('/tob/owner/brokenList')
						}
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
					count:10,
					tenantId:this.tenantId
				}
				request.apiGet(url,param).then((res) =>{
					// if(res.code == '0'){
						that.userList=that.userList.concat(res.data)
						that.total=res.total
						that.badges['badge'+that.curType]=res.displayCount
						global.hideLoading()
					// }
				})
			},
			getListBadge(url) {
				global.showLoading()
				var that = this
				var param = {
					openId:uni.getStorageSync('openid'),
					page:this.page,
					count:6,
					tenantId:this.tenantId
				}
				request.apiGet(url,param).then((res) =>{
					// if(res.code == '0'){
						that.badges['badge1']=res.displayCount
						global.hideLoading()
					// }
				})
			},
			scrolltolower(){
				if(this.userList.length<this.total){
					this.page++
					// if(this.curType==0){
					// 	this.getListData('/toc/deviceWarn/listNews')
					// }else 
					if(this.usertype=='gr'){
						if(this.curType==0){
							this.getListData('/toc/news/deviceWarn')
						}else if(this.curType==1){
								// 故障
							this.getListData('/toc/news/deviceBroken')
						}else if(this.curType==2){
							// 离线
							this.getListData('/toc/device/listOff')
						}
					}else{
						if(this.curType==0){
							this.getListData('/tob/owner/warnList')
						}else if(this.curType==1){
								// 故障
							this.getListData('/tob/owner/brokenList')
						}
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
			},
			toFix(sth,index){
				var that=this
				uni.$on('update',function(res){
					// that.userList[res].status=1
					that.userList[res].status=2
				})
				 uni.navigateTo({
				 	url:"/pages/repair/repairEdit?sth="+JSON.stringify(sth)+'&index='+index
				 })
			},
			changeStatus(id,status,index){
				global.showLoading()
				var that = this
				var param = {
					openId:uni.getStorageSync('openid'),
					id:id,
					status:status
				}
				if(this.curType==0){
					param.type=1
				}else if(this.curType==1){
					param.type=2
				}
				var url='/toc/deviceBroken/update'
				request.apiPost(url,param).then((res) =>{
					if(res.code == '0'){
						uni.showToast({
							title:'状态更改成功'
						})
						if(that.curType==0){
							that.badges.badge0--
						}else if(that.curType==1){
							that.badges.badge1--
						}
						that.userList[index].status=status
						global.hideLoading()
					}
				})
			},
			openPrompt(id){
				this.tenantId=id
				this.promptVisible2=true
			},
			// 督办
			clickPromptConfirm2(){
				global.showLoading()
				var param = {
					openId:uni.getStorageSync('openid'),
					tenantId:this.tenantId,
					title:this.title,
					content:this.content
				},that=this
				request.apiPost('/tob/owner/urge',param).then((res) =>{
					if(res.code == '0'){
						// that.markers=res.data
						global.showToast('下发成功')
						this.promptVisible2=false
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
			searchOwner(){
				if(this.ownerName==''){
					this.page=1
					this.total=0
					this.userList=[]
					this.getListData('/tob/owner/brokenList')
					return ;
				}
				global.showLoading()
				var param = {
					openId:uni.getStorageSync('openid'),
					ownerName:this.ownerName,
					page:1,
					limit:5
				},that=this
				request.apiGet('/tob/owner/search',param).then((res) =>{
					if(res.code == '0'){
						that.page=1
						that.total=0
						that.userList=[]
						if(res.data!=''){
							that.tenantId=res.data[0].tenantId
							that.getListData('/tob/owner/brokenList')
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
		position: relative;
		touch-callout: none;
		margin: 0 20upx 20upx 20upx;
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
				/* border-top: #CCC solid 1px; */
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
		text-align: center;
		line-height: 80upx;
		padding: 0;
		color: #fff;
	}
	.list .status image{
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
	}
	.list .status text{
		position: relative;
		z-index: 1;
		font-size: 12px;
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
	
	
	.input{
		margin: 20upx 0;
		padding: 15upx 0;
		font-size: 28upx;
		width: 85%;
		border: 1px solid #f2f2f2;
	}
	
	.search-line{
		text-align: center;
		padding: 30upx;
		background-color: #fff;
	}
	.search-line input{
		width: 100%;
		padding: 20upx 10upx;
		background-color: #f2f2f2;
		border-radius: 70upx;
	}
</style>
