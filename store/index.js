import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import Http from '../common/js/http.js'

const store = new Vuex.Store({
	state: {
		siteState: 1,
		showToastValue: {
			title: '', //标题
			icon: '', //图标
			duration: 1500 //时间
		},
		tabbarList: {},
		cartNumber: 0, //购物车数量
		themeStyle: '',
		Development: 1,
		addonIsExit: {
			bundling: 0,
			coupon: 0,
			discount: 0,
			fenxiao: 0,
			gift: 0,
			groupbuy: 0,
			manjian: 0,
			memberconsume: 0,
			memberrecharge: 0,
			memberregister: 0,
			membersignin: 0,
			memberwithdraw: 0,
			memberrecommend: 0,
			pintuan: 0,
			pointexchange: 0,
			seckill: 0,
			store: 0,
			topic: 0,
			bargain: 0,
			membercancel: 0,
			servicer: 0,
			supermember: 0
		},
		sourceMember: 0, // 来源会员
		authInfo: {}, // 授权信息
		paySource: '',
		token: null,
		diySeckillInterval: null
	},
	mutations: {
		setSiteState(state, siteStateVal) {
			state.siteState = siteStateVal;
		},
		setCartNumber(state, cartNumber) {
			state.cartNumber = cartNumber
		},
		setThemeStyle(state, ThemeStyle) {
			state.themeStyle = ThemeStyle
		},
		setAddonIsexit(state, addonIsExit) {
			state.addonIsExit = Object.assign(state.addonIsExit, addonIsExit);
		},
		updateShowToastValue(state, value) {
			state.showToastValue = value;
		},
		setTabbarList(state, value) {
			state.tabbarList = value;
		},
		setToken(state, value) {
			state.token = value;
		},
		setAuthinfo(state, value) {
			state.authInfo = value;
		},
		setSourceMember(state, value) {
			state.sourceMember = value;
		},
		setPaySource(state, value) {
			state.paySource = value;
		},
		setDiySeckillInterval(state, value) {
			state.diySeckillInterval = value;
		}
	},
	actions: {
		//查询购物车数量
		getCartNumber() {
			if (uni.getStorageSync("token")) {
				return new Promise((resolve, reject) => {
					Http.sendRequest({
						url: '/api/cart/count',
						success: res => {
							if (res.code == 0) {
								this.commit('setCartNumber', res.data)
								resolve(res.data)
							}
						}
					});
				})
			} else {
				this.commit('setCartNumber', 0);
			}
		},
		getThemeStyle() {
			if (uni.getStorageSync('setThemeStyle')) {
				this.commit('setThemeStyle', uni.getStorageSync('setThemeStyle'))
			}
			Http.sendRequest({
				url: '/api/diyview/style',
				success: res => {
					if (res.code == 0) {
						this.commit('setThemeStyle', res.data.style_theme);
						uni.setStorageSync('setThemeStyle', res.data.style_theme);
					}
				}
			});
		},
		// 获取插件是否安装
		getAddonIsexit() {
			if (uni.getStorageSync('memberAddonIsExit')) {
				this.commit('setAddonIsexit', uni.getStorageSync('memberAddonIsExit'))
			}
			Http.sendRequest({
				url: '/api/addon/addonisexit',
				success: res => {
					if (res.code == 0) {
						uni.setStorageSync('memberAddonIsExit', res.data);
						this.commit('setAddonIsexit', res.data)
					}
				}
			})
		},
		getTabbarList() {
			Http.sendRequest({
				url: '/api/diyview/bottomNav',
				data: {},
				success: res => {
					let data = res.data;
					if (data && data.value && data.value.length) {
						this.commit('setTabbarList', JSON.parse(data.value))
					}
				}
			});
		}
	}
})
export default store
