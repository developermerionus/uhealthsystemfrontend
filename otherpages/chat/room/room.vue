<template>
	<view class="container" id="container" :data-theme="themeStyle">
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" :down="{ auto: false }" :up="{ use: false }">
			<view class="room" @click="closePopWindow">
				<view class="room-content-box">
					<view :id="'chat' + index" v-for="(item, index) in messageList" :key="index">
						<chat-message :message="item" :shopInfo="shopInfo" :userInfo="userInfo" @sendGood="sendGood($event, index)"
						 @sendOrder="sendOrder($event, index)" :send="send"></chat-message>
					</view>
				</view>
				<view class="paddingbottom" id="paddingbottom" v-if="chatBottom"></view>
			</view>
			<view class="input-content">
				<view class="input-box">
					<view class="iconfont iconbiaoqing1 padding-right " @click="openEmjoy()"></view>
					<input type="text" class="message" placeholder="点此提问客服" id="input" v-model="formData.content" :confirm-type="'send'"
					 placeholder-style="color:#DDDDDD;" cursor-spacing="10" selection-end="-1" selection-start="-1" @confirm="sendMsg('message')"
					 @focus="inputFocus" @blur="closePopWindow()" confirm-type="send" @keyboardHeightChange="onKeyboardHeightChange" />

					<view class="iconfont iconjiahao01 padding-right" @click="openChatMore()"></view>
					<view class=" send_btn color-base-bg" @click="sendMsg('message')">发送</view>
				</view>
				<view class="inputShow" v-if="inputShow && inputFirst"></view>
				<view v-if="emjoyShow" @touchmove.prevent.stop>
					<view class="emjoy-box">
						<scroll-view scroll-y="true" class="emjoy-content">
							<view class="emjoy-item" v-for="(item, index) in emjoyList" :key="index" @click="addEmjoy(item, index)">
								<image :src="$util.img(item)"></image>
							</view>
						</scroll-view>
					</view>
				</view>

				<view class="more_send" v-if="chatMore">
					<view class="more_send-item" @click="addImg()">
						<i class="iconfont icontupian "></i>
						<view>图片</view>
					</view>
				</view>
			</view>
		</mescroll-body>
	</view>
</template>

<script>
	import SocketTask from '@/common/js/socketTest.js';
	import chatMessage from '@/components/chat-message/chat-message.vue';
	import emjoy from '@/common/js/emjoy.js';
	import globalConfig from '@/common/js/golbalConfig.js';
	export default {
		components: {
			chatMessage
		},
		data() {
			return {
				emjoyList: emjoy.emjoyList,
				emjoyShow: false,
				chatMore: false,
				formData: {
					content: '',
					goods_id: 0,
					order_id: 0,
					image: ''
				},
				isNetWork: false,
				send: false,

				messageList: [],
				page: 1,
				isAll: false,
				isLoading: 0,
				showLoading: false, //显示正在加载

				jumpBottom: null,
				scrollTop: 0,
				scrollPosition: 0,

				siteId: 0, //店铺id
				skuId: 0, //商品id
				orderId: 0, //订单id
				siteName: '', //店铺名称
				shopInfo: {},
				userInfo: {},
				style: {}, //聊天框的高度
				focus: true,
				inputFirst: 0,
				inputShow: false,
				inputOffsetBottom: 0,
				mescroll: null
			};
		},
		mixins: [SocketTask, globalConfig],
		computed: {
			chatBottom() {
				return this.emjoyShow || this.chatMore;
			}
		},
		onLoad(info) {
			if (!this.addonIsExit.live) {
				this.$util.showToast({
					title: '商家未开启小程序直播',
					mask: true,
					duration: 2000
				});
				setTimeout(() => {
					this.$util.redirectTo('/pages/index/index/index', {}, 'redirectTo');
				}, 2000);
				return;
			}
			if (uni.getStorageSync('token')) {
				this.getUserInfo();
			} else {
				this.$util.redirectTo('/pages/login/login/login');
				return;
			}

			this.getShopInfo();

			this.skuId = info.skuId ? info.skuId : 0;
			this.orderId = info.orderId ? info.orderId : 0;

			if (this.skuId || this.orderId) {
				this.send = true;
			}
		},
		onShow() {
			this.inputFirst = 0;
			this.inputShow = false;
			this.inputOffsetBottom = 0;
		},
		onReady() {
			// 监听键盘高度变化，以便设置输入框的高度
			uni.onKeyboardHeightChange(res => {
				this.inputOffsetBottom = res.height;
				if (res.height === 0) {
					this.focus = false;
				}
			});
		},
		methods: {
			mescrollInit(mescroll) {
				this.mescroll = mescroll;
				this.checkOpenSocket();
			},
			//下拉刷新
			downCallback() {
				this.getChatList();
			},
			onPullDownRefresh() {
				this.getChatList();
				setTimeout(function() {
					uni.stopPullDownRefresh();
				}, 1000);
			},
			//判断安卓还是iOS
			isAndroid() {
				let platform = uni.getSystemInfoSync().platform;
				if (platform == 'ios') {
					return false;
				} else if (platform == 'android') {
					return true;
				}
			},
			openChatMore() {
				if (this.isAndroid) {
					this.inputShow = false;
					this.inputFirst = 1;
				}

				this.chatMore = !this.chatMore;
				this.emjoyShow = false;

				this.$nextTick(() => {
					this.setPageScrollTo();
				});
			},
			//获取店铺详情
			getShopInfo() {
					this.$api.sendRequest({
						url: '/api/site/info',
						success: res => {
							if (res.code == 0) {
								this.shopInfo = res.data;
								this.siteName = '平台客服';
								//修改标题
								this.$langConfig.title(this.siteName);
							}
						}
					});
			},
			//获取个人信息
			getUserInfo() {
				this.$api.sendRequest({
					url: '/api/member/info',
					success: res => {
						if (res.code == 0) {
							this.userInfo = res.data;
						}
					}
				});
			},
			//获取聊天记录
			getChatList() {
				let that = this;
				if (this.isAll) {
					that.mescroll.endSuccess();
					return;
				}
				if (this.isLoading) return;
				this.isLoading = true;
				if (this.page == 1) this.messageList = [];
				this.$api.sendRequest({
					url: '/servicer/api/chat/dialogs',
					data: {
						servicer_id: this.servicer_id,
						page: this.page,
						limit: 5
					},
					success(res) {
						that.page += 1;
						if (res.code >= 0 && res.data) {
							if (res.data.list && res.data.list.length < 5) that.isAll = true;
							let startId = 0;
							if (this.messageList) {
								startId = this.messageList.slice(-1).id + 1;
							}

							let newArr = [];
							if (that.page == 2) {
								//如果请求的是第一页，并且有订单id或商品id;添加发送信息
								if (that.skuId) {
									let obj = {
										id: startId,
										isItMe: true,
										contentType: 'sendGood',
										sku_id: that.skuId
									};
									newArr.push(obj);
									startId += 1;
								}
								if (that.orderId) {
									let obj = {
										id: startId,
										isItMe: true,
										contentType: 'sendOrder',
										order_id: that.orderId
									};
									newArr.push(obj);
									startId += 1;
								}
							}

							//如果获取到历史聊天信息  转换为需要的格式  添加到数组内
							let arr = res.data.list;
							if (arr.length) {
								for (let i = 0; i < arr.length; i++) {
									let obj = {};
									if (arr[i].content_type == 0) {
										obj.id = startId;
										obj.content = arr[i].type == 0 ? arr[i].consumer_say : arr[i].servicer_say;
										obj.isItMe = arr[i].type == 0 ? true : false;
										obj.contentType = 'string';
										obj.sendStatus = true;
									} else if (arr[i].content_type == 1) {
										obj.id = startId;
										obj.isItMe = arr[i].type == 0 ? true : false;
										obj.contentType = 'goods';
										obj.sku_id = arr[i].goods_sku_id;
										obj.send = false;
										obj.sendStatus = true;
									} else if (arr[i].content_type == 2) {
										obj.id = startId;
										obj.isItMe = arr[i].type == 0 ? true : false;
										obj.contentType = 'order';
										obj.order_id = arr[i].order_id;
										obj.send = false;
										obj.sendStatus = true;
									} else if (arr[i].content_type == 3) {
										obj.id = startId;
										obj.isItMe = arr[i].type == 0 ? true : false;
										obj.contentType = 'image';
										obj.id = startId;
										obj.image = arr[i].type == 0 ? arr[i].consumer_say : arr[i].servicer_say;
										obj.sendStatus = true;
									}
									newArr.push(obj);
									startId += 1;
								}
							}

							//如果请求的是第一页  将在线信息作为消息添加到数组内
							if (that.page == 2) {
								let obj = {};
								obj.id = startId;
								if (that.servicer_id > 0) {
									obj.contentType = 'online';
								} else if (that.servicer_id == 0) {
									obj.contentType = 'noline';
								}
								newArr.push(obj);
								startId += 1;
							}
							that.isLoading = false;
							if (newArr.length) {
								that.messageList = newArr.concat(that.messageList);
								that.$nextTick(() => {
									if (that.page == 2) {
										that.setPageScrollTo();
									} else {
										let id = '#chat' + newArr.length;
										that.setPageScrollTo(id);
									}
								});
							}
						} else {
							this.isLoading = false;
							this.$util.showToast({
								title: res.message
							});
						}
						that.mescroll.endSuccess();
					},
					fail: () => {
						- // 请求失败,隐藏加载状态
						(-this.mescroll.endErr());
					}
				});
			},
			// 设置页面滚动位置
			setPageScrollTo(id) {
				if (id) {
					let view = uni
						.createSelectorQuery()
						.in(this)
						.select(id);
					view.boundingClientRect(res => {
						return false;
						uni.pageScrollTo({
							scrollTop: res.top - 30, // -30 为多显示出大半个消息的高度，示意上面还有信息。
							duration: 1000
						});
					}).exec();
				} else {
					let query = uni.createSelectorQuery().in(this);
					query
						.select('.room-content-box')
						.boundingClientRect(data => {
							uni.pageScrollTo({
								scrollTop: data.height - 30, // -30 为多显示出大半个消息的高度，示意上面还有信息。
								duration: 0
							});
						})
						.exec();
				}
			},
			//发送商品
			sendGood(e, index) {
				this.sendMsg('goods');
				this.messageList.splice(index, 1, 1);
			},
			//发送订单
			sendOrder(e, index) {
				this.sendMsg('order');
				this.messageList.splice(index, 1, 1);
			},
			//发送消息
			sendMsg(data) {
				if (this.isNetWork) return;
				this.isNetWork = true;
				let that = this;
				if (data == 'goods') {
					this.$api.sendRequest({
						url: '/servicer/api/chat/say',
						data: {
							goods_id: this.skuId,
							servicer_id: this.servicer_id,
							content_type: 1
						},
						success(res) {
							that.send = false;
							that.joinData('send', 'goods');
						},
						complete() {
							that.isNetWork = false;
							uni.hideKeyboard();
						}
					});
				} else if (data == 'order') {
					this.$api.sendRequest({
						url: '/servicer/api/chat/say',
						data: {
							order_id: this.orderId,
							servicer_id: this.servicer_id,
							content_type: 2
						},
						success(res) {
							that.send = false;
							that.joinData('send', 'order');
						},
						complete() {
							that.isNetWork = false;
							uni.hideKeyboard();
						}
					});
				} else if (data == 'image') {
					that.joinData('send', 'image');
					this.$api.sendRequest({
						url: '/servicer/api/chat/say',
						data: {
							message: this.formData.image.trim(),
							servicer_id: this.servicer_id,
							content_type: 3
						},
						success(res) {
							// that.joinData('send', 'string');
							that.formData.content = '';
						},
						error() {
							that.messageList[that.messageList.length - 1].sendStatus = false;
							that.formData.content = '';
						},
						complete() {
							that.isNetWork = false;
							uni.hideKeyboard();
						}
					});
				} else {
					// this.closePopWindow()

					if (!this.formData.content.trim()) {
						that.$util.showToast({
							title: '发送内容不能为空'
						});
						that.isNetWork = false;
						return;
					}
					that.joinData('send', 'string');
					that.$api.sendRequest({
						url: '/servicer/api/chat/say',
						data: {
							message: that.formData.content.trim(),
							servicer_id: that.servicer_id,
							content_type: 0
						},
						success(res) {
							// that.joinData('send', 'string');
							that.formData.content = '';
						},
						error() {
							that.messageList[that.messageList.length - 1].sendStatus = false;
							that.formData.content = '';
						},
						complete() {
							that.isNetWork = false;
							uni.hideKeyboard();
						}
					});
				}
			},
			//拼接消息 处理滚动
			async joinData(addType, contentType) {
				if (addType == 'send') {
					let data = {
						isItMe: true,
						contentType: contentType,
						sendStatus: true
					};
					if (contentType == 'string') {
						data.content = this.formData.content;
					} else if (contentType == 'order') {
						data.order_id = this.orderId;
					} else if (contentType == 'goods') {
						data.sku_id = this.skuId;
					} else if (contentType == 'image') {
						data.image = this.formData.image;
					}
					this.messageList.push(data);
					// this.formData.content = '';
					this.$nextTick(() => {
						this.setPageScrollTo();
					});
				}
			},
			// 隐藏加载提示
			hideLoadTips(flag) {
				if (flag) {
					this.ajax.loadText = '消息获取成功';
					setTimeout(() => {
						this.ajax.loading = false;
					}, 300);
				} else {
					this.ajax.loading = true;
					this.ajax.loadText = '正在获取消息';
				}
			},
			onPageScroll(e) {
				if (e.scrollTop < 5 && e.scrollTop >= 0) {
					this.getChatList();
				}
			},
			inputFocus(e) {
				if (this.isAndroid() && this.inputFirst) {
					this.inputShow = true;
				}

				this.emjoyShow = false;
				this.chatMore = false;
				this.$nextTick(() => {
					this.setPageScrollTo();
				});
			},
			closePopWindow() {
				this.inputFirst = 0;
				this.emjoyShow = false;
				this.chatMore = false;
				this.inputShow = false;
				uni.hideKeyboard();
			},
			openEmjoy() {
				if (this.isAndroid()) {
					this.inputFirst = 1;
					this.inputShow = false;
				}

				uni.hideKeyboard();
				this.chatMore = false;
				this.emjoyShow = !this.emjoyShow;
				this.$nextTick(() => {
					this.setPageScrollTo();
				});
			},
			addEmjoy(emjoy, index) {
				this.formData.content = this.formData.content + index;
			},
			addImg() {
				this.$util.upload(
					1, {
						path: 'chatimg'
					},
					res => {
						this.formData.image = res[0];
						// this.chatMore = false;
						this.sendMsg('image');
					},
					'/servicer/api/chat/chatimg'
				);
			}
		},
		beforeDestroy() {
			clearInterval(this.timeoutObj);
			this.timeoutObj = null;
			this.$api.sendRequest({
				url: '/servicer/api/chat/bye',
				data: {
					servicer_id: this.servicer_id
				},
				success(res) {
					uni.closeSocket();
				}
			});
		}
	};
</script>

<style lang="scss">
	//处理H5端弹出覆盖输入框的问题
	.more_send {
		display: flex;
		border-top: 2rpx solid #e5e5e5;
		height: 390rpx;
		flex-wrap: wrap;

		>view {
			padding-top: 16rpx;
			width: 25%;
			height: 156rpx;
			text-align: center;

			.iconfont {
				display: inline;
				font-size: 60rpx;
				color: #333;
				background-color: #fff;
				border-radius: 20rpx;
				padding: 20rpx;
			}

			>view {
				color: #909399;
				font-size: $font-size-goods-tag;
			}
		}
	}

	.chat_send {
		display: flex;
		height: 45px;
		justify-content: space-between;
		position: relative;

		.send {
			position: absolute;
			right: 30rpx;
			bottom: 30rpx;
			color: #fff;
			align-self: flex-end;
			font-size: 28rpx;
			padding: 10rpx 20rpx;
			border-radius: 8rpx;
		}

		.emjoy_list {
			flex: 1;
		}
	}

	/* 加载数据提示 */
	.tips {
		position: fixed;
		left: 0;
		top: var(--window-top);
		width: 100%;
		z-index: 9;
		background-color: rgba(0, 0, 0, 0);
		height: 72rpx;
		line-height: 72rpx;
		transform: translateY(-80rpx);
		transition: transform 0.3s ease-in-out 0s;
		font-size: 24rpx;
		text-align: center;
		line-height: 72rpx;

		&.show {
			transform: translateY(0);
		}
	}

	.room {
		width: 100%;
		/* #ifdef H5 */
		min-height: calc(100vh - 24px);
		padding-bottom: calc(110rpx + 44px);
		padding-bottom: calc(110rpx + 44px + constant(safe-area-inset-bottom));
		padding-bottom: calc(110rpx + 44px + env(safe-area-inset-bottom));
		/* #endif */

		/* #ifndef H5 */
		min-height: calc(100vh + 10px);
		padding-bottom: 110rpx;
		padding-bottom: calc(110rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(110rpx + env(safe-area-inset-bottom));
		/* #endif */

		box-sizing: border-box;

		.room-content-box {
			width: 100%;
			min-height: calc(100% + 10px);
			padding-top: $padding;
			box-sizing: border-box;
		}
	}

	.paddingbottom {
		height: calc(470rpx + 44px);
	}

	.emjoy-box {
		width: 100%;
		height: 300rpx;
		padding: 20rpx 25rpx;
		box-sizing: border-box;
		background: #f4f4f4;
		border-top: 1rpx solid #e5e5e5;

		.emjoy-content {
			width: 100%;
			height: 100%;

			.emjoy-item {
				display: inline-block;
				width: 100rpx;
				height: 70rpx;
				text-align: center;
				line-height: 70rpx;

				image {
					display: inline-block;
					width: 40rpx;
					height: 40rpx;
				}
			}
		}
	}

	.input-content {
		background: #f4f4f4;
		width: 100%;
		min-height: 110rpx;
		position: fixed;
		left: 0;
		bottom: 0;
		padding-bottom: 0px;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);

		.input-box {
			width: 100%;
			height: 100rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 $padding;
			box-sizing: border-box;

			.iconfont {
				line-height: 1;
				font-size: 52rpx;
				padding: 15rpx;
			}
			.send_btn {
				font-size: 24rpx;
				min-width: 60rpx;
				text-align: center;
				background-color: #e8e8e8;
				color: #fff;
				border-radius: 8rpx;
				height: 32rpx;
				line-height: 32rpx;
				padding: 16rpx;
			}

			input {
				margin-left: 20rpx;
				margin-right: 20rpx;
				width: 630rpx;
				height: 100%;
				height: 72rpx;
				padding: 0 20rpx;
				font-size: $font-size-tag;
				background-color: #fff;
				border-radius: 8rpx;
			}
		}
	}
</style>
