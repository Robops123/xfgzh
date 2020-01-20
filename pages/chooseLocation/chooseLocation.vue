<template>
	<view>
		<!--地图模块-->
		<view >
			<view style="padding-left: 15px;">
				<label for="">地址：</label>
				<view class="search-top">
					<input v-model="keyword" placeholder="输入查找位置">
					<button type="primary" size='mini'style="float: right;" v-if="choosedLocation.location" @click="selectLocation">确定</button>
				</view>
			</view>
			
		</view>
		
		 <!-- getPoint方法，给地图加点击事件，点击地图获取所需要的信息，-->
		 <!--scroll-wheel-zoom属性是否可以用鼠标滚轮控制地图缩放-->
		<baidu-map class="map" id="mapID" :center="center" @ready="ready"
		 :zoom="zoom" style='height: 800upx;' :scroll-wheel-zoom="true" @tap="getPoint" >
		  <!--地图类型，两种：一种是路线一种是绿的那种-->
		  <bm-map-type :map-types="['BMAP_NORMAL_MAP', 'BMAP_HYBRID_MAP']" anchor="BMAP_ANCHOR_TOP_LEFT"></bm-map-type>
		  <!--地图搜索功能，绑定上面的input，-->
		  <!--display: none样式很关键，因为下面默认会有地址提示信息很长，很烦，这样搜索会很舒服，-->
		  <!--zoom是搜索结果的视图比例，个人觉得12.8很舒服显示-->
		  <bm-local-search :keyword="keyword" :auto-viewport="true" @infohtmlset="infohtmlset" class='search-list'
		  zoom="12.8" ></bm-local-search>
		  <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
		  <!--信息窗口，show属性是控制显示隐藏，infoWindowClose和infoWindowOpen是控制信息窗口关闭隐藏的方法-->
		  <bm-marker :position="postionMap">
		    <bm-info-window :show="show" @close="infoWindowClose" @open="infoWindowOpen" style="font-size: 14px">
		      <p>站点地址：{{ add.site }}</p>
		    </bm-info-window>
		  </bm-marker>
		</baidu-map>
	</view>
</template>

<script>
	import global from '../../static/js/global.js'
	export default{
		data(){
		        return{
		          jgNameDialog: false,
		          show: false,
		          postionMap:{  //弹框位置
		            lng: null,
		                        lat:null
		          },
		          location: '',
		          keyword: '',  //搜索框关键词
		          zoom: 12.8,   //放大比例
		          address:'',   //位置详细信息
		          add:{
		            siteName:'',
		            site:'',
		            jd:'',
		            wd:'',
		            desce:'',
		            type:'',
		            jgName:'',
		            jgNum:'',
		          },
		          organizationData:[],
		          jgName:'',
		          jgNum:'',
				  center:{},
				  choosedLocation:{
					  lng:'',
					  lat:'',
					  location:''
				  }
		        }
		      },
		methods:{
		  getPoint(e){    //点击地图获取一些信息，
		    // this.show = true;
		    this.postionMap.lng = e.point.lng;     //通过  e.point.lng获取经度
		    this.postionMap.lat = e.point.lat;     //通过  e.point.lat获取纬度
		    this.add.jd = e.point.lng;
		    this.add.wd = e.point.lat;
		    this.zoom = e.target.getZoom()
			
		    let geocoder= new BMap.Geocoder();  //创建地址解析器的实例
		    geocoder.getLocation(e.point,rs=>{
				this.choosedLocation.location=rs.address
				this.choosedLocation.lng=rs.point.lng
				this.choosedLocation.lat=rs.point.lat
		      // this.add.site = rs.address;
		      //地址描述(string)=
		      // console.log(rs.address);    //这里打印可以看到里面的详细地址信息，可以根据需求选择想要的
		      // console.log(rs.addressComponents);//结构化的地址描述(object)
		      // console.log(rs.addressComponents.province); //省
		      // console.log(rs.addressComponents.city); //城市
		      // console.log(rs.addressComponents.district); //区县
		      // console.log(rs.addressComponents.street); //街道
		      // console.log(rs.addressComponents.streetNumber); //门牌号
		      // console.log(rs.surroundingPois); //附近的POI点(array)
		      // console.log(rs.business); //商圈字段，代表此点所属的商圈(string)
		    },{poiRadius:5,numPois:1});
		  },
		  infohtmlset(e){
			  var that=this
			  this.choosedLocation.location=e.address
			  this.choosedLocation.lng=e.point.lng
			  this.choosedLocation.lat=e.point.lat
		  },
		  infoWindowClose () {
		    this.show = false
		  },
		  infoWindowOpen () {
		    //这里有个问题纠结了很久，百度的信息窗口默认有个点击其他地方就消失的事件，我没有找到
		    //并且信息窗口点击一次显示，一次消失
		    //于是我加了一个100毫秒的定时器，保证每次点击地图都可以展示信息窗口
		   setInterval(()=>{
		     this.show = true
		   },0)
		  },
		  ready({BMap, map}){
		  			  var that=this
		  			  var geolocation = new BMap.Geolocation();
		  			  geolocation.getCurrentPosition(function (r) {
		  			      if (this.getStatus() == BMAP_STATUS_SUCCESS) {
		  			  					  that.center.lng=r.longitude
		  			  					   that.center.lat=r.latitude
		  			        // var mk = new BMap.Marker(r.point);
		  			        // map.addOverlay(mk);
		  			        map.panTo(r.point);
		  			        map.enableScrollWheelZoom(true);
		  			      }
		  			      else {
		  			        global.showToast('获取当前位置失败')
		  			      }
		  			    }, {enableHighAccuracy: true})
		  },
		  selectLocation(){
			  if(this.choosedLocation.location!='' && this.choosedLocation.lng!='' && this.choosedLocation.lat!=''){
				  var pages = getCurrentPages();
				  var currPage = pages[pages.length - 1]; //当前页面
				  var prevPage = pages[pages.length - 2]; //上一个页面
				  //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
				  prevPage.form.devLocation=this.choosedLocation.location
				  prevPage.form.baiduLatitude=this.choosedLocation.lat
				  prevPage.form.baiduLongitude=this.choosedLocation.lng
				   setTimeout(function(){
				  	uni.navigateBack();
				  },100)
			  }else{
				  global.showToast('请选择设备地址')
			  }
		  }
		}
	}
</script>

<style>
	.search-cover{
		position: absolute;
		top: 0;
		left: 0;
		z-index: 999;
	}
	.search-top{
		position: relative;
		padding-bottom: 50upx;
	}
	.search-top input{
		display: inline-block;
		height: 32px !important;
	}
	.search-top button{
		height: 32px !important;
		line-height: 32px !important;
		margin-right: 15px;
	}
	/* .map .search-list{
		height: calc(100vh - 50upx - 32px - 800upx);
	} */
</style>
