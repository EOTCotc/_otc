<template>
  <div class="sell-success-page">
    <div class="success-info">
      <i class="iconfont icon-cg2"></i>
      <i class="iconfont icon-guanbi" @click="closePage"></i>
      <section>
        <div>￥{{ totalMoney }}</div>
        <div>已成功出售 {{ num }} USDT</div>
      </section>
    </div>
    <footer class="success-btns">
      <van-button @click="show_order_info"> 查看订单 </van-button>
    </footer>
  </div>
</template>

<script>
export default {
  name: "success-page",
  props: {
    totalMoney: {
      require: true,
    },
    num: {
      require: true,
    },
  },
  methods: {
    closePage() {
      this.$router.replace({
        name: "CurrencyTrading",
      });
    },
    show_order_info() {
      const role = this.$route.query.role;
      if (role === "merchant_seller") {
        this.$router.replace({
          name: "order-Ticket",
          params: {
            method: "sell",
          },
          query:{
            oriderDone:true,
          }
        });
        return false
      }
      this.$router.replace({
        name: "orderGather-full",
        params: {
          done: true,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.sell-success-page {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 99;
  display: flex;
  background-color: #fff;
  flex-direction: column;
  div,
  footer {
    flex: 1;
  }
  .icon-cg2 {
    display: block;
    font-size: 1.5rem;
    text-align: center;
    height: 150px;
    line-height: 150px;
    color: rgb(0, 184, 122);
  }
  .icon-guanbi {
    position: absolute;
    right: 40px;
    top: 40px;
    font-size: 36px;
  }
  .success-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    section {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 30px;
      div:first-child {
        font-weight: 700;
        font-size: 1rem;
        line-height: 1rem;
        margin-bottom: 15px;
      }
    }
  }
  .success-btns {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 0 40px 140px 40px;
    align-items: center;
    button {
      border-radius: 20px;
      font-weight: 700;
      width: 6rem;
      background-color: #eee;
    }
    button:first-child {
      background-color: var(--main--color);
      margin-bottom: 35px;
      color: #fff;
    }
  }
}
</style>
