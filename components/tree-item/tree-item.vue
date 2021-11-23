<template>
	<view class="card">
	  <view class="ul">
	    <view class="li" v-for="(item,index) in treeData" :key="index">
	      <view class="item" :class="{'line-left':index!==0,'line-right':index!=treeData.length-1}">
	        <view class="item-name" :class="{'line-bottom': item.children&&item.children.length>0,'line-top':!treeFirst,
			'item-active': item.actived}">
	          <!-- <view v-if="!treeFirst" class="reduce" >-</view> -->
			  <view v-if='!item.id' @click="handleclickTreeInfoTap(item)">
				  <button class='clickTreeInfoTapButton'>{{item.name}}</button>
			  </view>
	          <view class="item-details">
				  <view v-if='item.id'>{{item.name}}</view>
				  <!-- <view v-if='!item.id' @click="handleclickTreeInfoTap(item)"> {{item.name}}</view> -->
				  <view v-if='item.id'>{{item.id}}</view>
				  <view v-if='item.member_level_name'>{{item.member_level_name}}({{item.initial_package}})</view>
				  <view v-if='item.activedLQV||item.activedLQV==0||item.activedRQV||item.activedRQV==0'>
					  QV:{{item.activedLQV}}/{{item.activedRQV}}</view>
				  <view>{{item.reg_time}}</view> 
			  </view>
	          <view class="forword" v-if='item.id' @click="handleclickForward(item)">↯</view>
		
	        </view>
	      </view>
	      <TreeItem v-if="item.children&&item.children.length>0" :tree-data="item.children" 
		  @clickForward="clickForward" @clickTreeInfoTap="clickTreeInfoTap"/>
	    </view>
	  </view>
	</view>
</template>

<script>
	import TreeItem from '@/components/tree-item/tree-item.vue'
	export default {
		components:{TreeItem},
		name:"TreeItem",
		props: {
			treeData: {
			  type: Array,
			  default: () => []
			},
			treeFirst: { //判断是否第一个
			  type: Boolean,
			  default: false
			},
		},
  data() {
    return {
		list: [],
	}
  },
  created() {

  },
  methods: {
    // 添加子元素
    addChild(index) {
      if (this.treeData[index].child) {
        this.treeData[index].child.push({ name: '1' })
      } else {
        this.$set(this.treeData[index], 'child', [{ 'name': '1' }])
      }
    },
    // 删除子元素
    delChild(index) {
      this.treeData.splice(index, 1)
    },
	
	// 点击事件处理 - 给父组件传当前子元素
	handleclickForward(item) {
		this.$emit('clickForward', item);
	},
	
	// 点击事件处理 - 给父组件传当前子元素
	handleclickTreeInfoTap(item) {
		this.$emit('clickTreeInfoTap', item);
	},
	
	// 调用父组件函数 - 
	clickForward(e) {
		this.$emit('clickForward',e);
	},
	// 调用父组件函数 -
	clickTreeInfoTap(e) {
		this.$emit('clickTreeInfoTap',e);
	}
	
	
  }
}
</script>

<style lang="scss" scoped>
$line-length:12px; //线长
$spacing:10px; //间距
$extend:calc(#{$spacing} + 2px); //延长线

// 线样式
@mixin line{
    content: "";
    display: block;
    width: 2px;
    height: $line-length;
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    background: rgb(6, 183, 253);
}
// 加减号icon
@mixin icon{
  position: absolute;
  border: solid 1px #666;
  border-radius: 100%;
  bottom:-8px;
  width: 12px;
  height: 12px;
  line-height: 10px;
  text-align: center;
  color:#666;
  z-index: 100;
  cursor: pointer;
  margin: 0;
  padding: 0;
  background-color: white;
  opacity: 1;
  font-size: 13px;
}

.card{
	
    .ul{
        display: flex;
        justify-content: center;
        .li{
            .item{
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
                &-name{
                    position: relative;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    // width: 150rpx;
                    // height:100rpx;
                    padding: 5px;
					border-radius: 5px;
                    margin: $spacing $spacing/2;//$spacing;
                    // background: coral;
					// background: white;
                    color: #fff;
                    .forword{
                      @include icon();
					  
                      &:hover{
                        opacity: 100%;
                      }
                    }
                    .reduce{
                      @include icon();
                      top:-5px;
                      &:hover{
                        opacity: 100%;
                      }
                    }
					
					.clickTreeInfoTapButton {
						margin: 0;
					}
					
					.item-details {
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;
						
						view {
							line-height: 1.2;
							// line-height: 12px;
							font-size: 11px;
						}
					}
					
					button {
						padding: 7px;
						line-height: 1;
					}
					
				
				}
            }
        }

    }
    // 向下的线
    .line-bottom{
        &::after{
            @include line();
            bottom: -$line-length;
        }
    }
    // 向上的线
    .line-top{
        &::before{
            @include line();
            top: -$line-length;
        }
    }
    // 向左的线
    .line-left{
        &::after{
            @include line();
            width: calc(50% + #{$spacing});
            height: 2px;
            left: calc(-50% - #{$extend});
            top: 0;
        }
    }
    // 向右的线
    .line-right{
        &::before{
            @include line();
            width: calc(50% + #{$spacing});
            height: 2px;
            right: calc(-50% - #{$extend});
            top: 0;
        }
    }
	
	// 活跃用户
	.item-name {
		border: 2px solid #fd4c06;
	}
	.item-active {
		border: 2px solid rgb(6, 183, 253);

	}

}
</style>
