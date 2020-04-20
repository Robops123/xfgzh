<template>
    <view >
        <view class="page-body">
            <view class="page-section page-section-gap">
               <!-- <map id="myMap" style="width: 100%; height: calc(100vh - 294px);"  :class="usertype=='dw' ? 'fullscreen':''"
					:latitude="markers[0].latitude" 
					:longitude="markers[0].longitude" 
					:markers="markers" 
					:include-points="markers"
					show-location
					:scale="scale"
					@markertap="showlist"
					@tap="bindtap" 
					@callouttap="callouttap" 
					@regionchange="regionchange"
					@end="regionchange"
					@updated="updated">
                </map> -->
				<!-- 个人 -->
				<baidu-map 
				v-if='markers.length>0 && usertype=="gr"'
				style="width: 100%; height: calc(100vh - 94px);"  
				:center="{
					lng:markers[0].baiduLongitude,
					lat:markers[0].baiduLatitude
				}" :zoom="zoom" @ready="handler" @click="getClickInfo" :scroll-wheel-zoom='true'>
					<bml-marker-clusterer :averageCenter="true" >
					       <bm-marker v-for='(item,index) in markers' :key='index' :position="{lng: item.baiduLongitude, lat: item.baiduLatitude}"
					        :dragging="false" @click='clusterclick(item)'
					        :title="departures(item.typeName).introduce || ''" 
					       >
					            <bm-label :content="departures(item.typeName).introduce" :labelStyle="{color: 'black', fontSize : '16px'}" :offset="{width: -25, height: -30}"/>
					          </bm-marker>
					   </bml-marker-clusterer>
				    </baidu-map>
					
					<!-- 单位 -->
					<baidu-map
					v-if='markers.length>0 && usertype=="dw"'
					style="width: 100%; height: calc(100vh - 94);"  
					class='fullscreen'
					:center="{
						lng:markers[0].longitude,
						lat:markers[0].latitude
					}" :zoom="zoom" @ready="handler" @click="getClickInfo" :scroll-wheel-zoom='true'>
						<bml-marker-clusterer :averageCenter="true" >
						       <bm-marker v-for='(item,index) in markers' :position="{lng: item.longitude, lat: item.latitude}"
						        :dragging="false" @click='clusterclick2(item)'>
						          </bm-marker>
						   </bml-marker-clusterer>
						   <bm-info-window :show="show" :position="{lng: info.longitude, lat: info.latitude}" :key=''
						   @close="infoWindowClose" @open="infoWindowOpen" class='infowindow'>
						   	<view>
						   		<view>
						   			<image src="../../static/selected.png" mode=""></image>
						   			{{info.describe}}
						   		</view>
						   		<view>
						   			<image src="../../static/定位.png" mode=""></image>
						   			{{info.location}}
						   		</view>
						   		<view class="time">
						   			{{info.location}}
						   		</view>
						   	</view>
						   </bm-info-window>
					    </baidu-map>
						
						
					<!-- <baidu-map class="map" :center="{lng: 116.404, lat: 39.915}" :zoom="15" style="width: 100%; height: calc(100vh - 294px);">
					    <bm-marker :position="{lng: 116.404, lat: 39.915}" :dragging="true" animation="BMAP_ANIMATION_BOUNCE">
					      <bm-label content="我爱北京天安门" :labelStyle="{color: 'red', fontSize : '24px'}" :offset="{width: -35, height: 30}"/>
					    </bm-marker>
					  </baidu-map> -->
					   <!-- <baidu-map class="map" :center="{lng: 116.404, lat: 39.915}" :zoom="15" style='height: 300px;'>
					      <bm-marker :position="{lng: 116.404, lat: 39.915}" :dragging="true" animation="BMAP_ANIMATION_BOUNCE" :icon="{url: 'http://developer.baidu.com/map/jsdemo/img/fox.gif', size: {width: 300, height: 157}}"></bm-marker>
					    </baidu-map> -->
            </view>
        </view>
    </view>
</template>

<script>
	import {BmlMarkerClusterer} from 'vue-baidu-map'
export default {
	props:{
		storeData:{
			type:Array			
		},
		 markers:{
			 type:Array,
		 },
		 usertype:{
			 type:String
		 }
	},
    data() {
        return {
			show:false,
			info:{},
			markerIcon:"",
			center: {lng: 109.45744048529967, lat: 36.49771311230842},
			      zoom: 15,
			store:{},
			storeFlag:false,
			storeAdFlag:true,
			distanceL:0,//附近店门的距离
            latitude: '',
            longitude: '',
			scale:'18',
			controls:[{position:{},iconPath:'http://img-cdn-qiniu.dcloud.net.cn/new-page/uni.png'}]
        }
    },
	onShow(){
		// this.usertype=uni.getStorageSync('usertype')
	},
    methods: {
		// 点击了门店信息
		storeDesEvn(){
			uni.showToast({title:'自己自定义跳门店详情页介绍',duration:2000,icon:'none'});
		},
		// 点击气泡
		callouttap(e){
			this.storeFlag=true;
			this.storeAdFlag=false;
			for (let i = 0; i < this.storeData.length; i++) {
				const ele = this.storeData[i];
				if(ele.id==e.markerId){
					this.store = ele;
					break;
				}
			}
			
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
		// 点击地图
		bindtap(id){
			console.log(id)
			this.storeFlag=false;
			// this.storeAdFlag=true;
		},
		// 隐藏广告图片
		hideAd(){
			this.storeAdFlag=false;
		},
		updated(){
			let _this = this;
			wx.getLocation({
			  type: 'gcj02', //返回可以用于wx.openLocation的经纬度
			  success: function (res) {
				  console.log(res)
				_this.latitude = res.latitude;
				_this.longitude = res.longitude;
				_this.nearDistance(_this.markers,_this.latitude,_this.longitude)
			  },
			   fail: function(res){
			   }
		  })
		},
		// 改变视野时改变经纬度
		regionchange(e){
			let _this = this;
			// 使用 wx.createMapContext 获取 map 上下文
			var mapCtx = wx.createMapContext('myMap',this)
			mapCtx.getCenterLocation({
				success:function(res){
					_this.centerLatitude = res.latitude;
					_this.centerLongitude = res.longitude;
					_this.nearDistance(_this.markers,_this.centerLatitude,_this.centerLongitude)
				},
				fail: function(res){
				}
			}) //获取当前地图的中心经纬度
		},
		// 两点间距离
		distance(la1, lo1, la2, lo2) {
			var La1 = la1 * Math.PI / 180.0;
			var La2 = la2 * Math.PI / 180.0;
			var La3 = La1 - La2;
			var Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
			var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
			s = s * 6378.137;//地球半径
			s = Math.round(s * 10000) / 10000;
			return s
		},
		// 计算最近的距离
		nearDistance(array,centerLatitude,centerLongitude){
			let temp=[]
			for (let i = 0,l=array.length; i < l; i++) {
				const element =  array[i];
				let d = this.distance(element.latitude,element.longitude,centerLatitude,centerLongitude);
				temp.push(d)
			};
			this.distanceL = Math.min.apply(null, temp);
		},
		// 点击标记
		showlist:function(detail,o){
			console.log(detail)
		},
		initPosition(){
			this.scale=15
			// this.latitude=this.markers[0].latitude
			// this.longitude=this.markers[0].longitude
		},
		handler ({BMap, map}) {
			var that=this
			// this.markers.forEach((item) =>{
			// 	var point = new BMap.Point(item.longitude, item.latitude)
			// 	var marker = new BMap.Marker(point) // 创建标注
			// 	map.addOverlay(marker) // 将标注添加到地图中
			// 	// var circle = new BMap.Circle(point, 6, { strokeColor: 'red', strokeWeight: 6, strokeOpacity: 1, Color: 'black', fillColor: 'black' })
			// 	// map.addOverlay(circle)
			// })
		      
			  // var geolocation = new BMap.Geolocation();
			  // geolocation.getCurrentPosition(function (r) {
			  //     if (this.getStatus() == BMAP_STATUS_SUCCESS) {
					//   // that.form.tencentLatitude=r.latitude
					//   //  that.form.tencentLongitude=r.longitude
			  //       var mk = new BMap.Marker(r.point);
			  //       map.addOverlay(mk);
			  //       map.panTo(r.point);
			  //       map.enableScrollWheelZoom(true);
			  //     }
			  //     else {
			  //       global.showToast('获取当前位置失败')
			  //     }
			  //   }, {enableHighAccuracy: true})
		    },
		    getClickInfo (e) {
		      this.center.lng = e.point.lng
		      this.center.lat = e.point.lat
		    },
			markertap(e){
				console.log(e)
			},
			clusterclick(e){
				  // console.log(e)
				  this.$emit('mapclick',e)
			},
			clusterclick2(e){
				this.info=e
				this.show=true
				console.log(this.info.longitude,this.info.latitude)
			},
			infoWindowOpen(){
				this.show=true
			},
			infoWindowClose(){
				this.show=false
			}
    },
	created() {
		this.usertype=uni.getStorageSync('usertype')
		this.initPosition()
		console.log(this.markers)
		// var map = new BMap.Map("myMap");    // 创建Map实例
		// 	map.centerAndZoom(new BMap.Point(this.latitude,this.longitude), 11);  // 初始化地图,设置中心点坐标和地图级别
		// 	//添加地图类型控件
		// 	map.addControl(new BMap.MapTypeControl({
		// 		mapTypes:[
		//             BMAP_NORMAL_MAP,
		//             BMAP_HYBRID_MAP
		//         ]}));	  
		// 	map.setCurrentCity("");          // 设置地图显示的城市 此项是必须设置的
		// 	map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
	},
	onReady() {
		
  },
 
  components:{
	  BmlMarkerClusterer
  },
  // computed:{
	 //  zoomnumber(){
		//   return parseInt(this.zoom)
	 //  }
  // }
}
</script>

<style lang="scss">
	.content {
		text-align: center;
		height: 400upx;
		background-color: #07BB07;
	}
	.page-section{
		z-index: 0;
	}
	.store-tips{
		width: 600upx;
		height: 100upx;
		margin: 10upx auto;
		border-radius: 10upx;
		position: absolute;
		top: 10upx;
		left: 50%;
		transform: translate(-50%,0);
		z-index:2;
		overflow: hidden;
		background: #07BB07;
		.store-des-box{
			background: #07BB07;
		}
		.store-img{
			width: 80upx;
			height: 80upx;
			border-radious:10upx;
			margin: 10upx;
			float: left;
		}
		.store-des{
			padding-top: 8upx;
			float: left;
			line-height: 1;
			font-size: 22upx;
			color: #666;
			padding-left: 20upx;
			.store-name{
				font-weight: 600;
				color: deeppink;
			}
		}
		.store-clear{
			width: 30upx;
			height: 30upx;
			position: absolute;
			top:7rpx;
			right:7upx;
			maigin:30upx;
	
		}
	}
	.address-icon{
		width:38rpx;
		height:40rpx;
		position:absolute;
		top:22%;
		left:50%;
		z-index:2;
		margin-bottom:-20upx;
		margin-left:-20upx;

	}
	.near-num{
		padding: 10upx 20upx;
		border-radius: 10upx;
		position:absolute;
		top:17%;
		left:50%;
		z-index:2;
		font-size:24upx;
		background:#fff;
		transform: translate(-50%,0)
	}
	.fullscreen{
		height: calc(100vh - 50px) !important;
	}
	.infowindow image{
		width: 12px;
		height: 12px;
	}
	.infowindow .time{
		padding-left: 12px;
	}
</style>
