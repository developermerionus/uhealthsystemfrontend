<template>
	<view :data-theme="themeStyle">
		<mescroll-uni @getData="getData" class="member-point">
			<view slot="list">
				<block v-if="dataList.length">
					<view
						class="index_bg color-base-bg"
						:style="
							'background-image:url(' +
								$util.img('upload/uniapp/index/mendian.png') +
								');background-repeat: no-repeat;background-size: 100% 100%;background-position: center'
						"
					>
						<!-- #ifdef H5 -->
						<view class="head-nav"></view>
						<!-- #endif -->
					
						<view class="store-info" v-if="storeId && dataList" @click.stop="selectStore(store.store_id)">
							<view class="info-box">
								<view class="info-content">
									<view class="info-title">{{ store.store_name }}</view>
									<view class="info-time" v-if="store.open_date">营业时间：{{ store.open_date }}</view>
									<view class="info-address">{{ store.full_address + store.address }}</view>
								</view>
							</view>
							<image :src="$util.img(store.store_image)" v-if="store.store_image"></image>
							<image :src="$util.getDefaultImage().default_storeimg" v-else></image>
						</view>

						<!-- 门店列表 -->
						<view class="store-list">
							<view class="list-content-box">
								<view class="list-title">附近门店</view>
								<view class="list-content">
									<block v-for="(item, index) in dataList" :key="index">
										<view class="list-item">
											<view class="item-box">
												<view class="item-image" @click="selectStore(item.store_id)">
													<image :src="$util.img(item.store_image)" v-if="item.store_image"></image>
													<image :src="$util.getDefaultImage().default_storeimg" v-else></image>
												</view>
												<view class="item-info" @click="storeTap(item)">
													<view class="item-title">
														<text class="title">{{ item.store_name }}</text>
														<text class="distance color-base-text" v-if="item.distance">
															距离{{ item.distance > 1 ? item.distance + 'km' : item.distance * 1000 + 'm' }}
														</text>
													</view>
													<view class="item-time" v-if="item.open_date">营业时间：{{ item.open_date }}</view>
													<view class="item-address">{{ item.full_address + item.address }}</view>
												</view>
												<view class="item-right"><text class="iconfont iconright"></text></view>
											</view>
										</view>
										<view class="line" v-if="index != dataList.length - 1"></view>
									</block>
								</view>
							</view>
						</view>
					</view>
				</block>
				<block v-else>
					<ns-empty text="您的附近暂无可选门店" :isIndex="false"></ns-empty>
				</block>
			</view>
		</mescroll-uni>
		<loading-cover ref="loadingCover"></loading-cover>
		<ns-show-toast></ns-show-toast>
	</view>
</template>

<script>
import globalConfig from '@/common/js/golbalConfig.js';
export default {
	components: {},
	data() {
		return {
			searchText: '',
			dataList: [],
			isNetwork: 1, //是否可以继续请求
			isAll: false,
			latitude: null, // 纬度
			longitude: null, // 经度
			store: {},
			storeId: 0,
			isIphoneX: false
		};
	},
	onLoad() {
		this.isIphoneX = this.$util.uniappIsIPhoneX();
		this.store = uni.getStorageSync('store') ? uni.getStorageSync('store') : {};
		if (this.store) this.storeId = this.store.store_id;
		if (uni.getStorageSync('location')) {
			this.latitude = uni.getStorageSync('location').latitude;
			this.longitude = uni.getStorageSync('location').longitude;
		}
	},
	mixins: [globalConfig],
	methods: {
		navigateBack() {
			this.$util.redirectTo('/pages/index/index/index', {}, 'redirectTo');
		},
		search() {},
		getData(mescroll) {
			if (!this.isNetwork) {
				mescroll.endSuccess(0);
				return;
			}
			if (this.isAll) {
				mescroll.endSuccess(0);
				return;
			}
			this.isNetwork = 0;
			let data = {
				page: mescroll.num,
				page_size: mescroll.size
			};
			if (this.latitude && this.longitude) {
				data.latitude = this.latitude;
				data.longitude = this.longitude;
			}
			this.$api.sendRequest({
				url: '/api/store/page',
				data: data,
				success: res => {
					this.isNetwork = 1;
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					let newArr = [];
					let msg = res.message;
					if (res.code == 0 && res.data) {
						newArr = res.data.list;
					} else {
						this.$util.showToast({ title: msg });
					}
					mescroll.endSuccess(newArr.length);
					//设置列表数据
					if (mescroll.num == 1) this.dataList = []; //如果是第一页需手动制空列表
					this.dataList = this.dataList.concat(newArr); //追加新数据
					if (this.dataList.length == res.data.count) {
						this.isAll = true;
					}
				},
				fail: res => {
					mescroll.endErr();
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		//获取门店详情
		getInfo() {
			let data = {
				store_id: this.storeId
			};
			if (this.latitude && this.longitude) {
				data.latitude = this.latitude;
				data.longitude = this.longitude;
			}
			this.$api.sendRequest({
				url: '/api/store/info',
				data: data,
				success: res => {
					if (res.data) {
						this.store = res.data;
						uni.setStorageSync('store', this.store);
					}
				}
			});
		},
		storeTap(item) {
			uni.setStorageSync('store', item);
			this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
		},
		selectStore(e) {
			let id = e ? e : this.storeId;
			this.$util.redirectTo('/otherpages/index/storedetail/storedetail', { store_id: id, back: '/otherpages/index/storelist/storelist' });
		}
	}
};
</script>

<style lang="scss">
.index_bg {
	width: 100%;
	height: 422rpx;
	background-size: 100% 100%;
}

.head-nav {
	width: 100%;
	height: 100rpx;
}

.head-nav.active {
	padding-top: 40rpx;
}

.head-return {
	padding-left: 30rpx;
	padding-right: 30rpx;
	height: 90rpx;
	line-height: 90rpx;
	color: #fff;
	font-weight: 600;
	font-size: $font-size-toolbar;
	display: flex;
	justify-content: space-between;

	text {
		display: inline-block;
		margin-right: 10rpx;
	}
}

//----------------------------------门店信息----------------------------------------
.store-info {
	width: 100%;
	padding: 76rpx 24rpx 0;
	box-sizing: border-box;
	position: relative;

	.info-box {
		width: 702rpx;
		height: 350rpx;
		background: #fff;
		border-radius: 20rpx;
		padding: 16rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		align-items: center;

		.info-content {
			width: 660rpx;
			height: 312rpx;
			background: #fff;
			text-align: center;
			border: 1px dashed rgba(229, 229, 229, 1);
			border-radius: 20rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			box-sizing: border-box;
			
			.info-title {
				max-width: 50%;
				font-size: $font-size-toolbar;
				color: $color-title;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				font-weight: 500;
				margin-bottom: 36rpx;
				line-height: 1;
			}

			.info-time {
				line-height: 1;
				font-size: $font-size-tag;
				color: $color-tip;
				margin-bottom: 36rpx;
			}

			.info-address {
				max-width: 80%;
				line-height: 42rpx;
				font-size: $font-size-tag;
				color: $color-title;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
			}
		}
	}

	image {
		width: 104rpx;
		height: 104rpx;
		position: absolute;
		border-radius: 50%;
		left: calc(50% - 54rpx);
		top: 24rpx;
	}
	.nowstore-title {
		width: 100%;
		font-size: $font-size-tag;
		color: #ffffff;
		line-height: 1;
		position: absolute;
		border-radius: 50%;
		left: calc(50% - 48rpx);
		top: -90rpx;
	}
}

//-----------------------------门店列表---------------------------------
.store-list {
	width: 100%;
	padding: 0 30rpx;
	box-sizing: border-box;
	margin-top: 20rpx;
	padding-bottom: 100rpx;
	.line {
		width: 654rpx;
		margin: 0 auto;
		height: 1px;
		background: $color-line;
	}
	.list-content-box {
		width: 100%;
		height: 100%;
		box-sizing: border-box;

		.list-title {
			width: 100%;
			font-size: 30rpx;
			color: $color-title;
			font-weight: 500;
			line-height: 1;
			margin: 52rpx 0 24rpx;
		}

		.list-content {
			width: 100%;
			background: #ffffff;
			border-radius: 10px;
			box-sizing: border-box;
			overflow: hidden;

			.list-item {
				width: 100%;
				padding: 35rpx 24rpx;
				box-sizing: border-box;

				.item-box {
					width: 100%;
					height: 100%;
					display: flex;
					background: #ffffff;
					align-items: center;

					.item-image {
						width: 88rpx;
						height: 88rpx;
						border-radius: 50%;
						align-self: start;

						image {
							width: 88rpx;
							height: 88rpx;
							border-radius: 50%;
						}
					}

					.item-info {
						width: 520rpx;
						height: 100%;
						padding-left: 20rpx;
						box-sizing: border-box;
						display: flex;
						flex-direction: column;
						margin-right: 24rpx;
						font-size: $font-size-tag;

						.item-title {
							display: flex;
							justify-content: space-between;
							align-items: center;
							margin-bottom: 10rpx;

							.title {
								max-width: 240rpx;
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
								font-size: $font-size-base;
								color: $color-title;
							}

							.distance {
								font-size: $font-size-activity-tag;
							}
						}

						.item-time {
							font-size: $font-size-activity-tag;
							color: $color-tip;
							margin-bottom: 10rpx;
						}

						.item-address {
							font-size: $font-size-tag;
							color: $color-title;
							line-height: 42rpx;

							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
							overflow: hidden;
						}
					}

					.item-right {
						flex-grow: 1;
						height: 100%;
						display: flex;
						justify-content: center;
						align-items: center;

						.iconfont {
							color: #ACACAC;
						}
					}
				}
			}
		}
	}
}
</style>
