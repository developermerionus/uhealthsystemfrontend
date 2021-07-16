<template>
	<view class="container">
		<navbar></navbar>
		<view>
        <view class="content">
			<view class="bonusReport">
				<text>{{$lang('common.bonus_report')}}</text>	
			</view>
		<view class="bonusTotal">
			
			<text class="bonusText">{{$lang('common.bonus_totoal')}}：${{totalBonus}}</text>	
			<!-- <select class="payTime minimal" @change="change">
			    <option value="" class="optionText">付款日期</option>
			    <option value="4weeks">Past 4 Weeks</option>
			    <option value="8weeks">Past 8 Weeks</option>
			    <option value="12weeks">Past 12 Weeks</option>
			    <option value="16weeks">Past 16 Weeks</option>
			</select> -->
			<select v-model="editSelectTypeLists" :label-in-value="true" class = "payTime minimal" @change="selectTypeChange" ref="addRequestState">
				<option v-for="(item,index) in optionRangeArr" :key="index" :value = "item.value">{{item.text}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item.date}}</option>
			</select>

		</view>
		 <view class="wrap">
			<scroll-view scroll-x="true" class="kite-classify-scroll">
			 <view class="yourBonus">
				{{$lang('common.your_bonus')}}
			 </view>
		        <view class="box">
		            <t-table border="0" border-color="#95b99e">
		               
						<t-tr class="tableHeader">
		                    <t-th>{{$lang('common.week_of_bonus')}}</t-th>
		                    <t-th>{{$lang('common.start_bonus')}}</t-th>
		                    <t-th>{{$lang('common.end_bonus')}}</t-th>
		                    <t-th>{{$lang('common.retail_bonus')}}</t-th>
							<t-th>{{$lang('common.fast_bonus')}}</t-th>
							<t-th>{{$lang('common.leadership_bonus')}}</t-th>
							<t-th>{{$lang('common.team_bonus')}}</t-th>
							<t-th>{{$lang('common.ranking_bonus')}}</t-th>
							<t-th>{{$lang('common.cash_bonus')}}</t-th>
		                </t-tr>
						
						<view class="dividLine"></view>
						<!-- <t-tr v-for="item in num" :key="item"><t-td>{{item}}</t-td></t-tr> -->
		                <t-tr v-for="(item,index) in showListOption" :key="item.start">
		                    <t-td>{{ item.week}}</t-td>
		                    <t-td>{{ item.start}}</t-td>
		                    <t-td>{{ item.end}}</t-td>
		                    <t-td>{{ item.fast_bonus }}</t-td>
							<t-td>{{ item.leadership_bonus }}</t-td>
							<t-td>{{ item.team_bonus }}</t-td>
							<t-td>{{ item.ranking_bonus }}</t-td>
							<t-td>{{ item.retail_bonus }}</t-td>
							<t-td>{{ item.cash_bonus }}</t-td>
		                </t-tr>
		            </t-table>
		        </view>
			</scroll-view>
		    </view>
			</view>
			</view>
	</view>
</template>

<script>
	import tTable from '@/components/t-table/t-table.vue';
	import tTh from '@/components/t-table/t-th.vue';
	import tTr from '@/components/t-table/t-tr.vue';
	import tTd from '@/components/t-table/t-td.vue';
	var _self;
	export default {
			components: {
				tTable,
				tTh,
				tTr,
				tTd
			},
			data() {
				return {
					showDefualtTextNum:-1,
					totalBonus: 0,
					showListOption: [],
					optionRangeArr: [],
					pastFourWeeks : [],
					pastEightWeeks: [],
					pastTwelvelWeeks: [],
					pastSixteenWeeks: [],
					allWeeksList : [],
					past_N_weeks:0,//0 stand for get all bonus detail
					selectTypeLists:[
										{value:"0",name:'银行卡提现（默认方式）'},
										{value:"1",name:'微信提现'}
									],
				};
			},
		    onShow(){
				_self = this;
				this.getBonusDetail();
				this.getBonusSum(0);
			},
			created() {
						this.editSelectTypeLists = _self.showDefualtTextNum; /* 默认选中 */
			        },
			methods: {
				selectTypeChange(){
								 console.log('this.$refs.addRequestState.value',this.$refs.addRequestState.value)
								 if(this.$refs.addRequestState.value==4){
									 this.showListOption = _self.pastFourWeeks;
									 this.getBonusSum(4);
									 console.log('_self.pastFourWeeks',_self.pastFourWeeks);
								 }
								 else if (this.$refs.addRequestState.value==8){
									 this.showListOption = _self.pastEightWeeks;
									 this.getBonusSum(8);
								 }
								 else if (this.$refs.addRequestState.value==12){
								 	 this.showListOption = _self.pastTwelvelWeeks;
									 this.getBonusSum(12);
								 }
								 else if (this.$refs.addRequestState.value==16){
								 	 this.showListOption = _self.pastSixteenWeeks;
									 this.getBonusSum(16);
								 }
								 else if (this.$refs.addRequestState.value==0){
								 	  this.showListOption = _self.allWeeksList;
									  this.getBonusSum(0);
								 }
								 },
				change(e) {
					//console.log('this.$refs.addRequestState.value',e.detail);
				},
				edit(item) {
					uni.showToast({
						title: item.name,
						icon: 'none'
					});
				},
				getBonusSum(showWeeks) {
					this.$api.sendRequest({
					url: '/api/Member/bonusSum',
					data: {
						past_N_weeks: showWeeks,
					},
					success(res) {
						_self.totalBonus = res.data[0].total? res.data[0].total:0;
						console.log('sum',_self.totalBonus);
						},
					fail: (err) => {
						// alert("关闭2")
						
					}
				})
				},
				getBonusDetail() {
					  this.$api.sendRequest({
						url: '/api/Member/bonus_detail',
						data: {
							past_N_weeks: this.past_N_weeks,
						},
						success(res) {
							let newArr=[];
							// alert("关闭1")
							console.log('res detail', res);
							if (res.code >= 0 && res.data && res.data.length!==0) {
								 newArr = res.data;
								 _self.showListOption = newArr;
								 _self.allWeeksList = [...newArr]; 
								 _self.dividToRange(newArr);
								}	
						},
						fail: (err) => {
							// alert("关闭2")
						}
					});
					
				},
				dividToRange(allArr) {
					let arr = [1,2,3];
					allArr.forEach((el, index)=> {
						if(index<4) {
							_self.pastFourWeeks.push(el);
						}
						if(index < 8) {
							_self.pastEightWeeks.push(el);
						}
						if(index < 12) {
							_self.pastTwelvelWeeks.push(el);
						}
						if(index<16) {
							_self.pastSixteenWeeks.push(el);
						}
					})
					_self.addRange (_self.pastFourWeeks, _self.pastEightWeeks, _self.pastTwelvelWeeks,_self.pastSixteenWeeks );
					console.log(_self.pastSixteenWeeks);
					},
					addRange (fourW, eightW, twelW,sixtW ){
						let rangeArr = [];
						rangeArr.push({value: _self.showDefualtTextNum, text: this.$lang("common.pay_time_bonus"), date: ''})
						rangeArr.push({value: 4, text:"Past 04 Weeks", date: fourW[fourW.length-1].start +" - "+ fourW[0].end })
						if(eightW.length>4 && eightW.length<9) {
						 rangeArr.push({value: 8, text:"Past 08 Weeks",  date: eightW[eightW.length-1].start +" - "+ eightW[0].end })
						}
						if(twelW.length>8 && twelW.length<13) {
						 rangeArr.push({value:12, text:"Past 12 Weeks", date:twelW[twelW.length-1].start +" - "+ twelW[0].end })
						}
						if(sixtW.length>12 && sixtW.length<17) {
						 rangeArr.push({value: 16, text:"Past 16 Weeks", date:sixtW[sixtW.length-1].start +" - "+ sixtW[0].end })
						}
						rangeArr.push({value: 0, text:"All", date:'' })
						
						_self.optionRangeArr = rangeArr;
							console.log(rangeArr);
					}
				}
		};
</script>

<style lang="scss">
	@import './css/bonusDetail.scss';
	.payTime {
		padding-top: 5px;
		font-weight: 400;
		font-size: 14px;
		width: 400px;
		height:40px;
		color: #1767b3;
		cursor: pointer;
		border-color: #0000001f;
		border-radius: 2.5%;
		padding:0 15px;
		
	}
	select.minimal {
	  background-image:
	    linear-gradient(45deg, transparent 50%, gray 50%),
	    linear-gradient(135deg, gray 50%, transparent 50%),
	    linear-gradient(to right, #ccc, #ccc);
	  background-position:
	    calc(100% - 20px) calc(1em + 2px),
	    calc(100% - 15px) calc(1em + 2px),
	    calc(100% - 2.5em) 0.5em;
	  background-size:
	    5px 5px,
	    5px 5px,
	    1px 1.5em;
	  background-repeat: no-repeat;
	}
	select {
		appearance: none;
	}
	
	.kite-classify-scroll {
		min-width:1000px;
	}
	@media screen and (max-width: 700px) {
	   .container {
		   .content{
			   .bonusReport {
				   margin-left:15px;
			   }
			   .bonusTotal {
			   	flex-direction: column;
				align-items: flex-start;
				height: 120px;
				.bonusText {
					margin-top: 15px;
				}
				.payTime {
					width: 100%;
					margin-bottom:18px;
				}
			   }
			   .wrap {
			   	margin-top:30px;
			   }
		   }
	   }
	}
	

</style>