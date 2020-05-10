<template>
	<view class="container">
		<scroll-view 
			style="  z-index: 1000;" 
			scroll-y="true" v-if="usertype=='gr'">
			<view class="title uni-text-gray fl-row">
				<view class="ml10 mt10 mb10 i-cube"></view>
				<text class="ml30">我的设备</text>
			</view>
			<view class="device-container" style="width: 100%;overflow-x: auto;">
				<!-- <zy-grid :showTip="true"
					:col="3" 
					v-if="deviceList.length > 0"
					:list="deviceList">
				</zy-grid> -->
				<view v-if="myDeviceList==''">暂无数据</view>
				<view class="my-device" v-for="(item,index) in myDeviceList" :key='index'>
					<view class="device-top">
						<text class="devName">{{item.devName}}</text>
						<text class="status offline" :class="{online:item.devState==1}">{{item.devState==0 ? '离线':'在线'}}</text>
						
					</view>
					<view class="device-main">
						<view class="device-main-left">
							<image :src="item.iconUrl+'/small/0.png'" mode="" v-if="item.devState==0"></image>
							<image :src="item.iconUrl+'/small/1.png'" mode="" v-if="item.devState==1 & item.isWarn==0"></image>
							<image :src="item.iconUrl+'/small/3.png'" mode="" v-if="item.devState==1 & item.isWarn==1"></image>
						</view>
						<view class="device-main-right">
							<view>{{item.typeName}}</view>
							<view :class="{cwarning:item.isWarn==1}">{{item.isWarn==0 ? '无告警':'告警'}}</view>
							<view>共享人数:{{item.shareCount}}</view>
						</view>
					</view>
					<view class="device-bottom">
						<text class=" cblue" @click="toDetail(item.devId,0)">查看详情</text>
					</view>
				</view>
			</view>
			
			<view class="title uni-text-gray fl-row">
				<view class="ml10 mt10 mb10 i-cube"></view>
				<text class="ml30">共享设备</text>
			</view>
			<view class="device-container" style="width: 100%;overflow-x: auto;">
				<!-- <zy-grid :showTip="true"
					:col="3" 
					v-if="deviceList.length > 0"
					:list="deviceList">
				</zy-grid> -->
				<view v-if="myShareDeviceList==''">暂无数据</view>
				<view class="my-device" v-for="(item,index) in myShareDeviceList" :key='index'>
					<view class="device-top">
						<text class="devName">{{item.devName}}</text>
						<text class="status offline" :class="{online:item.devState==1}">{{item.devState==0 ? '离线':'在线'}}</text>
						
					</view>
					<view class="device-main">
						<view class="device-main-left">
							<image :src="item.iconUrl+'/small/0.png'" mode="" v-if="item.devState==0"></image>
							<image :src="item.iconUrl+'/small/1.png'" mode="" v-if="item.devState==1 & item.isWarn==0"></image>
							<image :src="item.iconUrl+'/small/3.png'" mode="" v-if="item.devState==1 & item.isWarn==1"></image>
						</view>
						<view class="device-main-right">
							<view>{{item.typeName}}</view>
							<view :class="{cwarning:item.isWarn==1}">{{item.isWarn==0 ? '无告警':'告警'}}</view>
							<!-- <view>共享人数:{{item.shareCount}}</view> -->
						</view>
					</view>
					<view class="device-bottom">
						<text class=" cblue" @click="toDetail(item.devId,1)">查看详情</text>
					</view>
				</view>
			</view>
		</scroll-view>
		<!-- <view class="top-entrance" v-if="usertype=='gr'">
			<view class="bg-wrapper"></view>
			<view class="bg-content">
				<view class="bg-item" @click="goDevice">
					<view>
						<image src="../../static/img/quickNavicoSB@2x.png" mode=""></image>
					</view>
					<view>
						<text>我的设备</text>
					</view>
				</view>
				<view class="bg-item" @click="goRepair">
					<view>
						<image src="../../static/img/quickNavicoBX@2x.png" mode=""></image>
					</view>
					<view>
						<text>我的报修</text>
					</view>
				</view>
				<view class="bg-item" @click="goWarnhistroy">
					<view>
						<image src="../../static/img/quickNavicoGJ@2x.png" mode=""></image>
					</view>
					<view>
						<text>告警历史</text>
					</view>
				</view>
			</view>
		</view> -->
		<view v-if='usertype=="dw"'>
			<view class="search-line">
				<uni-icons type='search'></uni-icons>
				<input type="text" v-model="ownerName" placeholder="请输入业主名称"/>
				<button type="primary" class="search-btn" @click="search">搜索</button>
			</view>
		</view>
		<block v-for="(item, index) in arr" :key="index" v-if="usertype=='gr'">
			<view v-if="item.group" 
				class="title uni-text-gray fl-row">
				<view class="ml10 mt10 mb10 i-cube"></view>
				<text class="ml30">{{item.group}}</text>
			</view>
		</block>
		<!-- <view class="title uni-text-gray fl-row">
			<view class="ml10 mt10 mb10 i-cube"></view>
			<text class="ml30">地图</text>
		</view> -->
		<hchPosition :storeData="storeData" :markers="markers"  :usertype='usertype' v-if='usertype=="dw" & markersReady'
		 :class="usertype=='dw' ? 'fullscreen':''" @mapclick='pulldata'></hchPosition>
		<min-action-sheet ref="as"></min-action-sheet>
		<min-action-sheet ref="as1"></min-action-sheet>
		
		
		<view class="float-btn" v-if="usertype=='gr'"
			@click="addtype()">
			<uni-icons type="plus" color="#fff"></uni-icons>
			<view>
				设备
			</view>
		</view>
		
		<view id="liquidFill"></view>
	</view>
</template>

<script>
	import minActionSheet  from '../../components/comselect/comselect'
	import zyGrid from '../../components/zy-grid/zy-grid.vue'
	import hchPosition from "../../components/hch-position/hch-position"
	import UniIcons from '@/components/uni-icon/uni-icon.vue'
	import request from '../../api/request.js'
	import global from '../../static/js/global.js'
	 import wx from 'jweixin-module';
	export default {
		components:{
			zyGrid,
			hchPosition,
			UniIcons,
			minActionSheet 
		},
		data() {
			return {
				ownerName:'',
				markersReady:false,
				refresh:false,
				canvas: true,
				cWidth:'',
				cHeight:'',
				usertype:'',
				timer:null,
				arr: [],
				storeData:[//门店信息展示  id name address tel 必填
					{
						id:1,
						name:'可燃气体检测仪222',
						address:'厦门市思明区汇景商业广场XXX1号',
						tel:'12345678900',
					},{
						id:2,
						name:'可燃气体检测仪',
						address:'厦门市思明区汇景商业广场XXX2号',
						tel:'12345678900',
					},
				],
				markers: [//门店在地图上的标记 以下字段必填 
				// {
				//          longitude: 116.405,
				//          latitude: 39.901,
				//          showFlag:false //flag放在每一条数据里
				//        },
				//        {
				//          longitude: 116.404,
				//          latitude: 39.900,
				//          showFlag:false
				//        }
					],
				baseUrl:'',
				deviceList:[],
				deviceTypeList:[{
							name: '扫一扫',
							icon: 'iconfont active',
							color: '#007aff',
							image: '/static/img/scanCode.png'
						}],
						myDeviceList:'',
						myShareDeviceList:''
			};
		},
		onShow(){
			var that=this
			
			if(this.refresh){
				this.refresh=false
				this.init()
				// 判断是否在微信端
				// if (isWechat()) {
				// 	//如果为微信端就进行code
				// 	this.getCode();
				// }
			}
			// this.timer=setInterval(that.getDevState,30000)
		},
		onHide(){
			// window.clearInterval(this.timer)
		},
		onLoad(e) {
			this.usertype=uni.getStorageSync('usertype')
			this.applyAuthority()
			this.getDeviceList()
			var that=this
			// uni.$on('update',function(res){
			// 	that.init()
			// })
			// this.init()
			// 判断是否在微信端
			// if (isWechat()) {
			// 	//如果为微信端就进行code
			// 	// this.getCode();
			// }
		},
		methods: {
			// 默认加载
			init(){
				
				// this.getDeviceTypeList()
			},
			//获取设备列表
			getDeviceList(){
				var that=this
				global.showLoading()
				if(this.usertype=='gr'){
					var param = {
						openId:uni.getStorageSync('openid'),
						// devLocation:devlocation || ''
					}
					request.apiGet('/toc/device/list',param).then((res) =>{
						if(res.code == '0'){
							that.myDeviceList=res.data.selfList
							that.myShareDeviceList=res.data.shareList
							// res.data.forEach((item,index) =>{
							// 	if(item.baiduLatitude!=''){
							// 		total.push({
							// 				id:item.id,
							// 				latitude: item.baiduLatitude,
							// 				longitude: item.baiduLongitude,
							// 				iconPath: item.iconUrl,
							// 				// iconPath: that.departures(item.typeName).icon,
							// 				callout:{
							// 					content: that.departures(item.typeName).introduce,
							// 					borderRadius:10,
							// 					padding:10,
							// 					display:"ALWAYS",
							// 				}
							// 		})
							// 	}
							// })
							// that.deviceList = res.data.filter((item) =>item.baiduLatitude!='');
							// var total=[]
							// that.markers=res.data.filter((item) =>item.baiduLatitude!='');
							// that.markersReady=true
							// that.getDevState()
							global.hideLoading()
						}else{
							global.hideLoading()
							global.showToast(res.msg)
						}
					}).catch((reason) =>{
						global.hideLoading()
						global.showToast(reason)
					})
				}else if(this.usertype=='dw'){
					var param = {
						openId:uni.getStorageSync('openid'),
					}
					request.apiGet('/tob/owner/list',param).then((res) =>{
						if(res.code == '0'){
							that.markers=res.data
							// that.deviceList = res.data.filter((item) =>item.baiduLatitude!='');
							// var total=[]
							// res.data.forEach((item,index) =>{
							// 	if(item.baiduLatitude!=''){
							// 		total.push({
							// 				id:item.id,
							// 				latitude: item.baiduLatitude,
							// 				longitude: item.baiduLongitude,
							// 				iconPath: item.iconUrl,
							// 				// iconPath: that.departures(item.typeName).icon,
							// 				callout:{
							// 					content: that.departures(item.typeName).introduce,
							// 					borderRadius:10,
							// 					padding:10,
							// 					display:"ALWAYS",
							// 				}
							// 		})
							// 	}
							// })
							that.markers=res.data.filter((item) =>{
							return	item.mapEarePoints!='' & item.mapEarePoints.split(';').length>1
							});
							that.markersReady=true
							// that.getDevState()
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
			// 添加设备
			AddDevice() {
				var that=this
				this.$refs.as.handleShow({
					actions: that.deviceTypeList,
					success: (res) => {
						switch (res.id) {
							case -1:
								uni.showToast({
									title: '取消成功'
								});
							break
							case 0:
								this.addtype(res.devName)
							break
							case 1:
								this.addtype(res.devName)
							break
							case that.deviceTypeList.length-1:
								this.scanQrCode()
							break
						}
					}
			  	})
			},
			// 增加类型
			addtype(name) {
				this.$refs.as1.handleShow({
					actions: [
						// {
						// 	name: '手动添加',
						// 	icon: 'iconfont active',
						// 	color: '#007aff',
						// 	image: 'http://img-cdn-qiniu.dcloud.net.cn/new-page/uni.png'
						// },
						{
							name: '扫一扫',
							icon: 'iconfont active',
							color: '#007aff',
							image: '/static/img/scanCode.png'
						}
					],
					success: (res) => {
						switch (res.id) {
							// -1代表取消按钮
							case -1:
								uni.showToast({
									title: '取消成功'
								});
								break
							case 0:
							this.scanQrCode()
							
							break	
								// uni.navigateTo({
								// 	url:"/pages/adddevice/adddevice?type="+name
								// })
								// break
					  	}
					}
			  	})
			},
			getDeviceTypeList(){
				var that=this
				var param = {
					openId:uni.getStorageSync('openid')	
				}
				request.apiGet('/toc/deviceType/list',param).then((res) =>{
					if(res.code == '0'){
						res.data.forEach(element => {
							// that.deviceTypeList.unshift({
							// 	name: element.typeName,
							// 	icon: element.iconUrl,
							// 	color: '#007aff',
							// 	typeId:element.typeId
							// });
						});
						
						that.getDeviceList()
					}
				})
			},
			// 故障信息列表
			getDevState(){
				var that=this
				var param = {
					openId:uni.getStorageSync('openid')	
				}
				request.apiGet('/toc/device/listDevState/',param).then((res) =>{
					if(res.code == '0'){
						res.data.forEach((item1,index1) =>{
							that.deviceList.forEach((item2,index2) =>{
								if(item1.devId==item2.devId){
									that.deviceList[index2].isWarn=item1.isWarn
									that.deviceList[index2].devState=item1.devState
									that.$forceUpdate()
								}
							})
						})
						console.log(that.deviceList)
						// res.data.forEach(element => {
						// 	that.deviceTypeList.unshift({
						// 		name: element.typeName,
						// 		icon: element.iconUrl,
						// 		color: '#007aff',
						// 		typeId:element.typeId
						// 	});
						// });
					}
				})
			},
			pulldata(data){
				this.deviceList=[data]
			},
			// 名称区分设备
			departures(name){
				switch(name){
					case '烟感':
					return {introduce:'烟感报警器',icon:'/static/img/MiniSmokeTrans.png'}
					break;
					case '可燃气体':
					return {introduce:'可燃气体监测仪',icon:'/static/img/MiniGgasMonitor.png'}
					break;
				}
			},
			// 跳转
			jump(url, title='',to=3) {
				// this.$api.jump(url,title,to)
			},

			// 扫码
			scanQrCode(){
				// 允许从相机和相册扫码
				// uni.scanCode({
				// 	success: function (res) {
				// 		console.log('条码类型：' + res.scanType);
				// 		console.log('条码内容：' + res.result);
				// 	}
				// });
				
				wx.ready(function(){
					// global.hideLoading()
					wx.scanQRCode({
					                needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
					                scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
					                success: function (res) {
										uni.navigateTo({
											url:'../adddevice/adddevice?code='+res.resultStr
										})
					                    // let qrInfo = {toPageUrl:res.resultStr}
					                },
									error:function(reason){
										global.showToast('获取失败')
									}
					            });
				  // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
				});
				wx.error(function(res){
					global.showToast(res)
					global.hideLoading()
				  // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
				});
				var that=this
				uni.$on('updateIndex',function(){
					that.init()
				})
			},
			applyAuthority(){
				var data={
									url:encodeURIComponent(window.location.href.split('#')[0])
								}
								request.apiGet('/toc/tocUser/getSignature',data).then((res) =>{
									console.log(res)
									if(res.code=='0'){
										// global.showLoading()
										wx.config({
											// debug: true,
										    appId: 'wxcd55667b480dfd2c', // 必填，企业号的唯一标识，此处填写企业号corpid
										    timestamp: res.timestamp, // 必填，生成签名的时间戳
										    nonceStr: res.nonceStr, // 必填，生成签名的随机串
										    signature: res.signature,// 必填，签名，见附录1
										    jsApiList: ['scanQRCode']// 分享到QQ空间] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
										});
										
									}
								}).catch(reason =>{
									global.showToast(reason)
								})
			},

			change(idx,type,etype){
				this.$refs[this.arr[idx].id][0].changeData(this.arr[idx].id,this.arr[idx].opts,type,etype)
			},
			async findFamilyQYByList() {
				var data={
					loading: true,
					url:this.HostURL + this.serviceSRV,
					data:{
						p_service: 'familySjService',
						p_method: 'findFamilyQYByTotalList',
						startTime: this.startTime,
						endTime: this.endTime,
						regcodes: this.divisionCode[0],
						pageNo: 1, // 1-第几页
						pageSize: 10, // 10-每页记录条数
						token: this.token,
					}
				}
				var res = await this.$api.get(data)
				var result = this.$api.ErrTip(res)
				if (result&&result.list) {
					var Column={type:'column',categories:[],series:[{name:'户数',data:[]}]}//柱状图
					result.list.forEach((e)=>{
						if(e.name&&e.cnt){
							Column.categories.push(e.name);
							Column.series[0].data.push(e.cnt);
						}
					})
					this.$refs[this.arr[2].id][0].changeData(this.arr[2].id,Column,'column','group')
				}
			},
			// 获取code
			getCode() {
				let appid = "wxcd55667b480dfd2c"; //为测试号id
				let code = getUrlParam("code"); //是否存在code
				let local = 'http://xf.wxtih.com';
				console.log(`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${encodeURIComponent(local)}&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect`)
				if (code == null || code === "") {
					//不存在就打开上面的地址进行授权
					window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${encodeURIComponent(local)}&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect`;
				} else {
					//存在则通过code传向后台调用接口返回微信的个人信息
				}
			},
			goRepair() {
					uni.navigateTo({
						url:'/pages/repair/repairList'
					})
			},
			goDevice() {
					uni.navigateTo({
											url:"/pages/personCenter/mydevice"
										})
			},
			goWarnhistroy() {
					uni.navigateTo({
						url:"/pages/personCenter/warnhistroy"
					})
			},
			toDetail(id,type){
				uni.navigateTo({
					url:"/pages/adddevice/devicedetail?id="+id+'&type='+type
				})
			},
			// 搜索业主
			search(){
				global.showLoading()
				var param = {
					openId:uni.getStorageSync('openid'),
					ownerName:this.ownerName,
					page:1,
					count:5
				},that=this
				request.apiGet('/tob/owner/search',param).then((res) =>{
					if(res.code == '0'){
						that.markers=res.data
						that.markers=res.data.filter((item) =>{
						return	item.mapEarePoints!='' & item.mapEarePoints.split(';').length>1
						});
						that.markersReady=true
						// that.getDevState()
						global.hideLoading()
					}else{
						console.log('else')
						global.hideLoading()
						global.showToast(res.msg)
					}
				}).catch((reason) =>{
					global.hideLoading()
					global.showToast(reason)
				})
			}
		}
		// 判断公众号截取code
	}
	
	const getUrlParam = (name) => {
		let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		let r = window.location.search.substr(1).match(reg);
		if (r != null) {
			return unescape(r[2]);
		}
		return null;
	}
	
	
</script>

<style lang="scss">
	page{
		background-color: #f0f0f0;
	}
	/* #ifdef MP */
	.mp-search-box{
		position:absolute;
		left: 0;
		top: 30upx;
		z-index: 9999;
		width: 100%;
		padding: 0 80upx;
		.ser-input{
			flex:1;
			height: 56upx;
			line-height: 56upx;
			text-align: center;
			font-size: 28upx;
			color:$font-color-base;
			border-radius: 20px;
			background: rgba(255,255,255,.6);
		}
	}
	page{
		.cate-section{
			position:relative;
			z-index:5;
			border-radius:16upx 16upx 0 0;
			margin-top:-20upx;
		}
		.carousel-section{
			padding: 0;
			.titleNview-placing {
				padding-top: 0;
				height: 0;
			}
			.carousel{
				.carousel-item{
					padding: 0;
				}
			}
			.swiper-dots{
				left:45upx;
				bottom:40upx;
			}
		}
	}
	/* #endif */
	
	
	page {
		background: #f5f5f5;
	}
	.m-t{
		margin-top: 16upx;
	}
	/* 头部 轮播图 */
	.carousel-section {
		position: relative;
		padding-top: 10px;
		background-color:#F0AD4E;
		.titleNview-placing {
			height: var(--status-bar-height);
			padding-top: 38px;
			box-sizing: content-box;
		}

		.titleNview-background {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 426upx;
			transition: .4s;
		}
	}
	.grid-title{
		display: flex;
		align-items: center;
		font-size: 32upx;
		color: rgba(0,0,0,.63);
		padding: 30upx 0;
		view{
			width: 8upx;
			height: 30upx;
			background-color: rgba(255,82,65,1);
			margin-right: 20upx;
		}
	}
	
	.fl-row { display: flex; flex-direction: row; }
	.bgwh { background-color: #FFFFFF; }/*白色*/
	.g6 { color: #666; }/*浅黑*/
	.tc { text-align: center; }
	.f30 { font-size: 30upx; }
	.p10{ padding: 10upx; }
	.mt10{margin-top: 10upx;}
	.mb10{margin-bottom: 10upx;}
	.ml10{margin-left: 10upx;}
	.mr10{margin-right: 10upx;}
	.ml30{width: 70%;}
	
	.qiun-title-bar{
		width:96%; 
		padding:10upx 2%; 
		flex-wrap:nowrap;
	}
	
	
	.container {
		box-sizing: border-box;
		height: 100%;
		background-color: #efeff4;
	}
	
	.content {
		width: 750upx;
		height: calc(100% - 100upx);
		background-color: #efeff4;
	}
	.title {
		line-height: 80upx;
		// background-color: #ccc;
		text-indent: 20upx;
		font-size: 30upx;
		color: #000000;
		letter-spacing: 1px;
	}
	.i-cube {
		width: 4upx;
		height: 34upx;
		background-color: #51B3F7;
		margin-right: 20upx;
		margin-top: 10px;
	}
	
	.s-btn {
		font-size: 28upx;
		background-color: transparent;
		color: #f6a121;
		line-height: 1.8;
		height: 48upx;
		padding-left: 20upx;
		padding-right: 20upx;
	}
	.s-btn:after {
		border: 2upx solid #8799A3;
	}
	.s-btn-hover {
		background-color: #f6a121;
		color: #FFFFFF;
	}
	
	.s-btn1 {
		font-size: 28upx;
		background-color: transparent;
		color: #f6a121;
		line-height: 1.8;
		height: 48upx;
		padding-left: 20upx;
		padding-right: 20upx;
	}
	.s-btn1:after {
		border: 2upx solid #8799A3;
	}
	.s-btn1-hover {
		background-color: #007AFF;
		color: #FFFFFF;
	}
	
	.xieyi {
		margin-left: 30upx;
		display: flex;
		flex-direction: row;
		font-size: 30upx;
		margin-top: 20upx;
		color: #FFA800;
		height: 40upx;
		line-height: 40upx;
	}
	.link-highlight{
		color: #0000FF
	}
	.fullscreen{
		height: calc(100vh - 50px);
	}
	
	
	.top-entrance{
		    position: absolute;
		    height: 96px;
		    top: 0;
		    left: 0;
		    width: 100%;
		    z-index: 999;
	}
	.bg-wrapper{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: #040B29;
		opacity: 0.89;
		box-shadow:0px 2px 4px rgba(177,180,191,1);
	}
	.bg-content{
		position: relative;
		height: 100%;
		display: flex;
		justify-content: space-between;
	}
	.bg-content image{
		width: 25px;
		height: 25px;
		margin:24px 0 7px;
	}
	.bg-item{
		color: white;
		height: 100%;
		flex: 1;
		text-align: center;
	}
	
	
	.search-line{
		position: absolute;
		top: 0;
		left: 10%;
		width: 80%;
		height: 65upx;
		margin-top: 20upx;
		background-color: #fff;
		border: 1px solid #ff9900;
		border-radius: 65upx;
		z-index: 999;
		display: flex;
		align-items: center;
	}
	.search-line input{
		flex: 1;
	}
	.search-btn{
		background-color: #ff9900;
		height: 65upx;
		line-height: 65upx;
		width: 160upx;
		border-radius: 65upx;
	}
	
	
	.my-device{
		display: inline-block;
		width: 46%;
		margin: 20upx 1% 0 2%;
		border-radius: 8px;
		background-color: #fff;
		// border: 1px solid #333;
	}
	.device-top{
		padding: 15upx 0;
		border-bottom: 1px solid #f3efef;
		// border-bottom: 1px solid #333;
	}
	.device-main{
		padding: 20upx 20upx 20upx 0;
		box-sizing: border-box;
	}
	.device-main-left{
		width: 35%;
		text-align: center;
	}
	.device-main-right{
		width: 60%;
		border-left: 1px solid #f2efef;
		padding-left: 5%;
		white-space: nowrap;
	}
	.device-main-right{
		line-height: 1.5;
	}
	.device-main-left,
	.device-main-right{
		display: inline-block;
		vertical-align: middle;
	}
	.device-main-left image{
		width: 80upx;
		height: 80upx;
	}
	.device-container{
		padding-bottom: 30upx;
	}
	.device-bottom{
		color: #2794F0;
		text-align: center;
		padding: 15upx 0;
		border-top: 1px solid #f3efef;
		font-size: 30upx;
	}
	.status.online{
		border: 1px solid #6BBD8F !important;
		color: #6BBD8F !important;
	}
	.status.offline{
		border: 1px solid #999999;
		color: #999999;
		margin-left: 20upx;
	}
	.float-btn{
		position: fixed;
		bottom: 150upx;
		right: 50upx;
		width: 100upx;
		height: 100upx;
		text-align: center;
		color: #fff;
		line-height: 1.3;
		background-color: #2A95F0;
		border-radius: 50%;
	}
	
	.devName{
		display: inline-block;
		max-width: 70%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		padding-left: 20upx;
		vertical-align: bottom;
	}
	
</style>
