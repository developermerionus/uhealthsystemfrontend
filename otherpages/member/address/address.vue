<template>
	<view :data-theme="themeStyle" class="container">
		<view class="outer-container-wrap">
			<mescroll-uni ref="mescroll" @getData="getListData">
				<block slot="list">
					<navbar></navbar>
					<view class="address-list">	
						<template v-if="addressList.length !== 0">
							<view class="address-item" v-for="(item, index) in addressList" :key="index">
								<view class="address-item-top" @click="setDefault(item.id)">
									<view class="address-top-info">
										<view class="address-name">{{ item.name }}</view>
										<view class="address-tel">{{ item.mobile }}</view>
									</view>
									<view class="address-info" v-if='item.country_id==172'>
										{{ item.full_address }}{{ item.address }}</view>
									<view class="address-info" v-else>{{ item.address }} {{ item.full_address }}</view>
								</view>
								<view class="address-item-bottom">
									<view class="address-default" @click="setDefault(item.id)">
										<view class="iconfont"
											:class="item.is_default == 1 ? 'iconyuan_checked color-base-text' : 'iconyuan_checkbox'">
										</view>
										<text class="default" :class="{ 'color-base-text': item.is_default == 1 }"
											>{{ $lang('defaultAddress')}}</text>
									</view>
									<view class="address-btn">
										<text class="edit" @click="addAddress('edit', item.id)">
											<text class="iconfont iconbianji"></text>
											{{ $lang('modify') }}
										</text>
										<text class="delete" v-if="item.is_default != 1"
											@click="deleteAddress(item.id, item.is_default)">
											<text class="iconfont iconicon7"></text>
											{{ $lang('del') }}
										</text>
									</view>
								</view>
							</view>
							<view class="btn-add">
								<!-- #ifdef MP-WEIXIN -->
								<view class="wx-add" @click="getChooseAddress()" v-if="local != 1">
									<text class="">{{ $lang('getAddress') }}</text>
								</view>
								<!-- #endif -->
								<!-- #ifdef H5 -->
								<button type="primary" class="add-address" @click="getChooseAddress()"
									v-if="$util.isWeiXin() && local != 1">{{ $lang('getAddress') }}</button>
								<!-- #endif -->
								<button type="primary" class="add-address" @click="addAddress('add')">
									<text class="iconfont iconadd1"></text>
									{{ $lang('newAddAddress') }}
								</button>
							</view>
						</template>
						<view v-if="addressList.length == 0 && showEmpty" class="empty-box cart-empty">
							<ns-empty text="暂无可用地址" :isIndex="isIndex" :fixed="!1"></ns-empty>
						</view>
						<view class="button-wrap" v-if="addressList.length == 0 && showEmpty">
							<!-- #ifdef H5 -->
							<button type="primary" class="add-address" @click="getChooseAddress()"
								v-if="$util.isWeiXin() && local != 1">{{ $lang('getAddress') }}</button>
							<!-- #endif -->
							<!-- #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO -->
							<view class="wx-add" @click="getChooseAddress()" v-if="local != 1">
								<text class="">{{ $lang('getAddress') }}</text>
							</view>
							<!-- <button type="primary" class="add-wx color-base-text" @click="getChooseAddress()">{{ $lang('getAddress') }}</button> -->
							<!-- #endif -->

							<button type="primary" class="add-address" @click="addAddress('add')">
								<text class="iconfont iconadd1"></text>
								{{ $lang('newAddAddress') }}
							</button>
						</view>
					</view>
				</block>
			</mescroll-uni>
			<loading-cover ref="loadingCover"></loading-cover>
		</view>
	</view>
</template>

<script>
	import globalConfig from '@/common/js/golbalConfig.js';
	import {
		Weixin
	} from 'common/js/wx-jssdk.js';

	export default {
		data() {
			return {
				addressList: [],
				back: '', // 返回页
				redirect: 'redirectTo', // 跳转方式
				isIndex: false,
				showEmpty: false,
				local: 0, //定位是否显示
				localType: 1
			};
		},
		mixins: [globalConfig],
		onLoad(option) {
			if (option.back) {
				this.back = option.back;
				uni.setStorageSync('addressBack', option.back);
			}
			if (option.redirect) this.redirect = option.redirect;
			if (option.local) this.local = option.local;
			if (option.type) this.localType = option.type;

			if (uni.getStorageSync('addressBack')) {
				this.back = uni.getStorageSync('addressBack');
			}
		},
		onShow() {
			// 刷新多语言
			this.$langConfig.refresh();
			if (this.$refs.mescroll) this.$refs.mescroll.refresh();
			uni.removeStorageSync('addressInfo');
		},
		methods: {
			getListData(mescroll) {
				this.showEmpty = false;
				this.$api.sendRequest({
					url: '/api/memberaddress/page',
					data: {
						page: mescroll.num,
						page_size: mescroll.size,
						type: this.localType
					},
					success: res => {
						
						this.showEmpty = true;
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
						if (mescroll.num == 1) this.addressList = []; //如果是第一页需手动制空列表
						this.addressList = this.addressList.concat(newArr); //追加新数据
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					},
					fail: res => {
						mescroll.endErr();
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},

			/* 地址跳转 */
			addAddress(type, id) {
				let data = {
					type: this.localType,
					addressLength: this.addressList.length,
				};
				if (type == 'edit') data.id = id;
				if (this.back) data.back = this.back;

				this.$util.redirectTo('/otherpages/member/address_edit/address_edit', data);
			},
			/* 删除地址信息 */
			deleteAddress(id, is_default) {
				uni.showModal({
					title: '操作提示',
					content: '确定要删除该地址吗？',
					success: res => {
						if (res.confirm) {
							if (is_default == 1) {
								this.$util.showToast({
									title: '默认地址，不能删除'
								});
								return;
							}
							this.$api.sendRequest({
								url: '/api/memberaddress/delete',
								data: {
									id: id
								},
								success: res => {
									if (res.code == 0) {
										this.$util.showToast({
											title: '删除成功'
										});
									} else {
										this.$util.showToast({
											title: '删除失败'
										});
									}
									this.$refs.mescroll.refresh();
								},
								fail: res => {
									mescroll.endErr();
								}
							});
						}
					}
				});
			},
			setDefault(id) {
				this.$api.sendRequest({
					url: '/api/memberaddress/setdefault',
					data: {
						id
					},
					success: res => {
						if (res.data > 0) {
							this.$refs.mescroll.refresh();
							if (this.back != '') {
								let jump = true;
								let arr = getCurrentPages().reverse();
								for (let i = 0; i < arr.length; i++) {
									if (this.back.indexOf(arr[i].route) != -1) {
										jump = false;
										uni.navigateBack({
											delta: i
										});
										break;
									}
								}
								if (jump) {
									this.$util.redirectTo(this.back, {}, 'redirectTo');
								}
							} else {
								this.$refs.mescroll.refresh();
								this.$util.showToast({
									title: '修改默认地址成功'
								});
							}
						} else {
							this.$util.showToast({
								title: res.message
							});
						}
					}
				});
			},
			/**
			 * 一键获取地址
			 */
			getChooseAddress() {
				// #ifdef H5
				if (this.$util.isWeiXin()) {
					if (uni.getSystemInfoSync().platform == 'ios') {
						var url = uni.getStorageSync('initUrl');
					} else {
						var url = location.href;
					}
					// 获取jssdk配置
					this.$api.sendRequest({
						url: '/wechat/api/wechat/jssdkconfig',
						data: {
							url: url
						},
						success: jssdkRes => {
							if (jssdkRes.code == 0) {
								var wxJS = new Weixin();
								wxJS.init(jssdkRes.data);
								wxJS.openAddress(res => {
									if (res.errMsg == 'openAddress:ok') {
										this.saveAddress({
											name: res.userName, // 收货人姓名,
											mobile: res.telNumber, // 手机号
											province: res.provinceName, // 省
											city: res.cityName, // 市
											district: res.countryName, // 县
											address: res.detailInfo, // 街道
											full_address: res.provinceName + '-' + res
												.cityName + '-' + res.countryName
										});
									} else {
										this.$util.showToast({
											title: res.errMsg
										});
									}
								});
							} else {
								this.$util.showToast({
									title: jssdkRes.message
								});
							}
						}
					});
				}
				// #endif

				// #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO
				uni.chooseAddress({
					success: res => {
						if (res.errMsg == 'chooseAddress:ok') {
							this.saveAddress({
								name: res.userName, // 收货人姓名,
								mobile: res.telNumber, // 手机号
								province: res.provinceName, // 省
								city: res.cityName, // 市
								district: res.countyName, // 县
								address: res.detailInfo, // 街道地址
								full_address: res.provinceName + '-' + res.cityName + '-' + res
									.countyName
							});
						} else {
							this.$util.showToast({
								title: res.errMsg
							});
						}
					}
				});
				// #endif
			},
			/**
			 * 保存微信地址
			 * @param {Object} params
			 */
			saveAddress(params) {
				this.$api.sendRequest({
					url: '/api/memberaddress/addthreeparties',
					data: params,
					success: res => {
						if (res.code >= 0) {
							this.$refs.mescroll.refresh();
						} else {
							this.$util.showToast({
								title: res.message
							});
						}
					}
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	/deep/ .fixed {
		position: relative;
		top: 0;
	}

	.cart-empty {
		padding-top: 104px !important;
	}


	.outer-container-wrap {
		// -webkit-box-sizing: border-box;
		// -moz-box-sizing: border-box;
		// box-sizing: border-box;
		max-width: 1200px;
		margin: 0 auto;
	}

	.address-list {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		min-height: 70vh;
		justify-content: center;
		margin-top: 10px;

		.local {
			display: flex;
			align-items: center;
			margin: $margin-updown $margin-both;
			background-color: #fff;
			padding: 30rpx;
			border-radius: $border-radius;

			text {
				margin-right: 10rpx;
			}
		}

		.address-item {
			margin: $padding 30rpx 0;
			display: flex;
			flex-direction: column;
			background-color: #ffffff;
			padding: 30rpx;
			box-sizing: border-box;
			border-radius: 20rpx;

			.address-item-top {
				display: flex;
				flex-direction: column;
				border-bottom: 1rpx solid $color-line;

				.address-top-info {
					display: flex;
					justify-content: flex-start;

					.address-name {
						color: #000000;
						font-size: $font-size-toolbar;
					}

					.address-tel {
						color: #000000;
						font-size: $font-size-toolbar;
						margin-left: 26rpx;
					}
				}

				.address-info {
					font-size: $font-size-base;
					color: $color-tip;
					margin-top: 10rpx;
					margin-bottom: 28rpx;
				}
			}

			.address-item-bottom {
				display: flex;
				justify-content: space-between;
				padding-top: 30rpx;

				.address-default {
					display: flex;
					align-items: center;
					font-size: $font-size-base;
					line-height: 1;

					.default {
						padding-left: 10rpx;
					}

					.iconfont {
						line-height: 1;
					}
				}

				.address-btn {
					font-size: $font-size-base;
					line-height: 1;
					display: flex;
					align-items: center;

					.edit {
						text {
							vertical-align: center;
							margin-right: 10rpx;
							font-size: 30rpx;
						}
					}

					.delete {
						padding-left: 40rpx;

						text {
							margin-right: 10rpx;
							font-size: 26rpx;
						}
					}
				}
			}
		}

		.btn-add {
			margin-top: 60rpx;
			bottom: 0px;
			margin-left: 30rpx;
			margin-right: 30rpx;
			width: calc(100% - 60rpx);

			.add-address {
				height: 80rpx;
				line-height: 80rpx;
				border-radius: 80rpx;
				margin: 30rpx 0 30rpx;

				border-radius: 10rpx;
				// width: 100%;
				// margin: 5rpx 5rpx;
				background: linear-gradient(to right, #10869c 0%, #118ca3 12%, #139fb9 34%, #14a5c0 47%, #139fb9 67%, #118ca3 89%, #10869c 100%);

				text {
					margin-right: 10rpx;
					font-size: $font-size-base;
				}
			}
		}

		.wx-add {
			margin-top: 30rpx;
			margin-bottom: 30rpx;
			text-align: center;
			height: 80rpx;
			line-height: 80rpx;
			border: 1px solid #cccccc;
			border-radius: 80rpx;
		}
	}

	.button-wrap {
		height: 250rpx;
		margin: auto;
		margin-top: 30rpx;
		width: calc(100% - 60rpx);

		z-index: 9;
		text-align: center;
		overflow: hidden;

		.add-address {
			height: 80rpx;
			line-height: 80rpx;
			border-radius: 80rpx;
			margin: 30rpx 0 30rpx;

			text {
				margin-right: 10rpx;
				font-size: $font-size-base;
			}
		}

		.add-wx {
			background-color: none;
			margin-top: 30rpx;
			margin-bottom: 30rpx;
			width: 100%;
			text-align: center;
			height: 92rpx;
			line-height: 92rpx;
			border: 1px solid #cccccc;
			border-radius: 92rpx;
		}
	}

	@media screen and (min-width: 750px) {
		.address-list {
			max-width: 750px;
			margin: 0 auto;
			margin-top:10px;
		}

	}
	
</style>
