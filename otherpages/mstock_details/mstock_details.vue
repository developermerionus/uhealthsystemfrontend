<template>
	<view class="container">
		<navbar></navbar>
		<view>
        <view class="content">
			<view class="mstockReport">
				<text>{{$lang('common.mstockDetailReport')}}</text>	
			</view>
			<view class="mstocktotal">
				<text class="eventTotalBonusText">{{$lang('common.mstockEventTotalBonus')}}: {{mstockEventTotalBonus}}</text>	
			</view>
			<view class="wrap">
				<scroll-view scroll-x="true" class="kite-classify-scroll">
					<view class="yourBonus">
						{{$lang('common.yourMStock')}}
					</view>
					<view class="box">
						<t-table border="0" border-color="#95b99e">
							<t-tr class="tableHeader">
								<t-th>{{$lang('common.week_of_bonus')}}</t-th>
								<t-th>{{$lang('common.start_bonus')}}</t-th>
								<t-th>{{$lang('common.end_bonus')}}</t-th>
								<t-th>{{$lang('common.mstock_sumBonus')}}</t-th>
								<t-th>{{$lang('common.mstock_newMemberBonus')}}</t-th>
								<t-th>{{$lang('common.mstock_activeMemberBonus')}}</t-th>
								<t-th>{{$lang('common.mstock_teamBonus')}}</t-th>
								<t-th>{{$lang('common.mstock_week_coef')}}</t-th>
							</t-tr>
							
							<view class="dividLine"></view>
							<t-tr v-for="(item,index) in showListOption" :key="item.start">
								<t-td>{{ item.week}}</t-td>
								<t-td>{{ item.start}}</t-td>
								<t-td>{{ item.end}}</t-td>
								<t-td>{{ item.mstock_sumBonus }}</t-td>
								<t-td>{{ item.mstock_newMemberBonus }}</t-td>
								<t-td>{{ item.mstock_activeMemberBonus }}</t-td>
								<t-td>{{ item.mstock_teamBonus }}</t-td>
								<t-td>{{ item.mstock_week_coef }}</t-td>
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
					mstockEventTotalBonus: 0,
					showListOption: [],
					optionRangeArr: [],
				};
			},
		    onShow(){
				_self = this;
				this.getMStockDetail();
				this.getMStockEventTotalBonus(); 
			},
			methods: {
				edit(item) {
					uni.showToast({
						title: item.name,
						icon: 'none'
					});
				},
				getMStockEventTotalBonus() {
					this.$api.sendRequest({
					url: '/api/Member/mstock_detailSum',
					success(res) {
						// console.log(res);
						_self.mstockEventTotalBonus = res.data[0].mstock_eventTotalBonus ? 
						res.data[0].mstock_eventTotalBonus : 0;
						},
					fail: (err) => {
						// alert("关闭2")
					}
				})
				},
				getMStockDetail() {
					  this.$api.sendRequest({
						url: '/api/Member/mstock_detail',
						success(res) {
							let newArr=[];
							// alert("关闭1")
							// console.log('res detail', res);
							if (res.code >= 0 && res.data && res.data.length!==0) {
								 newArr = res.data;
								 _self.showListOption = newArr;
								 // console.log('get showListOption', _self.showListOption);
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
		.mstockReport {
			margin:10px 0px 10px 15px;
			font: 500 24px/36px Roboto,Helvetica,Arial,sans-serif;
			font-weight: 400;
			color: #444;
	
		}
		.mstocktotal {
			box-shadow: 0 2px 1px -1px #00000033, 0 1px 1px 0 #00000024, 0 1px 3px 0 #0000001f;
			background: #fafafa;
			color: rgba(0,0,0,.54);
			position: relative;
			z-index: 101;
			font-weight: 500!important;
			font-family: gotham ssm a,gotham ssm b,raleway,sans-serif!important;
			height: 64px;
			flex-direction: column;
			box-sizing: border-box;
			display: flex;
			align-items: stretch;
			max-width: 100%;
			display:flex;
			align-items: center;
			place-content: stretch space-between;
			flex-direction: row;
			padding:0 15px;
		}
		.eventTotalBonusText {
			color: rgba(0,0,0,.54);
			font: 500 20px/32px Roboto,Helvetica,Arial,sans-serif;
		}
		.wrap {
			margin-top:60px;
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
			   .mstockReport {
				   margin-left:15px;
			   }
			   .mstocktotal {
			   	flex-direction: column;
				align-items: flex-start;
				height: 60px;
				.eventTotalBonusText {
					margin-top: 15px;
				}
			   }
			   .wrap {
			   	margin-top:30px;
			   }
		   }
	   }
	}
	
</style>
