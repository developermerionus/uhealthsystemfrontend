<template>
	<view :data-theme="themeStyle">
		<view class="my_spell_category">
			<view class="category-item" v-for="(item, index) in pintuanStatusList" :key="index" @click="categoryChange(item.id)">
				<view class="item-con" :class="item.id == pintuanStatus ? 'active color-base-text color-base-bg-before' : ''">{{ item.name }}</view>
			</view>
		</view>
		<mescroll-uni @getData="getData" top="90" ref="mescroll" :size="10">
			<block slot="list">
				<view class="goods-list" v-for="(item, index) in dataList" :key="index">
					<view class="list-header">
						<text class="state-time">发起拼单 {{ $util.timeStampTurnTime(item.pay_time) }}</text>
						<text class="state-sign" :style="{ color: pintuanState[item.pintuan_status].color }">{{ pintuanState[item.pintuan_status].text }}</text>
					</view>

					<view class="list-body" @click="goPinTuanDetail(item.pintuan_id)">
						<view class="list-body-img">
							<image :src="$util.img(item.sku_image, { size: 'mid' })" @error="imageError(index)"></image>
						</view>
						<view class="shop-content">
							<view class="shop-title">{{ item.sku_name }}</view>
							<view class="pintuan-num">{{ item.pintuan_num }}人拼单</view>
							<view class="pintuan-price color-base-text">
								<text class="pintuan-price-icon">$</text>
								{{ item.order_money }}
							</view>
						</view>
					</view>
					<view v-if="item.pintuan_status == 2" class="list-footer">
						<template v-if="item.timeMachine">
							<view class="list-footer-time">
								<text>还剩</text>
								<text class="color-base-text">{{ item.pintuan_num - item.pintuan_count }}</text>
								<text>人，剩余时间</text>
								<view class="time-wrap">
									<uni-count-down class="time" :day="item.timeMachine.d" :hour="item.timeMachine.h" :minute="item.timeMachine.i"
									 :second="item.timeMachine.s" color="#909399" splitorColor="#909399" background-color="transparent"
									 border-color="transparent" />
								</view>
							</view>
							<button type="primary" size="mini" @click="toshare(item.id)">邀请好友</button>
						</template>
						<template v-else>
							<text>拼团失败</text>
						</template>
					</view>
					<view v-else-if="item.pintuan_status == 3" class="list-footer">
						<view class="picture-box">
							<view class="img-box" v-for="(i, j) in item.member_list" v-if="j < 4" :key="j">
								<image v-if="i.member_img" :src="$util.img(i.member_img)" @error="memberImageError(index, j)" mode="aspectFill"></image>
								<image v-else :src="$util.img($util.getDefaultImage().default_headimg)" mode="aspectFill"></image>
							</view>
						</view>
						<button type="primary" class="order-btn" size="mini" @click="toOrderDetail(item.order_id)">查看订单详情</button>
					</view>
				</view>
				<view v-if="dataList.length == 0" style="padding-top:0">
					<ns-empty text="暂无拼团订单" :emptyBtn="emptyBtn"></ns-empty>
				</view>
			</block>
		</mescroll-uni>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
	import uniCountDown from '@/components/uni-count-down/uni-count-down.vue';
	import globalConfig from '@/common/js/golbalConfig.js';
	export default {
		components: {
			uniCountDown
		},
		data() {
			return {
				mescroll: null,
				dataList: [],
				pintuanStatusList: [{
						id: 2,
						name: '拼团中'
					},
					{
						id: 3,
						name: '拼团成功'
					},
					{
						id: 1,
						name: '拼团失败'
					}
				],
				pintuanStatus: 2,
				pintuanState: [{},
					{
						color: '#FF4544',
						text: '拼团失败'
					},
					{
						color: '#FFA044',
						text: '拼团中'
					},
					{
						color: '#11BD64',
						text: '拼团成功'
					}
				],
				emptyBtn: {
					text: '去逛逛',
					url: '/promotionpages/pintuan/list/list'
				}
			};
		},
		mixins: [globalConfig],
		onShow() {
			if (!this.addonIsExit.pintuan) {
				this.$util.showToast({
					title: '商家未开启拼团',
					mask: true,
					duration: 2000
				});
				setTimeout(() => {
					this.$util.redirectTo('/pages/index/index/index', {}, 'redirectTo');
				}, 2000);
				return;
			}
			// 刷新多语言
			this.$langConfig.refresh();
		},
		methods: {
			//请求列表数据
			getData(mescroll) {
				this.mescroll = mescroll;
				this.$api.sendRequest({
					url: '/pintuan/api/order/page',
					data: {
						page_size: mescroll.size,
						page: mescroll.num,
						pintuan_status: this.pintuanStatus
					},
					success: res => {
						let newArr = [];
						let msg = res.message;
						if (res.code == 0 && res.data) {
							newArr = res.data.list;
						} else {
							this.$util.showToast({
								title: msg
							});
						}
						mescroll.endSuccess(newArr.length);
						//设置列表数据
						if (mescroll.num == 1) this.dataList = []; //如果是第一页需手动制空列表
						newArr.forEach(v => {
							if (v.group_end_time > res.timestamp) {
								v.timeMachine = this.$util.countDown(v.group_end_time - res.timestamp);
							} else {
								v.timeMachine = null;
							}
						});
						this.dataList = this.dataList.concat(newArr); //追加新数据
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail() {
						//联网失败的回调
						mescroll.endErr();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			//拼团商品详情
			goPinTuanDetail(id) {
				this.$util.redirectTo('/promotionpages/pintuan/detail/detail', {
					pintuan_id: id
				});
			},
			//去首页
			goIndex() {
				this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
			},
			toshare(id) {
				this.$util.redirectTo('/promotionpages/pintuan/share/share', {
					id: id
				});
			},
			toOrderDetail(id) {
				this.$util.redirectTo('/pages/order/detail/detail', {
					order_id: id
				});
			},
			//切换分类
			categoryChange(e) {
				this.pintuanStatus = e;
				this.mescroll.resetUpScroll();
			},
			imageError(index) {
				this.dataList[index].sku_image = this.$util.getDefaultImage().default_goods_img;
				this.$forceUpdate();
			},
			memberImageError(index, j) {
				this.dataList[index].member_list[j].member_img = this.$util.getDefaultImage().default_headimg;
				this.$forceUpdate();
			}
		}
	};
</script>

<style lang="scss">
	/deep/ .empty {
		margin-top: 0 !important;
	}

	.my_spell_category {
		width: 100%;
		height: 88rpx;
		display: flex;
		justify-content: space-around;
		background-color: #fff;
		position: fixed;
		top: 0;
		z-index: 999;
		box-sizing: border-box;

		.category-item {
			text-align: center;

			.item-con {
				display: inline-block;
				height: 88rpx;
				font-size: 30rpx;
				position: relative;
				line-height: 88rpx;
			}

			.item-con.active:after {
				content: '';
				display: block;
				width: 100%;
				height: 4rpx;
				border-radius: 6rpx;
				position: absolute;
				left: 0;
				bottom: 0;
			}

			&:last-of-type {
				margin-right: 0;
			}
		}
	}

	.goods-list {
		margin: 20rpx 30rpx 20rpx;
		background-color: #fff;
		border-radius: 10rpx;
		padding: 30rpx;
	}

	.list-header {
		display: flex;
		align-items: center;
		justify-content: space-between;

		.state-time {
			font-size: $font-size-base;
			color: $color-title;
		}

		.state-sign {
			font-size: $font-size-tag;
		}
	}

	.list-body {
		display: flex;
		justify-content: space-between;
		margin-top: 32rpx;

		.list-body-img {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 160rpx;
			height: 174rpx;
			margin-right: 18rpx;

			image {
				width: 160rpx;
				height: 174rpx;
				margin-right: 10rpx;
			}
		}

		.shop-content {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			width: 531rpx;

			.shop-title {
				margin-top: -8rpx;
				height: 84rpx;
				font-size: $font-size-base;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				line-height: 42rpx;
				color: $color-title;
			}

			.pintuan-num {
				color: $color-tip;
				font-size: $font-size-sub;
			}

			.pintuan-price {
				line-height: 1;
				font-size: $font-size-toolbar;

				.pintuan-price-icon {
					margin-right: 6rpx;
					font-size: $font-size-tag;
				}
			}
		}
	}

	.list-footer {
		display: flex;
		height: 80rpx;
		justify-content: space-between;
		align-items: center;
		margin-top: 22rpx;

		.time-wrap {
			display: inline-block;
			margin-left: 10rpx;
		}

		.list-footer-time {
			color: $color-tip;
		}

		text {
			border-radius: 60rpx;
			font-size: $font-size-tag;
			line-height: 50rpx;
		}

		.picture-box {
			margin-top: 20rpx;
			width: 60%;
			height: 100%;
			display: flex;
			align-items: center;
		}

		.img-box {
			image {
				border: 2rpx solid #fff;
				margin-right: -24rpx;
				width: 50rpx;
				height: 50rpx;
				border-radius: 50%;
			}
		}

		.order-btn {
			background-color: #fff !important;
			color: $color-title;
			border: 2rpx solid $color-tip;
		}
	}

	.empty {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: $padding;
		box-sizing: border-box;
		margin-top: 150rpx;

		.iconfont {
			font-size: 190rpx;
			color: $color-tip;
			line-height: 1.2;
		}

		button {
			margin-top: 20rpx;
			font-size: $font-size-base;
		}
	}
</style>
<style scoped>
	>>>.uni-countdown__number,
	>>>.uni-countdown__splitor {
		margin: 0;
		padding: 0;
	}
</style>
