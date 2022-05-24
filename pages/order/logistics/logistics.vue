<template>
	<view :data-theme="themeStyle">
		<navbar></navbar>
		<view class="main">
		<scroll-view class="order-nav" :scroll-x="true" :show-scrollbar="false">
			
			<view v-for="(packageItem, packageIndex) in packageList" :key="packageIndex" class="uni-tab-item" @click="ontabtap(packageIndex)">
				<text class="uni-tab-item-title" :class="packageIndex == currIndex ? 'uni-tab-item-title-active color-base-border  color-base-text' : ''">
					{{ $lang(`common.${packageItem.package_name}`) }}
				</text>
			</view>
		</scroll-view>
		<view v-for="(packageItem, packageIndex) in packageList" :key="packageIndex" class="swiper-item" v-show="packageIndex == currIndex">
			<view class="container">
				<view class="goods-wrap" v-if=" packageItem.goods_list">
					<view class="body">
						<view class="goods" v-for="(goodsItem, goodsIndex) in packageItem.goods_list" :key="goodsIndex">
							<view class="goods-img" @click="toGoodsDetail(goodsItem.sku_id)">
								<image :src="$util.img(goodsItem.sku_image, { size: 'mid' })" @error="imageError(packageIndex, goodsIndex)" mode="aspectFill"></image>
							</view>
							<view class="goods-info">
								<view @click="toGoodsDetail(goodsItem.sku_id)" class="goods-name">{{ goodsItem.sku_name }}</view>
								<view class="goods-sub-section">
									<view>
										<text>
											<text class="iconfont iconclose"></text>
											{{ goodsItem.num }}
										</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>

				<view class="express-company-wrap" v-if="packageItem.express_company_name">
					<!-- <view class="company-logo"><image :src="$util.img(packageItem.express_company_image)"></image></view> -->
					<view class="info" >
						<view class="company">
							<text >{{$lang('common.deliveryCompany')}}： {{ companyInfo[packageItem.express_company_name].realName }}</text>
						</view>
						<view class="goods" v-for="(deliveryNumItem, deliveryNoIndex) in deliveryNoArr" :key="deliveryNoIndex">
							<view v-if="companyInfo[packageItem.express_company_name].redirectUrl">
								<text>
									{{$lang('common.deliveryNumber')}}：
									<text class="color-tip">{{ deliveryNumItem}}</text>
								</text>
								<!-- <text class="copy" @click="$util.copy(deliveryNumItem)">{{$lang('common.copy')}}</text> -->
								<text class="copy" @click="findDeliveryDetail( deliveryNumItem)">{{$lang('common.search')}}</text>
							</view>
						</view>
						<view class="no" v-if="!companyInfo[packageItem.express_company_name].redirectUrl">
							<view class="goods" v-for="(deliveryNumItem, deliveryNoIndex) in deliveryNoArr" :key="deliveryNoIndex+'copy'">
									<text>
										{{$lang('common.deliveryNumber')}}：
										<text class="color-tip">{{ deliveryNumItem}}</text>
									</text>
									<text class="copy" @click="$util.copy(deliveryNumItem)">{{$lang('common.copy')}}</text>
							</view>
							<view >
								<text>
									{{$lang('common.deliveryCompanyUrl')}}：
									<text class="color-tip">{{  companyInfo[packageItem.express_company_name].url }}</text>
									 <!-- <web-view :webview-styles="webviewStyles" :src="packageItem.express_company_url">{{ packageItem.express_company_url }}</web-view> -->
								</text>
								<text class="copy" @click="visitSite( companyInfo[packageItem.express_company_name].url)">{{$lang('common.visit')}}</text>
							</view>
						</view>
					</view>
				</view>

				<view class="track-wrap">
					<!-- <block v-if="packageItem.trace.success && packageItem.trace.list.length != 0">
						<view
							class="track-item"
							v-for="(traceItem, traceIndex) in packageItem.trace.list"
							:data-theme="themeStyle"
							:class="traceIndex == 0 ? 'active' : ''"
							:key="traceIndex"
						>
							<view class="dot" :class="traceIndex == 0 ? 'color-base-bg' : ''"></view>
							<view class="msg">
								<view class="text" :class="traceIndex == 0 ? 'color-base-text' : ''">{{ traceItem.remark }}</view>
								<view class="time" :class="traceIndex == 0 ? 'color-base-text' : ''">{{ traceItem.datetime }}</view>
							</view>
						</view>
					</block> -->
					<!-- <block v-else-if="packageItem.trace.success && packageItem.trace.list.length == 0">
						<view class="fail-wrap font-size-base">{{ packageItem.trace.reason }}</view>
					</block> -->
					<!-- <block v-else>
						<!-- <view class="fail-wrap font-size-base">{{ packageItem.trace.reason }}</view> -->
					<!-- </block> -->
				</view>
			</view>
			</view>
		</view>
		<loading-cover ref="loadingCover"></loading-cover>
	</view>
</template>

<script>
import globalConfig from '@/common/js/golbalConfig.js';
let self;
export default {
	data() {
		return {
			orderId: '',
			packageList: [],
			isIphoneX: false,
			currIndex: 0,
			status: 0,
			deliveryNoArr:[],
			companyInfo:{
				shundaexpress:{url:"www.postalinkex.com", realName:"POSTALINK" ,redirectUrl:'https://www.postalinkex.com/SelectOrder.aspx?OrderNum='},
				shundaexpress_nmn:{url:"www.shundaexpress.com", realName: "顺达" , redirectUrl:'http://www.shundaexpress.com/select/?num='},
				ups:{url:'www.ups.com/track?loc=en_US&requester=ST/', realName:"UPS",redirectUrl:''},
				ezgo:{url:"www.ezgoex.com", realName:"ezgo",redirectUrl:'https://www.ezgoex.com/TrackingInfo?TrackginNO='},
				fafa:{url:"www.88shipping.com", realName:"全民发发",redirectUrl:'http://www.88shipping.com/track?num='},
				baitong:{url:"www.buytong.cn/newindex/waybillquery", realName: '百通',redirectUrl:''},
				fedex:{url:"www.fedex.com/en-us/home.html", realName: 'FedEx',redirectUrl:'https://www.fedex.com/fedextrack/no-results-found?trknbr='},
				zhongtong:{url:"www.zto.com", realName: '中通快递',redirectUrl:''},
				bangde:{url:"www.deppon.com", realName: '邦德快递',redirectUrl:''},
				shunfeng:{url:"www.sf-international.com", realName: '顺风快递',redirectUrl:''},
				sanqianli:{url:"www.highsince.com", realName: '三千里快递',redirectUrl:'http://www.highsince.com/track?track_number='},
				mingtong:{url:"www.tnjex.com", realName: 'mingtong',redirectUrl:'http://www.tnjex.com/index/courier&sn='},
				kuaidi101:{url:"www.kuaidi-101.com", realName: '快递101',redirectUrl:'https://kuaidi-101.com/SelectOrder.aspx?OrderNum='}
			}
		};
	},
	mixins: [globalConfig],
	onLoad(option) {
		if (option.order_id) this.orderId = option.order_id;
	},
	onShow() {
		self = this;
		// 刷新多语言
		this.$langConfig.refresh();
		// 判断登录
		if (!uni.getStorageSync('token')) {
			this.$util.redirectTo('/pages/login/login/login');
		} else {
			this.getPackageInfo();
		}
		this.isIphoneX = this.$util.uniappIsIPhoneX();
	},
	methods: {
		findCompanyUrl(deliveryNo) {
			let companyName = self.packageList[0].express_company_name;
			let url = this.companyInfo[companyName].redirectUrl;
			url += deliveryNo;
			// if (companyName=='fafa') {
			// 	url=this.companyInfo[companyName].redirectUrl;
			// }
			return url;
		},
 		findDeliveryDetail(deliveryNo) {
			let url = this.findCompanyUrl(deliveryNo);
			window.location.href = url;
		},
		visitSite(goUrl) {
			goUrl = 'https://'+goUrl;
			window.location.href = goUrl;
		},
		ontabtap(e) {
			this.currIndex = e;
			// let index = e.target.dataset.current || e.currentTarget.dataset.current;
			// this.orderStatus = this.statusList[index].status;
			// if (this.orderStatus == '') this.mergePayOrder = [];
			// this.$refs.loadingCover.show();
			// this.$refs.mescroll.refresh();
		},
		getDeliveryNoArr() {
			let arr = self.packageList[0].delivery_no.split(', ');
			this.deliveryNoArr = arr;
		},
		getPackageInfo() {
			this.$api.sendRequest({
				url: '/api/order/package',
				data: {
					order_id: this.orderId
				},
				success: res => {
					if (res.code >= 0) {
						self.packageList = res.data;
						this.getDeliveryNoArr();
						self.packageList.forEach(item => {
							// if (item.trace.list) {
							// 	item.trace.list = item.trace.list.reverse();
							// }
							item.status = this.status++;
						});
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					} else {
						this.$util.showToast({
							title: '未获取到订单信息！'
						});
						setTimeout(() => {
							this.$util.redirectTo('/pages/order/list/list');
						}, 1500);
					}
				},
				fail: res => {
					if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
				}
			});
		},
		toGoodsDetail(e) {
			this.$util.redirectTo('/pages/goods/detail/detail', { sku_id: e });
		},
		imageError(packageIndex, goodsIndex) {
			this.packageList[packageIndex].goods_list[goodsIndex].sku_image = this.$util.getDefaultImage().default_goods_img;
			this.$forceUpdate();
		}
	}
};
</script>

<style lang="scss">
@import '../public/css/logistics.scss';

.order-nav {
	margin-left:4%;
}

@media screen and (min-width: 1200px) and (max-width: 1400px){
					.order-nav {
						margin-left:8%;
					}
				}
@media screen and (min-width: 1400px){
					.order-nav {
						margin-left:12%;
					}
				}
.main {
	margin:0 auto;
	max-width: 1200px;
}
.copy {
		font-size: $font-size-tag;
		display: inline-block;
		color: #666;
		background: #f7f7f7;
		line-height: 1;
		padding: 6rpx 14rpx;
		margin-left: 10rpx;
		border-radius: 18rpx;
		border: 0.5px solid #666;
		}
/deep/.uni-scroll-view ::-webkit-scrollbar {
	/* 隐藏滚动条，但依旧具备可以滚动的功能 */
	display: none;
	width: 0;
	height: 0;
	color: transparent;
	background: transparent;
}
/deep/::-webkit-scrollbar {
	display: none;
	width: 0;
	height: 0;
	color: transparent;
	background: transparent;
}
</style>