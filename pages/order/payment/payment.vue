<template>
	<view class="order-container" :class="{ 'safe-area': isIphoneX }" :data-theme="themeStyle">
		
		<!-- 选择地址 -->
		<template v-if="orderPaymentData.is_virtual == 0">
			<navbar></navbar>
			<view v-if="!setCard">
			<view class="address-box" v-if="orderPaymentData.delivery.delivery_type != 'store'">
				<view class="info-wrap" v-if="orderPaymentData.member_address" @click="selectAddress">
					<view class="icon-wrap"><text class="iconfont icondizhi"></text></view>
					<view class="content">
						<text
							class="name font-size-base">{{ orderPaymentData.member_address.name ? orderPaymentData.member_address.name : '' }}</text>
						<text
							class="font-size-base">{{ orderPaymentData.member_address.mobile ? orderPaymentData.member_address.mobile : '' }}</text>
						<text class="cell-more iconfont iconright"></text>
						<view class="desc-wrap" v-if='orderPaymentData.member_address.country_id==172'>
							{{ orderPaymentData.member_address.full_address ? orderPaymentData.member_address.full_address : '' }}
							{{ orderPaymentData.member_address.address ? orderPaymentData.member_address.address : '' }}
						</view>
						<view class="desc-wrap" v-else>
							{{ orderPaymentData.member_address.address ? orderPaymentData.member_address.address : '' }}
							{{ orderPaymentData.member_address.full_address ? orderPaymentData.member_address.full_address : '' }}
						</view>
					</view>
				</view>
				<view class="empty-wrap" v-else @click="selectAddress">
					<view class="icon-wrap">
						<view class="iconfont icondizhi empty"></view>
					</view>
					<view class="info">{{ $lang('common.set_address')}}</view>
					<view class="cell-more">
						<view class="iconfont iconright"></view>
					</view>
				</view>

				<!-- 外卖配送 -->
				<view class="local-box" v-if="orderPaymentData.delivery.delivery_type == 'local'">
					<view class="order-cell">
						<text class="tit">配送时间</text>
						<view class="box">
							<text v-if="timeInfo.showTime">{{ timeInfo.start_time + '-' + timeInfo.end_time }}</text>
							<text v-if="deliveryWeek">
								<template v-if="timeInfo.showTime">
									（
								</template>
								{{ deliveryWeek }}
								<template v-if="timeInfo.showTime">
									）
								</template>
							</text>
							<text v-if="!canLocalDelicery">（休息中）</text>
						</view>
					</view>
					<picker v-if="timeInfo.showTimeBar && orderPaymentData.member_address && canLocalDelicery"
						:value="orderCreateData.buyer_ask_delivery_time" mode="time" @change="bindTimeChange">
						<view class="pick-block">
							<view class="font-size-base">送达时间</view>
							<view class="time-picker">
								<text>{{ orderCreateData.buyer_ask_delivery_time }}</text>
								<text class="iconfont iconright cell-more"></text>
							</view>
						</view>
					</picker>
				</view>
			</view>

			<view class="mobile-wrap" v-if="orderPaymentData.delivery.delivery_type == 'store' && storeInfo.currStore">
				<view class="form-group">
					<text class="iconfont icondianhua2"></text>
					<text class="text">预留手机</text>
					<input type="number" maxlength="11" placeholder="请输入您的手机号码"
						placeholder-class="color-tip placeholder" class="input" v-model="member_address.mobile" />
				</view>
			</view>
			<!-- 配送方式修改 -->
			<view class="delivery-mode">
				<view class="head">
					<text class="iconfont iconwuliu"></text>
					<text>{{$lang('common.deliverymethod')}}</text>
					<radio-group @change="radioChange" class="radioGroup">
						<label class="selfPickup">
							<view>
								<radio value="delivery" :checked="current==='delivery'" />
							</view>
							<view class="radioWord">{{$lang("common.delivery")}}</view>
						</label>
						<label class="selfPickup">
							<view>
								<radio value="selfpickup" :checked="current==='selfpickup'" />
							</view>
							<view class="radioWord">{{$lang("common.selfpickup")}}</view>
						</label>
					</radio-group>
				</view>
			</view>



			<!-- 配送方式 -->
			<view class="delivery-mode" v-if="orderPaymentData.shop_goods_list.express_type.length > 1">
				<view class="head">
					<text class="iconfont iconwuliu"></text>
					<text>配送方式</text>
				</view>
				<view class="action">
					<button
						v-for="(deliveryItem, deliveryIndex) in orderPaymentData.shop_goods_list.express_type"
						:key="deliveryIndex"
						:type="deliveryItem.name == orderPaymentData.delivery.delivery_type ? 'primary' : 'default'"
						@click="selectDeliveryType(deliveryItem)"
						size="mini"
					>
						{{ deliveryItem.title }}
					</button>
				</view>
			</view>

			<!-- 选择门店 -->
			<view class="store-box" v-if="orderPaymentData.delivery.delivery_type == 'store'">
				<view v-if="storeInfo.currStore" @click="openSiteDelivery" class="store-info">
					<view v-if="storeInfo.currStore.store_image" class="icon img"><image :src="$util.img(storeInfo.currStore.store_image)" mode="aspectFill"></image></view>
					<view v-else class="icon"><view class="iconfont iconmendian"></view></view>
					<view class="info-wrap">
						<view class="title">
							<text>{{ storeInfo.currStore.store_name }}</text>
							<view class="cell-more iconfont iconright"></view>
						</view>
						<view class="store-detail">
							<view v-if="storeInfo.currStore.open_date">营业时间：{{ storeInfo.currStore.open_date }}</view>
							<view>地址：{{ storeInfo.currStore.full_address }} {{ storeInfo.currStore.address }}</view>
						</view>
					</view>
				</view>
				<view v-else class="empty">当前无自提门店，请选择其它配送方式</view>
			</view>
		    </view>
		</template>
		<view v-if="!setCard">
		<!-- 虚拟商品展示手机号 -->
		<view class="mobile-wrap" v-if="orderPaymentData.is_virtual == 1 && orderCreateData.member_address">
			<view class="tips color-base-text">购买虚拟类商品需填写手机号，方便商家与您联系</view>
			<view class="form-group">
				<text class="iconfont icondianhua2"></text>
				<text class="text">手机号码</text>
				<input type="number" maxlength="11" placeholder="请输入您的手机号码" placeholder-class="color-tip placeholder"
					class="input" v-model="orderCreateData.member_address.mobile" />
			</view>
		</view>

		<!-- 店铺 -->
		<view class="site-wrap">
			<view class="site-body">
				<!-- 商品 -->
				<view class="goods-wrap" v-for="(goodsItem, goodsIndex) in orderPaymentData.shop_goods_list.goods_list"
					:key="goodsIndex">
					<view class="goods-img" @click="navigateTo(goodsItem.sku_id)">
						<image :src="$util.img(goodsItem.sku_image, { size: 'mid' })" @error="imageError(goodsIndex)"
							mode="aspectFill"></image>
					</view>
					<view class="goods-info">
						<view @click="navigateTo(goodsItem.sku_id)" class="goods-name">{{ goodsItem.sku_name }}</view>
						<view class="sku" v-if="goodsItem.sku_spec_format">
							<view class="goods-spec">
								<block v-for="(x, i) in goodsItem.sku_spec_format" :key="i">
									{{ x.spec_value_name }} {{  goodsItem.sku_spec_format.length - 1  > i ? '; ' : '' }}
								</block>
							</view>
						</view>
						<view class="goods-sub-section">
							<view class="color-base-text">
								<text class="unit">{{ $lang('common.currencySymbol') }}</text>
								<text class="goods-price">{{ goodsItem.price }}</text>
							</view>
							<view>
								<text class="font-size-tag">x</text>
								<text class="font-size-base">{{ goodsItem.num }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="site-footer">
				<view class="order-cell coupon" v-if="orderPaymentData.shop_goods_list.coupon_list.length">
					<text class="tit">优惠券</text>
					<view class="box text-overflow" @click="openSiteCoupon()">
						<template v-if="orderPaymentData.coupon.coupon_id">
							<text>已使用优惠券，优惠</text>
							<text class="color-base-text unit">{{ $lang('common.currencySymbol') }}</text>
							<text class="color-base-text money">{{ orderPaymentData.coupon_money | moneyFormat }}</text>
						</template>
						<text v-else>不使用优惠券</text>
					</view>
					<text class="iconfont iconright"></text>
				</view>
				<view class="order-cell" v-if="promotionExits">
					<text class="tit">活动优惠</text>
					<view class="box text-overflow" @click="openSitePromotion()">
						<text>{{ orderPaymentData.shop_goods_list.promotion | promotion }}</text>
					</view>
					<text class="iconfont iconright"></text>
				</view>
				<view class="order-cell point" v-if="orderPaymentData.shop_goods_list.max_usable_point > 0">
					<text class="tit">
						<text>使用{{ orderPaymentData.shop_goods_list.max_usable_point }}积分可抵扣</text>
						<text class="unit color-base-text">{{ $lang('common.currencySymbol') }}</text>
						<text class="money color-base-text">{{ orderPaymentData.point_money | moneyFormat }}</text>
					</text>
					<view class="box"></view>
					<ns-switch class="balance-switch" @change="usePoint" :checked="orderCreateData.is_point == 1">
					</ns-switch>
				</view>
				<!-- <view class="order-cell order-invoice-cell" v-if="orderPaymentData.shop_goods_list.invoice">
					<text class="tit">发票</text>
					<view class="box text-overflow" @click="openPopup('invoicePopup')">
						<text v-if="orderCreateData.is_invoice == 1">{{ orderCreateData.invoice_type == 1 ? '纸质' : '电子' }}发票({{ orderCreateData.invoice_content }})</text>
						<text v-else>无需发票</text>
					</view>
					<text class="iconfont iconright"></text>
				</view> -->
				<view class="order-cell">
					<text class="tit">{{$lang('common.buyer_memo')}}</text>
					<view class="box"><input type="text" :placeholder="$lang('common.remark')"
							placeholder-class="color-tip" v-model="orderCreateData.buyer_message" /></view>
				</view>
				<view class="order-cell clear-flex" v-if="orderPaymentData.recommend_member_card">
					<text class="tit">会员优惠</text>
					<view class="box member-card-wrap">
						<view class="head" @click="selectMemberCard">
							<text class="iconfont iconhuiyuan"></text>
							<view class="info">
								开通{{ orderPaymentData.recommend_member_card.level_name }}<text>本单预计可省{{ orderPaymentData.recommend_member_card.discount_money|moneyFormat }}元</text>
							</view>
							<text class="iconfont"
								:class="orderPaymentData.is_open_card == 1 ? 'iconyuan_checked color-base-text' : 'iconyuan_checkbox'"></text>
						</view>
						<view class="body" v-if="orderCreateData.is_open_card">
							<view class="item"
								:class="{'active color-base-border': item.key == orderPaymentData.member_card_unit }"
								v-for="(item, index) in cardChargeType" :key="index"
								@click="selectMembercardUnit(item.key)">
								<view class="title">{{ item.title }}</view>
								<view class="price">
									{{ $lang('common.currencySymbol') }}{{ parseFloat(item.value) }}/{{ item.unit }}
								</view>
								<text class="iconfont iconicon color-base-text"></text>
							</view>
						</view>
					</view>
				</view>

			</view>
		</view>

		<!-- 订单金额 -->
		<view class="order-money">
			<view class="order-cell">
				<text class="tit">{{ $lang('common.amount')}}</text>
				<view class="box color-title">
					<text class="unit">{{ $lang('common.currencySymbol') }}</text>
					<text class="money">{{ orderPaymentData.goods_money | moneyFormat }}</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderPaymentData.is_virtual == 0 && orderPaymentData.delivery_money > 0">
				<text class="tit">{{ $lang('common.fare')}}</text>
				<view class="box color-base-text">
					<text class="operator">+</text>
					<text class="unit">{{ $lang('common.currencySymbol') }}</text>
					<text class="money">{{ orderPaymentData.delivery_money | moneyFormat }}</text>

				</view>

			</view>
			<!-- <view class="selfPickUp" v-if="orderPaymentData.is_virtual == 0 && orderPaymentData.delivery_money > 0">
				<text>如可自取，免运费。只需修改您的邮寄地址，国家名一栏，选第一个选项 “selfPickUp 自取”</text></view> -->
			<!-- <view class="order-cell" v-if="orderCreateData.is_invoice && orderPaymentData.invoice_money > 0"> -->
		<!-- 	<view class="order-cell" v-if="orderPaymentData.invoice_money > 0"> -->
			<view class="order-cell" >
				<text class="tit">
					<text>{{ $lang('common.tax')}}</text>
					<!-- <text class="color-base-text font-bold">({{ orderPaymentData.shop_goods_list.invoice.invoice_rate }}%)</text> -->
				</text>
				<view class="box color-base-text">
					<text class="operator">+</text>
					<text class="unit">{{ $lang('common.currencySymbol') }}</text>
					<text class="money">{{ orderPaymentData.invoice_money | moneyFormat }}</text>

				</view>

			</view>
			<view class="order-cell" v-if="orderCreateData.is_invoice && orderPaymentData.invoice_delivery_money > 0">
				<text class="tit">发票邮寄费</text>
				<view class="box color-base-text">
					<text class="operator">+</text>
					<text class="unit">{{ $lang('common.currencySymbol') }}</text>
					<text class="money">{{ orderPaymentData.invoice_delivery_money | moneyFormat }}</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderPaymentData.promotion_money > 0">
				<text class="tit">优惠</text>
				<view class="box color-base-text">
					<text class="operator">-</text>
					<text class="unit">{{ $lang('common.currencySymbol') }}</text>
					<text class="money">{{ orderPaymentData.promotion_money | moneyFormat }}</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderPaymentData.coupon_money > 0">
				<text class="tit">优惠券</text>
				<view class="box color-base-text">
					<text class="operator">-</text>
					<text class="unit">{{ $lang('common.currencySymbol') }}</text>
					<text class="money">{{ orderPaymentData.coupon_money | moneyFormat }}</text>
				</view>
			</view>
			<!-- <view class="order-cell" v-if="orderPaymentData.balance_money > 0">
				<text class="tit">使用余额</text>
				<view class="box color-base-text">
					<text class="operator">-</text>
					<text class="unit">{{ $lang('common.currencySymbol') }}</text>
					<text class="money">{{ orderPaymentData.balance_money | moneyFormat }}</text>
				</view>
			</view> -->
			<view class="order-cell" v-if="orderPaymentData.point_money > 0">
				<text class="tit">积分抵扣</text>
				<view class="box color-base-text">
					<text class="operator">-</text>
					<text class="unit">{{ $lang('common.currencySymbol') }}</text>
					<text class="money">{{ orderPaymentData.point_money | moneyFormat }}</text>
				</view>
			</view>
			<view class="order-cell" v-if="orderPaymentData.member_card_money > 0">
				<text class="tit">会员卡</text>
				<view class="box color-base-text">
					<text class="operator">+</text>
					<text class="unit">{{ $lang('common.currencySymbol') }}</text>
					<text class="money">{{ orderPaymentData.member_card_money | moneyFormat }}</text>
				</view>
			</view>
		</view>

		<view class="order-submit" :class="{ 'bottom-safe-area': isIphoneX }">
			<view class="order-settlement-info">
				<text
					class="font-size-base color-tip margin-right">{{$lang('common.total')}}{{ orderPaymentData.goods_num }}{{$lang('common.num_of_buy')}}</text>
				<text class="font-size-base">{{$lang('common.total_amount')}}：</text>
				<text class="color-base-text unit">{{ $lang('common.currencySymbol') }}</text>
				<text class="color-base-text money">{{ orderPaymentData.pay_money | moneyFormat }}</text>
			</view>
			<view class="submit-btn"><button type="primary" size="mini"
					@click="openChoosePayment()">{{$lang('common.submit_payment')}}</button></view>
		</view>
		
		<view class="out-focus">
		<view class="agreeContract focus" :focus="focusFlag">
			<checkbox @click="checkboxChange" :checked="checkboxChecked" />
			{{$lang('common.agree')}}
			<!-- <button @click="readContract">{{$lang('common.buy_agreement')}}</button> -->
			<button @click="openPopup">{{$lang('common.buy_agreement')}}</button>
			
			</view>
		
		<view v-show="showContract">
			<view class="textContent">
				<text>{{$lang('common.agreement')}}</text>
				<button type="primary" @click="agreeHandler">{{$lang('common.agree')}}</button> <button @click="cancelHandler()">{{$lang('common.disagree')}}</button>
			</view>
		</view>
		</view>
		<view @touchmove.prevent>
			<uni-popup ref="agrementPopup" type="center" :maskClick="false">
				<view class="conten-box"  v-show ="lang=='zh-cn'">
					<text class="iconfont iconclose" @click="toClose"></text>
					<view class="title">{{ buyAgreement_zh.title }}</view>
					<view class="con" >
						<scroll-view scroll-y="true" class="con">
							<rich-text :nodes="buyAgreement_zh.content">
							</rich-text>
						</scroll-view>
					</view>
				</view>
				<view class="conten-box" v-show ="lang=='en-us'">
					<text class="iconfont iconclose" @click="toClose"></text>
					<view class="title">{{ buyAgreement_en.title }}</view>
					<view class="con">
						<scroll-view scroll-y="true" class="con">
							<rich-text :nodes="buyAgreement_en.content">
							</rich-text>
						</scroll-view>
					</view>
				</view>
			</uni-popup>
		</view>
		
		<!-- 发票弹窗 -->
		<uni-popup ref="invoicePopup" type="bottom">
			<view :style="orderCreateData.is_invoice == 1 ? 'height: 83vh;' : 'height: 48vh;'"
				class="invoice-popup popup" @touchmove.prevent.stop>
				<view class="popup-header">
					<text class="tit">发票</text>
					<text class="iconfont iconclose" @click="closeInvoicePopup()"></text>
				</view>
				<scroll-view scroll-y="true" class="popup-body" :class="{ 'safe-area': isIphoneX }">
					<view>
						<view class="invoice-cell" v-if="orderPaymentData.shop_goods_list.invoice">
							<text class="tit">需要发票</text>
							<view class="option-grpup">
								<view class="option-item"
									:class="{ 'color-base-bg active': orderCreateData.is_invoice == 0 }"
									@click="changeIsInvoice">不需要</view>
								<view class="option-item"
									:class="{ 'color-base-bg active': orderCreateData.is_invoice == 1 }"
									@click="changeIsInvoice">需要</view>
							</view>
						</view>
						<block v-if="orderCreateData.is_invoice == 1">
							<view class="invoice-cell">
								<text class="tit">发票类型</text>
								<view class="option-grpup">
									<view class="option-item"
										:class="{ 'color-base-bg active': orderCreateData.invoice_type == 1 }"
										@click="changeInvoiceType(1)">纸质</view>
									<view class="option-item"
										:class="{ 'color-base-bg active': orderCreateData.invoice_type == 2 }"
										@click="changeInvoiceType(2)">电子</view>
								</view>
							</view>
							<view class="invoice-cell">
								<text class="tit">抬头类型</text>
								<view class="option-grpup">
									<view class="option-item"
										:class="{ 'color-base-bg active': orderCreateData.invoice_title_type == 1 }"
										@click="changeInvoiceTitleType(1)">
										个人
									</view>
									<view class="option-item"
										:class="{ 'color-base-bg active': orderCreateData.invoice_title_type == 2 }"
										@click="changeInvoiceTitleType(2)">
										企业
									</view>
								</view>
							</view>
							<!-- <view class="invoice-cell is-invoice" @click="changeIsTaxInvoice()">
								<text class="tit">需要增值税专用发票</text>
								<view class="box"></view>
								<switch color="#FF4544" class="balance-switch" :checked="orderCreateData.is_tax_invoice == 1" />
							</view> -->
							<view class="invoice-cell">
								<text class="tit">发票信息</text>
								<view class="invoice-form-group">
									<input type="text" placeholder="请填写抬头名称"
										v-model.trim="orderCreateData.invoice_title" />
									<input v-if="orderCreateData.invoice_title_type == 2" type="text"
										placeholder="请填写纳税人识别号" v-model.trim="orderCreateData.taxpayer_number" />
									<input type="text" placeholder="请填写邮寄地址"
										v-model.trim="orderCreateData.invoice_full_address"
										v-if="orderCreateData.invoice_type == 1" />
									<input type="text" placeholder="请填写邮箱" v-model.trim="orderCreateData.invoice_email"
										v-if="orderCreateData.invoice_type == 2" />
								</view>
							</view>
							<view class="invoice-cell">
								<text class="tit">发票内容</text>
								<view class="option-grpup">
									<view :key="index"
										v-for="(item, index) in orderPaymentData.shop_goods_list.invoice.invoice_content_array"
										:class="{ 'color-base-bg active': item == orderCreateData.invoice_content }"
										@click="changeInvoiceContent(item)" class="option-item content">
										{{ item }}
									</view>
								</view>
							</view>
						</block>
						<view class="invoice-tops">发票内容将以根据税法调整，具体请以展示为准，发票内容显示详细商品名 称及价格信息</view>
					</view>
				</scroll-view>
				<view class="popup-footer" @click="saveInvoice" :class="{ 'bottom-safe-area': isIphoneX }">
					<view class="confirm-btn color-base-bg">确定</view>
				</view>
			</view>
		</uni-popup>

		<!-- 优惠券弹窗 -->
		<uni-popup ref="couponPopup" type="bottom">
			<view class="coupon-popup popup" @touchmove.prevent.stop>
				<view class="popup-header">
					<text class="tit">优惠券</text>
					<text class="iconfont iconclose" @click="closePopup('couponPopup')"></text>
				</view>
				<scroll-view scroll-y="true" class="popup-body" :class="{ 'safe-area': isIphoneX }">
					<view class="coupon-item"
						v-for="(couponItem, couponIndex) in orderPaymentData.shop_goods_list.coupon_list"
						:key="couponIndex" @click="selectCoupon(couponItem)">
						<view class="coupon-info">
							<view class="info-wrap"
								:style="{ backgroundImage: 'url(' + $util.img('/upload/uniapp/coupon/bg_lingqu.png') + ')' }">
								<view class="coupon-money">
									<template v-if="couponItem.type == 'reward'">
										<text class="unit">{{ $lang('common.currencySymbol') }}</text>
										<text class="money">{{ parseFloat(couponItem.money) }}</text>
									</template>
									<template v-else-if="couponItem.type == 'discount'">
										<text class="money">{{ parseFloat(couponItem.discount) }}</text>
										<text class="unit">折</text>
									</template>
									<view class="at-least">
										<template v-if="couponItem.at_least > 0">
											满{{ couponItem.at_least }}可用
										</template>
										<template v-else>
											无门槛
										</template>
									</view>
								</view>
							</view>
							<view class="desc-wrap">
								<view class="coupon-name">{{ couponItem.coupon_name }}</view>
								<view v-if="couponItem.type == 'discount' && couponItem.discount_limit > 0"
									class="limit">最多可抵${{ couponItem.discount_limit }}</view>
								<view class="time font-size-goods-tag">
									有效期：{{ $util.timeStampTurnTime(couponItem.end_time) }}</view>
							</view>
							<view class="iconfont"
								:class="orderPaymentData.coupon.coupon_id == couponItem.coupon_id ? 'iconyuan_checked color-base-text' : 'iconyuan_checkbox'">
							</view>
						</view>
					</view>
				</scroll-view>
				<view class="popup-footer" :class="{ 'bottom-safe-area': isIphoneX }">
					<view class="confirm-btn color-base-bg" @click="popupConfirm('couponPopup')">确定</view>
				</view>
			</view>
		</uni-popup>

		<!-- 活动优惠弹窗 -->
		<uni-popup ref="sitePromotionPopup" type="bottom">
			<view class="promotion-popup popup">
				<view class="popup-header">
					<text class="tit">活动优惠</text>
					<text class="iconfont iconclose" @click="closePopup('sitePromotionPopup')"></text>
				</view>
				<scroll-view scroll-y="true" class="popup-body" :class="{ 'safe-area': isIphoneX }">
					<view>
						<block v-if="manjian.length">
							<view class="order-cell" v-for="(item, index) in manjian" :key="index">
								<text class="tit">
									<text class="promotion-mark ns-gradient-promotionpages-payment">满减送</text>
									{{ item.manjian_name }}
								</text>
								<view class="box" v-if="item.discount_array.real_discount_money > 0">
									<text class="unit color-base-text">- {{ $lang('common.currencySymbol') }}</text>
									<text
										class="money color-base-text">{{ item.discount_array.real_discount_money | moneyFormat }}</text>
								</view>
							</view>
						</block>
						<view class="order-cell" v-if="promotionList && promotionList.freeshipping != undefined">
							<text class="tit">
								<text class="promotion-mark ns-gradient-promotionpages-payment">满额包邮</text>
								满{{ promotionList.freeshipping.price }}元包邮
							</text>
							<view class="box"></view>
						</view>
					</view>
				</scroll-view>
				<view class="popup-footer" :class="{ 'bottom-safe-area': isIphoneX }">
					<view class="confirm-btn color-base-bg" @click="closePopup('sitePromotionPopup')">确定</view>
				</view>
			</view>
		</uni-popup>

		<!-- 门店列表弹窗 -->
		<uni-popup ref="deliveryPopup" type="bottom">
			<view class="delivery-popup popup">
				<view class="popup-header">
					<text class="tit">已为您甄选出附近所有相关门店</text>
					<text class="iconfont iconclose" @click="closePopup('deliveryPopup')"></text>
				</view>
				<view class="popup-body store-popup" :class="{ 'safe-area': isIphoneX }">
					<view class="delivery-content">
						<view class="item-wrap" v-for="(item, index) in storeInfo.storeList" :key="index"
							@click="selectPickupPoint(item)">
							<view class="detail">
								<view class="name"
									:class="item.store_id == orderPaymentData.delivery.store_id ? 'color-base-text' : ''">
									<text>{{ item.store_name }}</text>
									<text v-if="item.distance">({{ item.distance }}km)</text>
								</view>
								<view class="info">
									<view
										:class="item.store_id == orderPaymentData.delivery.store_id ? 'color-base-text' : ''"
										class="font-size-goods-tag">
										营业时间：{{ item.open_date }}
									</view>
									<!-- 	<view :class="item.store_id == orderPaymentData.delivery.store_id ? 'color-base-text' : ''" class="font-size-goods-tag">
										地址：{{ item.full_address }}{{ item.address }}
									</view> -->
									<view
										:class="item.store_id == orderPaymentData.delivery.store_id ? 'color-base-text' : ''"
										class="font-size-goods-tag">
										地址：{{ item.full_address }}
									</view>
								</view>
							</view>
							<view class="icon" v-if="item.store_id == orderPaymentData.delivery.store_id"><text
									class="iconfont iconyuan_checked color-base-text"></text></view>
						</view>
						<view v-if="!storeInfo.storeList" class="empty">所选择收货地址附近没有可以自提的门店</view>
					</view>
				</view>
			</view>
		</uni-popup>
     </view>
		<!-- 选择支付方式弹窗 -->
		<!-- <ns-payment ref="choosePaymentPopup" :isBalance="orderCreateData.is_balance" @useBalance="useBalance"
			:isPayPassWord="orderPaymentData.member_account.is_pay_password"
			:balanceDeduct="orderPaymentData.order_money > 0 && orderPaymentData.member_account.balance_total > 0 ? balanceDeduct : '0'"
			:payMoney="orderPaymentData.pay_money" @confirm="orderCreate"></ns-payment> -->
			<!-- <ns-payment
				ref="choosePaymentPopup"
				@cardFormDataHandler = "cardFormDataHandler"
				:cardFormData = "cardFormData"
				:isBalance="orderCreateData.is_balance"
				@useBalance="useBalance"
				:isPayPassWord="orderPaymentData.member_account.is_pay_password"
				:balanceDeduct="orderPaymentData.order_money <= orderPaymentData.member_account.balance_total ? balanceDeduct : '0'"
				:payMoney="orderPaymentData.pay_money"
				@confirm="orderCreate"
				@showHandler = "showHandler"
			></ns-payment> -->
			<ns-payment
				ref="choosePaymentPopup"
				@cardFormDataHandler = "cardFormDataHandler"
				:cardFormData = "cardFormData"
				:isBalance="orderCreateData.is_balance"
				:is_newCoupon="orderCreateData.is_newCoupon"
				@useBalance="useBalance"
				@useNewCoupon="useNewCoupon"
				:isPayPassWord="orderPaymentData.member_account.is_pay_password"
				:balanceDeduct="orderPaymentData.order_money > 0 ? balanceDeduct : '0'"
				:couponDeduct="orderPaymentData.order_money > 0 ? couponDeduct : '0'"
				:payMoney="orderPaymentData.pay_money"
				@confirm="orderCreate"
				@showHandler = "showHandler"
				@cancelorder="cancelOrder"
			></ns-payment>

		<loading-cover ref="loadingCover"></loading-cover>
		
	</view>
</template>

<script>
	import payment from '../public/js/payment.js';
	import uniPopup from '@/components/uni-popup/uni-popup.vue';
	import globalConfig from '@/common/js/golbalConfig.js';
	import nsSwitch from '@/components/ns-switch/ns-switch.vue';
	import nsPayment from '@/components/payment/payment.vue';

	export default {
		data() {
			return {
				lang:'',
				buyAgreement_zh: {
					title: '',
					content: ''
				},
				buyAgreement_en: {
					title: '',
					content: ''
				},
				focusFlag: false,
				showContract: false,
				checkboxChecked: false,
				cardFormData:{state:''},
				setCard: false,
				formData: {
					id: 0,
					name: '',
					mobile: '',
					telephone: '',
					country_id: 172,
					province_id: '',
					state: '',
					city_id: '',
					city: '',
					district_id: '',
					community_id: '',
					address: '',
					zipcode: '',
					full_address: '',
					latitude: 0,
					longitude: 0,
					is_default: 1,
					idNumber: '',
					firstname: '',
					lastname: ''
				},
				current: 'delivery',
				selfPickUpState: "California",
				selfPickUpCity: "West Covina",
				selfPickUpStreet: "100 N Barranca St. #100",
				selfPickUpZipCode: "91791",
				selfPickUp_country: 'SelfPickUp',
				selfPickUp_countryId: 0,
				pickupExist: false,
				selfPickUPIdForDefault: 0,
				preDefaultId: 0,
				addressIdArr: []
			}
		},
		components: {
			uniPopup,
			nsSwitch,
			nsPayment
		},
		mixins: [payment, globalConfig],
		onLoad(option) {
			this.getMemberInfo();
			this.formData.id = option.id;
			this.getUsStates(1);
			this.getCityListCA();
			this.getRegisiterAggrement();
		},
		onShow() {
			this.checkSelfPickupExist();
			
		},
		methods: {
			/**
			 * 展示购买协议
			 */
			openPopup() {
				this.$refs.agrementPopup.open();
				this.lang = uni.getStorageSync("lang");
			},
			/**
			 * 点击关闭协议
			 */
			toClose() {
				this.$refs.agrementPopup.close();
			},
			getRegisiterAggrement() {
				this.$api.sendRequest({
					url: '/api/register/buyAggrement_zh',
					success: res => {
						if (res.code >= 0) {
							this.buyAgreement_zh = res.data;
						}
					}
				});
				this.$api.sendRequest({
					url: '/api/register/buyAggrement_en',
					success: res => {
						if (res.code >= 0) {
							this.buyAgreement_en = res.data;
						}
					}
				});
				
			},
			
			showFocus() {
				this.focusFlag = false;
				this.$nextTick(function() {
					this.focusFlag = true;
					this.but();
				});
			},
			but() {
			
				uni.createSelectorQuery().select('.focus').boundingClientRect(data => {
					//目标位置的节点：类class或者id
					uni.createSelectorQuery().select(".out-focus").boundingClientRect(res => {
						//最外层盒子的节点：类class或者id
						uni.pageScrollTo({
			
							duration: 100, //过渡时间
							scrollTop:data.top+590 - res.top,//到达距离顶部的top值
							//scrollTop: data.top - res.top, //如果置顶
						})
					}).exec()
				}).exec();
			},
			readContract() {
				this.showContract = !this.showContract;
			},
			agreeHandler() {
				this.showContract = false;
				this.checkboxChecked = true;
			},
			checkboxChange() {
				this.checkboxChecked = !this.checkboxChecked;
				this.showContract = false;
				//console.log('this.checkboxChecked', this.checkboxChecked);
			},
			showHandler() {
				this.setCard=!this.setCard;
			},
			nameFormat(data) {
							//this.formData.name = res.data.marketCountryId===172?res.data.surname + res.data.firstname:res.data.surname + ' ' + res.data.firstname;
							if( data.marketCountryId === 172 || 
								data.marketCountryId === 228 ||
								data.marketCountryId === 10||
								data.marketCountryId === 131||
								data.marketCountryId === 139||
								data.marketCountryId === 144||
								data.marketCountryId === 221
								) {
									return data.surname + data.firstname;
								}
								else{
									return data.firstname +' '+data.surname;
								}
						},
			radioChange(evt) {
				this.current = evt.detail.value;
				if (!this.selfPickupExistInList && this.current === "selfpickup") {
					this.addSelfPickup();
				} else if (this.selfPickupExistInList && this.current === "selfpickup") {
					this.setDefault(this.selfPickUPIdForDefault);
				} else if (this.selfPickupExistInList && this.current === "delivery") {
					if (this.addressIdArr.length > 2 || this.addressIdArr.length === 1) {
						this.selectAddress();
					} else {
						let otherId = this.addressIdArr.find(el => el !== this.selfPickUPIdForDefault);
						this.setDefault(otherId);
					}
				}
			},
			setDefault(id) {
				this.$api.sendRequest({
					url: '/api/memberaddress/setdefault',
					data: {
						id
					},
					success: res => {
						uni.redirectTo({
							url: '/pages/order/payment/payment'
						});
					}
				})
			},
			addSelfPickup() {
				//addselfpickupinfo 
				let full_address = '';
				full_address = this.selfPickUpCity + ', ' + this.selfPickUpState +
					' ' + this.selfPickUpZipCode + ', ' + this.selfPickUp_country;
				let data = {
					name: this.formData.name,
					mobile: this.formData.mobile,
					telephone: this.formData.telephone,
					country_id: this.selfPickUp_countryId,
					province_id: 0,
					city_id: 0,
					district_id: 0,
					community_id: 0,
					address: this.selfPickUpStreet,
					full_address,
					latitude: this.formData.latitude,
					longitude: this.formData.longitude,
					//?
					is_default: this.formData.is_default,
					type: 1,
					idNumber: this.formData.idNumber,
					city: this.selfPickUpCity,
					state: this.selfPickUpState,
					zipcode: this.selfPickUpZipCode,
					id: 0
				};
				let url = 'add';
				this.$api.sendRequest({
					url: '/api/memberaddress/' + url,
					data: data,
					success: res => {
						this.selfPickupExistInList = true;
						 if(!this.formData.mobile) {
							this.fillupAddressInfo(res.data);
						 }
						 else {
							uni.redirectTo({
								url: '/pages/order/payment/payment'
							});
						}
					}
				})
			},
			fillupAddressInfo(selectedItemId){
				let data = {
						type: 1,
						addressLength: 3,
						back:'/pages/order/payment/payment',//come back address
						id: selectedItemId
					};
					this.$util.redirectTo('/otherpages/member/address_edit/address_edit', data);
				
			},
			checkSelfPickupExist() {
				this.$api.sendRequest({
					url: '/api/memberaddress/page',
					data: {
					},
					success: res => {
						let newArr = [];
						let msg = res.message;
						if (res.code == 0 && res.data) {
							newArr = res.data.list;
							let result
							this.addressIdArr =[];
							this.selfPickupExistInList = false;
							newArr.forEach(el => {
								if(this.addressIdArr.indexOf(el.id) === -1){
									this.addressIdArr.push(el.id);
								}
								if (el.country_id === 0) {
									this.selfPickupExistInList = true;
									this.selfPickUPIdForDefault = el.id;
								}
							})
						} else {
							this.$util.showToast({
								title: msg
							});
						}
					},
					fail: res => {

						if (this.$refs.loadingCover) this.$refs.loadingCover.hide();
					}
				});

			},
			getMemberInfo() {
				this.$api.sendRequest({
					url: '/api/member/info',
					success: res => {
						if (res.code == 0) {
							this.formData.idNumber = res.data.id_number;
							this.formData.name = this.nameFormat(res.data);
							this.formData.mobile = res.data.mobile;
							this.formData.telephone = '';
							this.formData.latitude = 0;
							this.formData.longitude = 0;
							this.formData.is_default = 1;
						}
					},
				})
			}
		}
		// onLoad() {
		// 	console.log(this.orderCreateData.is_invoice , this.orderPaymentData.invoice_money)
		// }, 


	}
</script>

<style lang="scss">
	@import './../../../common/css/order_parment.scss';
	.conten-box {
		background-color: #ffff;
		padding: 0 30rpx;
		box-sizing: border-box;
		height: 812rpx;
		width: 580rpx;
		border-radius: 10rpx;
	
		text {
			margin-top: 25rpx;
			float: right;
			line-height: 1;
		}
	
		.title {
			width: 100%;
			font-size: 36rpx;
			font-weight: bold;
			display: flex;
			align-items: center;
			justify-content: center;
			border-bottom: 1px solid #e0e0e0;
			line-height: 1;
			padding-bottom: 28rpx;
		}
	
		.content-con {
			width: 100%;
			height: 680rpx;
			box-sizing: border-box;
		}
	
		.con {
			width: 100%;
			height: 100%;
		}
	
		.sure {
			width: 100%;
			height: 100rpx;
			display: flex;
			justify-content: center;
			align-items: center;
	
			.sure-btn {
				width: 100%;
				height: 60rpx;
				border-radius: 60rpx;
				color: #ffffff;
				text-align: center;
				line-height: 60rpx;
			}
		}
	}
	
	.textContent {
		width: 80%;
		margin: 0 auto;
		button{
			margin-top:15px;
			}
	}
	.agreeContract {
		margin-top: 20rpx;
		display: flex;
		align-items: center;
		padding: 20rpx 40rpx;
		min-height: 50rpx;
		background-color: #fff;
		justify-content: flex-start;
	}
    .order-container {
		max-width: 1200px;
		margin:0 auto;
	}
	.selfPickup {
		display: flex;
		margin: 10px 0;
	}

	.radioWord {
		margin-left: 10px;
	}

	@media screen and (min-width:700px) {
		.radioGroup {
			display: flex;
			flex-direction: row;
		}

		.selfPickup {
			margin-right: 50px;
		}
		
	}
	
</style>
<style scoped>
	/deep/ .uni-popup__wrapper.uni-custom .uni-popup__wrapper-box {
		background: none;
		max-height: unset !important;
		overflow-y: hidden !important;
	}

	>>>.uni-popup__wrapper {
		border-radius: 20rpx 20rpx 0 0;
	}

	>>>.uni-popup {
		z-index: 1000;
	}
</style>
