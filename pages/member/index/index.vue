<template>
	<view :data-theme="themeStyle">
		<view class="container">
			<navbar></navbar>

			<view class="member-container">
				<!-- <view class="user-section ns-gradient-pages-member-index-index" :data-theme="defaultInfo.topStyle == 'default' ? themeStyle : ''" :style="defaultBgColor"> -->
				<view class="user-section">
					<view>
						<!-- <view class="user-section" > -->
						<!-- <view class="bg-img"><image :src="defaultBgImg" mode="widthFix"></image></view> -->
						<view class="user-section-box">
							<view class="user-info-box" v-if="token">
								<view @click="$util.redirectTo('/pages/member/info/info')" class="user-head">
									<image
											:src="memberImg ? $util.img(memberImg) : $util.getDefaultImage().default_headimg"
											mode="aspectFill"
											@error="memberInfo.headimg = $util.getDefaultImage().default_headimg"></image>
								</view>
	
								<view class="user-box">

									<view class="user-title">Hi, {{ memberInfo.firstname }}!</view>
										<view v-if="!screenGreaterSixHundredPx" class="combineMemeberId">
										<view style='height:50rpx;line-height: 50rpx;'
											class="user-member iconfont iconhuiyuan">
											<text>{{ $lang( memberInfo.member_level_name  )}}</text>
										</view>
										<view class="user-title-id">ID: {{ memberInfo.member_id }}</view>
									</view>
									<!--if the width is >600px show these two -->
									<view v-if="screenGreaterSixHundredPx" style='height:50rpx;line-height: 50rpx;' class="user-member iconfont iconhuiyuan">
											<text>{{ $lang( memberInfo.member_level_name  )}}</text>
									</view>
									<view v-if="screenGreaterSixHundredPx" class="user-title-id" >ID:{{ memberInfo.member_id }}
									</view>
							<view class="user-label2">{{ $lang( memberInfo.branch ) }}</view>
								</view>
							</view>

						</view>
						<view @click="logout" class="user-set" v-if="token">
							<view class="iconfont iconfenxiang1"></view>
						</view>

					</view>
					<view class="wallet-button-container" v-if="token && memberGroup=='0'">
						<button class="wallet-button" type="default"
						@click="redirectToLink(bonusPageObject.link, bonusPageObject.index)">
							<image class="wallet-icon" src="../../../static/images/icons/wallet.png"></image>
							{{ $lang('electronicwallet') }}
						</button>
					</view>
					<view class="wallet-button-container" v-if="token && memberGroup=='1'">
						<button class="wallet-button" type="default"
						@click="$util.redirectTo('/pages/bonusDetail/bonusDetail')">
							<image class="wallet-icon" src="../../../static/images/icons/wallet.png"></image>
							{{ $lang('bonus_history') }}
						</button>
					</view>
				</view>
				
				<view class="member-body" v-if="token">
					<!-- 订单模块 -->
					<view class="order-section">
						<view class="order-head" @click="redirectToLink('/pages/order/list/list')">
							<text class="order-tit">{{ $lang('allOrders') }}</text>
							<text class="order-tip">{{ $lang('seeAllOrders') }}</text>
							<text class="order-more iconfont iconright"></text>
						</view>
						<view class="order-body">
							<view class="order-item" @click="redirectToLink('/pages/order/list/list?status=waitpay')">
								<view class="order-icon">
									<text v-if="orderNum.waitPay > 99" class="order-num color-base-bg">99+</text>
									<text v-else-if="orderNum.waitPay > 0"
										class="order-num color-base-bg">{{ orderNum.waitPay }}</text>
									<image :src="$util.img('upload/uniapp/member/index/order/default_order_1.png')"
										mode="aspectFit"></image>
								</view>
								<text class="order-name">{{ $lang('waitPay') }}</text>
							</view>
							<view class="order-item" @click="redirectToLink('/pages/order/list/list?status=waitsend')">
								<view class="order-icon">
									<text v-if="orderNum.readyDelivery > 99" class="order-num color-base-bg">99+</text>
									<text v-else-if="orderNum.readyDelivery > 0"
										class="order-num color-base-bg">{{ orderNum.readyDelivery }}</text>
									<image :src="$util.img('upload/uniapp/member/index/order/default_order_2.png')"
										mode="aspectFit"></image>
								</view>
								<text class="order-name">{{ $lang('readyDelivery') }}</text>
							</view>
							<view class="order-item"
								@click="redirectToLink('/pages/order/list/list?status=waitconfirm')">
								<view class="order-icon">
									<text v-if="orderNum.waitDelivery > 99" class="order-num color-base-bg">99+</text>
									<text v-else-if="orderNum.waitDelivery > 0"
										class="order-num color-base-bg">{{ orderNum.waitDelivery }}</text>
									<image :src="$util.img('upload/uniapp/member/index/order/default_order_3.png')"
										mode="aspectFit"></image>
								</view>
								<text class="order-name">{{ $lang('waitDelivery') }}</text>
							</view>

						</view>
					</view>

					<!-- 常用功能模块 -->
					<view class="example-body" :style="{ background: '#fff' }">
						<view class="example-body-head"><text class="example-tit">{{$lang('tools')}}</text></view>

						<!-- <uni-grid :column="4" :show-border="false" :square="false" v-if="defaultInfo.menuStyle == 'palace' && defaultInfo.topStyle != 'default'"> -->
						<view style="margin-left: 20rpx; margin-right: 10rpx;">
							<uni-grid :column="toolsColumnNum" :show-border="false" :square="false">
								<block v-for="(item, index) in defaultInfo.menuList" :key="index">
									<view @click="redirectToLink(item.url, index)">
										<uni-grid-item>
											<image class="image" :src="$util.img(item.img)" mode="aspectFill" />
											<text class="text">{{ $lang(item.text) }}</text>
										</uni-grid-item>
									</view>
								</block>
							</uni-grid>
						</view>
					</view>

					<view v-if='token&&memberInfo.member_level>1&&infoList1.length>0' class="example-body memberInforContainer"
						style="background: rgb(255, 255, 255);">
						
						<!-- 会员信息模块 -->
						<view class="example-body-head memberInfo">
							<text class="example-tit memberInfoTitle">{{$lang('memberInfo')}}</text>
							<!-- <text style='font-size: 16rpx;'> [{{bonus.start.slice(5)+'~'+bonus.end.slice(5)}}]</text> -->
							<text class="memberInfoTimeRange"> [{{bonus.start | dateFormat }} ~ {{bonus.end | dateFormat }}]</text>

							<radio-group class="memberInfoRadio" @change="radioChange">
								<label class="radio">
									<radio value="0" checked="true" />{{ $lang('thisweek') }}
								</label>
								<label class="radio lastWeek">
									<radio value="1" />{{ $lang('lastweek') }}
								</label>
							</radio-group>
							<!-- <button size="mini" type="plain" @click="pageUp"></button>
							<button size="mini" type="plain" @click="pageDown"></button> -->
						</view>
						<view>
							<uni-grid :column="columnNum" :show-border="false" :square="false">
								<block v-for="(item, index) in infoList1" :key="index">
									<uni-grid-item class="makesameline">
									<view class="recurringDate">
										<image v-if="item.item===$lang('common.activerequirement')" class="redflag-icon" 
										src="../../../static/images/icons/red-flag.png"></image>
										<text class="text memberInforLabel">{{ item.item }}</text>
									</view>
										<!-- <text class="text memberInforContent"
											:class="{color: item.value=='不活跃' }">{{ item.value }}</text> -->
											<text class="text memberInforContent"
												:class="{color: item.value == '不活跃' || item.value == 'Non-Active'}">
												{{ item.value }}</text>
									</uni-grid-item>
								</block>
							</uni-grid>
						</view>

						<view class="mat-progress-bar"></view>
					</view>
					<view v-if='token&&memberInfo.member_level>1&&infoList4.length>0' class="example-body"
						style="margin-top: -10rpx; background: rgb(255, 255, 255);">
						<!-- 会员奖金模块 -->
						<view class="bonusDetail" @click="$util.redirectTo('/pages/bonusDetail/bonusDetail')">
							<image class="redflag-icon" src="../../../static/images/icons/red-flag.png"></image>
							<text class="bonus-tip">{{ $lang('common.seeBonusDetails') }}</text>
							<text class="view-more iconfont iconright"></text>
						</view>
						<view style="margin 30rpx, 30rpx;">
							<uni-grid :column="columnNum" :show-border="false" :square="false">
								<block v-for="(item, index) in infoList4" :key="index">
									<view @click="redirectToList(item.url, item.value)">
										<uni-grid-item>
											<text class="text memberInforLabel">{{ item.item }}</text>
											<text class="text memberInforContent">{{ item.value}}</text>
										</uni-grid-item>
									</view>
								</block>
							</uni-grid>
						</view>
						<view class="mat-progress-bar"></view>
					</view>
					<view v-if='token&&memberInfo.member_level>1&&infoList2.length>0' class="example-body"
						style="margin-top: -20rpx;background: rgb(255, 255, 255);">
						<!-- 会员信息模块 -->
						<view style="margin 30rpx, 30rpx;">
							<uni-grid :column="columnNum" :show-border="false" :square="false">
								<block v-for="(item, index) in infoList2" :key="index">
									<view @click="redirectToList(item.url, item.value)">
										<uni-grid-item>
											<text class="text memberInforLabel">{{ item.item }}</text>
											<text class="text memberInforContent">{{ item.value}}</text>
										</uni-grid-item>
									</view>
								</block>
							</uni-grid>
						</view>
						<view class="mat-progress-bar"></view>
					</view>
					<view v-if='token&&memberInfo.member_level>1&&infoList3.length>0' class="example-body"
						style="margin-top: -20rpx; background: rgb(255, 255, 255);">
						<!-- 会员信息模块 -->
						<view style="margin 30rpx, 30rpx;">
							<uni-grid :column="columnNum" :show-border="false" :square="false">
								<block v-for="(item, index) in infoList3" :key="index">
									<view @click="redirectToList(item.url, item.value)">
										<uni-grid-item>
											<text class="text memberInforLabel">{{ item.item }}</text>
											<text class="text memberInforContent">{{ item.value}}</text>
										</uni-grid-item>
									</view>
								</block>
							</uni-grid>
						</view>
						<view class="mat-progress-bar"></view>
					</view>
				</view>
				<view v-if="!token" @click="$util.redirectTo('/pages/login/login/login')" v-trigger></view>
				
				<view class="padding-bottom">
					<ns-copy-right></ns-copy-right>
				</view>

				<ns-login ref="login"></ns-login>
				<loading-cover ref="loadingCover"></loading-cover>
				<!-- 底部tabBar -->
				<diy-bottom-nav type="shop"></diy-bottom-nav>
			</view>
		</view>
		<to-top v-if="showTop" @toTop="scrollToTopNative()"></to-top>
	</view>
</template>

<script>
	// import navBar from '@/components/nav-bar/nav-bar.vue'
	import uniGrid from '@/components/uni-grid/uni-grid.vue';
	import uniGridItem from '@/components/uni-grid-item/uni-grid-item.vue';
	import diyBottomNav from '@/components/diy-bottom-nav/diy-bottom-nav.vue';
	import toTop from '@/components/toTop/toTop.vue';
	import scroll from '@/common/js/scroll-view.js';
	import nsCopyRight from '@/components/ns-copyright/ns-copyright.vue';
	import fenxiaoWords from 'common/js/fenxiao-words.js';
	import globalConfig from '@/common/js/golbalConfig.js';

   let self;
	export default {
		components: {
			// navBar,
			uniGrid,
			uniGridItem,
			diyBottomNav,
			toTop,
			nsCopyRight
		},
		data() {
			return {
				memberImg:'',
				memberGroup:'',
				token: '',
				memberInfo: {
					balance: 0,
					balance_money: 0,
					point: 0
				},
				couponNum: 0,
				orderNum: {
					waitPay: 0, //待付款
					readyDelivery: 0, //待发货
					waitDelivery: 0, //待收货
					waitEvaluate: 0, // 待评价
					refunding: 0 // 退款中
				},
				isVerification: true,
				copyrightLoad: 0,
				bottom_info: {},
				authInfo: {
					is_verifier: false
				},

				shopTop: false,
				scrollTop: 0,
				shopConfig: null,
				promoterInfo: null,
				withdrawConfig: null,
				fenxiaoBasicsConfig: null,
				defaultInfo: {
					topStyle: 'default',
					bgColor: '#ff454f',
					textColor: '#fff',
					bgImg: '',
					menuList: [{}, {}, {}, {}],
					insertGap: '0',
					menuStyle: 'palace',
					level: 1
				},
				signState: 1, // 签到是否开启
				evaluateConfig: {
					evaluate_audit: 1,
					evaluate_show: 0,
					evaluate_status: 1
				},
				memberrecommend: 0,
				membercard: null,
				bonus: {
					bonus: 0,
					lastweek_bonus: 0
				},
				infoList1: [],
				infoList2: [],
				infoList3: [],
				infoList4: [],
				statusBarHeight: 0,
				lastweek: 0,
				bonusPageObject: {},
				columnNum: 2,
				toolsColumnNum: 2,
				screenGreaterSixHundredPx:false,
			}
		},
		mixins: [scroll, fenxiaoWords, globalConfig],
		computed: {
			storeToken() {
				return this.$store.state.token;
			},
			defaultBgColor() {
				var val = '';
				if (this.defaultInfo.topStyle != 'default') {
					val = 'background:' + this.defaultInfo.bgColor;
				}
				return val;
			},
			defaultBgImg() {
				var defaultImg = '';
				if (this.defaultInfo.topStyle != 'default') {
					defaultImg = this.defaultInfo.bgImg ? this.$util.img(this.defaultInfo.bgImg) : '';
				} else {
					defaultImg = this.$util.img('upload/uniapp/member/index/member_bg.png');
				}
				return defaultImg;
			},
			defaultTextColor() {
				var textColor = '';
				if (this.defaultInfo.topStyle != 'default') {
					textColor = 'color:' + this.defaultInfo.textColor + ' !important';
				}
				return textColor;
			}
		},
		watch: {
			storeToken: async function(nVal, oVal) {
				if (this.addonIsExit.membersignin) {
					await this.getSignState();
				}
				await this.getMemberInfo();
				this.getOrderNum();
				this.getCouponNum();
				this.checkIsVerifier();
			}
		},
		filters: {
			/**
			 * 日期格式化输出
			 * @param {Object} money
			 */
			dateFormat(date) {
				return date.substring(2, 10);
			}
		},
		directives: {
		        trigger: {
		            inserted(el, binging) {
		               // el.click(console.log("自动唤起"))
		                //$(el).trigger('click')
		            }
		        }
		    },
		

		onLoad() {
			this.getMemberInfo();
			this.columnNum = this.findColumnNum();
			this.toolsColumnNum = this.toolsFindColumnNum();
			this.screenGreaterSixHundredPx = this.findTitleFormat();
			uni.hideTabBar();
			if (this.addonIsExit.memberwithdraw) {
				this.getWithdrawConfig();
			}
			if (this.addonIsExit.fenxiao) {
				this.getFenxiaoBasicsConfig();
			}
			this.getEvaluateConfig();
		},
		async onReady() {
			//console.log("onreadying");
			if (this.addonIsExit.membersignin) {
				await this.getSignState();
			}
			await this.getDefaultInfo();
			if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
		},
		async onShow() {
			self = this;
			this.initGetHeading();
			uni.onWindowResize((res) => {
				this.columnNum = res.size.windowWidth >= 800 ? 3 : 2;
				this.toolsColumnNum = res.size.windowWidth >= 800 ? 4 : 2;
				this.findTitleFormat = res.size.windowWidth >= 600;
			})
			
	
			// 刷新多语言
			this.$langConfig.refresh();

			this.checkToken();

			if (uni.getStorageSync('userInfo')) {
				this.memberInfo = uni.getStorageSync('userInfo');
			}
			if (self.token) {
				if (this.addonIsExit.membersignin) {
					await this.getSignState();
				}
				await this.getMemberInfo();
				this.getOrderNum();
				this.getCouponNum();
				this.checkIsVerifier();
			} else {
				this.initInfo();
			}

			if (this.addonIsExit.memberrecommend) {
				this.getMemberRecommend();
			}
		},
		methods: {
			initGetHeading() {
				this.$api.sendRequest({
					url: '/api/member/info',
					success: res => {
						if (res.code == 0) {
							this.memberImg = res.data.headimg;
						} 
					}
				});
			},
			checkToken() {
				self.token = uni.getStorageSync('token');
				//console.log('self token ',self.token);
				if (!self.token) {
					//console.log('call token');
					uni.redirectTo({
						url: '/pages/login/login/login'
					});
				}
			},
			findTitleFormat() {
				let result = 0;
				uni.getSystemInfo({
					success: function(res) {
						result = res.windowWidth >= 600;
						}
				});
				return result;
			},
			findColumnNum() {
				let result = 0;
				uni.getSystemInfo({
					success: function(res) {
						result = res.windowWidth >= 800 ? 3 : 2;
						}
				});
				return result;
			},
			toolsFindColumnNum() {
				let result = 0;
				uni.getSystemInfo({
					success: function(res) {
						result = res.windowWidth >= 800 ? 4 : 2;
						}
				});
				return result;
			},
			radioChange(evt) {
				this.lastweek = evt.detail.value;
				this.getBonus()
			},
			// 退出登录
			logout() {
				uni.showModal({
					title: this.$lang('common.warning'),
					content: this.$lang('common.quit_info'),
					success: (res) => {
						if (res.confirm) {
							uni.removeStorage({
								key: 'token',
								success: res => {
									uni.setStorageSync('loginLock', 1);
									//购物车数量
									uni.removeStorageSync('userInfo')
									this.$store.dispatch('getCartNumber').then((e) => {})
									uni.reLaunch({
										url: '/pages/member/index/index',
										// success: ()=>{
										// 	this.$util.redirectTo(decodeURIComponent('/pages/member/index/index'), {}, this.redirect);
										// }
									})
									// this.$util.redirectTo('/pages/index/index/index', {}, 'reLaunch');
								}
							});
						}
					}
				});
			},
			// 签到是否开启
			async getSignState() {
				var res = await this.$api.sendRequest({
					url: '/api/membersignin/getSignStatus',
					async: false
				});
				if (res.code == 0) {
					this.signState = res.data.is_use;
				}
			},
			async getDefaultInfo() {
				var res = await this.$api.sendRequest({
					url: '/api/diyview/memberindex',
					async: false
				});
				// console.log(res);
				if (res.code == 0) {
					this.defaultInfo.topStyle = res.data.topStyle;
					this.defaultInfo.bgColor = res.data.bgColor;
					this.defaultInfo.textColor = res.data.textColor;
					this.defaultInfo.bgImg = res.data.bgImg;
					this.defaultInfo.menuStyle = res.data.menuStyle;
					this.defaultInfo.menuList = res.data.menuList;
					let bonusObject = {};
					this.defaultInfo.menuList.forEach((el, index) => {
						if (el.text === "提现") {
							bonusObject.link = el.url;
							bonusObject.index = index;
						}
					});
					this.bonusPageObject = bonusObject;
					this.defaultInfo.insertGap = res.data.insertGap;
					this.defaultInfo.level = res.data.level || 1;
				}
			},
			redirectToLink(url, index) {
				if (!uni.getStorageSync('token')) {
					this.$refs.login.open(url);
				} else {
					// if (index > 1 && this.memberInfo.member_level < 2) return this.$util.msg('会员才能进入！');
					if (index == 3) url = '/otherpages/fenxiao/withdraw_apply/withdraw_apply';
					// console.log(url)
					// if ( index == 3)  url = '/otherpages/member/tree/tree_copy';
					this.$util.redirectTo(url);
				}
			},
			redirectToList(url, value) {
				// console.log('check the value url', url, value); 
				if (value > 0 && url=='/otherpages/mstock_details/mstock_details') {
					this.$util.redirectTo(url);
				}
				if (this.memberInfo.UFP10>0 && url=='/otherpages/ufp10_details/ufp10_details') {
					this.$util.redirectTo(url);
				}
				if (value > 0||url == '/otherpages/member/bill/bill?class=recommend&branch=L'
				||url == '/otherpages/member/bill/bill?class=recommend&branch=R'
				||url=='/otherpages/member/bill/bill?class=UFP10') { 
					// if (this.lastweek == 1) return this.$util.msg('上周明细近日上线，敬请期待');
					this.$util.redirectTo(url + '&lastweek=' + this.lastweek);
				}
				
			},

			initInfo() {
				self.token = '';
				this.memberInfo = {
					balance: '0.00',
					balance_money: '0.00',
					point: 0
				};
				this.couponNum = 0;
				this.orderNum = {
					waitPay: 0, //待付款
					readyDelivery: 0, //待发货
					waitDelivery: 0, //待收货
					waitEvaluate: 0, // 待评价
					refunding: 0 // 退款中
				};
				this.authInfo = {
					is_verifier: false
				};
				uni.stopPullDownRefresh();
			},
			// 获取奖金等信息
			async getBonus() {
				if (this.memberInfo.member_level < 2) return;
				let res = await this.$api.sendRequest({
					url: '/api/member/bonus',
					data: {
						lastweek: this.lastweek,
					},
					async: false
				});
				if (res.code >= 0 && res.data[0]) {
					this.bonus = res.data[0];
					// console.log('this.bonus',this.bonus);
					if (this.columnNum < 3) {
						this.infoList1 = [];
						this.infoList1.push({
							item: this.$lang('actived'),
							value: this.bonus.actived == 1 ? this.$lang('活跃') : this.$lang('不活跃')
						})
						this.infoList1.push({
							item: this.$lang('activedPV'),
							value: this.bonus.activedPV/30+" PV/"+this.$lang('common.day')
						})
						this.infoList1.push({
							item: this.$lang('member_level_name'),
							value: this.$lang(this.bonus.member_level_name)
						})
						this.infoList1.push({
							item: this.$lang('restPV'),
							value: this.bonus.restPV
						})
						this.infoList1.push({
							item: this.$lang('highest_level'),
							value: this.$lang(this.bonus.highest_level)
						})
						this.infoList1.push({
							item: this.$lang('common.activerequirement'),
							value: this.$lang('restPV')+" > 0"
						})
						// this.infoList1.push({
						// 	item: this.$lang('nextRecurringDate'),
						// 	value: this.bonus.recurringDate
						// })
						// console.log(this.infoList1);
						this.infoList2 = [];
						this.infoList2.push({
							item: this.$lang('LCV'),
							value: this.bonus.LCV
						})
						this.infoList2.push({
							item: this.$lang('RCV'),
							value: this.bonus.RCV
						})
						this.infoList2.push({
							item: this.$lang('addedLCV'),
							value: this.bonus.addedLCV,
							url: '/otherpages/member/bill/bill?class=cv&branch=L'
						})
						this.infoList2.push({
							item: this.$lang('addedRCV'),
							value: this.bonus.addedRCV,
							url: '/otherpages/member/bill/bill?class=cv&branch=R'
						})
						this.infoList2.push({
							item: this.$lang('restLCV'),
							value: this.bonus.restLCV == -1 ? this.$lang('待结算') : this.bonus.restLCV
						})
						this.infoList2.push({
							item: this.$lang('restRCV'),
							value: this.bonus.restRCV == -1 ? this.$lang('待结算') : this.bonus.restRCV
						})

						this.infoList2.push({
							item: this.$lang('activedLQV'),
							value: this.bonus.activedLQV,
							url: '/otherpages/member/bill/bill?class=past_n_week_qv&branch=L'
						})
						this.infoList2.push({
							item: this.$lang('activedRQV'),
							value: this.bonus.activedRQV,
							url: '/otherpages/member/bill/bill?class=past_n_week_qv&branch=R'
						})
						this.infoList2.push({
							item: this.$lang('c7bonus'),
							value: this.bonus.c7bonus == -1 ? 0 : this.bonus.c7bonus
						})
						// console.log(this.infoList2);
						this.infoList3 = [];
						this.infoList3.push({
							item: this.$lang('recommend_total'),
							value: this.bonus.recommend_total
						})
						this.infoList3.push({
							item: this.$lang('epoint_balance'),
							value: this.bonus.epoint_balance
						})
						this.infoList3.push({
							item: this.$lang('recommend_ltotal'),
							value: this.bonus.recommend_ltotal,
							url: '/otherpages/member/bill/bill?class=recommend&branch=L'
						})
						this.infoList3.push({
							item: this.$lang('lastweek_bonus'),
							value: this.bonus.lastweek_bonus == -1 ? this.$lang('待结算') : this.bonus.lastweek_bonus
						})
						this.infoList3.push({
							item: this.$lang('recommend_rtotal'),
							value: this.bonus.recommend_rtotal,
							url: '/otherpages/member/bill/bill?class=recommend&branch=R'
						})
						this.infoList3.push({
							item: this.$lang('bonus'),
							value: this.bonus.bonus
						})
						this.infoList3.push({
							item: this.$lang('ufp10'), //"ufp10 UFP Dividend 创始分红权益",
							value: this.memberInfo.UFP10>0? (this.memberInfo.UFP10_Prime>0? this.$lang('prime') 
							: this.$lang('basic') ) : this.$lang('未参与'), 
							url: this.memberInfo.UFP10>0 && (this.memberInfo.UFP10_leftNum>0 || 
							this.memberInfo.UFP10_rightNum>0) ? '/otherpages/member/bill/bill?class=UFP10' : null
						})
						this.infoList3.push({
							item: this.$lang('ufp10_bonus_details'),
							value: this.$lang('check_details'),
							url:'/otherpages/ufp10_details/ufp10_details'
						})
						if (this.memberInfo.mstock_preGivenFromCompany>0) {
						this.infoList3.push({
								item: this.$lang('mstock_preGivenFromCompany'), 
								value: this.memberInfo.mstock_preGivenFromCompany
							})
						}
						if (this.memberInfo.mstock_preGivenFromLevel>0) {
							this.infoList3.push({
								item: this.$lang('mstock_preGivenFromLevel'), 
								value: this.memberInfo.mstock_preGivenFromLevel
							}) 
						}
						this.infoList3.push({
								item: this.$lang('mstock_eventTotalBonus_lastweek'), 
								value: this.bonus.mstock_eventTotalBonus_lastweek,
								url:'/otherpages/mstock_details/mstock_details'
							})
						// console.log(this.infoList3);
						this.infoList4 = [];
						this.infoList4.push({
							item: this.$lang('retail_bonus'),
							value: this.bonus.retail_bonus
						})
						this.infoList4.push({
							item: this.$lang('fast_bonus'),
							value: this.bonus.fast_bonus,
							url: '/otherpages/member/bill/bill?class=bonus&type=1'
						})
						this.infoList4.push({
							item: this.$lang('leadership_bonus'),
							value: this.bonus.leadership_bonus,
							url: '/otherpages/member/bill/bill?class=bonus&type=2'
						})
						this.infoList4.push({
							item: this.$lang('team_bonus'),
							value: this.bonus.team_bonus,
							url: '/otherpages/member/bill/bill?class=bonus&type=3'
						})
						this.infoList4.push({
							item: this.$lang('ranking_bonus'),
							value: this.bonus.ranking_bonus,
							url: '/otherpages/member/bill/bill?class=bonus&type=4'
						})
						this.infoList4.push({
							item: this.$lang('cash_bonus'),
							value: this.bonus.cash_bonus
						})
						// console.log(this.infoList4);
						this.$forceUpdate();
					} else {
						this.infoList1 = [];
						this.infoList1.push({
							item: this.$lang('actived'),
							value: this.bonus.actived == 1 ? this.$lang('活跃') : this.$lang('不活跃')
						})
						this.infoList1.push({
							item: this.$lang('member_level_name'),
							value: this.$lang(this.bonus.member_level_name)
						})
						this.infoList1.push({
							item: this.$lang('highest_level'),
							value: this.$lang(this.bonus.highest_level)
						})
						this.infoList1.push({
							item: this.$lang('activedPV'),
							value: this.bonus.activedPV/30+" PV/"+this.$lang('common.day')
						})
						this.infoList1.push({
							item: this.$lang('restPV'),
							value: this.bonus.restPV
						})
						this.infoList1.push({
							item: this.$lang('common.activerequirement'),
							value: this.$lang('restPV')+" > 0"
						})
						// this.infoList1.push({
						// 	item: this.$lang('nextRecurringDate'),
						// 	value: this.bonus.recurringDate
						// })
						// console.log(this.infoList1);
						this.infoList2 = [];
						this.infoList2.push({
							item: this.$lang('LCV'),
							value: this.bonus.LCV
						})
						this.infoList2.push({
							item: this.$lang('addedLCV'),
							value: this.bonus.addedLCV,
							url: '/otherpages/member/bill/bill?class=cv&branch=L'
						})
						this.infoList2.push({
							item: this.$lang('restLCV'),
							value: this.bonus.restLCV == -1 ? this.$lang('待结算') : this.bonus.restLCV
						})
						this.infoList2.push({
							item: this.$lang('RCV'),
							value: this.bonus.RCV
						})
						this.infoList2.push({
							item: this.$lang('addedRCV'),
							value: this.bonus.addedRCV,
							url: '/otherpages/member/bill/bill?class=cv&branch=R'
						})
						this.infoList2.push({
							item: this.$lang('restRCV'),
							value: this.bonus.restRCV == -1 ? this.$lang('待结算') : this.bonus.restRCV
						})
						this.infoList2.push({
							item: this.$lang('activedLQV'),
							value: this.bonus.activedLQV,
							url: '/otherpages/member/bill/bill?class=past_n_week_qv&branch=L'
						})
						this.infoList2.push({
							item: this.$lang('activedRQV'),
							value: this.bonus.activedRQV,
							url: '/otherpages/member/bill/bill?class=past_n_week_qv&branch=R'
						})
						this.infoList2.push({
							item: this.$lang('c7bonus'),
							value: this.bonus.c7bonus == -1 ? 0 : this.bonus.c7bonus
						})
						// console.log(this.infoList2);
						this.infoList3 = [];
						this.infoList3.push({
							item: this.$lang('recommend_total'),
							value: this.bonus.recommend_total,
							
						})
						this.infoList3.push({
							item: this.$lang('recommend_ltotal'),
							value: this.bonus.recommend_ltotal,
							url: '/otherpages/member/bill/bill?class=recommend&branch=L'
						})
						this.infoList3.push({
							item: this.$lang('recommend_rtotal'),
							value: this.bonus.recommend_rtotal,
							url: '/otherpages/member/bill/bill?class=recommend&branch=R'
						})
						this.infoList3.push({
							item: this.$lang('bonus'),
							value: this.bonus.bonus
						})
						this.infoList3.push({
							item: this.$lang('lastweek_bonus'),
							value: this.bonus.lastweek_bonus == -1 ? this.$lang('待结算') : this.bonus.lastweek_bonus
						})
						this.infoList3.push({
							item: this.$lang('epoint_balance'),
							value: this.bonus.epoint_balance
						})
						this.infoList3.push({
							item: this.$lang('ufp10'), //"ufp10 UFP Dividend 创始分红权益",
							value: this.memberInfo.UFP10>0? (this.memberInfo.UFP10_Prime>0? this.$lang('prime') 
							: this.$lang('basic') ) : this.$lang('未参与'), 
							url: this.memberInfo.UFP10>0 && (this.memberInfo.UFP10_leftNum>0 || 
							this.memberInfo.UFP10_rightNum>0) ? '/otherpages/member/bill/bill?class=UFP10' : null
						}) 
						this.infoList3.push({
							item: this.$lang('ufp10_bonus_details'),
							value: this.$lang('check_details'),
							url:'/otherpages/ufp10_details/ufp10_details'
						})
						if (this.memberInfo.mstock_preGivenFromCompany>0) {
						this.infoList3.push({
								item: this.$lang('mstock_preGivenFromCompany'), 
								value: this.memberInfo.mstock_preGivenFromCompany
							})
						}
						if (this.memberInfo.mstock_preGivenFromLevel>0) {
							this.infoList3.push({
								item: this.$lang('mstock_preGivenFromLevel'), 
								value: this.memberInfo.mstock_preGivenFromLevel
							}) 
						}
						this.infoList3.push({
								item: this.$lang('mstock_eventTotalBonus_lastweek'), 
								value: this.bonus.mstock_eventTotalBonus_lastweek,
								url:'/otherpages/mstock_details/mstock_details'
							})
						
						// console.log(this.infoList3);
						this.infoList4 = [];
						this.infoList4.push({
							item: this.$lang('retail_bonus'),
							value: this.bonus.retail_bonus
						})
						this.infoList4.push({
							item: this.$lang('fast_bonus'),
							value: this.bonus.fast_bonus,
							url: '/otherpages/member/bill/bill?class=bonus&type=1'
						})
						this.infoList4.push({
							item: this.$lang('leadership_bonus'),
							value: this.bonus.leadership_bonus,
							url: '/otherpages/member/bill/bill?class=bonus&type=2'
						})
						this.infoList4.push({
							item: this.$lang('team_bonus'),
							value: this.bonus.team_bonus,
							url: '/otherpages/member/bill/bill?class=bonus&type=3'
						})
						this.infoList4.push({
							item: this.$lang('ranking_bonus'),
							value: this.bonus.ranking_bonus,
							url: '/otherpages/member/bill/bill?class=bonus&type=4'
						})
						this.infoList4.push({
							item: this.$lang('cash_bonus'),
							value: this.bonus.cash_bonus
						})
						// console.log(this.infoList4);
						this.$forceUpdate();
					}
				}
			},
			// 获取会员基础信息
			async getMemberInfo() {
				let res = await this.$api.sendRequest({
					url: '/api/member/info',
					async: false
				});
				if (res.code >= 0 && res.data) {
					// console.log(res.data);
					this.getBonus();
					self.token = uni.getStorageSync('token');
					this.memberInfo = res.data;
					this.memberGroup = this.memberInfo.group_id;

					uni.setStorageSync('userInfo', this.memberInfo);
					if (this.addonIsExit.supermember && this.memberInfo.member_level_type == 0) this
						.getMemberCardInfo();
				} else {
					this.initInfo();
					uni.removeStorageSync('token');
					uni.removeStorageSync('userInfo');
				}
				uni.stopPullDownRefresh();
			},
			// 下拉刷新
			onPullDownRefresh() {
				if (uni.getStorageSync('token')) this.getMemberInfo();
				else this.initInfo();
			},
			// 订单数量
			getOrderNum() {
				this.$api.sendRequest({
					url: '/api/order/num',
					data: {
						order_status: 'waitpay,waitsend,waitconfirm,waitrate,refunding'
					},
					success: res => {
						if (res.code == 0) {
							this.orderNum.waitPay = res.data.waitpay;
							this.orderNum.readyDelivery = res.data.waitsend;
							this.orderNum.waitDelivery = res.data.waitconfirm;
							this.orderNum.waitEvaluate = res.data.waitrate;
							this.orderNum.refunding = res.data.refunding;
						}
						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});
			},
			// 优惠券数量
			getCouponNum() {
				this.$api.sendRequest({
					url: '/coupon/api/coupon/num',
					success: res => {
						if (res.code == 0) {
							this.couponNum = res.data;
						}
					}
				});
			},
			checkIsVerifier() {
				this.$api.sendRequest({
					url: '/api/verify/checkisverifier',
					success: res => {
						this.authInfo.is_verifier = (res.code == 0);
						this.$forceUpdate();
					}
				});
			},
			jumpLevel() {
				if (uni.getStorageSync('token')) {
					this.$util.redirectTo('/otherpages/member/level/level');
				} else {
					this.$refs.login.open('/pages/member/index/index');
				}
			},
			/**
			 * 获取余额提现配置
			 */
			getWithdrawConfig() {
				this.$api.sendRequest({
					url: '/api/memberwithdraw/config',
					success: res => {
						if (res.code >= 0 && res.data) {
							this.withdrawConfig = res.data;
							this.$forceUpdate();
						}
					}
				});
			},
			/**
			 * 获取分销基本配置
			 */
			getFenxiaoBasicsConfig() {
				this.$api.sendRequest({
					url: '/fenxiao/api/config/basics',
					success: res => {
						if (res.code >= 0) {
							this.fenxiaoBasicsConfig = res.data;
							this.$forceUpdate();
						}
					}
				});
			},
			getEvaluateConfig() {
				this.$api.sendRequest({
					url: '/api/goodsevaluate/config',
					success: res => {
						if (res.code == 0) {
							var data = res.data;
							this.evaluateConfig = data;
						}
					}
				});
			},
			menuIsShow(data) {
				switch (data.tag) {
					case 'fenxiao':
						return this.addonIsExit.fenxiao == 1 && this.fenxiaoBasicsConfig && this.fenxiaoBasicsConfig
							.level > 0;
						break;
					case 'memberwithdraw':
						return this.withdrawConfig && this.withdrawConfig.is_use == 1;
						break;
					case 'membersignin':
						return this.signState == 1;
						break;
					case 'verifier':
						return this.authInfo.is_verifier;
						break;
					case 'memberrecommend':
						return this.addonIsExit.memberrecommend && this.memberrecommend;
						break;
					default:
						return true;
				}
			},
			getMemberRecommend() {
				this.$api.sendRequest({
					url: '/memberrecommend/api/memberrecommend/info',
					success: res => {
						if (res.code == 0 && res.data) {
							this.memberrecommend = 1;
						}
					}
				});
			},
			getMemberCardInfo() {
				this.$api.sendRequest({
					url: '/supermember/api/membercard/firstcard',
					success: res => {
						if (res.code == 0 && res.data) {
							this.membercard = res.data;
						}
					}
				});
			}
		}
	};
</script>

<style lang="scss">
	// @import '@/common/css/info_edit.scss';	
	@import '../public/css/index.scss';

	/deep/.uni-scroll-view::-webkit-scrollbar {
		/* 隐藏滚动条，但依旧具备可以滚动的功能 */
		display: none
	}
	.recurringDate {
		display:flex;
		flex-direction: row;
		align-items: center;
	}
	.redflag-icon{
		width: 25px;
		height: 25px;
		margin-right: 5px;
	}
	.bonusDetail {
		display:flex;
		justify-content: flex-end;
		margin-right: 30rpx;
		
		.bonus-tip {
			margin-right: 6rpx;
			color: $color-tip;
			font-size: $font-size-tag;
			letter-spacing: 3rpx;
		}
		.view-more {
			color: lighten($color-tip, 10%);
			font-size: $font-size-tag;
		}
	}
	
</style>
<style scoped>
	/deep/ .reward-popup .uni-popup__wrapper-box {
		background: none !important;
		max-width: unset !important;
		max-height: unset !important;
	}

	.text.color {
		border: 5rpx solid #fc354f;
	}
</style>
