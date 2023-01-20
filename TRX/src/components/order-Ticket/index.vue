<template>
  <div class="order-container">
    <van-tabs
      v-model="active"
      @click="switched"
      swipeable
      sticky
      :offset-top="offsetTop"
      color="#237DF4"
      background="#1B2945"
      title-active-color="#fff"
      title-inactive-color="#8D94A2"
    >
      <van-tab title="收购单">
        <!-- 收购单 -->
        <purchase :purchaseList="mypurchaseList" ref="shoping"></purchase>
      </van-tab>
      <van-tab title="出售单">
        <!-- 出售单 -->
        <OnOffer ref="sell"></OnOffer>
      </van-tab>
    </van-tabs>

    <div class="footer">
      <div v-if="!setShow" @click="message">信息设置</div>
      <div v-else @click="message">商家设置</div>
      <div
        :class="active == 0 ? 'back-color' : 'back-color2'"
        @click="buyEvent()"
      >
        {{ buy }}
      </div>
    </div>

    <!-- 未填写收付款信息，提示弹窗 -->
    <van-popup v-model="show" round closeable class="popup">
      <div class="popup_content">
        <p class="popup_title">商家信息设置提示</p>
        <p class="popup_text">
          当前信息设置未完善，缺少姓名、商家名称、联系电话、出售提示、收款提示
        </p>
        <van-button round type="info" color="#1B2945" block @click="message">
          去设置
        </van-button>
      </div>
    </van-popup>
    <!-- end  未填写收付款信息，提示弹窗 -->
  </div>
</template>

<script>
import purchase from "@/components/order-Ticket/purchase.vue";
import OnOffer from "@/components/order-Ticket/OnOffer.vue";

import { Order_sj } from "@/api/trxRequest";
import { Bususer } from "@/api/payverification";

import { UserInfo } from "@/utils/web3";

import PubSub from "pubsub-js";

export default {
  name: "order-Ticket",
  components: {
    purchase,
    OnOffer,
  },
  props: ["method"],
  data() {
    return {
      buy: "收购",
      active: 0,
      //信息是否设置
      setShow: false,
      //信息设置弹出开关
      show: false,
      userData: null, //用户数据
      mypurchaseList: [],
      offsetTop: "44px",
    };
  },
  created() {
    PubSub.subscribe("update_order", () => {
      this.paymentInfoIsOK();
    });
    if (this.method && this.method === "buy") {
      this.active = 0;
      this.buy = "收购";
      return false;
    } else if (this.method === "sell") {
      this.active = 1;
      this.buy = "出售";
      return false;
    }
    this.active = 0;
  },
  mounted() {
    this.userData = UserInfo();
    this.paymentInfoIsOK();
    setTimeout(() => {
      this.offsetTop = document
        .getElementById("nav")
        .getBoundingClientRect().height;
    }, 0);
  },
  methods: {
    //切换时改变文字
    switched(name, title) {
      if (name == 0) {
        this.buy = "收购";
      } else {
        this.buy = "出售";
      }
    },
    //跳转商家设置
    async message() {
      // 判断是否有实名认证  是否有设置一项收付款信息
      const { myalipay, mybank, mywechat } = this.userData;
      if (!!myalipay || !!mybank || !!mywechat) {
        try {
          this.$router.push({
            name: "setmessage",
            params: {
              active: this.active,
            },
          });
        } catch (err) {
          console.warn(err);
        }
      } else {
        //未设置
        this.$router.push({
          name: "receivingList",
          query: {
            returnURL: this.$router.currentRoute.fullPath,
          },
        });
      }
    },
    async buyEvent() {
      //若未设置信息
      let name = undefined;
      if (!this.setShow) {
        this.show = true;
      } else {
        if (this.active == 0) {
          name = "setpurchase"; // 挂收购单
        } else {
          name = "setsell"; // 挂出售单
        }
        const { data } = await Bususer();
        if (data == null) {
          this.$toast.warning("请完善商家基本信息");
          return false;
        }
        this.$router.push({
          name: name,
          params: {
            active: this.active,
          },
        });
      }
    },
    async paymentInfoIsOK() {
      const { myalipay, mybank, mywechat } = this.userData;
      if (!!myalipay || !!mybank || !!mywechat) {
        //已填信息
        try {
          const { data } = await Order_sj();
          this.mypurchaseList = data.reverse();
          this.show = false;
          this.setShow = true;
        } catch (err) {
          this.$toast.error(err.message);
          console.warn(err);
        }
      } else {
        this.show = true;
        this.setShow = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.order-container {
  background-color: #eee;
  position: fixed;
  left: 0;
  right: 0;
  top: 90px;
  bottom: 100px;
  overflow-y: auto;
}

.footer {
  position: fixed;
  height: 100px;
  bottom: 0;
  width: 100vw;
  display: flex;
  text-align: center;
  div {
    font-size: 32px;
    line-height: 96px;
  }
  div:first-child {
    width: 33.5%;
    background: #fff;
  }
  div:last-child {
    color: #fff;
    width: 66.5%;
  }
  .back-color {
    background: #00b87a;
  }
  .back-color2 {
    background: #fc7542;
  }
}
.popup {
  width: 90%;
  height: 30%;
  .popup_content {
    padding: 30px 30px 40px;
    .popup_title {
      font-size: 36px;
      color: #333;
      font-weight: bold;
      margin-bottom: 30px;
    }
    .popup_text {
      font-size: 32px;
      color: #f37a4c;
      margin-bottom: 80px;
    }
  }
}
</style>
>
