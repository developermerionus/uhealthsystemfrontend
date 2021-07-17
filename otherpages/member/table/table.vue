<template>
	<view>
		<wyb-table ref="table" :headers="headers" :contents="contents" height="1000rpx" :url-col="urlCol" />
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	import wybTable from '@/components/wyb-table/wyb-table.vue'
	export default {
	    components: {
	        wybTable
	    },
	    data() {
	        return {
	            headers: [{
	                label: '订单号',
	                key: 'order_no',
					width: 300
	            },  {
	                label: '会员ID',
	                key: 'member_id'
	            }, {
	                label: 'CV',
	                key: 'cv'
	            }],
	            contents: [{
	                order_no: '00001111',
	                // age: '',
	                member_id: '1119938',
	                cv: '100',
	            }],
	            urlCol: [{
	                type: 'route',
	                key: 'url'
	            }, {
	                type: 'http',
	                key: 'link'
	            }]
	        }
	    },
		onLoad(){
			// console.log('onshow...')
			this.getData();
		},
		// onShow(){
		// 	console.log('onshow...')
		// 	this.getData();
		// }, 
		methods: {
			getData() {
				// console.log('getCV...')
				this.$api.sendRequest({
					url: '/api/member/getMemberCV',
					data: {
						branch: '左区-left',
						yearweek: 202114
					},
					success: res => {
					//	console.log(res.data);
					//	console.log(res.data[0]);
					//	console.log(res.data[1]);
						if (res.code == 0) {
							this.contents = res.data;
						}
						console.log(this.contents);
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			}
		}
	}
</script>

<style>

</style>
