<script>
import dealPay from "./components-deal/sale-deal-pay.vue";

export default {
  name: "sale-fllow",
  props: ["curPayData", "activePayType"],
  components: {
    dealPay,
  },
  data() {
    return {
      time: 45 * 1000,
      activeName: "size",
      delayTimeshow: false,
    };
  },
  methods: {
    initTime() {
      setTimeout(() => {
        this.delayTimeshow = true;
        Promise.resolve().then(() => {
          this.$refs["countDown"].reset();
        });
      }, 300);
    },
    closeDelayTimeModel() {
      this.delayTimeshow = false;
    },
    finishReset() {
      this.$refs["countDown"].reset();
    },
    open_input() {
      const container = this.$refs["pay-fllow-container"].parentElement;
      container.style.transition = "all .6s";
      container.style.height = "80%";
    },
    close_input() {
      const container = this.$refs["pay-fllow-container"].parentElement;
      container.style.transition = "all .4s";
      container.style.height = "54%";
    },
  },
};
</script>

<template>
  <div class="pay-fllow" ref="pay-fllow-container">
    <!-- start 支付交易头信息 -->
    <header class="header">
      <img
        :src="
          require(`@/assets/currency-icons/${activePayType.toLowerCase()}.svg`)
        "
        class="icon-img"
        alt="USDC"
      />
      <section class="top-container">
        <div class="top-title">出售{{ activePayType }}</div>
        <div class="top-main-container">
          <div class="top-txt">单价 ￥{{ curPayData.cny }}</div>
          <van-count-down
           v-if="delayTimeshow"
            ref="countDown"
            @finish="finishReset"
            :time="time"
            format="mm:sss 刷新"
          />
        </div>
      </section>
    </header>
    <!-- end / 支付交易头信息 -->

    <!-- start 支付交易主题信息 -->
    <main class="main">
      <van-tabs v-model="activeName" title-active-color="#2483ff" swipeable>
        <van-tab title="按金额出售" name="size">
          <dealPay
            ref="child-dealPay"
            :item="curPayData"
            :activeName="activeName"
            name="CNY"
            :type="activePayType"
            @open-input="open_input"
            @close-input="close_input"
          />
        </van-tab>
        <van-tab title="按数量出售" name="num">
          <!-- 交易详细信息 支付方式选择 -->
          <dealPay
            ref="child-dealPay"
            :item="curPayData"
            :activeName="activeName"
            :type="activePayType"
            :name="activePayType"
            @open-input="open_input"
            @close-input="close_input"
          />
        </van-tab>
      </van-tabs>
    </main>
    <!-- end / 支付交易主题信息 -->
  </div>
</template>

<style lang="less" scoped>
.pay-fllow {
  .header {
    height: 120px;
    padding: 0px 30px 0px 30px;
    display: flex;
    align-items: center;
    border-bottom: 2px solid var(--main-test-color);
    .icon-img {
      width: 60px;
      height: 60px;
      margin-right: 25px;
    }
    .top-container {
      font-size: 30px;
      .top-title {
        font-weight: 700;
        color: #000;
      }
      .top-txt {
        color: var(--main--color);
        margin-right: 20px;
      }
      .top-main-container {
        display: flex;
        justify-content: center;
        align-items: center;
        line-height: 60px;
        padding-top: 5px;
        .van-count-down {
          font-size: 0.4rem;
        }
      }
    }
  }
  /deep/ .van-tabs__line {
    background-color: var(--main--color) !important;
    width: 120px;
  }

  .main {
    /deep/ .van-tabs__wrap {
      position: relative !important;
    }
    /deep/ .van-tab {
      width: 2.8rem !important;
      flex: none;
    }
    /deep/ .van-tabs__content {
      padding: 0 !important;
    }
    /deep/ .van-field__label {
      order: 2;
      color: #000;
    }
    /deep/ .van-field {
      padding: 50px 10px 10px 40px;
      border-bottom: 2px solid var(--main-test-color);
    }
  }
}
</style>
