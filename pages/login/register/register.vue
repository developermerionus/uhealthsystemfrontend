<template>
	<scroll-view scroll-y="true" class="container" :data-theme="themeStyle">
		<view class="outer-container-wrap">
			<navbar></navbar>
		<!-- <view class="iconfont iconclose back-btn" @click="$util.goBack()"></view> -->
		<view class="header-wrap">
			<view class="title">{{title}}</view>
			<view class="regisiter-agreement">
				<text style='color: #606266;'>{{$lang('already_have_account')}}?{{'\xa0'}}</text> <!-- {{'\xa0'}} js escape code for breakspace -->
				<text class="color-base-text" @click="toLogin">{{$lang('login_now')}}</text>
			</view>
		</view>
		<view class="body-wrap">
			<view class="form-wrap">
				<view class="input-wrap" v-show="registerMode == 'account'" @click='selectCountry'>
					<!-- <view class="content"><text class="tit">请选择全球市场<text>*</text></text>{{ countryList[0].name }}</view> -->
					<view class="content">{{$lang('marketRegion')}}<text style='color: #FF0000;'>*</text>
						<input style="margin-left: 20rpx;" disabled type="text"
							:placeholder="$lang('marketRegionPlaceholoder')" placeholder-class="input-placeholder"
							class="input" v-model="formData.market" @click='selectCountry' />
					</view>
				</view>
				<view class="input-wrap" v-show="registerMode == 'account'">
					<view class="content"><input type="text" :placeholder="$lang('accountPlaceholder')"
							placeholder-class="input-placeholder" class="input" v-model="formData.account" /></view>
				</view>
				<view class="input-wrap" v-show="registerMode == 'account'">
					<view class="content">
							<input type="password" :placeholder="$lang('passwordPlaceholder')"
								placeholder-class="input-placeholder" class="input" v-model="formData.password" />
					</view>
				</view>
				<view class="input-wrap" v-show="registerMode == 'account'">
					<view class="content">
						<input type="password" :placeholder="$lang('rePasswordPlaceholder')"
							placeholder-class="input-placeholder" class="input" v-model="formData.rePassword" />
					</view>
				</view>
				<view class="input-wrap">
					<view class="content">
						<input type="text" :placeholder="$lang('captchaPlaceholder')"
							placeholder-class="input-placeholder" class="input" v-model="formData.vercode" />
						<image :src="captcha.img" class="captcha" @click="getCaptcha"></image>
					</view>
				</view>
				<!-- <view class="input-wrap" v-show="registerMode == 'mobile'">
					<view class="content">
						<input type="text" placeholder="请输入动态码" placeholder-class="input-placeholder" class="input" v-model="formData.dynacode" />
						<view class="dynacode" :class="dynacodeData.seconds == 120 ? 'color-base-text' : 'color-tip'" @click="sendMobileCode">{{ dynacodeData.codeText }}</view>
					</view>
				</view> -->
			</view>

			<view style="width: 80%; margin: 40upx auto; color: #bfbfbf;">
				上线ID:{{item.superiors}} {{item.branch}}
				<!-- <text class="color-base-text" @click="openPopup"></text> -->
			</view>
			<!-- <view class="login-mode-box">
				<text @click="switchRegisterMode" >使用用户名注册</text>
				<text @click="switchRegisterMode" >使用手机号注册</text>
			</view> -->
			<!-- <view class="btn_view"><button type="primary" @click="register"
					class="login-btn color-base-border color-base-bg">{{$lang('registered')}}</button></view> -->
			<view class="regisiter-agreement">
				{{$lang('registerTips')}}
				<text class="color-base-text" @click="openPopup">{{$lang('registerAgreement')}}</text>
			</view>
			<view class="btn_view" id="pages_login_register_register-btn_view"><button type="primary" @click="register"
					class="login-btn color-base-border color-base-bg"> {{$lang('registered')}}</button></view>
		</view>

		<view @touchmove.prevent>
			<uni-popup ref="registerPopup" type="center" :maskClick="false">
				<view class="conten-box">
					<text class="iconfont iconclose" @click="toClose"></text>
					<view class="title">{{ regisiterAgreement.title }}</view>
					<view class="con">
						<scroll-view scroll-y="true" class="con">
							<rich-text :nodes="regisiterAgreement.content">
							</rich-text>
						</scroll-view>
					</view>
				</view>
			</uni-popup>
		</view>

		<loading-cover ref="loadingCover"></loading-cover>
		<register-reward ref="registerReward"></register-reward>
		</view>
	</scroll-view>
</template>

<script>
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
	import validate from 'common/js/validate.js';
	import registerReward from '@/components/register-reward/register-reward.vue';
	import auth from 'common/js/auth.js';
	import globalConfig from '@/common/js/golbalConfig.js';
	// import info from '../public/js/info.js';

	export default {
		components: {
			uniPopup,
			registerReward
		},
		data() {
			return {
				allowRegister: true, // 是否允许注册
				registerMode: 'account',
				formData: {
					market: '',
					mobile: '',
					account: '',
					password: '',
					rePassword: '',
					vercode: '',
					dynacode: '',
					key: ''
				},
				regisiterAgreement: {
					// 注册协议
					title: '',
					content: ''
				},
				captcha: {
					// 验证码
					id: '',
					img: ''
				},
				isSub: false,
				back: '', // 返回页
				// dynacodeData: {
				// 	seconds: 120,
				// 	timer: null,
				// 	codeText: '获取动态码',
				// 	isSend: false
				// },
				registerConfig: {
					register: ''
				},
				title: '注册',
				represent: false, //代为注册
				item: {
					superiors: 'suzh0125',
					branch: '左区-left'
				},
				countryList: [{
					"id": 172,
					"name": "China"
				}],
				index: 0
			};
		},
		mixins: [auth, globalConfig],
		onLoad(option) {
			// a==1 代为注册
		//	console.log(option);
			this.title = option ? this.$lang('registered_representative') : this.$lang('registered')
			if (option) {
				this.represent = true;
				this.item = JSON.parse(option.option);
				// console.log(this.item);
				// this.option = JSON.parse(option.option)
			}

			if (option.back) this.back = option.back;
			this.getCaptcha();
			this.getRegisiterAggrement();
			this.getRegisterConfig();
			//this.getCountryList();

			if (uni.getStorageSync('authInfo')) {
				this.authInfo = uni.getStorageSync('authInfo');
			}
		},
		onShow() {
			this.getCountryList();
			// 刷新多语言
			this.$langConfig.refresh();
			// #ifdef MP
			this.getCode(); 
			// #endif
			this.getMemberInfo();
		},
		onReady() {
			if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
		},
		methods: {
			getMemberInfo() {
				let memberInfo = uni.getStorageSync('userInfo');
				//console.log('memberInfo',memberInfo);
				this.formData.group_id = memberInfo.group_id;
			},
 			selectCountry() {
				uni.showActionSheet({
					itemList: this.countryList.map((item) => {
						return item.name
					}),
					success: (res) => {
						// console.log(res);
						this.formData.market = this.countryList[res.tapIndex].name;
						this.index = res.tapIndex;
					}
				})
			},
			/**
			 * 获取国家
			 */
			getCountryList() {
				this.$api.sendRequest({
					url: '/api/address/country',
					success: res => {
						if (res.code >= 0 && res.data) {
							this.countryList = res.data.filter(item=> item.id!=0);
							 if (!this.formData.country_id && this.$refs.loadingCover) this.$refs.loadingCover.hide();
							// this.formData.market = this.countryList[0].name;
						}
					}
				});
			},
			/**
			 * 切换注册方式
			 */
			switchRegisterMode() {
				this.registerMode = this.registerMode == 'mobile' ? 'account' : 'mobile';
			},
			/**
			 * 展示注册协议
			 */
			openPopup() {
				this.$refs.registerPopup.open();
			},
			/**
			 * 点击关闭协议
			 */
			toClose() {
				this.$refs.registerPopup.close();
			},
			/**
			 * 获取注册协议
			 */
			getRegisiterAggrement() {
				this.$api.sendRequest({
					url: '/api/register/aggrement',
					success: res => {
						if (res.code >= 0) {
							this.regisiterAgreement = res.data;
						}
					}
				});
			},
			/**
			 * 获取注册配置
			 */
			getRegisterConfig() {
				this.$api.sendRequest({
					url: '/api/register/config',
					success: res => {
						if (res.code >= 0) {
							this.registerConfig = res.data.value;
							if (this.registerConfig.register == '') {
								this.$util.showToast({
									title: '平台未启用注册!'
								});
								setTimeout(() => {
									this.$util.redirectTo('/pages/index/index/index', {}, 'tabbar');
								}, 1000);
							} else if (this.registerConfig.register.indexOf('username') != -1) {
								this.registerMode = 'account';
							} else {
								this.registerMode = 'mobile';
							}
							if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
						}
					}
				});
			},
			/**
			 * 获取验证码
			 */
			getCaptcha() {
				this.$api.sendRequest({
					url: '/api/captcha/captcha',
					data: {
						captcha_id: this.captcha.id
					},
					success: res => {
						if (res.code >= 0) {
							this.captcha = res.data;
							this.captcha.img = this.captcha.img.replace(/\r\n/g, '');
						}
					}
				});
			},
			/**
			 * 注册
			 */
			register() {
				if (this.registerMode == 'account') {
					var url = '/api/register/username';
					data = {
						username: this.formData.account,
						password: this.formData.password,
						marketregion: this.formData.market,
						market: this.countryList[this.index].id,
						group_id: this.formData.group_id
					};
				} else {
					var url = '/api/register/mobile',
						data = {
							mobile: this.formData.mobile,
							key: this.formData.key,
							code: this.formData.dynacode
						};
				}

				if (this.captcha.id != '') {
					data.captcha_id = this.captcha.id;
					data.captcha_code = this.formData.vercode;
				}
				if (Object.keys(this.authInfo).length) {
					Object.assign(data, this.authInfo);
				}
				if (this.authInfo.avatarUrl) data.headimg = this.authInfo.avatarUrl;
				if (this.authInfo.nickName) data.nickname = this.authInfo.nickName;
				if (uni.getStorageSync('source_member')) data.source_member = uni.getStorageSync('source_member');
				if (this.represent) {
					Object.assign(data, this.item);
					// console.log(data, this.item)
					// return;
				}
				if (this.verify(data)) {
					// console.log(data)
					if (this.isSub) return;
					this.isSub = true;
					this.$api.sendRequest({
						url,
						data,
						success: res => {
							// console.log(res);
							if (res.code >= 0) {
								if (this.represent) {
									this.isSub = false;
									this.$util.msg('代注册成功')
									this.logout();
									// uni.reLaunch({
									// 	url: `/pages/member/info/info?browse=1&member_id=${res.data.member_id}`
									// })
									// this.$util.redirectTo('/pages/othermember/member/tree', {}, 'reLaunch');
									// this.$util.redirectTo(`/pages/member/info/info?browse=1&member_id=${res.data.member_id}`);
								} else uni.setStorage({
									key: 'token',
									data: res.data.token,
									success: () => {
										uni.removeStorageSync('loginLock');
										uni.removeStorageSync('unbound');
										uni.removeStorageSync('authInfo');

										if (this.$refs.registerReward.getReward()) {
											this.$util.showToast({
												title: '注册成功'
											});
											this.$refs.registerReward.open();
										} else {
											if (this.back != '') {
												this.$util.redirectTo(decodeURIComponent(this
													.back), {}, 'reLaunch');
											} else {
												this.$util.redirectTo(
													'/pages/member/index/index', {},
													'reLaunch');
											}
										}
									}
								});
							} else {
								this.isSub = false;
								this.getCaptcha();
								this.$util.showToast({
									title: res.message
								});
							}
						},
						fail: res => {
							this.isSub = false;
							this.getCaptcha();
						}
					});
				}
			},
			verify(data) {
				// 手机号注册
				if (this.registerMode == 'mobile') {
					var rule = [{
						name: 'mobile',
						checkType: 'required',
						errorMsg: '请输入手机号'
					}, {
						name: 'mobile',
						checkType: 'phoneno',
						errorMsg: '请输入正确的手机号'
					}];
					if (this.captcha.id != '') rule.push({
						name: 'captcha_code',
						checkType: 'required',
						errorMsg: this.$lang('captchaPlaceholder')
					});
					rule.push({
						name: 'code',
						checkType: 'required',
						errorMsg: this.$lang('dynacodePlaceholder')
					});
				}

				// 用户名注册
				if (this.registerMode == 'account') {
					if (this.isNumber(this.formData.account)) {
						this.$util.showToast({
							title: '全部都是数字不能作为用户名！'
						});
						return false;
					}
					var rule = [{
								name: 'username',
								checkType: 'required',
								errorMsg: '请输入账号'
							},
							{
								name: 'password',
								checkType: 'required',
								errorMsg: '请输入密码'
							},
							{
								name: 'marketregion',
								checkType: 'required',
								errorMsg: '请选择全球市场'
							},
						],
						regConfig = this.registerConfig;

					if (regConfig.pwd_len > 0) {
						rule.push({
							name: 'password',
							checkType: 'lengthMin',
							checkRule: regConfig.pwd_len,
							errorMsg: '密码长度不能小于' + regConfig.pwd_len + '位'
						});
					}
					if (regConfig.pwd_complexity != '') {
						let passwordErrorMsg = '密码需包含',
							reg = '';
						if (regConfig.pwd_complexity.indexOf('number') != -1) {
							reg += '(?=.*?[0-9])';
							passwordErrorMsg += '数字';
						}
						if (regConfig.pwd_complexity.indexOf('letter') != -1) {
							reg += '(?=.*?[a-z])';
							passwordErrorMsg += '、小写字母';
						}
						if (regConfig.pwd_complexity.indexOf('upper_case') != -1) {
							reg += '(?=.*?[A-Z])';
							passwordErrorMsg += '、大写字母';
						}
						if (regConfig.pwd_complexity.indexOf('symbol') != -1) {
							reg += '(?=.*?[#?!@$%^&*-])';
							passwordErrorMsg += '、特殊字符';
						}
						rule.push({
							name: 'password',
							checkType: 'reg',
							checkRule: reg,
							errorMsg: passwordErrorMsg
						});
					}
					if (this.formData.password != this.formData.rePassword) {
						this.$util.showToast({
							title: '两次密码不一致'
						});
						return false;
					}
					if (this.captcha.id != '') rule.push({
						name: 'captcha_code',
						checkType: 'required',
						errorMsg: this.$lang('captchaPlaceholder')
					});
				}
				var checkRes = validate.check(data, rule);
				if (checkRes) {
					return true;
				} else {
					this.$util.showToast({
						title: validate.error
					});
					return false;
				}
			},
			isNumber: function(checkVal) {
				var reg = /^-?[1-9][0-9]?.?[0-9]*$/;
				return reg.test(checkVal);
			},
			/**
			 * 去登录
			 */
			toLogin() {
				if (this.back)
					this.$util.redirectTo('/pages/login/login/login', {
						back: this.back
					});
				else this.$util.redirectTo('/pages/login/login/login');
			},
			logout() {
				uni.setStorageSync('loginLock', 1);
				//购物车数量
				uni.removeStorageSync('userInfo')
				this.$store.dispatch('getCartNumber').then((e) => {})
				uni.reLaunch({
					url: '/pages/login/login/login',
				})
			},
			/**
			 * 发送手机动态码
			 */
			sendMobileCode() {
				if (this.dynacodeData.seconds != 120) return;
				var data = {
					mobile: this.formData.mobile,
					captcha_id: this.captcha.id,
					captcha_code: this.formData.vercode
				};
				var rule = [{
						name: 'mobile',
						checkType: 'required',
						errorMsg: '请输入手机号'
					},
					{
						name: 'mobile',
						checkType: 'phoneno',
						errorMsg: '请输入正确的手机号'
					},
					{
						name: 'captcha_code',
						checkType: 'required',
						errorMsg: '请输入验证码'
					}
				];
				var checkRes = validate.check(data, rule);
				if (!checkRes) {
					this.$util.showToast({
						title: validate.error
					});
					return;
				}
				if (this.dynacodeData.isSend) return;
				this.dynacodeData.isSend = true;
				this.$api.sendRequest({
					url: '/api/register/mobileCode',
					data: data,
					success: res => {
						this.dynacodeData.isSend = false;
						if (res.code >= 0) {
							this.formData.key = res.data.key;

							if (this.dynacodeData.seconds == 120 && this.dynacodeData.timer == null) {
								this.dynacodeData.timer = setInterval(() => {
									this.dynacodeData.seconds--;
									this.dynacodeData.codeText = this.dynacodeData.seconds + 's后可重新获取';
								}, 1000);
							}
						} else {
							this.$util.showToast({
								title: res.message
							});
						}
					},
					fail: () => {
						this.$util.showToast({
							title: 'request:fail'
						});
						this.dynacodeData.isSend = false;
					}
				});
			}
		},
		watch: {
			'dynacodeData.seconds': {
				handler(newValue, oldValue) {
					if (newValue == 0) {
						clearInterval(this.dynacodeData.timer);
						this.dynacodeData = {
							seconds: 120,
							timer: null,
							codeText: '获取动态码',
							isSend: false
						};
					}
				},
				immediate: true,
				deep: true
			}
		}
	};
</script>

<style lang="scss">
	@import '../public/css/common.scss';
	#pages_login_register_register-btn_view {
		float: none;
		margin: 0 auto;
	}
	
	.header-wrap, .body-wrap {
		max-width: 750px;
		margin: 0 auto;
	}

</style>
<style scoped>
	/deep/ .reward-popup .uni-popup__wrapper-box {
		background: none !important;
		max-width: unset !important;
		max-height: unset !important;
		overflow: unset !important;
	}
</style>
