<template>
  <div class="content-box-container">
    <VueLoading
      v-if="dataLoading_before"
      type="spiningDubbles"
      :size="{ width: '35px', height: '35px' }"
      :style="{ fill: 'rgb(219,9, 9)' }"
    />
    <van-empty class="null" v-else-if="sellDatalist.length == 0" description="暂无订单信息" />
    <div v-else>
      <van-tabs v-model="active" animated swipeable background="#F3F4F5">
        <van-tab title="总订单">
          <SellBlanketOrder
            v-for="(orderItem, i) in sellDatalist"
            :key="random(i)"
            :orderItem="orderItem"
            @repetition="repetition"
          />
        </van-tab>
        <van-tab title="待处理">
          <SellPending></SellPending>
        </van-tab>
        <van-tab title="已完成">
          <SellAccomplish></SellAccomplish>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import SellBlanketOrder from '@/components/orderFrom/SellBlanketOrder.vue'
import SellPending from '@/components/orderFrom/SellPending.vue'
import SellAccomplish from '@/components/orderFrom/SellAccomplish.vue'


import {  Toast } from 'vant'
import { VueLoading } from 'vue-loading-template'

import { Order_sj } from '@/api/trxRequest'

import PubSub from 'pubsub-js'

export default {
  name: 'my-onoffer', //商家出售
  components: {
    SellBlanketOrder,
    SellPending,
    SellAccomplish,
    VueLoading,
  },
  created() {
    this.getSellData()
    PubSub.subscribe('update-selltotal-orderData', () => {
      this.getSellData()
      this.random(Math.random(0, 10))
    })
  },
  data() {
    return {
      sellDatalist: [],
      active: '',
      dataLoading_before: true,
    }
  },
  methods: {
    async getSellData() {
      try {
        const { data } = await Order_sj({
          type: 10,
        })
        console.log(data)
        this.sellDatalist = data.reverse()
        this.dataLoading_before = false
      } catch (err) {
        console.warn(err)
      }
    },
    random(i) {
      return Math.random(0, i) * Math.random(0, i)
    },
    repetition() {
      this.getSellData()
      Toast.clear()
    },
  },
}
</script>

<style lang="less" scoped>
.vue-loading {
  width: 100vh;
  height: 50vh;
  line-height: 50vh;
}

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

.content-box-container {
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
</style>
>
