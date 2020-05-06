<template>
	<view>
		<!-- <view class="yt-list">
			<view class="yt-list-cell desc-cell">
				<text class="cell-tit clamp">设备IMEI号：</text>
			</view>
			<view class="yt-list-cell desc-cell">
				<input class="desc" type="text" v-model="form.imei" placeholder="设备IMEI号(必填)" placeholder-class="placeholder" />
			</view>
		</view>
		<view class="yt-list">
			<view class="yt-list-cell desc-cell">
				<text class="cell-tit clamp">设备名称：</text>
			</view>
			<view class="yt-list-cell desc-cell">
				<input class="desc" type="text" disabled v-model="form.devName" placeholder="设备名称(必填)" placeholder-class="placeholder" />
			</view>
		</view>
		<view class="yt-list">
			<view class="yt-list-cell desc-cell">
				<text class="cell-tit clamp">设备地址：</text>
			</view>
			<view class="yt-list-cell desc-cell">
				<input class="desc" type="text" v-model="form.devLocation" placeholder="点击选择位置: " 
				placeholder-class="placeholder"  @click="openLocation" />
			</view>
		</view> -->
		<view class="card">
			<view class="line border-line">
				<text><text class="cerror">*</text>设备型号:</text>
				<input type="text"  v-model="info.typeName" disabled/>
			</view>
			<view class="line border-line">
				<text><text class="cerror">*</text>设备名称:</text>
				<input type="text" v-model="info.devName" />
			</view>
			<view class="line border-line">
				<text><text class="cerror">*</text>设备编号:</text>
				<input type="text" v-model="info.devId" disabled/>
			</view>
			<view class="line border-line">
				<text><text class="cerror">*</text>地址:</text>
				<uni-combox class="input" @input='getAddress' @click='chooseLocation'
				:candidates="candidates" :value="address" v-model="address"></uni-combox>
			</view>
			<!-- <view class="line border-line">
				<text><text class="cerror">*</text>设备批次址:</text>
				<input type="text" v-model="info.devLocation" disabled/>
			</view> -->
			<view class="line border-line">
				<text><text class="cerror">*</text>imei码:</text>
				<input type="text" v-model="info.imei" disabled/>
			</view>
		</view>
		
		<view style="text-align: center;">
			<button class="add-btn" @click="submit">确定添加</button>
		</view>
		
		
		
		<view class="yt-list-cell desc-cell">
			<view class="map-warpper"></view>
			<baidu-map  style="width: 100%; height: 500upx;margin-top: 100upx;" 
			 :center="{
												lng:info.baiduLongitude,
												lat:info.baiduLatitude
											}" :zoom="15"
			 @ready="handler" >
				<bm-marker  :position="{lng: info.baiduLongitude, lat: info.baiduLatitude}" :dragging="false"
				   :zIndex="999999999" >
				</bm-marker>
			</baidu-map>
		</view>
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
	import request from '../../api/request.js'
	import global from '../../static/js/global.js'
	import uniCombox from "@/components/uni-combox/uni-combox"
	
	export default {
		components: {
			uniCombox
		},
		data() {
			return {
				mapReady:true,
				result:'',
				address:"",
				candidates:[],
				form:{
					openId:uni.getStorageSync('openid'),
					imei:'',
					devName:'',
					devLocation:'',
					baiduLatitude:'',
					baiduLongitude:'',
				},
				code:'',
				info:{},
				choosedLocationId:''
			}
		},
		onLoad(p){
			this.code=p.code
			this.getDeviceInfo()
			 // var geolocation = new BMap.Geolocation();
		},
		onShow(){
			var that=this
			// var jweixin = require('jweixin-module')  
			// jweixin.ready(function(){  
			//     // TODO  
			// });
		},
		methods: {
			submit: function() {
				var that=this
				global.showLoading()
				var params={
					openId:uni.getStorageSync('openid'),
					devId:this.info.devId,
					addressId:this.choosedLocationId,
					devName:this.info.devName
				}
				request.apiPost('/toc/device/bind',params).then((res) =>{
					if(res.code == '0'){
						global.showToast('添加成功')
						// var pages = getCurrentPages();
						// var currPage = pages[pages.length - 1]; //当前页面
						// var prevPage = pages[pages.length - 2]; //上一个页面
						//直接调用上一个页面的setData()方法，把数据存到上一个页面中去
						// prevPage.refresh=true
						 setTimeout(function(){
							 uni.$emit('updateIndex')
							uni.navigateBack();
						},1000)
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
			// 获取当前位置
			getLocation(){
				var that = this;
				if(this.clickNum !== 0){
					uni.showLoading({title:"获取中...",mask:true})
				}
				if(this.clickNum >= 3){
					uni.showToast({title:"请稍后尝试！",icon:"none",mask:true});
					return ;
				}
				this.clickNum++;
				uni.getLocation({
					type: 'gcj02', //返回可以用于uni.openLocation的经纬度
					success(res) {
						uni.hideLoading();
						that.latitude = res.latitude;
						that.longitude = res.longitude;
						// console.log(res.latitude,"---",res.longitude)
						that.covers[1] = {id:1,latitude:res.latitude,longitude : res.longitude,iconPath: '../../static/location.png'}
						var s = pointInsideCircle([that.latitude,that.longitude],[that.circles[0].latitude,that.circles[0].longitude],that.r/100000);
						that.is = s;
						
						that.signInfo.latitude = res.latitude;
						that.signInfo.longitude = res.longitude;
						that.signInfo.mode = s ? "正常打卡" : "外勤打卡";
						
						that.getAdd()
					},
					fail(err){
						uni.hideLoading();
						that.address = "请检查位置信息！"
						uni.showToast({title:"请检查位置信息状态！",icon:"none", mask:true,duration:3000})
					}
				});
			},
			// 选择地址
			openLocation(){
				uni.navigateTo({
					url:'../chooseLocation/chooseLocation'
				})
				// var that = this;
				// uni.chooseLocation({
				// 	keyword:'baidu',
				// 	success: function (res) {
				// 		console.log(res)
				// 		that.form.devLocation = res.address;
				// 	that.form.baiduLatitude=res.latitude
				// 	 that.form.baiduLongitude=res.longitude
				// 		// 这里是有问题的 .返回的 res 中有经纬度，地址名  如果使用这个经纬度 就会存在问题，（当前位置和公司位置重合），所以不建议使用这个经纬度。
				// 		var s = pointInsideCircle([that.latitude,that.longitude],[that.circles[0].latitude,that.circles[0].longitude],that.r/10000);
				// 		that.is = s;
				// 	}
				// });
			},
			handler ({BMap, map}) {
				var that=this
			      // var point = new BMap.Point(109.49926175379778, 36.60449676862417)
			      // map.centerAndZoom(point, 13)
			      // var marker = new BMap.Marker(point) // 创建标注
			      // map.addOverlay(marker) // 将标注添加到地图中
			      // var circle = new BMap.Circle(point, 6, { strokeColor: 'Red', strokeWeight: 6, strokeOpacity: 1, Color: 'Red', fillColor: '#f03' })
			      // map.addOverlay(circle)
				  var geolocation = new BMap.Geolocation();
				  geolocation.getCurrentPosition(function (r) {
				      if (this.getStatus() == BMAP_STATUS_SUCCESS) {
						  that.form.baiduLatitude=r.latitude
						   that.form.baiduLongitude=r.longitude
				        // var mk = new BMap.Marker(r.point);
				        // map.addOverlay(mk);
				        // map.panTo(r.point);
				        // map.enableScrollWheelZoom(true);
				      }
				      else {
				        global.showToast('获取当前位置失败')
				      }
				    }, {enableHighAccuracy: true})
			    },
			    getClickInfo (e) {
			      console.log(e.point.lng)
			      console.log(e.point.lat)
			      this.center.lng = e.point.lng
			      this.center.lat = e.point.lat
			    },
				getDeviceInfo(){
					var that=this
					var param = {
						// openId:uni.getStorageSync('openid'),
						openId:'wx12345678',
						code:this.code,
					}
					request.apiGet('/toc/device/bindInfo',param).then((res) =>{
							if(res.code == '0'){
								that.info=res.data
							}else{
								global.showToast(res.msg)
							}
							global.hideLoading()
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
				chooseLocation(e){
						console.log(e)
					this.choosedLocationId=e.id
					this.info.baiduLongitude=e.longitude
					this.info.baiduLatitude=e.latitude
					this.$forceUpdate()
				},
		}
	}
</script>

<style lang="scss">
	page {
		background: rgb(240,240,240);
		// padding-bottom: 100upx;
	}

	

	.yt-list {
		margin-top: 16upx;
		background: #fff;
	}

	.yt-list-cell {
		display: flex;
		align-items: center;
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

	.add-btn{
		background:rgba(63,135,255,1) !important;
		border-radius:34px !important;
		font-size: 34upx;
		margin-top: 40upx;
		color: #fff;
		width: 80%;
	}
	.card{
		padding: 20upx 20upx 0;
		background-color: #fff;
		margin: 30upx;
		border-radius: 8px;
	}
	.card .line{
		padding: 20upx 0;
	}
	.card .border-line{
		border-bottom: 1px solid #f2f2f2;
	}
	.line>text{
		display: inline-block;
		vertical-align: middle;
		width: 30%;
		text-align: right;
	}
	.line>input,
	.line>.input{
		font-size: 28upx;
		display: inline-block;
		vertical-align: middle;
		width: 64%;
		margin-left: 5%;
	}
	.uni-input-placeholder,
	textarea{
		font-size: 28upx;
	}
	.map-warpper {
		position: absolute;
		left: 0;
		top: 0;
		z-index: 99;
		width: 100%;
		height: 100%;
	}
</style>
