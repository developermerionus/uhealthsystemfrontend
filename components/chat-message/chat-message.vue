<template>
	<view class="chat-message" :data-theme="themeStyle">
		<block v-if="message.contentType == 'sendGood'"><ns-chat-goods :isCanSend="send" :skuId="message.sku_id" @sendMsg="sendGood"></ns-chat-goods></block>
		<block v-if="message.contentType == 'sendOrder'"><ns-chat-order :isCanSend="send" :orderId="message.order_id" @sendMsg="sendOrder"></ns-chat-order></block>
		<view class="message" v-if="message.contentType == 'string'">
			<view class="message-item " :class="message.isItMe ? 'right' : 'left'">
				<block v-if="message.isItMe">
					<view class="head_img">
						<image class="img" :src="myHeadImg" v-if="myHeadImg" mode="aspectFill" @error="myHeadImg = defaultHead"></image>
						<image class="img" :src="defaultHead" mode="aspectFill" v-else></image>
					</view>
				</block>
				<block v-else>
					<view class="head_img">
						<image class="img" :src="avatar" mode="aspectFill" v-if="avatar" @error="avatar = defaultAvatar"></image>
						<image class="img" :src="defaultAvatar" mode="aspectFill" v-else></image>
					</view>
				</block>
				<view class="chat_text">
					<text class="iconfont iconwarn margin-right" v-if="message.isItMe && !message.sendStatus"></text>
					<view class="content"><rich-text :nodes="stringToEmjoy(message.content)"></rich-text></view>
					<!-- <text class="iconfont iconwarn margin-left" v-if="!message.isItMe  && !message.sendStatus"></text> -->
				</view>
			</view>
		</view>
		<view class="message" v-if="message.contentType == 'image'">
			<view class="message-item " :class="message.isItMe ? 'right' : 'left'">
				<block v-if="message.isItMe">
					<view class="head_img">
						<image class="img" :src="myHeadImg" v-if="myHeadImg" mode="aspectFill" @error="myHeadImg = defaultHead"></image>
						<image class="img" :src="defaultHead" mode="aspectFill" v-else></image>
					</view>
				</block>
				<block v-else>
					<view class="head_img">
						<image class="img" :src="avatar" mode="aspectFill" v-if="avatar" @error="avatar = defaultAvatar"></image>
						<image class="img" :src="defaultAvatar" mode="aspectFill" v-else></image>
					</view>
				</block>
				<view class="chat_img">
					<text class="iconfont iconwarn margin-right color-base-text" v-if="message.isItMe && !message.sendStatus"></text>
					<view
						class="content_img"
						@click="previewMedia($util.img(message.image))"
						:style="{ backgroundImage: 'url(' + $util.img(message.image) + ')', backgroundPosition: message.isItMe ? 'center right' : 'center left' }"
					>
						<!-- <image class="img_img" :src="$util.img(message.image)" mode="aspectFit"></image> -->
					</view>
					<!-- <text class="iconfont iconwarn margin-left" v-if="!message.isItMe  && !message.sendStatus"></text> -->
				</view>
			</view>
		</view>
		<view v-else-if="message.contentType == 'goods'"><ns-chat-goods :isCanSend="!1" :skuId="message.sku_id"></ns-chat-goods></view>
		<view v-else-if="message.contentType == 'order'"><ns-chat-order :isCanSend="!1" :orderId="message.order_id"></ns-chat-order></view>

		<view class="no-connect-box" v-if="message.contentType == 'noline'"><view class="no-connect">客服不在线</view></view>
		<view class="no-connect-box" v-if="message.contentType == 'online'"><view class="no-connect">客服在线</view></view>
		<uni-popup ref="imgPopup" type="center">
			<view class="imagePop"><image :src="$util.img(currImg)" mode="aspectFit"></image></view>
		</uni-popup>
	</view>
</template>

<script>
import globalConfig from '@/common/js/golbalConfig.js';
import nsChatGoods from '@/components/ns-chat/ns-chat-goods.vue';
import nsChatOrder from '@/components/ns-chat/ns-chat-order.vue';
import htmlParser from '@/common/js/html-parser';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import emjoy from '@/common/js/emjoy.js';

export default {
	name: 'diy-pintuan',
	props: {
		message: {
			type: Object
		},
		shopInfo: {
			type: Object
		},
		userInfo: {
			type: Object
		},
		send: {
			type: Boolean
		}
	},
	data() {
		return {
			avatar: '', //店铺头像
			defaultAvatar: this.$util.img('upload/uniapp/kefu.png'),
			myHeadImg: '', //我的头像
			defaultHead: this.$util.getDefaultImage().default_headimg,
			emjoyList: emjoy.emjoyList,
			currImg: ''
		};
	},
	components: {
		nsChatGoods,
		nsChatOrder,
		uniPopup
	},
	mixins: [globalConfig],
	mounted() {
		this.avatar = this.$util.img(this.shopInfo.logo);
		this.myHeadImg = this.$util.img(this.userInfo.headimg);
	},
	methods: {
		// 预览图片
		previewMedia(img_url) {
			var paths = [img_url];
			uni.previewImage({
				current: 0,
				urls: paths
			});
		},
		sendGood() {
			this.$emit('sendGood', 'goods');
		},
		sendOrder() {
			this.$emit('sendOrder', 'order');
		},
		stringToEmjoy(value) {
			if (!value) return;
			let string = value; // 需要把[握手]和[微笑]匹配出来
			let reg = new RegExp('\\[emjoy_(.+?)\\]', 'g');
			let emjoyString = string.replace(reg, v => {
				let emjoy = '';
				for (let index in this.emjoyList) {
					if (v == index) {
						emjoy = "<img class='message-img' src='" + this.emjoyList[index] + "'/>";
						break;
					}
				}
				if (emjoy) {
					return emjoy;
				} else {
					return v;
				}
			});

			let content = htmlParser(emjoyString);
			content.forEach(v => {
				if (v.name == 'img') {
					v.attrs.style = 'display: inline-block;width: 18px !important;height: 18px !important;padding:0 1px;';
				}
			});
			return content;
		}
	}
};
</script>

<style lang="scss">
/deep/.uni-popup__wrapper.uni-custom .uni-popup__wrapper-box {
	background-color: #000;
}
/deep/.uni-popup__wrapper.uni-custom.center .uni-popup__wrapper-box {
	max-width: 100%;
	width: 100%;
}
.imagePop {
	height: 50vh;
	width: 100vw;
	text-align: center;
	image {
		width: 100%;
		height: 100%;
	}
}
.chat-message {
	width: 100%;
	height: 100%;
	.message {
		padding: 13rpx 30rpx;
		position: relative;
	}
	.left .content {
		padding: 20rpx;
		max-width: 450rpx;
		border-radius: 10rpx;
		font-size: 30rpx;
	}
	.right .content {
		padding: 20rpx;
		max-width: 450rpx;
		border-radius: 10rpx;
		font-size: 30rpx;
	}
	.content_img {
		height: 200rpx;
		width: 100%;
		overflow: hidden;
		text-align: right;
		margin-left: 28rpx;
		background-repeat: no-repeat;
		background-size: contain;
		image {
			min-height: 80rpx;
			min-width: 80rpx;
			height: 100%;
			width: 100%;
		}
	}
	.right .content_img {
		margin-right: 28rpx;
		margin-left: 0;
	}
	.message-item {
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
		align-content: flex-start;
		flex-wrap: nowrap;
		flex-direction: row;
		.head_img {
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
			overflow: hidden;
			position: relative;
			.img {
				width: 100%;
				height: 100%;
			}
		}

		//图片
		.contentType3 {
			padding: 0;
			border-radius: 2rpx;
			background-color: transparent !important;
			.img {
				width: 200rpx;
				height: auto;
				max-width: 300rpx;
				max-height: 400rpx;
			}
		}
		.contentType3::after {
			border: none !important;
			display: none !important;
		}
		.content-type-right {
			flex-direction: row-reverse;
		}

		&.right {
			flex-direction: row-reverse;

			.content {
				background-color: #4cd964;
				margin-right: 28rpx;
				word-break: break-all;
				line-height: 36rpx;
				position: relative;
			}
		}

		&.left {
			.content {
				background-color: #ffffff;
				margin-left: 28rpx;
				word-break: break-all;
				line-height: 36rpx;
				position: relative;
			}
		}
	}
	.next {
		width: 100%;
		height: 20rpx;
	}
}
.no-connect-box {
	width: 100%;
	text-align: center;
	margin: 20rpx 0 50rpx;
	.no-connect {
		display: inline-block;
		padding: 0 20rpx;
		height: 40rpx;
		background: red;
		margin: 0 auto;
		background: rgba(0, 0, 0, 0.5);
		border-radius: 9rpx;
		text-align: center;
		line-height: 40rpx;
		font-size: 22rpx;
		color: #ffffff;
	}
}
.chat_text,
.chat_img {
	display: flex;
	align-items: center;
	.iconfont {
		font-size: 36rpx;
	}
}
.chat_img {
	width: 30%;
	height: 200rpx;
}
</style>
