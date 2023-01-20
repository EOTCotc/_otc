<template>
  <div class="content-box-container">
    <van-empty
      class="null"
      v-if="purchaseList.length == 0"
      description="暂无订单信息"
    />
    <div class="content-box" v-else>
      <van-tabs v-model="active" animated swipeable background="#F3F4F5">
        <van-tab title="总订单">
          <BuyBlanketOrder
            v-for="(orderItem, i) in purchaseList"
            :key="i"
            :orderItem="orderItem"
          ></BuyBlanketOrder>
        </van-tab>

        <!-- 待处理订单 -->
        <van-tab title="待处理" >
          <BuyPending></BuyPending>
        </van-tab>

        <!-- 等待收币订单 -->
        <van-tab title="待收币">
          <BuyAccomplish></BuyAccomplish>
        </van-tab>
        <!-- 已收币订单 -->
        <van-tab title="已收币">
          <BuyReceivedCoin></BuyReceivedCoin>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import BuyBlanketOrder from "@/components/orderFrom/BuyBlanketOrder.vue";
import BuyPending from "@/components/orderFrom/BuyPending.vue";
import BuyAccomplish from "@/components/orderFrom/BuyAccomplish.vue";
import BuyReceivedCoin from "@/components/orderFrom/BuyReceivedCoin.vue"

export default {
  name: "my-purchase",
  components: {
    BuyBlanketOrder,
    BuyPending,
    BuyAccomplish,
    BuyReceivedCoin,
  },
  props: {
    purchaseList: {
      require: true,
      type: [Object, Array],
      default: () => [],
    },
  },
  created(){
      //console.log(this.$route.query)
  },
  data() {
    return {
      action: 0,
      active: "",
    };
  },


};
</script>

<style lang="less" scoped>
/deep/.van-tabs__nav--line {
  height: 90%;
}
/deep/.van-tab {
  background: #fff;
  border-radius: 60px;
  margin: 24px 10px 0;
}
/deep/.van-tab--active {
  color: #2483ff;
  border: 2px solid #247ff7;
  background: #e8f2ff;
}
/deep/.van-tabs__line {
  background: none;
}

.content-box-container{
  height: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
}

.content-box {
  flex: 1;
  overflow-y: auto;
  background: #f3f4f5;
  // padding-bottom:96px;
  .null {
    min-height: calc(100vh - 228px);
  }
}
.pop {
  height: 100vh;
}
p {
  margin: 0;
}
</style>>