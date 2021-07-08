<template>
	<view class="container" :data-theme="themeStyle">
			<!-- <view class="container"> -->
				<view class="outer-container-wrap">
					<navbar></navbar>
					<view class="container-body-wrap">
						<view class="transfer-cate">
							<block v-for="(item, index) in category" :key="index">
								<view class="cate-li" :class="{ 'active color-base-text color-base-bg-before': status == item.id }" 
								@click="selectCate(item.id)">
									{{ $lang(item.name) }}
								</view>
							</block>
						</view>
					</view>
				</view>
	</view>
</template>

<script>
	import globalConfig from '@/common/js/golbalConfig.js';
	
	export default {
		data() {
			return {
				category: [{
						id: 0,
						name: '全部',
						number: 2
					},
					{
						id: 1,
						name: '待审核',
						number: 0
					},
					{
						id: 2,
						name: '已提现',
						number: 0
					},
					{
						id: 3,
						name: '已拒绝',
						number: 0
					}
				],
				
				withdrawState: {
					'1': {
						color: 'color: rgb(255, 160, 68)',
						text: '待审核'
					},
					'2': {
						color: 'color: rgb(17, 189, 100)',
						text: '已提现'
					},
					'3': { 
						color: 'color: rgb(255, 69, 68)',
						text: '已拒绝'
					}
				},
				status: 0,
				transferList: [],
				emptyShow: false
				
			}
		},
		mixins: [globalConfig],
		
		methods: {
			selectCate(e) {
				this.status = e;
				//this.$refs.mescroll.refresh();
			}
		}
	}
</script>

<style>
	
	.outer-container-wrap {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
	}
	
	.transfer-cate {
		width: 100%;
		height: 88rpx;
		display: flex;
		justify-content: space-around;
		background: #fff;
		position: fixed;
		top: 80px;
		z-index: 999;
		box-sizing: border-box;
		
		max-width: 1200px;
		margin: 0 auto;
		
		.cate-li {
			text-align: center;
			display: inline-block;
			height: 88rpx;
			font-size: 30rpx;
			position: relative;
			line-height: 88rpx;
			
			&.active:after {
				content: '';
				display: block;
				width: 100%;
				height: 4rpx;
				border-radius: 6rpx;
				position: absolute;
				left: 0;
				bottom: 0;
			}
			
			}
		
	}
	
	
</style>
