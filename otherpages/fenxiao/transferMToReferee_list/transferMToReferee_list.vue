<template>
	<view class="container" :data-theme="themeStyle">
		<!-- <view class="container"> -->
		<view class="outer-container-wrap">
			<navbar></navbar>
			<view class="container-body-wrap">
				<view class="transfer-cate">
					<block v-for="(item, index) in category" :key="index">
					<!-- 	<view class="cate-li"
							:class="{ 'active color-base-text color-base-bg-before': status == item.id }"
							@click="selectCate(item.id)"> -->
							<view class="cate-li"
								:class="{ 'active color-base-bg-before': status == item.id }"
								@click="selectCate(item.id)">
							{{ $lang(item.name) }} 
						</view>
					</block>
				</view>
				
				<mescroll-uni ref="mescroll" @getData="getData" top="140px" 
				class="member-point" :size="10">
				<block slot="list">
					<view class="transfer-li" v-for="(item, index) in transferList" :key="index">
						<view class="transfer-li-box">
							<view class="transfer-desc">
								<view class="desc-info">
									<!-- <view class="desc-info-name" :style="transferState[item.status].color">
									{{ $lang(transferState[item.status].text) }}</view> -->
									<text :style="transferState[item.status].color">{{ item.memo }} : </text>
									<view class="desc-info-time">{{ item.trans_time }}</view>
								</view>
								<view class="desc-money" :style="transferState[item.status].color">
									${{ Math.abs(item.amount) }}
								</view>
							</view>
						<!-- 	<view class="money-desc">
								<text :style="transferState[item.status].color">{{ item.memo }}：</text>
								<text class="color-base-text">${{ Math.abs(item.amount) }}</text>
							</view> -->
						</view>
					</view>
					
					
					<block v-if="transferList.length == 0 && emptyShow">
						<ns-empty :text="$lang('transferRecordsEmpty_0') " :isIndex="!1" v-if="status == 0">
						</ns-empty>
						<ns-empty :text="$lang('transferRecordsEmpty_1')" :isIndex="!1" v-if="status == 1">
						</ns-empty>
						<ns-empty :text="$lang('transferRecordsEmpty_2')" :isIndex="!1" v-if="status == 2">
						</ns-empty>
						<!-- <ns-empty :text="$lang('transferRecordsEmpty_3')" :isIndex="!1" v-if="status == 3">
						</ns-empty> -->
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
						name: 'all', // '全部',
						number: 2
					},
					// {
					// 	id: 1,
					// 	name: 'transferred', 
					// 	number: 0
					// },
					// {
					// 	id: 2,
					// 	name: 'received', 
					// 	number: 0
					// },
					// {
					// 	id: 3,
					// 	name: '已拒绝',
					// 	number: 0
					// }
				],

				transferState: {
					'1': {
						color: 'color: rgb(255, 69, 68)',
						text: 'transferred'
					},
					'2': {
						color: 'color: rgb(17, 189, 100)',
						text: 'received'
					},
					// '3': {
					// 	color: 'color: ,
					// 	text: '已拒绝'
					// }
				},
				status: 0,
				transferList: [],
				emptyShow: false

			};
		},
		mixins: [globalConfig],

		methods: {
			
			getData(mescroll) {
				this.emptyShow = false;
				if (mescroll.num == 1) {
					this.transferList = [];
				};
				
				this.$api.sendRequest({
					url: '/api/member/transfer_detail',
					data: {
						page_size: mescroll.size,
						page: mescroll.num,
						status: this.status
					},
					success: res => {
						this.emptyShow = true;
						let newArr = [];
						let msg = res.message;
						if (res.code == 0 && res.data) {
							newArr = res.data;
						} else {
							this.$util.showToast({
								title: msg
							});
						}
						mescroll.endSuccess(newArr.length);
						//设置列表数据
						if (mescroll.num == 1) this.transferList = []; //如果是第一页需手动制空列表
						this.transferList = this.transferList.concat(newArr); //追加新数据
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						mescroll.endErr();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
				
			},
			
			selectCate(e) {
				this.status = e;
				this.$refs.mescroll.refresh();
			}
		}
	}
</script>

<style lang="scss">
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
			

			&.active:after {
				content: '';
				display: block;
				width: 100%;
				height: 4rpx;
				border-radius: 6rpx;
				position: absolute;
				left: 0;
				bottom: 0;
				background-color: red;
			}
		}
	}
	
	.transfer-li {
		width: 100%;
		padding: 0 30rpx;
		box-sizing: border-box;
		max-width: 1200px;
		margin: 0 auto;
		margin-top: 20rpx;
	}
	
	.transfer-li-box {
			width: 100%;
			height: 100%;
			padding: 30rpx;
			background-color: #fff;
			box-sizing: border-box;
		
			.transfer-desc {
				width: 100%;
				display: flex;
				justify-content: space-between;
				border-bottom: 2rpx solid $color-line;
				
			
				.desc-info {
					display: flex;
					justify-content: center;
					flex-direction: column;
			
					.desc-info-name {
						font-size: $font-size-base;
						color: $color-title;
						line-height: 1;
						margin-bottom: 10rpx;
					}
			
					.desc-info-time {
						margin-bottom: 10rpx;
						font-size: $font-size-tag;
						color: $color-tip;
					}
				}
			}
			
			
	
	}
	
</style>
