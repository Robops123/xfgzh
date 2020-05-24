<template>
	<view>
		<!-- <view class="yt-list">
			<view class="yt-list-cell desc-cell">
				<text class="cell-tit clamp">设备IMEI号：</text>
				<button class="mini-btn" type="warn" size="mini" @click="more(form.devId)">更多</button>
			</view>
			<view class="yt-list-cell desc-cell">
				<input class="desc" type="text" v-model="form.imei" />
			</view>
		</view>
		<view class="yt-list">
			<view class="yt-list-cell desc-cell">
				<text class="cell-tit clamp">设备名称：</text>
			</view>
			<view class="yt-list-cell desc-cell">
				<input class="desc" type="text" v-model="form.devName" />
			</view>
		</view>
		<view class="yt-list">
			<view class="yt-list-cell desc-cell">
				<text class="cell-tit clamp">设备地址：</text>
			</view>
			<view class="yt-list-cell desc-cell">
				<view class="map-warpper"></view>
				<baidu-map style="width: 100%; height: 500upx;" v-if='mapReady'
				 :center="{
													lng:form.baiduLongitude,
													lat:form.baiduLatitude
												}" :zoom="15"
				 @ready="handler" >
					<bm-marker  :position="{lng: form.baiduLongitude, lat: form.baiduLatitude}" :dragging="false"
					   :zIndex="999999999" :icon="{url:'http://developer.baidu.com/map/jsdemo/img/fox.gif',size: {width: 34, height: 34}}">
					</bm-marker>
				</baidu-map>
			</view>
		</view> -->
		<!-- <view class="yt-list">
			<view class="yt-list-cell desc-cell">
				<text class="cell-tit clamp">保修信息：</text>
			</view>
			<view class="yt-list-cell desc-cell">
				设备购买时间：<input class="desc" v-model="form.buyDate" type="text" disabled/>
			</view>
			<view class="yt-list-cell desc-cell">
				购买商家：<input class="desc" v-model="form.buyCom" type="text" disabled/>
			</view>
		</view> -->
		
		<view class="card">
			<view class="line">
				<text class="cgray">所属地址:</text>
				{{data.devLocation}}
			</view>
			<view class="line-box">
				<view class="line">
					<view>
						<text class="cgray dev-props">设备型号:</text>
						<text class="">{{data.typeName}}</text>
					</view>
					<view class="fr">
							<text class="cgray dev-props">设备名称:</text>
							<text class="">{{data.devName}}</text>
					</view>
				</view>
				<view class="line">
					<view>
						<text class="cgray dev-props">告警状态:</text>
						<text class="" :class="{cwarning:data.isWarn==1}">{{data.isWarn==1 ? '有':'无'}}</text>
					</view>
					<view class="fr">
							<text class="cgray dev-props">在线状态:</text>
							<text v-if="data.isBroken==0" class="">
								<text :class="{conline:data.devState==1,coffline:data.devState==0}">
									{{data.devState==1 ? '在线':'离线'}}
								</text>
							</text>
							<text class="cwarning " v-else>故障</text>
					</view>
				</view>
				<!-- <view class="line">
					<text class="cgray">设备编号:</text>
					{{data.devId}}
				</view>
				<view class="line">
					<text class="cgray">设备本地编码:</text>
					21231232
				</view> -->
				<view class="line">
					<view>
						<text class="cgray dev-props">历史告警数:</text>
						<text class="">{{data.warnCount}}</text>
					</view>
					<view class="fr">
						<text >
							<text class="cgray dev-props">历史误报数:</text>
							<text class="">{{data.misreportCount}}</text>
						</text>
					</view>
				</view>
			</view>
			<view class="edit-btn cblue" v-if="type==0" @click="editAddress">修改</view>
		</view>
		
		<view style="margin: 0 30upx;" v-if="type==0">
			<text>共享记录</text>
			<view class="fr add-share-btn" @click="promptVisible2=true">
				<uni-icons type="plus" color="#fff"></uni-icons>
				添加共享
			</view>
		</view>
		
		<view class="card card2"  v-if="type==0">
			<view class="line border-line" v-for='(item,index) in data.deviceShareList' :key='index'>
				<text class="col1">{{item.shareToUser}}</text>
				<text class="left-border col2" @click="makePhone(item.shareToUserPhone)">{{item.shareToUserPhone}}</text>
				<!-- <text class="left-border col3">{{item.nickName}}</text> -->
				<text class="cblue left-border col4" @click="stopShare(item.id)">取消共享</text>
			</view>
		</view>
		
		
		<view class="yt-list-cell desc-cell">
			<view class="map-warpper"></view>
			<baidu-map :class='{sharemap:type==1}' style="width: 100%; height: 500upx;" v-if='data'
			 :center="{
												lng:data.baiduLongitude,
												lat:data.baiduLatitude
											}" :zoom="15"
			 >
			 <bm-label :content="data.devLocation" 
			 :position="{lng: data.baiduLongitude, lat:data.baiduLatitude}" :labelStyle="{color: '#333', fontSize : '16px'}" />
				<bm-marker  :position="{lng: data.baiduLongitude,lat:data.baiduLatitude}" :dragging="false"
				   :zIndex="999999999" >
				</bm-marker>
			</baidu-map>
		</view>
		
		
		<prompt :visible.sync="promptVisible" title='新地址'   @confirm="clickPromptConfirm" mainColor="#e74a39">
		  <!-- 这里放入slot内容-->
		  <uni-combox class="input"  @click='chooseLocation'
		  :candidates="candidates" :value="address" v-model="address"></uni-combox>
		</prompt>
		
		<prompt :visible.sync="promptVisible2" title='添加分享' class="prompt2"  @confirm="clickPromptConfirm2" mainColor="#e74a39">
		  <!-- 这里放入slot内容-->
		  <view class="prompt-line">
			  <text>名称：</text>
			  <input type="text" class="input" value="" v-model="toName" placeholder="请输入对方名称"/>
		  </view>
		 <view class="prompt-line">
			 <text>手机号：</text>
			 <input type="text" class="input" value="" v-model="toPhone" placeholder="请输入对方手机号"/>
		 </view>
		</prompt>
		<!-- <uni-popup ref='addressEdit' type="middle">
			<view>输入新地址:</view>
			<view>
				<input type="text" value="" />
			</view>
			<view>
				<button class="btn"></button>
			</view>
		</uni-popup> -->
		
		<baidu-map  style="display: none;" >
			 <bm-local-search :keyword="address" @searchcomplete='searchComplete'  ></bm-local-search>
		</baidu-map>
	</view>
</template>

<script>
	import {
		handleSignClick,
		setSignInfo,
		addSignInfo,
		getSignInfo,
		delSignInfo,
		getInfo,
		key
	} from "./index.js"
	import UniIcons from '@/components/uni-icon/uni-icon.vue'
import Prompt from '@/components/zz-prompt/index.vue'
import uniCombox from "@/components/uni-combox/uni-combox"
import request from '../../api/request.js'
import global from '../../static/js/global.js'
	export default {
		components: {
			UniIcons,
			Prompt,
			uniCombox
		},
		data() {
			return {
				promptVisible:false,promptVisible2:false,
				mapReady:false,
				address: "",
				candidates:[],
				id:'',
				type:'',
				form: {
					devId: '',
					baiduLongitude: '',
					baiduLatitude: '',
					contact: '',
					phone: '',
					address: '',
					imei: '',
					remark: '',
					buyTime: '',
					devName: ''
				},
				markers: [

				],
				
				shareList:'',
				data:'',
				choosedLocationId:'',
				toPhone:'',
				toName:'',
				
				
				baiduLongitude:'',
				baiduLatitude:''
			}
		},
		onLoad(p) {
			this.id=p.id
			this.type=p.type
			this.getDetail()
			// var params = JSON.parse(p.item)
			// console.log(params)
			// this.form.devId = params.devId
			// this.form.address = params.devLocation
			// this.form.imei = params.imei
			// this.form.devName = params.devName
			// this.form.baiduLongitude = params.baiduLongitude
			// this.form.baiduLatitude = params.baiduLatitude
			// this.form.buyDate = params.buyDate
			// this.form.buyCom = params.buyCom
			// this.markers.push({
			// 	id: params.id,
			// 	latitude: params.baiduLatitude,
			// 	longitude: params.baiduLongitude,
			// 	iconPath: '/static/img/MiniSmokeTrans.png',
			// 	callout: {
			// 		content: params.devName,
			// 		borderRadius: 10,
			// 		padding: 10,
			// 		display: "ALWAYS",
			// 	}
			// })
			this.mapReady=true

		},
		methods: {
			submit: function() {
				uni.switchTab({
					url: "/pages/index/index"
				})
			},
			more(id) {
				uni.navigateTo({
					url: "/pages/adddevice/devicemore?id=" + this.form.devId
				})

			},
			// 获取当前位置
			getLocation() {
				var that = this;
				if (this.clickNum !== 0) {
					uni.showLoading({
						title: "获取中...",
						mask: true
					})
				}
				if (this.clickNum >= 3) {
					uni.showToast({
						title: "请稍后尝试！",
						icon: "none",
						mask: true
					});
					return;
				}
				this.clickNum++;
				uni.getLocation({
					type: 'gcj02', //返回可以用于uni.openLocation的经纬度
					success(res) {
						uni.hideLoading();
						that.latitude = res.latitude;
						that.longitude = res.longitude;
						// console.log(res.latitude,"---",res.longitude)
						that.covers[1] = {
							id: 1,
							latitude: res.latitude,
							longitude: res.longitude,
							iconPath: '../../static/location.png'
						}
						var s = pointInsideCircle([that.latitude, that.longitude], [that.circles[0].latitude, that.circles[0].longitude],
							that.r / 100000);
						that.is = s;

						that.signInfo.latitude = res.latitude;
						that.signInfo.longitude = res.longitude;
						that.signInfo.mode = s ? "正常打卡" : "外勤打卡";

						that.getAdd()
					},
					fail(err) {
						uni.hideLoading();
						that.address = "请检查位置信息！"
						uni.showToast({
							title: "请检查位置信息状态！",
							icon: "none",
							mask: true,
							duration: 3000
						})
					}
				});
			},
			// 选择地址
			openLocation() {
				var that = this;
				uni.chooseLocation({
					success: function(res) {
						that.address = res.address;
						that.signInfo.address = res.address;
						// 这里是有问题的 .返回的 res 中有经纬度，地址名  如果使用这个经纬度 就会存在问题，（当前位置和公司位置重合），所以不建议使用这个经纬度。
						var s = pointInsideCircle([that.latitude, that.longitude], [that.circles[0].latitude, that.circles[0].longitude],
							that.r / 10000);
						that.is = s;
					}
				});
			},
			updated() {
				let _this = this;
				wx.getLocation({
					type: 'gcj02', //返回可以用于wx.openLocation的经纬度
					success: function(res) {
						_this.latitude = res.latitude;
						_this.longitude = res.longitude;
						_this.nearDistance(_this.markers, _this.latitude, _this.longitude)
					},
					fail: function(res) {}
				})
			},
			// 改变视野时改变经纬度
			regionchange(e) {
				let _this = this;
				// 使用 wx.createMapContext 获取 map 上下文
				var mapCtx = wx.createMapContext('myMap', this)
				mapCtx.getCenterLocation({
					success: function(res) {
						_this.centerLatitude = res.latitude;
						_this.centerLongitude = res.longitude;
						_this.nearDistance(_this.markers, _this.centerLatitude, _this.centerLongitude)
					},
					fail: function(res) {}
				}) //获取当前地图的中心经纬度
			},
			handler ({BMap, map}) {
				var that=this
					var point = new BMap.Point(this.form.baiduLongitude, this.form.baiduLatitude)
					map.centerAndZoom(point, 15)
					var marker = new BMap.Marker(point) // 创建标注
					map.addOverlay(marker) // 将标注添加到地图中
			      
				  var geolocation = new BMap.Geolocation();
			    },
				editAddress(){
					this.promptVisible=true
				},
				
				
				// 
				getDetail(){
					var that=this
					var param = {
						openId:uni.getStorageSync('openid'),
						devId:this.id
					}
					request.apiGet('/toc/device/info',param).then((res) =>{
						if(res.code == '0'){
							that.data=res.data
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
				getAddress(){
					var that=this
					var param = {
						page:1,
						count:10,
						address:this.address
					}
					that.candidates=[]
					request.apiGet('/toc/address/bindList',param).then((res) =>{
						// res.rows.forEach((item) =>{
						// 	that.candidates.push(item.address)
						// })
							that.candidates=res.rows
							global.hideLoading()
					}).catch((reason) =>{
						global.hideLoading()
						global.showToast(reason)
					})
				},
				searchComplete(e){
					console.log(e)
					var coordinates=[]
					e.Ir.forEach((item) =>{
						if(coordinates.filter(citem =>{return citem.address==item.address}).length<1){
							coordinates.push({
								address:item.address,
								baiduLongitude:item.point.lng,
								baiduLatitude:item.point.lat
							})
						}
					})
					this.candidates=coordinates
				},
				chooseLocation(e){
					console.log(e)
					this.address=e.address
					this.baiduLongitude=e.baiduLongitude
					this.baiduLatitude=e.baiduLatitude
				},
				clickPromptConfirm(){
					var that=this
					var param = {
						openId:uni.getStorageSync('openid'),
						devId:this.data.devId,
						devLocation:this.address,
						baiduLongitude:this.baiduLongitude,
						baiduLatitude:this.baiduLatitude
					}
					request.apiPost('/toc/device/changeAddressForPerson',param).then((res) =>{
							if(res.code == '0'){
								global.showToast('更改成功')
								that.promptVisible=false
								that.getDetail()
							}else{
								global.showToast(res.msg)
							}
							global.hideLoading()
					}).catch((reason) =>{
						global.hideLoading()
						global.showToast(reason)
					})
				},
				clickPromptConfirm2(){
					var that=this
					var param = {
						openId:uni.getStorageSync('openid'),
						devId:this.data.devId,
						toPhone:this.toPhone,
						toName:this.toName
					}
					request.apiPost('/toc/device/share',param).then((res) =>{
							if(res.code == '0'){
								global.showToast('更改成功')
								that.promptVisible2=false
								that.getDetail()
							}else{
								global.showToast(res.msg)
							}
							global.hideLoading()
					}).catch((reason) =>{
						global.hideLoading()
						global.showToast(reason)
					})
				},
				stopShare(id){
					var that=this
					var param = {
						openId:uni.getStorageSync('openid'),
						shareId:id,
					}
					request.apiPost('/toc/device/cancelShare',param).then((res) =>{
							if(res.code == '0'){
								global.showToast('更改成功')
								that.getDetail()
							}else{
								global.showToast(res.msg)
							}
							global.hideLoading()
					}).catch((reason) =>{
						global.hideLoading()
						global.showToast(reason)
					})
				},
				makePhone(number){
					uni.makePhoneCall({
						phoneNumber:number,
						fail:(reason) =>{
							global.showToast(reason)
						}
					})
				}
		}
	}
</script>

<style lang="scss">
	page {
		background: #F0F0F0;
		// padding-bottom: 100upx;
	}



	.yt-list {
		margin-top: 16upx;
		background: #fff;
	}

	.yt-list-cell {
		display: flex;
		align-items: center;
		// padding: 10upx 30upx 10upx 40upx;
		line-height: 70upx;
		position: relative;

		&.cell-hover {
			background: #fafafa;
		}

		&.b-b:after {
			left: 30upx;
		}

		.cell-icon {
			height: 32upx;
			width: 32upx;
			font-size: 22upx;
			color: #fff;
			text-align: center;
			line-height: 32upx;
			background: #f85e52;
			border-radius: 4upx;
			margin-right: 12upx;

			&.hb {
				background: #ffaa0e;
			}

			&.lpk {
				background: #3ab54a;
			}

		}

		.cell-tit {
			flex: 1;
			font-size: 26upx;
			color: dimgray;
			margin-right: 10upx;
		}

		.cell-tip {
			font-size: 26upx;
			color: #f85e52;

			&.disabled {
				color: #f85e52;
			}

			&.active {
				color: #f85e52;
			}

			&.red {
				color: #f85e52;
			}
		}

		&.desc-cell {
			position: relative;

			.cell-tit {
				max-width: 160upx;
			}
		}

		.desc {
			flex: 1;
			font-size: 28upx;
			color: darkgray;
		}

		switch {
			transform: translateX(16upx) scale(.84);
		}
	}

	.add-btn {
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

	.mini-btn {
		line-height: 32px;
		height: 32px;
		margin-right: 10upx;
	}

	.map-warpper {
		position: absolute;
		left: 0;
		top: 0;
		// z-index: 2;
		width: 100%;
		height: 100%;
	}
	.card{
		padding: 20upx 20upx 0;
		background-color: #fff;
		margin: 30upx;
		border-radius: 8px;
	}
	.card .line{
		padding: 10upx 0;
	}
	.card .border-line{
		border-bottom: 1px solid #f2f2f2;
	}
	.edit-btn{
	   padding: 20upx;
	   text-align: center;
	   border-top: 1px solid #E6E6E6;
	}
	.add-share-btn{
		padding: 5upx 20upx;
		background:rgba(42,149,240,1);
		border-radius:24px;
		color: #fff;
		margin-top: -5upx;
	}
	
	.card2{
		// padding: 20upx 0 0;
		padding: 0 !important;
		margin: 40upx 30upx;
	}
	.card2 .border-line{
		font-size: 24upx;
	}
	.card2 text{
		display: inline-block;
		padding: 0 10upx;
		line-height: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		box-sizing: border-box;
		text-align: center;
	}
	.card2 .left-border{
		border-left: 1px solid #111;
	}
	.col1{
		width: 40%;
	}
	.col2{
		width: 40%;
	}
	// .col3{
	// 	width: 29%;
	// }
	.col4{
		width: 20%;
	}
	.sharemap{
		height: 800upx !important;
	}
	.btn{
		background:rgba(63,135,255,1) !important;
		border-radius:34px !important;
		font-size: 34upx;
		margin-top: 60upx;
	}
	
	.input{
		margin: 20upx 0;
		padding: 15upx 0;
		font-size: 28upx;
		width: 85%;
		border: 1px solid #f2f2f2;
	}
	.prompt2{
		
	}
	
	.prompt-line{
		width: 90%;
		margin: 0 auto;
	}
	.prompt-line text,
	.prompt-line input{
		display: inline-block;
		vertical-align: middle;
	}
	.prompt-line text{
		width: 30%;
		box-sizing: border-box;
		padding-right: 5%;
		text-align: right;
	}
	.prompt-line input{
		width: 60%;
	}
	
	
	.line>view{
		display: inline-block;
		vertical-align: middle;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 300upx;
	}
	.line .dev-props{
		width: 150upx;
		display: inline-block;
	}
	.line-box{
		position: relative;
	}
	.line-box:before{
		content: '';
		position: absolute;
		left: 50%;
		top: 0;
		border-left: 1px dashed #f2f2f2;
		height: 100%;
	}
</style>
