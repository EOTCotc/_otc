<template>
  <div class="order-gather-container">
    <van-tabs
      sticky
      :offset-top="offsetTop"
      v-model="active"
      line-height="2px"
      swipeable
      background="#fff"
    >
      <van-tab>
        <template #title>
          <van-button> 未完成 </van-button>
        </template>
        <OrderUndone :key="force_Update_num"></OrderUndone>
      </van-tab>
      <van-tab>
        <template #title>
          <van-button> 已完成 </van-button>
        </template>
        <OrderCompleted></OrderCompleted>
      </van-tab>
      <van-tab>
        <template #title>
          <van-button> 其他订单 </van-button>
        </template>
        <OrderCanceled></OrderCanceled>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import OrderCanceled from "./order-canceled/index.vue";
import OrderCompleted from "./order-completed/index.vue";
import OrderUndone from "./order-undone/index.vue";
export default {
  components: {
    OrderCanceled,
    OrderCompleted,
    OrderUndone,
  },
  name: "order-gather",
  created() {
    this.active = this.$route.params.done ? 1 : 0;
    this.$bus.$on("update-active", this.force_Update);
    this.$nextTick(()=>{
      this.offsetTop = document
      .getElementById("nav")
      .getBoundingClientRect().height;
    })
  },
  data() {
    return {
      offsetTop: "45px",
      active: 0,
      forceUpdate: true,
      force_Update_num: Math.random() * Math.random(),
    };
  },
  methods: {
    force_Update() {
      this.force_Update_num = Math.random() * Math.random();
      this.active = 0;
    },
  },
};
</script>

<style lang="less" scoped>
.order-gather-container {
  height: auto;
  /deep/.van-tab {
    position: relative;
    padding: 0;
    line-height: 1rem !important;
  }
}
/deep/ .van-tabs__wrap {
  height: 1rem !important;
  border-bottom: 2px solid #eee;
}
/deep/ .van-tabs__line {
  background-color: blue !important;
}
button {
  border: none !important;
}
/deep/ .van-tab__text {
  flex: 1;
  display: flex;
  position: relative;
}
/deep/ .van-button {
  flex: 1;
}
</style>
