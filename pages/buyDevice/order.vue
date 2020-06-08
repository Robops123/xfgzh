<template>
	<view　style='margin-top: 40upx;'>
		<view class='line' v-if='type==1'>
			<text class='cwarning'>*</text><text class='pre-name'>企业名称</text>:
			<input type="text" class="line-input" v-model="form.companyName">
		</view>
		<view class='line' v-if='type==1'>
			<text class='cwarning'>*</text><text class='pre-name'>纳税人识别号</text>:
			<input type="text" class="line-input" v-model="form.companyCode">
		</view>
		<view class='line'>
			<text class='cwarning'>*</text><text class='pre-name'>姓名</text>:
			<input type="text" class="line-input" v-model="form.customName">
		</view>
		<view class='line'>
			<text class='cwarning'>*</text><text class='pre-name'>联系电话</text>:
			<input type="text" class="line-input" v-model="form.customPhone">
		</view>
		<view class='line'>
			<text class='cwarning'>*</text><text class='pre-name'>收货地址</text>:
			<input type="text" class="line-input" v-model="form.address">
		</view>
		<view class='line'>
			<text class='cwarning'>*</text><text class='pre-name'>电子邮箱</text>:
			<input type="text" class="line-input" v-model="form.email">
		</view>
		<view class='line'>
			<text class='cwarning'>*</text><text class='pre-name'>购买数量</text>:
			<view class='calculator'>
				<view class='operate minus' @click='minus' :class='{disabled:minusDisabled}'>-</view>
				<input type="number" class="line-input" v-model="amount">
				<view class='operate plus'  @click='plus' :class='{disabled:plusDisabled}'>+</view>
			</view>
			<!-- <view style='margin: -35upx 0 25upx 20upx;'>(每人限购10件)</view> -->
		</view>
		
		<view class='line'>
			<text class='cwarning'>*</text><text class='pre-name'>订单总额</text>:
			<input type="text" v-model="totalPrice" class="line-input" disabled="disabled" style="width: 300upx;background-color: lightgray;">元
		</view>
		
		<view class='buy-btn' @click='pay'>点击购买</view>
	</view>
</template>

<script>
	import global from '../../static/js/global.js';
	import request from '../../api/request.js'
	export default{
		data(){
			return {
				type:0,
				price:'',
				id:'',
				amount:1,
				name:'',
				form:{
					customName:'',
					customPhone:'',
					address:'',
					email:'',
					productList:[],
					customType:'',
					companyName:'',
					companyCode:'',
					province:'',
					city:'',
					openId:uni.getStorageSync('openid')
				}
			}
		},
		onLoad(p){
			this.type=p.type
			this.price=p.price
			this.id=p.id
			this.name=p.name
		},
		computed:{
			totalPrice(){
				return this.amount*this.price
			},
			minusDisabled(){
				return this.amount<=1 
			},
			plusDisabled(){
				return this.amount>=10
			}
		},
		methods:{
			minus(){
				if(!this.minusDisabled){
					--this.amount
				}
			},
			plus(){
				if(!this.plusDisabled){
					++this.amount
				}
			},
			pay(){
				this.generateOrder()
				// uni.navigateTo({
				// 	url:'/pages/buyDevice/result'
				// })
			},
			generateOrder(){
				if(!this.form.customName || !this.form.customPhone || !this.form.address || !this.form.email){
					global.showToast('请将订单信息填写完整')
					return ;
				}
				if(this.type==1){
					if(!this.form.companyCode || !this.form.companyName){
						global.showToast('请将订单信息填写完整')
						return ;
					}
				}
				var that=this
				this.form.productList.push({
					productId:this.id,
					productName:this.name,
					productCount:this.amount
				})
				this.form.customType=this.type
				uni.request({
					url:'http://112.25.69.93/api/mall/pay/submitOrderHuiShan',
					method :"post",
					header:{
						'Accept': 'application/json',
						"content-type":"application/json"
					},
					timeout:6000,
					data:this.form,
					success(res) {
						console.log(res)
						if(res.data.code == 0){
							global.hideLoading()
							if(that.type==0){
								uni.redirectTo({
									url:'../pay/wxPay?name='+that.name+'&price='+that.totalPrice+'&recordId='+res.data.data
								})
							}else {
								uni.navigateTo({
									url:`/pages/buyDevice/result?data=${JSON.stringify(res.data.data)}`
								})
							}
						}else{
							global.hideLoading()
							global.showToast('请将订单信息填写完整')
						}
					},
					fail(err) {
						global.hideLoading()
						global.showToast('网络错误')
					}
				})
			}
		}
	}
</script>

<style>
	.pre-name{
		text-align: justify;   
	}
	.pre-name:after{
		display: inline-block ;
		 content: ''; 
		 padding-left: 100%;
	}
	.line{
		padding: 0 30upx;
		margin-top: -20upx;
	}
	.line .pre-name{
		display: inline-block;
		width: 200upx;
		vertical-align: text-top;
	}
	.line>input{
		display: inline-block;
		width: 350upx;
		vertical-align: middle;
		border: 1px solid #000000;
		margin-left: 30upx;
	}
	.buy-btn{
		width: 40%;
		line-height: 30px;
		text-align: center;
		border: 1px solid #000000;
		margin:20px auto 40px;
	}
	.calculator{
		display: inline-block;
		vertical-align: middle;
		height: 60upx;
		margin-left: 30upx;
	}
	.calculator view,.calculator input{
		display: inline-block;
		vertical-align: middle;
		text-align: center;
	}
	.calculator input{
		width: 70upx;
		height: 60upx !important;
		background-color: #f8f8f8;
	}
	.operate{
		width: 60upx;
		height: 100%;
		line-height: 60upx;
		text-align: center;
		background-color: #f8f8f8;
	}
	.disabled{
		background-color: #e5e5e5;
	}
</style>
