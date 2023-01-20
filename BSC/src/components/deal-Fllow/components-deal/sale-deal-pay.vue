<script>
import { runSign } from "@/utils/web3";

import Spinner from "vue-simple-spinner";

import { Verification_order_before } from "@/api/payverification";

import { mapMutations } from "vuex";

export default {
  name: "deal-pay",
  components: {
    Spinner,
  },
  data: () => ({
    money: undefined, //选择支付金额
    orderSaleLoading: false, // 订单出售 loading显隐
  }),
  inject: ["sellerMthods"],
  /**
   * type -> 当前交易支付类型   item -> 正在交易的 订单项
   * activeName   name-> 按 金额 or 数量进行购买
   *  */
  props: ["type", "item", "name", "activeName"],
  methods: {
    ...mapMutations(["setMerchantInfoMap"]),
    confirm_pay() {
      //出售中
      this.orderSaleLoading = true;
      this.SellCurrency();
    },
    size_limit(val) {
      const minSize = this.item.amount1;
      const MaxSize = this.item.amount2;
      if (minSize <= Number(val) && Number(val) <= MaxSize) {
        return true;
      }
      this.$refs["animate-div"].classList.add("animate__shakeX");
      return false;
    },
    fullNum(activeName) {
      if (activeName === "size") {
        this.money = this.item.amount2.substring(
          0,
          this.item.amount2.length - 3
        );
      } else if (activeName === "num") {
        this.money = this.maxformNum;
      }
    },
    validato_pay_size(val) {
      if (this.activeName === "size") {
        return this.size_limit(val);
      } else if (this.activeName === "num") {
        return this.size_limit(this.transformNum);
      }
      return false;
    },
    SellCurrency() {
      //出售数据统计，进行最终页面跳转
      let totalMoney = undefined; // 此次出售可以获得多少 money
      let gusdt = undefined; // 此次出售多少 usdt
      if (this.activeName === "size") {
        totalMoney = this.money;
        gusdt = this.transformMoney;
      } else if (this.activeName === "num") {
        totalMoney = this.transformNum;
        gusdt = this.money;
      }
      // 签名检测 出售前数据前提条件判定
      runSign()
        .then(() => {
          //签名验证通过
          return Verification_order_before({
            oid: this.item.id,
            gnum: gusdt,
            dsx: this.item.dsx,
          });
        })
        .then((data) => {
          var it = eval(data.data);
          //验证通过 保留该订单 和商家的信息
          let odid = parseInt(it.odid);
          if (odid > 9) {
            // 订单生成成功，把当前订单存进订单集合中,并把该订单单号存储在 本地
            // odid 子订单号
            localStorage.setItem("csnum", odid);
            this.setMerchantInfoMap({
              it, //商家信息
              item: this.item, //订单信息
            });
            // 确认出售，跳转去 出售货币生成页面
            this.$router.push({
              name: "outflows-currency",
              params: {
                item: this.item, //当前订单信息
                num: gusdt, //当前出售多少 udst
                totalMoney: totalMoney, //出售总金额
                sellerMthods: this.sellerMthods,
                MerchanInfo: it, //卖家信息
              },
              query: {
                id: it.odid,
                inTrading: true,
              },
            });
          } else if (odid == 9) this.$toast.error("不能出售自己的订单");
          else if (odid == 3)
            this.$toast.error(
              <div>
                <p style="font-size:16px;margin:5px">该订单USDT数量已不足,</p>
                <p style="font-size:16px;margin:5px">请选择其它订单"</p>
              </div>
            );
          else if (odid == 2) {
            this.$toast.error("商家已修改订单价格，请重新下单");
            //下单的时刻 < 商家修改订单价格时刻
            // 刷新数据 重新下单
            this.$bus.$emit("update-orderlist");
          } else if (odid == 1)
            this.$toast.error("您多次撤销订单，请明天再下单");
          else if (odid == 0)
            this.$toast.error(
              <div>
                <p style="font-size:16px;margin:5px">您还有未处理的订单，</p>
                <p style="font-size:16px;margin:5px">请完成该订单后再下单"</p>
              </div>
            );
        })
        .catch((err) => {
          console.warn(err);
        });
      // 关闭 出售信息 弹窗
      this.$bus.$emit("close-OrderSaleInfo");
      this.orderSaleLoading = false;
    },
    onFocus() {
      this.$emit("open-input");
    },
    onBlur() {
      this.$emit("close-input");
    },
  },
  watch: {
    money: {
      handler() {
        if ((this.money ?? "") !== "") {
          this.$refs["animate-div"].classList.remove("animate__shakeX");
        }
      },
    },
  },
  computed: {
    limit() {
      return `￥${this.ThousandSeparator(
        this.item.amount1
      )}-￥${this.ThousandSeparator(this.item.amount2)}`;
    },
    transformMoney() {
      return +(this.money / this.item.cny).toFixed(6);
    },
    transformNum() {
      return +(this.money * this.item.cny).toFixed(2);
    },
    maxformNum() {
      return (this.item.amount2 / this.item.cny).toFixed(2);
    },
  },
};
</script>

<template>
  <div>
    <van-form
      @submit="confirm_pay"
      validate-trigger="onSubmit"
      label-align="right"
      label-width="100px"
    >
      <van-field
        v-model.number.trim.lazy="money"
        autocomplete="off"
        name="moneySize"
        type="number"
        :maxlength="20"
        placeholder="0.00"
        @focus="onFocus"
        @blur="onBlur"
        :rules="[{ validator: validato_pay_size }]"
      />

      <div class="lable-txt">
        <span>{{ name }}</span>
        <span>|</span>
        <span @click="fullNum(activeName)" :style="{ color: 'blue' }"
          >全部</span
        >
      </div>

      <div class="pay-mid-main">
        <span class="limit" ref="animate-div">限额： {{ limit }}</span>
      </div>

      <div class="pay-mid-main">
        <span class="limit">资金账户可出售： {{ maxformNum }} {{ type }} </span>
        <span class="business" :style="{ color: 'blue' }">去划算</span>
      </div>

      <!-- 按金额购买 or 按数量购买 -->
      <div>
        <div class="harvest" v-if="activeName === 'num'">
          <strong>出售</strong>
          <span>{{ money ? money : "0" }} {{ type }}</span>
        </div>
        <div class="harvest" v-if="activeName === 'size'">
          <strong>可得</strong>
          <span>￥ {{ money ? money : "0" }}.00</span>
        </div>
      </div>

      <!-- start 底部支付按钮 -->
      <footer class="footer">
        <van-button
          :loading="orderSaleLoading"
          loading-text="订单生成中..."
          :disabled="orderSaleLoading"
          type="primary"
          native-type="submit"
          size="large"
          color="#2483ff"
        >
          出售 {{ type }}
        </van-button>
      </footer>
    </van-form>

    <!-- end / 底部出售按钮 -->

    <!-- start 支付支付订单生成中  loading status  -->
    <van-dialog v-model="orderSaleLoading" :showConfirmButton="false">
      <Spinner
        size="30"
        message="订单生成中"
        :spacing="15"
        :font-size="16"
      ></Spinner>
      <!-- <van-loading size="36px" text-color="#000" vertical>订单生成中</van-loading> -->
      <div class="ld-text">正在下单，请稍等...</div>
    </van-dialog>
    <!-- end / 支付支付订单生成中  loading status  -->
  </div>
</template>
;

<style lang="less" scoped>
.van-dialog {
  padding-top: 50px;
}

.ld-text {
  text-align: center;
  font-size: 26px;
  padding: 25px 0;
}

.lable-txt {
  position: absolute;
  display: flex;
  width: 220px;
  align-items: center;
  justify-content: space-evenly;
  top: 140px;
  right: 20px;
  font-size: 30px;
  span {
    height: 40px;
    line-height: 40px;
  }
}
.active-status {
  color: #000 !important;
}
.animate__shakeX {
  -webkit-animation: shakeX 1s cubic-bezier(0.19, 1.04, 1, 0.73);
  color: #ee0a24 !important;
  animation: shakeX 1s cubic-bezier(0.19, 1.04, 1, 0.73);
}

@keyframes shakeX {
  from,
  to {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }

  10%,
  30%,
  50%,
  70%,
  90% {
    -webkit-transform: translate3d(-10px, 0, 0);
    transform: translate3d(-10px, 0, 0);
  }

  20%,
  40%,
  60%,
  80% {
    -webkit-transform: translate3d(10px, 0, 0);
    transform: translate3d(10px, 0, 0);
  }
}

/deep/ .van-field__control::placeholder {
  color: var(--main-test-color) !important;
}

/deep/ .van-field__control {
  color: #000 !important;
}
.van-popup {
  background-color: rgba(255, 255, 255, 0) !important;
}

.pay-mid-main {
  position: relative;
  display: flex;
  justify-content: space-between;
  height: 60px;
  .business {
    position: absolute;
    right: 20px;
    font-size: 26px;
    top: 50%;
    transform: translateY(-50%);
  }
}
.limit {
  font-size: 30px;
  position: absolute;
  color: var(--main-test-color);
  padding: 10px;
  margin-left: 15px;
}
.footer {
  margin-top: 30px;
  padding: 0 20px;
}

.pay-select-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  span {
    flex: 1;
    font-size: 28px;
    padding: 10px;
  }
  .txt2 {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .pay-txt {
      text-align: center;
    }
    /deep/ .pay-iconyhk {
      position: absolute;
      left: 20%;
      top: 20px;
    }
    /deep/ .pay-iconzfb {
      position: absolute;
      left: 20%;
      top: 20px;
    }
    /deep/ .pay-iconwx {
      position: absolute;
      left: 16%;
      top: 20px;
    }
  }
}
/deep/ .van-popup--right {
  top: 77% !important;
}

.harvest {
  font-size: 36px;
  padding: 25px 15px;
  height: 60px;
  margin-bottom: 60px;
  line-height: 60px;
  align-items: center;
  span {
    display: inline-block;
    margin: 7px 0 0 15px;
    color: var(--main-test-color);
  }
}
</style>

<style lang="less">
.loading-text {
  text-align: center;
}
</style>
