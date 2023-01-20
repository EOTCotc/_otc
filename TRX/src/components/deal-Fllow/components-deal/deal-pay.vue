<script>
import payIcons from "@/components/ChooseWay/pay-Icons.vue";

import Spinner from "vue-simple-spinner";

import { paytype } from "@/utils/utils";

import { GetmyUSDT, runSign, userSign, userBaseMes } from "@/utils/web3";

import { Verification_UserXbuyOrder_before } from "@/api/payverification";

export default {
  name: "deal-pay",
  components: {
    payIcons,
    Spinner,
  },
  data: () => ({
    money: undefined, //选择支付金额
    showPayModel: false, //交易模态框 显示隐藏
    playList: [], // 当前可选支付方式
    cuePayType: "default", // 默认 第一个
    orderPayModel: false, // 购买货币，生成订单的谈窗
    orderPayLoading: false, // 购买货币，生成订单的谈窗中  loading显隐
  }),
  filters: {
    isxj(value) {
      if (value && value.includes("现金")) {
        return "现金交易";
      }
      return value;
    },
  },
  inject: ["sellerMthods"],
  /**
   * type -> 当前交易支付类型   item -> 正在交易的 订单项  name-> 按 金额 or 数量进行购买
   * activeName  ->
   *  */
  props: ["type", "item", "name", "activeName"],
  methods: {
    onFocus() {
      this.$emit("open-input");
    },
    onBlur() {
      this.$emit("close-input");
    },
    paytype(value) {
      return paytype(value);
    },
    changePayMode() {
      this.cuePayType = "buyer_payMethod";
      this.showPayModel = true;
    },
    setPlay(e) {
      this.playList = e;
      if (this.cuePayType === "buyer_payMethod") {
        return false;
      }
      this.cuePayType = e[0];
    },
    goBack() {
      this.showPayModel = false;
    },
    handlePayChange(curType) {
      if (!this.hasOwnthisPay(curType)) {
        return false;
      }
      this.cuePayType = curType;
      this.showPayModel = false;
    },
    // 判断用户是否有填 改支付方式
    hasOwnthisPay(curType) {
      if (curType === "xj") return true;
      if (curType === "wx" && this.sellerMthods["mybmywechatnk"]) {
        return true;
      }
      if (curType === "zfb" && this.sellerMthods["myalipay"]) {
        return true;
      }
      if (curType === "yhk" && this.sellerMthods["mybank"]) {
        return true;
      }
      this.$toast.clear();
      this.$toast.error(
        <div>
          <p style="font-size:13px;margin:5px">您没有填写当前支付方式，</p>
          <p style="font-size:16px;margin:5px">请重新选择!</p>
        </div>
      );
    },

    hasCurrentPay(value) {
      return Boolean(value.split("&")[1]);
    },
    confirm_pay() {
      this.$toast.clear();
      if (this.item.cash === "-1") {
        this.orderPayLoading = true;
        this.showOrderPayModel();
        return true;
      }

      if (["wx", "yhk", "zfb", "xj"].includes(this.cuePayType)) {
        // 购买交易加载loading
        this.orderPayLoading = true;
        this.showOrderPayModel();
      } else {
        this.$toast.error("请选择支付方式");
      }
    },
    async showOrderPayModel() {
      let gusdt = undefined;
      let totalPrice = undefined;
      // 购买多少 usdt 总价格
      if (this.activeName === "size") {
        gusdt = this.transformMoney;
        totalPrice = this.money;
      } else if (this.activeName === "num") {
        gusdt = this.money;
        totalPrice = this.transformNum;
      }

      try {
        await this.generate_orders(gusdt, totalPrice);
      } catch (err) {
        console.warn(err);
        this.$toast.error(err, {
          timeout: 2500,
        });
        if (err === "SignaturError") {
          console.warn("错误签名", window.localStorage.getItem("mysign"));
          this.$toast.error("请重新签名");
          await userSign("EOTC请求您签名确认,签名不消耗GAS.");
          await this.generate_orders(gusdt, totalPrice,true);
        }
      }
      // 关闭 出售信息 弹窗
      this.orderPayLoading = false;
      this.$bus.$emit("close-OrderSaleInfo");
    },

    async generate_orders(gusdt, totalPrice,messageError = false) {
      return new Promise(async (resolve, reject) => {
        try {
          console.log(this.item)
          const id = this.item.id;
          await GetmyUSDT(id, gusdt,0);
          if(!messageError) await runSign();
          const { data } = await Verification_UserXbuyOrder_before({
            oid: id,
            cnyNum: totalPrice,
            dsx: this.item.dsx,
            userPay: this.get_buyerPay(this.cuePayType),
          });
          var it = eval(data);
          it.bank = this.item.ads.trim();
          let odid = parseInt(it.odid);
          // console.log(odid,111)
          if (odid > 9) {
            localStorage.setItem("xdnum", odid);
            console.log(this.item)
            console.log(it)
            console.log(this.sellerMthods)

            this.$router.push({
              name: "order-pay",
              params: {
                item: this.item,
                cuePayType: this.cuePayType,
                num: gusdt,
                money: totalPrice,
                MerchanInfo: it,
                sellerMthods: this.sellerMthods,
                servicefee:it.chenjiao,
              },
              query: {
                id: it.odid,
                inTrading: true,
              },
            });
          } else if (odid == 9) this.$toast.error("不能购买自己的订单");
          else if (odid == 3) {
            this.$toast.error(
              <div>
                <p style="font-size:16px;margin:5px">该订单USDT数量已不足,</p>
                <p style="font-size:16px;margin:5px">请选择其它订单"</p>
              </div>
            );
          } else if (odid == 2) {
            this.$toast.error("商家已修改订单价格，请重新下单");
            //下单的时刻 < 商家修改订单价格时刻
            // 刷新数据 重新下单
            this.$bus.$emit("update-orderlist");
          } else if (odid == 1)
            this.$toast.error("您多次撤销订单，请明天再下单");
          else if (odid == 0) {
            this.$toast.error(
              <div>
                <p style="font-size:16px;margin:5px">您还有未处理的订单，</p>
                <p style="font-size:16px;margin:5px">请完成该订单后再下单"</p>
              </div>
            );
          }
          resolve();
        } catch (err) {
          reject(err);
        }
      });
    },
    get_buyerPay(pay_Type) {
      let uname;
      if (this.item.aipay) {
        uname = this.item.aipay.split("&")[0];
      } else if (this.item.wechat) {
        uname = this.item.wechat.split("&")[0];
      } else if (this.item.bank) {
        uname = this.item.bank.split("&")[0];
      }
      if (this.item.cash === "-1") {
        this.cuePayType = "xj";
        return `${uname}&现金交易&现金`;
      }

      switch (pay_Type) {
        case "yhk": {
          const pay_data = `${this.item.bank?.trim()}`;
          return pay_data;
        }
        case "wx": {
          const pay_data = `${this.item.wechat?.trim()}&微信`;
          return pay_data;
        }
        case "zfb": {
          const pay_data = `${this.item.aipay?.trim()}&支付宝`;
          return pay_data;
        }
        case "xj": {
          const pay_data = `${uname}&现金交易&现金`;
          return pay_data;
        }
      }
    },
    merchants_gatheringMethod() {
      const Icons = [];
      for (const key of Object.keys(this.item)) {
        switch (key) {
          case "bank":
            if (this.hasCurrentPay(this.item[key])) {
              Icons.push("yhk");
            }
            break;
          case "aipay":
            if (this.hasCurrentPay(this.item[key])) {
              Icons.push("zfb");
            }
            break;
          case "wechat":
            if (this.hasCurrentPay(this.item[key])) {
              Icons.push("wx");
            }
            break;
        }
      }
      return Icons;
    },
    size_limit(val) {
      const minSize = this.item.amount1;
      const MaxSize = this.item.amount2;
      if (minSize <= val && val <= MaxSize) {
        return true;
      }
      this.$refs["animate-div"].classList.add("animate__shakeX");

      return false;
    },
    validato_pay_size(val) {
      if (this.activeName === "size") {
        return this.size_limit(val);
      } else if (this.activeName === "num") {
        return this.size_limit(this.transformNum);
      }
      return false; //测试谈窗 true
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
      return +(this.money / this.item.cny).toFixed(2);
    },
    transformNum() {
      return +(this.money * this.item.cny).toFixed(2);
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
      label-width="60px"
    >
      <van-field
        v-model.number.trim.lazy="money"
        autocomplete="off"
        name="moneySize"
        :label="name"
        type="number"
        placeholder="0.00"
        @focus="onFocus"
        @blur="onBlur"
        :rules="[{ validator: validato_pay_size }]"
      />
      <div class="pay-mid-main">
        <span class="limit" ref="animate-div">限额： {{ limit }}</span>
      </div>

      <div class="pay-select-main">
        <span>支付方式</span>
        <span class="txt2" v-if="item.cash === '-1'">
          <img
            class="xj_moeny"
            src="@/assets/currency-icons/moeny-c.png"
            alt="xj"
          />&nbsp;&nbsp;&nbsp;
          <p>现金交易</p>
          &nbsp;&nbsp;&nbsp;
        </span>
        <span
          class="txt2"
          @click="changePayMode"
          v-else-if="cuePayType === 'default'"
          :style="{ color: 'red' }"
          >支付方式&nbsp;
          <van-icon name="arrow" :style="{ marginTop: '4px' }" />
        </span>
        <span
          class="txt2"
          @click="changePayMode"
          v-else-if="cuePayType === 'buyer_payMethod'"
          :style="{ color: 'red' }"
          >选择支付方式&nbsp;
          <!-- 选择支付方式 -->
          <payIcons
            v-show="false"
            :items="item"
            :cuePayType="cuePayType"
            @get-playList="setPlay"
          />
          <van-icon name="arrow" :style="{ marginTop: '4px' }" />
        </span>
        <span
          class="txt2"
          @click="changePayMode"
          v-else-if="item.cash !== '-1'"
        >
          <!-- 选择支付方式 -->
          <payIcons
            :items="item"
            :cuePayType="cuePayType"
            @get-playList="setPlay"
          />
          <span class="pay-txt">{{ paytype(cuePayType) | isxj }}</span>
          <van-icon name="arrow" />
        </span>
      </div>

      <!-- 按金额购买 or 按数量购买 -->
      <div class="harvest" v-if="activeName === 'size'">
        <strong>可得</strong>
        <span>{{ money ? transformMoney : "0.00" }} {{ type }}</span>
      </div>
      <div class="harvest" v-else-if="activeName === 'num'">
        <strong>应付</strong>
        <span>￥ {{ money ? transformNum : "0.00" }}</span>
      </div>

      <!-- start 底部支付按钮 -->
      <footer class="footer">
        <van-button
          type="primary"
          native-type="submit"
          size="large"
          :loading="orderPayLoading"
          loading-text="订单生成中..."
          color="#2483ff"
        >
          购买 {{ type }}
        </van-button>
      </footer>
      <!-- end / 底部支付按钮 -->
    </van-form>

    <!-- start  收款方式 提示弹窗 -->
    <van-popup
      v-model="showPayModel"
      :close-on-popstate="true"
      get-container="body"
      position="bottom"
      class="res-payFun"
      :style="{ height: '380px' }"
    >
      <template>
        <div>
          <header class="header">
            <van-icon name="arrow-left" @click="goBack" />
            <span class="header-text" @click="goBack">选择支付方式</span>
          </header>
          <main class="main">
            <template v-if="item.cash === '1' || item.cash === '-1'">
              <van-cell center @click="handlePayChange('xj')">
                <template #title>
                  <span class="custom-title">&nbsp;现金交易</span>
                </template>
                <template #icon>
                  <img
                    class="xj_moeny"
                    src="@/assets/currency-icons/moeny-c.png"
                    alt="xj"
                  />
                </template>
              </van-cell>
            </template>

            <template>
              <van-cell
                center
                v-for="(payType, i) in playList"
                :key="i"
                @click="handlePayChange(payType)"
              >
                <template #title>
                  <span class="custom-title">{{ paytype(payType) }}</span>
                </template>
                <template #icon>
                  <van-icon>
                    <i
                      :class="[
                        'iconfont',
                        `icon-${payType}`,
                        `pay-icon${payType}`,
                      ]"
                    ></i>
                  </van-icon>
                </template>
                <template #right-icon> </template>
              </van-cell>
            </template>

            <div class="salePay-info">
              <span class="span1"
                >*<i class="zy-info">请使用本人实名账户进行收款</i
                >,否则会导致订单失败且账号存在被冻结风险</span
              >
            </div>
          </main>
        </div>
      </template>
    </van-popup>
    <!-- end 出售 详细信息  收款方式 提示弹窗  -->

    <!-- start 支付支付订单生成中  loading status  -->
    <van-dialog v-model="orderPayLoading" :showConfirmButton="false">
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
.salePay-info {
  display: flex;
  margin: 45px 25px 25px;
  flex-direction: column;
  background-color: rgb(249, 249, 249);
  padding: 15px;
  border-radius: 15px;
  .span1 {
    margin: 10px;
    flex: 1;
    line-height: 40px;
  }
  .zy-info {
    color: #ee0a24;
  }
  font-size: 24px;
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

.iconfont {
  margin-right: 15px;
}

/deep/ .van-field__control::placeholder {
  color: var(--main-test-color) !important;
}

/deep/ .van-field__control {
  color: #000 !important;
}

.pay-mid-main {
  position: relative;
  height: 60px;
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

.header {
  font-size: 36px;
  color: #000;
  font-weight: 700;
  padding: 15px;
  border-bottom: 2px solid var(--main-test-color);
  .header-text {
    margin-left: 15px;
  }
}
.van-icon-success {
  color: var(--main--color);
  font-size: 36px;
}

.harvest {
  font-size: 36px;
  padding: 0 15px;
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

// animate__shakeX
</style>

<style lang="less">
.van-dialog {
  padding-top: 50px;
}

.van-form {
  margin-bottom: 25px;
}

.ld-text {
  text-align: center;
  font-size: 26px;
  padding: 25px 0;
}
</style>

<style>
.van-popup--right {
  top: 14.6rem !important;
}
</style>
