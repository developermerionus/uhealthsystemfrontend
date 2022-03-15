<template>
	<view class="container">
		<navbar></navbar>
		<view>
        <view class="content">
			<view class="ufp10bonusReport">
				<text>{{$lang('common.ufp10_bonus_detail')}}</text>	
			</view>
			<view class="wrap">
				<scroll-view scroll-x="true" class="kite-classify-scroll">
					<view class="yourBonus">
						{{$lang('common.yourUFP10Bonus')}}
					</view>
					<view class="box">
						<t-table border="0" border-color="#95b99e">
							<t-tr class="tableHeader">
								<t-th>{{$lang('common.peroid_start')}}</t-th>
								<t-th>{{$lang('common.peroid_end')}}</t-th>
								<t-th>{{$lang('common.peroid_activedWeek')}}</t-th>
								<t-th>{{$lang('common.ufp10_basic_bonus')}}</t-th>
								<t-th v-if="isPrime>0">{{$lang('common.ufp10_prime_bonus')}}</t-th>
								<t-th v-if="isPrime>0">{{$lang('common.ufp10_actived_recommends_total')}}</t-th>
								<t-th v-if="isPrime>0">{{$lang('common.ufp10_actived_recommends_right')}}</t-th>
								<t-th v-if="isPrime>0">{{$lang('common.ufp10_actived_recommends_left')}}</t-th>
								
							</t-tr>
							
							<view class="dividLine"></view>
							<t-tr v-for="(item,index) in showListOption" :key="item.start">
								<t-td>{{ item.start.slice(0,10)}}</t-td>
								<t-td>{{ item.end.slice(0,10)}}</t-td>
								<t-td>{{ item.actived_week }}</t-td>
								<t-td>{{ item.ufp10_basic_bonus }}</t-td>
								<t-td v-if="isPrime>0">{{ item.ufp10_prime_bonus }}</t-td>
								<t-td v-if="isPrime>0">{{ item.recommend_total }}</t-td>
								<t-td v-if="isPrime>0">{{ item.recommend_rtotal }}</t-td>
								<t-td v-if="isPrime>0">{{ item.recommend_ltotal }}</t-td>
								
							</t-tr>
						</t-table>
					</view>
				</scroll-view>
			</view>
		</view>
		</view>
		<view class="copyRight">
			<ns-copy-right></ns-copy-right>
		</view>
	</view>
</template>

<script>
	import tTable from '@/components/t-table/t-table.vue';
	import tTh from '@/components/t-table/t-th.vue';
	import tTr from '@/components/t-table/t-tr.vue';
	import tTd from '@/components/t-table/t-td.vue';
	import nsCopyRight from '@/components/ns-copyright/ns-copyright.vue';
	var _self;
	export default {
			components: {
				tTable,
				tTh,
				tTr,
				tTd,
				nsCopyRight
			},
			data() {
				return {
					showDefualtTextNum:-1,
					showListOption: [],
					optionRangeArr: [],
					isPrime: 0,
				};
			},
		    onShow(){
				_self = this;
				this.getUFP10Detail();
			},
			methods: {
				edit(item) {
					uni.showToast({
						title: item.name,
						icon: 'none'
					});
				},
				getUFP10Detail() {
					  this.$api.sendRequest({
						url: '/api/Member/ufp10_detail',
						success(res) {
							let newArr=[];
							// alert("关闭1");
							// console.log('res detail', res);
							if (res.code >= 0 && res.data && res.data.length!==0) {
								 newArr = res.data;
								 _self.showListOption = newArr;
								 // console.log('get showListOption', newArr);
								 _self.isPrime = newArr[0].prime?newArr[0].prime:0;
								 // console.log('get showListOption',  _self.isPrime);
							}	
						},
						fail: (err) => {
							// alert("关闭2")
						}
					});
					
				},

				}
		};
</script>

<style lang="scss">
.container {
	max-width: 1200px;
	margin: 0 auto;
	.content {
		width:100%;
		margin:0  auto;
		.ufp10bonusReport {
			margin:10px 0px 10px 15px;
			font: 500 24px/36px Roboto,Helvetica,Arial,sans-serif;
			font-weight: 400;
			color: #444;
	
		}
		
		.wrap {
			margin-top:15px;
			flex-direction: column;
			box-sizing: border-box;
			display: flex;
			flex: 1 1 100%;
			max-width: 100%;
			position: relative;
			z-index: 1;
			display: block;
			height: 100%;
			overflow: auto;
			font-size: 14px;
			font-family: gotham ssm a,gotham ssm b,raleway,sans-serif!important;
			line-height: 18px;
			box-shadow: 0 3px 1px -2px #00000033, 0 2px 2px 0 #00000024, 0 1px 5px 0 #0000001f;
			.yourBonus {
				background: #fafafa;
				color: rgba(0,0,0,.54);
				position: relative;
				z-index: 101;
				flex-direction: row;
				box-sizing: border-box;
				display: flex;
				place-content: center space-between;
				align-items: center;
				min-height: 44px !important;
				max-height: 44px !important;
				height: 44px !important;
				padding: 0 16px;
				width: 100%;
				white-space: nowrap;
				font-weight: 500!important;
				font-family: gotham ssm a,gotham ssm b,raleway,sans-serif!important;
				font: 500 20px/32px Roboto,Helvetica,Arial,sans-serif;
				margin: 0;
				box-shadow: 0 2px 1px -1px #00000033, 0 1px 1px 0 #00000024, 0 1px 3px 0 #0000001f;
			}
			.dividLine {
				border-bottom: solid 0.00001px rgba(0, 0, 0, 0.12);
			}
			.tableHeader {
				.t-th {
					color: #1767b3;
					font-size: 14px;
					font-weight: 500;
				}
				    
			}
		}
		
	}
}
	.copyRight {
		margin: 20px 0;
		padding-bottom: 3px;
	}
	
	
	.kite-classify-scroll {
		min-width:1000px;
	}
	
	@media screen and (min-width: 600px) and (max-width: 1000px){
	   .container {
			.content {
				width:95%;
			}
		}
	
	}

	@media screen and (max-width: 700px) {
	   .container {
		   .content{
			   .ufp10bonusReport {
				   margin-left:15px;
			   }

			   .wrap {
			   	margin-top:15px;
			   }
		   }
	   }
	}
	
</style>
