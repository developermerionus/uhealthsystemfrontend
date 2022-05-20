<template>
	<!-- <view class= "container">
		<view ref="input" class="input">
			<text>物流上传  CSV file</text> 
		</view> -->
	<view class="container">
		<h2>Delivery Department File Upload</h2>
		<!-- Upload  -->
		<form id="file-upload-form" class="uploader">
			<input id="file-upload" type="file" name="fileUpload" accept="image/*" />

			<label for="file-upload" id="file-drag">
				<img id="file-image" src="#" alt="Preview" class="hidden">
				<div id="start">
					<i class="fa fa-download" aria-hidden="true"></i>
					<div>Select a file</div>
					<div id="notimage" class="hidden">Please select an image</div>
					<!-- <view id="file-upload-btn" class="btn btn-primary input" ref="input" >Select a file</view> -->
					<view ref="input" class="btn btn-primary input">

					</view>
				</div>
				<div id="response" class="hidden">
					<div id="messages"></div>
					<progress class="progress" id="file-progress" value="0">
						<span>0</span>%
					</progress>
				</div>
			</label>
		</form>
		<view class="comment">
			<view><span class="star">*</span> 第一栏 名字 必须是 deliverynum <text class="copy"
					@click="$util.copy('deliverynum')">copy{{$lang('copy')}}</text></view>
			<view><span class="star">*</span> 第二栏 名字 必须是 ordernum <text class="copy"
					@click="$util.copy('ordernum')">copy{{$lang('copy')}}</text></view>
			<view><span class="star">*</span> 第三栏 名字 必须是 companyName <text class="copy"
					@click="$util.copy('companyName')">copy{{$lang('copy')}}</text></view>
			<view><span>快递公司名称：</span>
				shundaexpress <text class="copy" @click="$util.copy('shundaexpress')">copy{{$lang('copy')}}</text>
				shundaexpress_nmn <text class="copy"
					@click="$util.copy('shundaexpress_nmn')">copy{{$lang('copy')}}</text>
				ups <text class="copy" @click="$util.copy('ups')">copy{{$lang('copy')}}</text>
				ezgo <text class="copy" @click="$util.copy('ezgo')">copy{{$lang('copy')}}</text>
				fafa <text class="copy" @click="$util.copy('fafa')">copy{{$lang('copy')}}</text>
				baitong <text class="copy" @click="$util.copy('baitong')">copy{{$lang('copy')}}</text>
				fedex <text class="copy" @click="$util.copy('fedex')">copy{{$lang('copy')}}</text>
			</view>
			<view>
				shunfeng <text class="copy" @click="$util.copy('shunfeng')">copy{{$lang('copy')}}</text>
				bangde <text class="copy" @click="$util.copy('bangde')">copy{{$lang('copy')}}</text>
				zhongtong <text class="copy" @click="$util.copy('zhongtong')">copy{{$lang('copy')}}</text>
				sanqianli <text class="copy" @click="$util.copy('sanqianli')">copy{{$lang('copy')}}</text>
				mingtong <text class="copy" @click="$util.copy('mingtong')">copy{{$lang('copy')}}</text>
			</view>
		</view>
		<view class='stock-table-container'>
			<h2 class="title">基础产品库存</h2>
			<table class='stock-table'>
				<thead>
					<tr>
						<th>商品ID</th>
						<th>商品名字</th>
						<th>现有库存</th>
						<th>待发货</th>
						<th>已发货</th>
					</tr>
				</thead>
				<tbody>
					<tr v-if='goodsBaseComponentsStock.length>0' v-for="(item,index) in goodsBaseComponentsStock" 
					:key="index">
						<td>{{ item.goods_id }}</td>
						<td>{{ item.goods_name }}</td>
						<td>{{ item.goods_stock }}</td>
						<td>{{ item.stock_onhold }}</td>
						<td>{{ item.stock_outbound }}</td>
					</tr>
				</tbody>
			</table>
		</view>
		<view class="block-store">
			<h2 class="title">出入库 库存调整</h2>
			<!-- Upload  -->
			<form id="file-upload-form" class="uploader">
				<label for="file-upload" id="file-drag">
					<view class="edit-info-box">
						<text class="info-name">{{$lang('common.status')}}</text>
						<view class="container_dropdown uni-input info-content input-len">
							<view class="uni-input-wrapper makecenter">
								<view class="status_warp  input-placeholder" @click="changeSaleStatus">
									<text>{{ good_status }}</text>
									<text class="triangleIncon" :style="{ transform: transformStyle }"></text>
								</view>
								<!-- 下拉菜单start -->
								<view class="dropdown" :class="{ show: dropdown.show }">
									<view class="" @click="closeDropdown"></view>
									<view class="dropdown-list">
										<view v-for="(title, key) of dropdown.options" :key="key"
											class="dropdown-list-cell" :class="{ active: dropdown.value === key }"
											@click="changeDropdown(key)">{{ title.value }}</view>
									</view>
								</view>
							</view>
							<!-- 下拉菜单end-->
						</view>
					</view>

					<view class="edit-info-box">
						<text class="info-name">{{$lang('common.deliveryNo')}}</text>
						<input class="uni-input info-content input-len" type="text" maxlength="30"
							:placeholder="$lang('common.deliveryNo')" v-model="formData.deliveryNo" />
					</view>
					<view class="edit-info-box">
						<text class="info-name">{{$lang('common.orderNo')}}</text>
						<input class="uni-input info-content input-len" type="text" maxlength="30"
							:placeholder="$lang('common.orderNo')" v-model="formData.orderNo" />
					</view>
					<view class="edit-info-box">
						<text class="info-name">{{$lang('common.nmn')}}</text>
						<input class="uni-input info-content input-len" type="number" maxlength="30"
							:placeholder="$lang('common.nmn')" v-model.number="formData.nmn" />
					</view>
					<view class="edit-info-box">
						<text class="info-name">{{$lang('common.np')}}</text>
						<input class="uni-input info-content input-len" type="number" maxlength="30"
							:placeholder="$lang('common.np')" v-model.number="formData.np" />
					</view>
					<view class="edit-info-box">
						<text class="info-name">{{$lang('common.cq')}}</text>
						<input class="uni-input info-content input-len" type="number" maxlength="30"
							:placeholder="$lang('common.cq')" v-model.number="formData.cq" />
					</view>
					<view class="edit-info-box">
						<text class="info-name">{{$lang('common.cr')}}</text>
						<input class="uni-input info-content input-len" type="number" maxlength="30"
							:placeholder="$lang('common.cr')" v-model.number="formData.cr" />
					</view>
					<view class="edit-info-box">
						<text class="info-name">{{$lang('common.adminName')}}</text>
						<input class="uni-input info-content input-len" type="text" maxlength="30"
							:placeholder="$lang('common.adminName')" v-model="formData.adminName" />
					</view>
					<view class="edit-info-box">
						<text class="info-name">{{$lang('common.memo')}}</text>
						<input class="uni-input info-content input-len" type="text" maxlength="30"
							:placeholder="$lang('common.memo')" v-model="formData.memo" />
					</view>
					<view class="save-item" @click="submitInfo">
						<button class="buttonColor">Submit</button>
					</view>
				</label>
			</form>
		</view>
	</view>
	</view>
	<!-- </view> -->

</template>

<script>
	let _self;
	export default {
		data() {
			return {
				dropdown: {
					show: false,
					options: [{
							num: '4',
							value: "批量入库"
						},
						{
							num: '3',
							value: "退单入库"
						},
						{
							num: '5',
							value: "无订单号出库"
						},
						{
							num: '6',
							value: "有订单号出库"
						},
					],
					value: 0,
				},
				good_status: "批量入库",
				transformStyle: "rotate(0deg)",
				token: '',
				formData: {
					status: '4',
					orderNo: '',
					deliveryNo: '',
					nmn: 0,
					np: 0,
					cq: 0,
					cr: 0,
					adminName: '',
					memo: ''
				},
				goodsBaseComponentsStock: [],
			}
		},
		// uni-app input does not support type="file" type so it needs to be created by js
		mounted() {
			// Create attachment upload
			var _self = this;
			var input = document.createElement('input'); //Create element
			input.type = 'file' //Add file type
			//input.className = "btn btn-primary input"
			input.onchange = (event) => {
				_self.upFile(input, event)
			}
			this.$refs.input.$el.appendChild(input)
		},
		onShow() {
			_self = this;
			this.checkToken();
			this.getGoodsBaseComponentsStock();
		},
		//Upload
		methods: {
			// 打开下拉框
			changeSaleStatus() {
				// console.log('changeSaleStatus');
				this.dropdown.show = !this.dropdown.show;
				// console.log(this.dropdown.show);
				this.transformStyle = this.dropdown.show ?
					"rotate(180deg)" :
					"rotate(0deg)";
			},
			// 关闭下拉列表
			closeDropdown() {
				// console.log('clicke');
				this.dropdown.show = false;
				this.transformStyle = this.dropdown.show ?
					"rotate(180deg)" :
					"rotate(0deg)";
			},
			// 选择销售中/下架选项
			changeDropdown(key) {
				// console.log(key);
				this.dropdown.value = key;
				this.good_status = this.dropdown.options[key].value;
				this.formData.status = this.dropdown.options[key].num;
				this.closeDropdown();
				uni.showToast({
					title: this.good_status,
					duration: 2000,
				});
			},
			submitInfo() {
				this.$api.sendRequest({
					url: '/api/order/modifyGoodsStockByBaseComponents',
					data: {
						status: this.formData.status,
						orderNo: this.formData.orderNo,
						deliveryNo: this.formData.deliveryNo,
						nmn: this.formData.nmn != '' ? this.formData.nmn : 0,
						np: this.formData.np != '' ? this.formData.np : 0,
						cq: this.formData.cq != '' ? this.formData.cq : 0,
						cr: this.formData.cr != '' ? this.formData.cr : 0,
						adminName: this.formData.adminName,
						memo: this.formData.memo
					},
					success: res => {
						// console.log(res);
						if (res.code >= 0 && res.data) {
							_self.$util.showToastLonger({
								title: '数据更新成功'
							}, 3000);
						} else {
							_self.$util.showToastLonger({
								title: '数据更新失败'
							}, 3000);
						}
					}
				});
			},
			checkToken() {
				_self.token = uni.getStorageSync('token');
				// console.log('self token ', _self.token);
				if (!_self.token) {
					// console.log('call token');
					uni.redirectTo({
						url: '/pages/login/login/login'
					});
				}
			},
			upFile(input, event) {
				//console.log('config.baseurl', this.$config.baseUrl);
				let url = this.$config.baseUrl + '/api/upload/uploadCsvFile';
				var _self = this;
				uni.uploadFile({
					url: url,
					files: [{
						file: input.files[0],
						uri: event.srcElement.value
					}],
					success: (uploadFileRes) => {
						//	console.log('success', uploadFileRes, JSON.parse(uploadFileRes.data));
						let res = JSON.parse(uploadFileRes.data);
						//console.log('res',res);
						if (res.code == 10066) {
							this.updateDatabase();
							// console.log('csv file get uploaded successfully');
							_self.$util.showToastLonger({
								title: res.message
							}, 3000);
						} else {
							// console.log(res.errMsg);
							_self.$util.showToastLonger({
								title: res.message
							}, 3000);
						}
					},
					fail: (err) => {
						console.log('error', err);
					}
				});
				//this.$util.upload_file_server(tempFilePath, data, path, url = "")

			},
			updateDatabase() {
				this.$api.sendRequest({
					url: '/api/order/scanDeliveryTable',
					success(res) {
						// console.log('数据更新', res);
						if (res === 'success') {
							_self.$util.showToastLonger({
								title: '数据更新成功'
							}, 3000);
						} else {
							_self.$util.showToastLonger({
								title: '数据更新失败'
							}, 3000);
						}
					},
					fail: (err) => {
						// alert("关闭2")
					}
				});
			},
			upload_file_server(tempFilePath, data, path, url = "") {
				if (url) {
					var uploadUrl = Config.baseUrl + url
				} else {
					var uploadUrl = Config.baseUrl + '/api/upload/' + path
				}
				return new Promise((resolve, reject) => {
					uni.uploadFile({
						url: uploadUrl,
						filePath: tempFilePath,
						name: 'file',
						formData: data,
						success: function(res) {
							var path_str = JSON.parse(res.data);
							if (path_str.code >= 0) {
								resolve(path_str.data.pic_path);
							} else {
								reject("error");
							}
						}
					});

				});

			},
			
			getGoodsBaseComponentsStock() {
				this.$api.sendRequest({
					url: '/api/order/getGoodsBaseComponentsStock',
					success(res) {
						if (res.code >= 0 && res.data && res.data.length!==0) {
							_self.goodsBaseComponentsStock = res.data;
							}	
					},
					fail: (err) => {
						// alert("关闭2")
					}
				});
			},
			
		}

	}
</script>

<style lang="scss">
	.save-item {
		margin-top: 20px;
	}

	.uni-input-placeholder {
		font-size: 13px !important;
	}

	.title {
		margin-bottom: 10px;
	}

	.buttonColor {
		background-color: #454cad;
		color: white;
	}

	.edit-info-box {
		margin-top: 20rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 40rpx;
		min-height: 50rpx;
		background-color: #fff;

		.info-name {
			width: 150rpx;
			font-size: $font-size-base;
			text-align: left;
		}

		.info-content {
			&:first-of-type {
				// width: auto !important;
			}

			margin-right: auto;
			width: 500rpx;
			font-size: $font-size-base;
			padding: 0;
		}

		.dynacode {
			margin: 0;
			padding: 0 10rpx;
			width: 250rpx;
			height: 60rpx;
			font-size: $font-size-base;
			line-height: 60rpx;
			color: #fff;
			word-break: break-all;
		}

		.edit-sex-list {
			display: flex;

			label {
				display: flex;
				margin-left: 30rpx;
				align-items: center;
			}
		}

	}

	.container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		text-align: center;
		margin: 0 auto;
		max-width: 1200px;
	}

	.copy {
		font-size: 15px;
		display: inline-block;
		color: #666;
		background: #f7f7f7;
		line-height: 1;
		padding: 3px 10px;
		margin: 0 15px 0 10px;
		border-radius: 18px;
		border: 0.5px solid #666;
	}

	.star {
		color: red;
	}

	.comment {
		margin-top: 20px;
	}

	// Imports
	// 
	@import url(https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css);
	@import url('https://fonts.googleapis.com/css?family=Roboto');

	// Vars and Reset
	// 
	$theme: #454cad;
	$dark-text: #5f6982;

	html,
	body,
	* {
		box-sizing: border-box;
		font-size: 16px;
	}

	html,
	body {
		height: 100%;
		text-align: center;
	}

	body {
		padding: 2rem;
		background: #f8f8f8;
	}

	h2 {
		font-family: "Roboto", sans-serif;
		font-size: 26px;
		line-height: 1;
		color: $theme;
		margin-bottom: 0;
	}

	p {
		font-family: "Roboto", sans-serif;
		font-size: 18px;
		color: $dark-text;
	}

	.container_dropdown {
		position: relative;
	}

	.makecenter {
		display: flex;
		align-items: center;
	}

	// 这是tab栏的样式  (不重要)
	.status_warp {
		padding: 0 30px;
		width: 100%;
		text-align: center;
		height: 50px;
		line-height: 50px;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #eeeeee;
		;

		.triangleIncon {
			margin-left: 14rpx;
			width: 14px;
			height: 14px;
			background-size: contain;
			transition: all 0.25s ease-in-out 1;
			background: url("../../static/triangle.png") no-repeat;
			background-size: contain;
		}

	}

	/*  下拉遮罩层 (这里才是最重要的) */
	.dropdown {
		display: none;
		justify-content: center;
		z-index: 999;
		position: absolute;
		top: 60px; //这是相对于tab栏的高度做的定位
		left: 0;
		width: 100%;
		height: 100%;
		transition-duration: 0.25s;

		&.show {
			display: flex;
			visibility: visible;

			.dropdown-mask {
				opacity: 1;
			}

			.dropdown-list {

				display: block;
			}
		}

		// 全遮罩层
		.dropdown-mask {
			position: fixed;
			width: 100vw;
			height: 100vh;
			// background-color: rgba(0, 0, 0, 0.4);
			transition-property: opacity;
			transition-duration: 0.4s;
			opacity: 0;
			top: 70rpx;
			left: 0;
		}

		// 下拉框样式
		.dropdown-list {
			position: relative;
			top: 201px;
			background-color: #eeeeee;
			transition-property: transform, opacity;
			transition-duration: 0.4s;
			display: none;
			width: 100%;
			height: 210px;
			transform: translateY(-100%);

			.dropdown-list-cell {
				line-height: 50px;
				color: #333;
				padding: 0 30rpx;
				border-bottom: 1rpx solid #eee;
				position: relative;

				&.active::after {
					content: "";
					position: absolute;
					//right: 30rpx;
					top: 50%;
					width: 32px;
					height: 32px;
					transform: translateY(-50%);
					background: url("../../static/checkmark3.png") no-repeat;
					background-size: contain;
				}
			}
		}
	}


	.popup-footer {
		height: 100rpx;

		.confirm-btn {
			height: 72rpx;
			line-height: 72rpx;
			color: #fff;
			text-align: center;
			margin: 20rpx 30rpx 0;
			border-radius: 40rpx;
		}

		&.bottom-safe-area {
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);
		}

		.color-based-bg {
			background-color: $theme;
		}
	}

	.block-store {
		margin-top: 30px;
	}

	// Upload Demo
	// 
	.uploader {
		display: block;
		clear: both;
		margin: 0 auto;
		width: 100%;
		max-width: 600px;

		label {
			float: left;
			clear: both;
			width: 100%;
			padding: 2rem 1.5rem;
			text-align: center;
			background: #fff;
			border-radius: 7px;
			border: 3px solid #eee;
			transition: all .2s ease;
			user-select: none;

			&:hover {
				border-color: $theme;
			}

			&.hover {
				border: 3px solid $theme;
				box-shadow: inset 0 0 0 6px #eee;

				#start {
					i.fa {
						transform: scale(0.8);
						opacity: 0.3;
					}
				}
			}
		}

		#start {
			float: left;
			clear: both;
			width: 100%;

			&.hidden {
				display: none;
			}

			i.fa {
				font-size: 50px;
				margin-bottom: 1rem;
				transition: all .2s ease-in-out;
			}
		}

		#response {
			float: left;
			clear: both;
			width: 100%;

			&.hidden {
				display: none;
			}

			#messages {
				margin-bottom: .5rem;
			}
		}

		#file-image {
			display: inline;
			margin: 0 auto .5rem auto;
			width: auto;
			height: auto;
			max-width: 180px;

			&.hidden {
				display: none;
			}
		}

		#notimage {
			display: block;
			float: left;
			clear: both;
			width: 100%;

			&.hidden {
				display: none;
			}
		}

		progress,
		.progress {
			// appearance: none;
			display: inline;
			clear: both;
			margin: 0 auto;
			width: 100%;
			max-width: 180px;
			height: 8px;
			border: 0;
			border-radius: 4px;
			background-color: #eee;
			overflow: hidden;
		}

		.progress[value]::-webkit-progress-bar {
			border-radius: 4px;
			background-color: #eee;
		}

		.progress[value]::-webkit-progress-value {
			background: linear-gradient(to right, darken($theme, 8%) 0%, $theme 50%);
			border-radius: 4px;
		}

		.progress[value]::-moz-progress-bar {
			background: linear-gradient(to right, darken($theme, 8%) 0%, $theme 50%);
			border-radius: 4px;
		}

		input[type="file"] {
			display: none;
		}

		div {
			margin: 0 0 .5rem 0;
			color: $dark-text;
		}

		.btn {
			display: inline-block;
			margin: .5rem .5rem 1rem .5rem;
			clear: both;
			font-family: inherit;
			font-weight: 700;
			font-size: 14px;
			text-decoration: none;
			text-transform: initial;
			border: none;
			border-radius: .2rem;
			outline: none;
			padding: 0 1rem;
			height: 36px;
			line-height: 36px;
			color: #fff;
			transition: all 0.2s ease-in-out;
			box-sizing: border-box;
			background: $theme;
			border-color: $theme;
			cursor: pointer;
		}
	}
	
	.stock-table-container {
		max-width: 1000px;
		width: 100%;
		margin-top: 50px;
	}
	.stock-table {
		border: solid 2px gray;
		display: table;
		border-collapse: separate;
		border-spacing: 2px;
		width: 100%; 
		
		th {
		  border-bottom: 2px solid gray;
		}
		
		
		tr:nth-child(even) {
		  background-color: #f2f2f2;
		}
		
	}

</style>
