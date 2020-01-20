// 常量
if(!globalThis)var globalThis = {}
globalThis.PATH='http://47.103.152.26/api'
// globalThis.PATH="/geomantic/"



async function showLoading(){
	uni.showLoading({
		title:"请等待",
		mask:true,
	})
}

async function hideLoading(){
	uni.hideLoading();
}

/**
 * @name 显示toast
 * @param res {status:"0",(msg||data):""}
 */
async function showToast(res){
	uni.showToast({
		title: res || res.msg,
		mask: true,
		icon: res.status==0?"success":"",
		duration: 1500
	});
}

export default {
	showLoading,
	hideLoading,
	showToast
}