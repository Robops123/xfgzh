<template>
	<view>
		<view class="yt-list">
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
		</view>
		
		<button class="add-btn" @click="submit">保存设备</button>
		
	</view>
	
</template>
<!-- <script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak="></script> -->
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
	
	export default {
		components: {
		},
		data() {
			return {
				result:'',
				address:"选择位置",
				form:{
					openId:uni.getStorageSync('openid'),
					imei:'',
					devName:'',
					devLocation:'',
					baiduLatitude:'',
					baiduLongitude:'',
				},
			}
		},
		onLoad(p){
			this.form.devName=p.type
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
				request.apiPost('/toc/device/save',this.form).then((res) =>{
					if(res.code == '0'){
						global.showToast('添加成功')
						var pages = getCurrentPages();
						var currPage = pages[pages.length - 1]; //当前页面
						var prevPage = pages[pages.length - 2]; //上一个页面
						//直接调用上一个页面的setData()方法，把数据存到上一个页面中去
						prevPage.refresh=true
						 setTimeout(function(){
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
			    }
		}
	}
</script>

<style lang="scss">
	page {
		background: gainsboro;
		padding-bottom: 100upx;
	}

	

	.yt-list {
		margin-top: 16upx;
		background: #fff;
	}

	.yt-list-cell {
		display: flex;
		align-items: center;
		padding: 10upx 30upx 10upx 40upx;
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
</style>
