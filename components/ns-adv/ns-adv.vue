<template>
	<view>
		<!-- 	<view class="bg"></view> -->
		<swiper :indicator-dots="advList.length > 1" indicator-active-color="#ffffff" :autoplay="true" :interval="3000" :duration="1000" v-if="advList.length" class="ns-adv">
			<swiper-item v-for="(item, index) in advList" :key="index" @click="jumppage(item.adv_url)">
				<view class="image-box"><image :src="$util.img(item.adv_image)"></image></view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
export default {
	name: 'ns-advert',
	props: {
		keyword: {
			type: String
		}
	},
	data() {
		return {
			advList: []
		};
	},
	created() {
		this.getAdvList();
	},
	methods: {
		//获取广告位
		getAdvList() {
			var item = {
				adv_image: '',
				adv_url: ''
			};
			switch (this.keyword) {
				case 'NS_GROUPBUY':
					item.adv_image = 'upload/default/diy_view/index_groupbuy_gg.png';
					break;
				case 'NS_PINTUAN':
					item.adv_image = 'upload/default/diy_view/index_pintuan_gg.png';
					break;
				case 'NS_SECKILL':
					item.adv_image = 'upload/default/diy_view/index_seckill_gg.png';
					break;
				case 'NS_TOPIC':
					item.adv_image = 'upload/default/diy_view/index_topic_gg.png';
					break;
				case 'NS_BARGAIN':
					item.adv_image = 'upload/default/diy_view/index_bargain_gg.png';
					break;
			}
			let arr = [];
			arr.push(item);
			this.advList = this.advList.concat(arr);
		},
		jumppage(e) {
			this.$util.diyRedirectTo(e);
		}
	}
};
</script>

<style>
.bg {
	width: 100%;
	height: 158rpx;
	background-color: #fff;
	position: fixed;
	left: 0;
	/* #ifdef H5 */
	top: 88rpx;
	/* #endif */
	/* #ifdef MP-WEIXIN */
	top: 0;
	/* #endif */
}
.ns-adv {
	background: #fff;
	height: 300rpx;
	border-radius: 10rpx;
	padding: 8rpx 24rpx 24rpx;
}

.ns-adv .image-box {
	width: 100%;
	height: 100%;
	border-radius: 10rpx;
}

.ns-adv image {
	width: 100%;
	height: 100%;
	border-radius: 10rpx;
}
</style>
