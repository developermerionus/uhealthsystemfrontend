<template>
	<view class="container" :data-theme="themeStyle">
		<!-- <view class="container"> -->
		<view class="outer-container-wrap">
			<navbar></navbar>
			<view class="container-body-wrap">
				<view class="transfer-cate">
					<block v-for="(item, index) in category" :key="index">
						<view class="cate-li"
							:class="{ 'active color-base-text color-base-bg-before': status == item.id }"
							@click="selectCate(item.id)">
							{{ $lang(item.name) }}
						</view>
					</block>
				</view>
				
				<mescroll-uni ref="mescroll" @getData="getData" top="140px" 
				class="member-point" :size="10">
				<block slot="list">
					
					
					
					<block v-if="transferList.length == 0 && emptyShow">
						<ns-empty :text="$lang('transferRecordsEmpty_0') " :isIndex="!1" v-if="status == 0">
						</ns-empty>
						<ns-empty :text="$lang('transferRecordsEmpty_1')" :isIndex="!1" v-if="status == 1">
						</ns-empty>
						<ns-empty :text="$lang('transferRecordsEmpty_2')" :isIndex="!1" v-if="status == 2">
						</ns-empty>
						<ns-empty :text="$lang('transferRecordsEmpty_3')" :isIndex="!1" v-if="status == 3">
						</ns-empty>
					</block>
				</block>
				</mescroll-uni>
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
			
			getData(mescroll) {
				this.emptyShow = false;
				if (mescroll.num == 1) {
					this.transferList = [];
				}
				
				this.emptyShow = true;
			},
			
			selectCate(e) {
				this.status = e;
				this.$refs.mescroll.refresh();
			}
		}
	}
</script>

<style>
	.outer-container-wrap {
		max-width: 1200px;
		margin: 0 auto;
	}

	.transfer-cate {
		width: 100%;
		height: 88rpx;
		display: flex;
		justify-content: space-around;
		background: #fff;
		position: fixed;
		top: 90px;
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

			/* &.active:after {
				content: '';
				display: block;
				width: 100%;
				height: 4rpx;
				border-radius: 6rpx;
				position: absolute;
				left: 0;
				bottom: 0;
				background-color: red;
			} */

		}
		
		
		

	}
</style>
