<template>
	<view style='text-align: center;'>
		<view class='title'>NB烟感</view>
		<view class='buy-btn buy-btn-1' @click='buy(0)'>个人购买</view>
		<view class='buy-btn buy-btn-2' @click='buy(1)'>企业购买</view>
		
		<view class='tips'>注：个人账号支付请点击 “个人购买” ;</view>
		<view class='tips'>企业对公账号支付请点击 “企业购买” ;</view>
	</view>
</template>

<script>
	import global from '../../static/js/global.js';
	import request from '../../api/request.js'
	export default{
		data(){
			return {
				openId:'',
				productInfo:{}
			}
		},
		onLoad(p) {
			var code=this.getUrlParam('code')
			if(code!=null){
				this.getOpenId(code)
			}
			this.getList()
		},
		methods:{
			getUrlParam (name) {
			  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')  
			  let url = window.location.href.split('#')[0]   
			  let search = url.split('?')[1]  
			  if (search) {  
			    var r = search.substr(0).match(reg)  
			    if (r !== null) return unescape(r[2])  
			    return null  
			  } else {  
			    return null  
			  }  
			},
			getOpenId(code){
				global.showLoading()
				var data={
					code:code
				},that=this
				request.apiGet('/toc/tocUser/getOpenId',data).then((res) =>{
					if(res.code == '0'){
						global.hideLoading()
						that.openId=res.openId
						uni.setStorageSync('openid',res.openId)
					}else{
						global.hideLoading()
						global.showToast('请在微信环境下打开')
					}
					
				}).catch((reason) =>{
					global.hideLoading()
					global.showToast('网络错误')
				})
			},
			getList(){
				global.showLoading()
				var data={
					page:1,
					count:10,
					belongProject:'huishan'
				},that=this
				uni.request({
					url:'http://112.25.69.93/api/mall/productInfo/page',
					method :"GET",
					header:{
						'Accept': 'application/json',
						"content-type":"application/json"
					},
					timeout:6000,
					data:data,
					success(res) {
						console.log(res)
						if(res.data.code == '0'){
							global.hideLoading()
							that.productInfo=res.data.data[0]
						}else{
							global.hideLoading()
							global.showToast('配置错误')
						}
					},
					fail(err) {
						global.hideLoading()
						global.showToast('网络错误')
					}
				})
			},
			buy(type){
				uni.navigateTo({
					url:`/pages/buyDevice/order?type=${type}&price=${this.productInfo.price}&id=${this.productInfo.productId}&name=${this.productInfo.productName}`
				})
			}
		}
	}
</script>

<style>
	.title{
		line-height: 80px;
		font-size: 16px;
		font-weight: bold;
	}
	.buy-btn{
		width: 60%;
		line-height: 40px;
		border: 1px solid #000000;
		margin:0 auto 40px;
	}
	.buy-btn-1{
		color: #fff;
		background-color: #0099ff;
	}
	.buy-btn-2{
		background-color: #ff9933;
	}
	.tips{
		color: #ff3300;
		line-height: 24px;
	}
</style>
