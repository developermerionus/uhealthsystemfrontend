<template>
	<view class="pick-regions">
		<picker mode="multiSelector" :value="multiIndex" :range="multiArray" @change="handleValueChange" @columnchange="handleColumnChange"><slot></slot></picker>
	</view>
</template>

<script>
export default {
	props: {
		defaultRegions: {
			type: Array
		},
		countryid: {
			type: [String,Number]
		},
	},
	data() {
		return {
			pickerValueArray: [],
			cityArr: [],
			districtArr: [],
			multiIndex: [0, 0, 0],
			isInitMultiArray: false,
			// 是否加载完默认地区
			isLoadDefaultAreas: false
		};
	},
	watch: {
		defaultRegions: {
			handler(arr, oldArr = []) {
				// 避免传的是字面量的时候重复触发
				if (arr.length !== 3 || arr.join('') === oldArr.join('')) return;
				this.handleDefaultRegions();
			},
			immediate: true
		},
		countryid: {
			handler(arr, oldArr = []) {
				this.getDefaultAreas(this.countryid, { level: 0 });
			},
			deep: true
		}
	},
	computed: {
		multiArray() {
			if (!this.isLoadDefaultAreas) return;
			var arr = this.pickedArr.map(arr => arr.map(item => item.label));
			return arr;
		},
		pickedArr() {
			// 进行初始化
			if (this.isInitMultiArray) {
				return [this.pickerValueArray[0], this.pickerValueArray[1], this.pickerValueArray[2]];
			}
			return [this.pickerValueArray[0], this.cityArr, this.districtArr];
		}
	},
	created() {
		this.getDefaultAreas(172, { level: 0 });
	},
	methods: {
		//刷新地址
		refreshAddress(countryid){
			// console.log(countryid);
			this.getAreas(countryid, res=>{
				this.handleDefaultRegions();
			});
		},
		async handleColumnChange(e) {
			this.isInitMultiArray = false;
			let col = e.detail.column;
			let row = e.detail.value;
			this.multiIndex[col] = row;
			switch (col) {
				case 0:
					//选择省，加载市、区县
					this.cityArr = await this.getAreasAsync(this.pickerValueArray[0][this.multiIndex[col]].value);
					if(this.cityArr.length != 0){
						this.districtArr = await this.getAreasAsync(this.cityArr[0].value);
					}else{
						this.districtArr = [];
					}
					break;
				case 1:
					//选择市，加载区县
					this.districtArr = await this.getAreasAsync(this.cityArr[this.multiIndex[col]].value);
					break;
				case 2:
					break;
			}
		},
		handleValueChange(e) {
			// 结构赋值
			let [index0, index1, index2] = e.detail.value;
			let [arr0, arr1, arr2] = this.pickedArr;
			let address = [arr0[index0], arr1[index1], arr2[index2]];
			this.$emit('getRegions', address);
		},
		handleDefaultRegions() {
			var time = setInterval(() => {
				if (!this.isLoadDefaultAreas) return;
				this.isInitMultiArray = false;
				for (let i = 0; i < this.defaultRegions.length; i++) {
					for (let j = 0; j < this.pickerValueArray[i].length; j++) {
						// 匹配省
						if (this.defaultRegions[i] == this.pickerValueArray[i][j].value && this.pickerValueArray[i][j].level == 1) {
							// 设置选中省
							this.$set(this.multiIndex, i, j);

							// 查询市
							this.getAreas(this.pickerValueArray[i][j].value, data => {
								this.cityArr = data;

								for (let k = 0; k < this.cityArr.length; k++) {
									if (this.defaultRegions[1] == this.cityArr[k].value) {
										// 设置选中市
										this.$set(this.multiIndex, 1, k);

										// 查询区县
										this.getAreas(this.cityArr[k].value, data => {
											this.districtArr = data;

											// 设置选中区县
											for (let u = 0; u < this.districtArr.length; u++) {
												if (this.defaultRegions[2] == this.districtArr[u].value) {
													this.$set(this.multiIndex, 2, u);
													this.handleValueChange({
														detail: {
															value: [j, k, u]
														}
													});
													break;
												}
											}
										});

										break;
									}
								}
							});
						}
					}
				}
				if (this.isLoadDefaultAreas) clearInterval(time);
			}, 100);
		},
		getDefaultAreas(pid, obj) {
			this.$api.sendRequest({
				url: '/api/address/lists',
				data: { pid: pid },
				success: res => {
					if (res.code == 0) {
						var data = [];
						var selected = undefined;
						res.data.forEach((item, index) => {
							if (obj != undefined) {
								if (obj.level == 0 && obj.province_id != undefined) {
									selected = obj.province_id;
								} else if (obj.level == 1 && obj.city_id != undefined) {
									selected = obj.city_id;
								} else if (obj.level == 2 && obj.district_id != undefined) {
									selected = obj.district_id;
								}
							}

							if (selected == undefined && index == 0) {
								selected = item.id;
							}
							data.push({
								value: item.id,
								label: item.name,
								level: item.level
							});
						});

						this.pickerValueArray[obj.level] = data;
						if (obj.level + 1 < 3) {
							obj.level++;
							if(!selected && obj.level == 2){
								this.cityArr = [];
								this.districtArr = [];
								return false;
							}
							this.getDefaultAreas(selected, obj);
						} else {
							this.isInitMultiArray = true;
							this.isLoadDefaultAreas = true;
						}
					}
				}
			});
		},
		// 同步获取地区
		async getAreasAsync(pid) {
			let res = await this.$api.sendRequest({
				url: '/api/address/lists',
				data: { pid: pid },
				async: false
			});
			if (res.code == 0) {
				var data = [];
				res.data.forEach((item, index) => {
					data.push({
						value: item.id,
						label: item.name,
						level: item.level
					});
				});
				return data;
			}
		},
		// 异步获取地区
		getAreas(pid, callback) {
			this.$api.sendRequest({
				url: '/api/address/lists',
				data: { pid: pid },
				success: res => {
					if (res.code == 0) {
						var data = [];
						res.data.forEach((item, index) => {
							data.push({
								value: item.id,
								label: item.name,
								level: item.level
							});
						});
						if (callback) callback(data);
					}
				}
			});
		},
		
	}
};
</script>
