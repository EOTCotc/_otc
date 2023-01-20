<template>
  <div class="content">
    <VueLoading
      v-if="dataLoading_before"
      type="spiningDubbles"
      :size="{ width: '35px', height: '35px' }"
      :style="{ fill: 'rgb(219,9, 9)' }"
    />
    <PaymentEmpty v-else-if="orderData_List.length === 0" />
    <Order
      v-else
      v-for="(order_item, i) in orderData_List"
      :key="i"
      @update_OrderList="getinit_Data"
      :order_item="order_item"
      @update_data="getinit_Data"
    >
    </Order>
  </div>
</template>

<script>
import Order from "./order";
import PaymentEmpty from "../payment-empty";
import { Eotcdis_Order } from "@/api/trxRequest";
import { VueLoading } from "vue-loading-template";

export default {
  components: {
    PaymentEmpty,
    Order,
    VueLoading,
  },
  name: "canceled-order", //用户已完成订单·
  data() {
    return {
      dataLoading_before: true,
      orderData_List: [],
    };
  },
  created() {
    this.getinit_Data();
  },
  methods: {
    async getinit_Data() {
      try {
        const { data } = await Eotcdis_Order({
          type: 1, //双位数商家， 单位数用户
          t1: 3,
          t2: 10,
        });
        //console.log(data);
        this.orderData_List = data;
        this.dataLoading_before = false;
      } catch (err) {
        console.warn(err);
      }
    },
  },
};
</script>

<style lang="less" scoped>
::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
.content {
  display: flex;
  flex-direction: column;
  min-height: 80vh;
  .vue-loading {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>

<style >
  ::-webkit-scrollbar {
  display: none !important; /* Chrome Safari */
}
</style>