<template>
	<view>
		<web-view :src="url" v-if='url'></web-view>
	</view>
</template>

<script>
	import request from '../../api/request.js'
	import global from '../../static/js/global.js'
	export default{
		data(){
			return {
				inspectionId:'',
				url:''
			}
		},
		onLoad(p){
			this.inspectionId=p.inspectionId
			this.getUrl()
		},
		methods:{
			getUrl(){
				global.showLoading()
				var param = {
					openId:uni.getStorageSync('openid'),
					// openId:'oivqowWYRMGh62Zsyo8Ce_2Z72dw',
					inspectionId:this.inspectionId,
				},that=this
				request.apiGet('/tob/owner/previewInspectionReport',param).then((res) =>{
					if(res.code == '0'){
						// that.markers=res.data
						this.url=res.data
						global.hideLoading()
					}else{
						global.hideLoading()
						global.showToast(res.msg)
					}
				}).catch((reason) =>{
					global.hideLoading()
					global.showToast(reason)
				})
			}
		}
	}
</script>

<style>
</style>
