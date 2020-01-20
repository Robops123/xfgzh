<template>
	<view>
		<view class="yt-list">
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
				<!-- <map id="myMap" style="width: 100%; height: 500upx;"
				            					:latitude="form.baiduLatitude" 
				            					:longitude="form.baiduLongitude" 
				            					:markers="markers" 
												></map> -->
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
		</view>
		<view class="yt-list">
			<view class="yt-list-cell desc-cell">
				<text class="cell-tit clamp">保修信息：</text>
			</view>
			<view class="yt-list-cell desc-cell">
				设备购买时间：<input class="desc" v-model="form.buyDate" type="text" disabled/>
			</view>
			<view class="yt-list-cell desc-cell">
				购买商家：<input class="desc" v-model="form.buyCom" type="text" disabled/>
			</view>
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

	export default {
		components: {},
		data() {
			return {
				mapReady:false,
				address: "选择位置",
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

				]
			}
		},
		onLoad(p) {
			var params = JSON.parse(p.item)
			console.log(params)
			this.form.devId = params.devId
			this.form.address = params.devLocation
			this.form.imei = params.imei
			this.form.devName = params.devName
			this.form.baiduLongitude = params.baiduLongitude
			this.form.baiduLatitude = params.baiduLatitude
			this.form.buyDate = params.buyDate
			this.form.buyCom = params.buyCom
			this.markers.push({
				id: params.id,
				latitude: params.baiduLatitude,
				longitude: params.baiduLongitude,
				iconPath: '/static/img/MiniSmokeTrans.png',
				callout: {
					content: params.devName,
					borderRadius: 10,
					padding: 10,
					display: "ALWAYS",
				}
			})
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
		z-index: 99;
		width: 100%;
		height: 100%;
	}
</style>
