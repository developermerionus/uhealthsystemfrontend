<template>
	<view class="store-wrap" v-if="value.style" :style="{ background: value.backgroundColor }">

		<block v-if="value.style == 1">
			<view class="store-box store-one">
				<view class="store-info">
					<view class="info-box" :style="{ color: value.textColor ? value.textColor : 'rgba(0,0,0,0)' }" @click="toStoreList()">
						<text class="title" v-if="store.store_id">{{ store.store_name }}</text>
						<text class="title" v-else>请选择门店</text>
						<text>
							<text class="change margin-left">切换</text>
							<text class="iconfont iconright"></text>
						</text>
					</view>
					<view class="address-box" :style="{ color: value.textColor ? value.textColor : 'rgba(0,0,0,0)' }">
						<!-- <text class="address" :style="{color:textColor}"> -->
						<view class="address" :style="{ color: value.textColor ? value.textColor : 'rgba(0,0,0,0)' }">
							<text class="iconfont icondizhi"></text>
							<text v-if="store.store_id" @click="mapRoute">{{ store.full_address }}{{ store.address }}</text>
							<text v-else>无法获取您当前的位置</text>
						</view>
					</view>
				</view>
				<view class="store-image" @click="selectStore()">
					<image :src="$util.img(store.store_image)" v-if="store.store_image && store.store_id" mode="aspectFit"></image>
					<image :src="$util.getDefaultImage().default_storeimg" v-else mode="aspectFit"></image>
				</view>
			</view>
		</block>

		<block v-if="value.style == 2">

			<view class="store-box store-three" @click="toStoreList()">

				<view class="store-info">
					<view class="store-image" @click="selectStore()">
						<image :src="$util.img(store.store_image)" v-if="store.store_image && store.store_id" mode="aspectFit"></image>
						<image :src="$util.getDefaultImage().default_storeimg" v-else mode="aspectFit"></image>
					</view>
				
					<view class="info-box" :style="{ color: value.textColor ? value.textColor : 'rgba(0,0,0,0)' }">
						<text class="title" v-if="store.store_id">{{ store.store_name }}</text>
						<text class="title" v-else>请选择门店</text>
						<text>
							<text class="change margin-left">切换</text>
							<text class="iconfont iconright"></text>
						</text>
					</view>
				</view>

				<view class="store-icon" @click.stop="search()"><text class="iconfont iconsousuo" :style="{ color: value.textColor }"></text></view>

			</view>

		</block>

		<block v-if="value.style == 3">

			<!-- <view class="store-box store-three" :style="{background:bgColor,color:textColor}" @click="toStoreList()"> -->

			<view class="store-box store-four">
<!--	
			<view class="store-box store-four" @click="toStoreList()">
				<view class="store-left-wrap">
					<text class="iconfont iconweizhi" :style="{ color: value.textColor ? value.textColor : 'rgba(0,0,0,0)' }"></text>
					<text class="title" v-if="store.store_id" :style="{ color: value.textColor ? value.textColor : 'rgba(0,0,0,0)' }">{{ store.store_name }}</text>
					<text class="title" v-else :style="{ color: value.textColor ? value.textColor : 'rgba(0,0,0,0)' }">请选择门店</text>
					<text class="iconfont iconunfold" :style="{ color: value.textColor ? value.textColor : 'rgba(0,0,0,0)' }"></text>
				</view>
-->
				<!-- <view class="store-right-search">
					<input type="text" class="uni-input font-size-tag" disabled :placeholder="$lang('common.search')" @click.stop="search()" />
					<text class="iconfont iconsousuo2" @click.stop="search()"></text>
				</view> -->
			</view>

		</block>
	</view>
</template>

<script>
// 门店列表
import Map from '@/common/js/map/openMap.js';
export default {
	name: 'ns-store',
	props: {
		storeId: {
			type: [String, Number],
			default() {
				return 0;
			}
		},
		textColor: {
			type: [String]
		},
		bgColor: {
			type: [String]
		},
		value: {
			type: Object
		}
	},
	data() {
		return {
			type: 'country',
			store: {
				store_name: ''
			},
			showStore: 1,
			size: 2,
			num: 1,
			isNetwork: 1, //是否可以继续请求
			storeList: [],
			latitude: null, // 纬度
			longitude: null // 经度
		};
	},
	watch: {
		storeId() {
			if (uni.getStorageSync('store')) {
				this.store = uni.getStorageSync('store');
			} else {
				this.getStoreList();
			}
		}
	},
	created() {
		uni.getLocation({
			type: 'gcj02',
			success: res => {
				uni.setStorage({
					key: 'location',
					data: {
						latitude: res.latitude,
						longitude: res.longitude
					}
				});
				this.latitude = uni.getStorageSync('location').latitude ? uni.getStorageSync('location').latitude : res.latitude;
				this.longitude = uni.getStorageSync('location').longitude ? uni.getStorageSync('location').longitude : res.longitude;
				this.getStoreList();
				// if(this.storeId){
				// 	this.getInfo()
				// }
			},
			fail: res => {
				this.getStoreList();
				// if(this.storeId){
				// 	this.getInfo()
				// }
			}
		});
	},
	methods: {
		//跳转至门店列表
		toStoreList() {
			this.$util.redirectTo('/otherpages/index/storelist/storelist', {});
		},
		//获取门店详情
		// getInfo(e) {
		// 	let storeid=e?e:this.storeId;
		// 	let data={
		// 		store_id: storeid,
		// 	};
		// 	if(this.latitude && this.longitude){
		// 		data.latitude=this.latitude;
		// 		data.longitude=this.longitude;
		// 	}
		// 	this.$api.sendRequest({
		// 		url: '/api/store/info',
		// 		data: data,
		// 		success: res => {
		// 			if (res.data) {
		// 				this.store = res.data;
		// 				uni.setStorageSync('store', this.store);
		// 			}
		// 		}
		// 	});
		// },
		selectStore() {
			if (this.store.store_id) {
				this.$util.redirectTo('/otherpages/index/storedetail/storedetail', {
					store_id: this.store.store_id,
					back: '/pages/index/index/index'
				});				
			}
		},
		search() {
			this.$util.redirectTo('/otherpages/goods/search/search');
		},
		//获取门店列表
		getStoreList() {
			let data = {
				page: 1,
				page_size: 2
			};
			if (this.latitude && this.longitude) {
				data.latitude = this.latitude;
				data.longitude = this.longitude;
			}
			this.$api.sendRequest({
				url: '/api/store/page',
				data: data,
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
					this.storeList = newArr;
					for (let i = 0; i < this.storeList.length; i++) {
						if (this.storeList[i].store_id == res.data.store_id) {
							this.store = this.storeList[i];
							uni.setStorageSync('store', this.storeList[i]);
							this.$forceUpdate();
						}
					}
				}
			});
		},
		mapRoute() {
			if (!isNaN(Number(this.store.latitude)) && !isNaN(Number(this.store.longitude))) {
				Map.openMap(Number(this.store.latitude), Number(this.store.longitude), this.store.store_name, 'wgs84');
			}
		},
	}
};
</script>

<style lang="scss">
.store-wrap {
	padding: 20rpx 0;
	box-sizing: border-box;

	.store-box {
		// padding: 20rpx 24rpx;
		box-sizing: border-box;
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.noStoreBox {
		width: 100%;
		height: 100%;
		line-height: 120rpx;
		color: #ffffff;
	}
	.store-info {
		width: 458rpx;
		height: 100rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-around;

		.info-box {
			// color: #ffffff;
			display: flex;
			align-items: flex-end;
			margin-bottom: 6rpx;

			text {
				line-height: 1.2;
			}

			.title {
				max-width: 60%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				font-size: $font-size-toolbar;
				margin-right: 40rpx;
			}

			.change {
				font-size: $font-size-goods-tag;
			}

			.iconfont {
				font-size: $font-size-goods-tag;
			}
		}
		.address-box {
			width: 100%;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			color: #ffffff;
		}
		.address {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			// display: flex;
			width: 100%;
			// align-items: center;
			// color: #ffffff;
			line-height: 1.2;
			font-size: $font-size-goods-tag;

			.iconfont {
				font-size: $font-size-goods-tag;
				margin-right: 6rpx;
			}

			.store-address-info {
				width: calc(100% - 30rpx);
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}
	}

	.store-image {
		width: 72rpx;
		height: 72rpx;
		border-radius: 50%;

		image {
			width: 100%;
			height: 100%;
			border-radius: 50%;
		}
	}
}

.store-one, .store-three {
	padding: 0 20rpx;
}

.store-two {
	.store-image {
		align-self: flex-start;
		margin-right: 14rpx;
	}
	.info-box {
		margin-bottom: 0 !important;
	}
	.store-info {
		height: 106rpx;
	}
	.switchover {
		display: flex;
		width: 60px;
	}
}
.store-three {

	.store-info {
		height: auto;
		justify-content: end;
		flex-direction: inherit;
		align-items: center;
	}
	.info-box {
		margin-left: 18rpx;
		margin-bottom: 0 !important;
	}
	.store-icon text {
		font-size: 36rpx;
		color: #fff;
	}
}

.store-four {
	padding: 0 !important;

	.store-left-wrap {
		display: flex;
		.iconweizhi {
			margin-right: 6rpx;
			font-size: 28rpx;
		}

		.iconunfold {
			margin-left: 6rpx;
		}
		
		.title {
			display: inline-block;
			max-width: 160rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}

	.store-right-search {
		width: calc(100% - 260rpx);
		position: relative;

		input {
			width: 100%;
			height: 72rpx;
			line-height: 72rpx;
			background-color: #ffffff;
			border: none;
			border-radius: 72rpx;
			padding-left: 30rpx;
			box-sizing: border-box;
		}

		.iconsousuo2 {
			position: absolute;
			right: 30rpx;
			top: 10rpx;
			font-size: 28rpx;
			color: #909399;
		}
	}
}
</style>
