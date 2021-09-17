export default {
	methods: {
		/**
		 * 订单支付
		 * @param {Object} out_trade_no
		 */
		orderPay(orderData) {
			console.log('llallla');
			if (orderData.adjust_money == 0) {
				this.openChoosePayment();
			} else {
				uni.showModal({
					title: '提示',
					content: '商家已将支付金额调整为' + orderData.pay_money + '元，是否继续支付？',
					success: res => {
						if (res.confirm) {
							this.openChoosePayment();
						}
					}
				})
			}
		},
		pay() {
			console.log('this pay');
			this.$api.sendRequest({
				url: '/api/order/pay',
				data: {
					order_ids: this.orderData.order_id
				},
				success: res => {
					if (res.code >= 0) {
						this.$refs.choosePaymentPopup.getPayInfo(res.data);
					} else {
						this.$util.showToast({
							title: res.message
						});
					}
				}
			})
		},
		cancelOrder() {
			console.log('coole go');
			//this.$refs.mescroll.refresh();
			},
		/**
		 * 关闭订单
		 * @param {Object} order_id
		 */
		orderClose(order_id, callback) {
			uni.showModal({
				title: '提示',
				content: '您确定要关闭该订单吗？',
				success: res => {
					if (res.confirm) {
						this.$api.sendRequest({
							url: '/api/order/close',
							data: {
								order_id
							},
							success: res => {
								if (res.code >= 0) {
									typeof callback == 'function' && callback();
								} else {
									this.$util.showToast({
										title: '当前订单可能存在拼团，维权等操作，' + res.message + '不可以关闭哦!',
										duration: 2000
									})
								}
							}
						})
					}
				}
			})
		},
		/**
		 * 订单收货
		 * @param {Object} order_id
		 */
		orderDelivery(order_id, callback) {
			uni.showModal({
				title: '提示',
				content: '您确定已经收到货物了吗？',
				success: res => {
					if (res.confirm) {
						this.$api.sendRequest({
							url: '/api/order/takedelivery',
							data: {
								order_id
							},
							success: res => {
								this.$util.showToast({
									title: res.message
								})
								typeof callback == 'function' && callback();
							}
						})
					}
				},
			})
		},
	}
}
