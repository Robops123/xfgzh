<template>
	<view>
		<!--地图模块-->
		<view >
			<view style="padding-left: 15px;">
				<label for="">地址：</label>
				<view class="search-top">
					<input v-model="address" placeholder="输入查找位置">
					<button type="primary" size='mini' style="float: right;" v-if="choosedLocation" @click="selectLocation">确定</button>
				</view>
			</view>
			
		</view>
		
		<view class="address-list" v-for="(item,index) in candidates" :key='index' @click="choose(index)">
			<view class="address-name">
				{{item.address}}({{item.location}})
			</view>
			<icon type="success_no_circle" size="12" v-show="item.choosed" class="icon"></icon>
		</view>
		
		<baidu-map  style="display: none;" >
			 <bm-local-search :keyword="address" @searchcomplete='searchComplete'  ></bm-local-search>
		</baidu-map>
	</view>
</template>

<script>
	import global from '../../static/js/global.js'
	export default{
		data(){
		        return{
					address:'',
				  choosedLocation:'',
				  candidates:[]
		        }
		      },
		methods:{
			choose(w){
				this.candidates.map((item,index) =>{
					if(index==w){
						this.choosedLocation=item
						item.choosed=true
					}else{
						item.choosed=false
					}
				})
				this.$forceUpdate()
			},
			searchComplete(e){
				console.log(e)
				var coordinates=[]
				e.Ir.forEach((item) =>{
					// if(coordinates.filter(citem =>{return citem.address==item.address}).length<1){
						coordinates.push({
							location:item.address,
							address:item.title,
							baiduLongitude:item.point.lng,
							baiduLatitude:item.point.lat
						})
					// }
				})
				this.candidates=coordinates
			},
		  selectLocation(){
				  uni.$emit('chooseLocation',this.choosedLocation)
				   setTimeout(function(){
				  	uni.navigateBack();
				  },100)
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
	
	.address-list{
		padding:0 20upx ;
		margin-bottom: 20upx;
		position: relative;
	}
	.address-name{
		display: inline-block;
		width: 80%;
	}
	.address-list .icon{
		position: absolute;
		right: 10%;
		top: 50%;
	}
</style>
