/**
 * @name 封装下拉
 * @params getList 刷新数据的函数
 * @params listData 存放数据的变量名
 * @params page 页数变量名
 */
export default({getList="getList",listData="listData",page="page",initIndex="initIndex",modelData="modelData"})=> {
	var startPoint={}
	var endPoint={}
	return {
		data(){
			return {
				[listData]:[],
				[page]:1,
				[initIndex]:0,
				[modelData]:[
					{label:"告警记录",backgroud:"color:#FF0000"},
					{label:"报修记录",backgroud:"color:#FF0000"}
				]
			}
		},
		onPullDownRefresh() {
			this.refresh();
		},
		onReachBottom() {
			this[getList].call(this, this[page], this.__pulldone);
		},
		methods:{
			refresh(){
				this[page]=1;
				this[getList].call(this, this[page], this.__pulldone);
			},
			__pulldone(data){
				var db = data || [];
				if (this[page] == 1) {
				  this[listData] = db;
				} else {
				  this[listData] = (this[listData] || []).concat(db);
				}
				uni.stopPullDownRefresh();
				this[page]++;
			},
			
			/**
			 * @name 动态开启或关闭pulldown
			 * @params {boolean} isOpen
			 */
			setPullDown(isOpen){
				// #ifdef APP-PLUS
				const pages = getCurrentPages();  
				const page = pages[pages.length - 1]; 
				var currentWebview = page.$getAppWebview();
				currentWebview.setStyle({//设置当前webview的style
					pullToRefresh: {
						support: isOpen ,
						style: plus.os.name === 'Android' ? 'circle' : 'default'  
					}
				});
				// #endif
			},
			
		}
	}
}