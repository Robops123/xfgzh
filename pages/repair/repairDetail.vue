<template>
	<view>
		<view class="list"  :class="{'active':pickerUserIndex==index}"  v-for="(item,index) in 1"
		 :key="index" :data-index="index">
		 <image src="../../static/img/message/bx.png" mode="" class="status"></image>
			<view class="title">
				可燃气体检测仪3发现疑似媒体谢咯大厦时间段
			</view>
			<view class="coffline describe">啊实打实大师到江安石大姐爱神的箭暗色调驾驶机动阿萨德奥斯迪偶家艾斯欧到江安死哦精雕机搜的窘境艾斯欧弟就欧艾斯的我OA就搜到</view>
			<view class="brief">
				<view>
					<image src="../../static/img/device/location.png" mode=""></image>
				</view>
				<view>
					<view class="address cblue">啥啥啥肯定会将卡仕达</view>
					<view class="date coffline">2020-04-20 12:23:11</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				id:''
			}
		},
		onLoad(p){
			this.id=p.id
		}
	}
</script>

<style>
	page{
		background-color: #f2f2f2;
	}
	.list{
		position: relative;
		align-items: center;
		padding: 20upx 30upx;
		margin:  20upx;
		background: #fff;
		position: relative;
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
	.list .describe{
		max-width: 90%;
		margin: 10upx 0;
	}
</style>
