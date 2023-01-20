<template>
  <div class="currency">
    <div class="currency-container">
      <van-tabs
        @change="currency_Change"
        v-model="active"
        line-height="2px"
        swipeable
      >
        <div class="selsect">
          <selectNav @change-pay="changePay" @change-size="changeSize" />
        </div>

        <van-loading size="24px" vertical v-if="listLoading"
          >加载中...</van-loading
        >
        <payment_empty v-else-if="isShow_empty" />

        <van-tab
          v-for="(item, index) in typeList"
          v-else
          :title="item"
          :key="index"
        >
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="已经没有更多了..."
            @load="onLoad"
          >
            <!--  start  selsect 内容筛选 -->

            <!--  end  selsect 内容筛选 -->

            <!-- 交易列表 start -->
            <van-cell-group inset v-for="(items, i) in list" :key="i">
              <van-cell>
                <template #title>
                  <!-- store -->
                  <div class="left " @click="to_merchantInfo(items)">
                    <div class="aut-img">
                      {{ items.sname.slice(0, 1) }}
                      <div
                        class="online-icon"
                        v-if="isActive_user(items.updateDate)"
                      >
                        <p class="online-status"></p>
                      </div>
                    </div>
                    <span class="text">{{ items.sname }}</span>
                  </div>
                </template>
                <template>
                  <div class="right">
                    <!-- {{items.eotc}} EOTC |  -->
                    <span>{{ items.odid }} | {{ items.chenjiao }}%</span>
                  </div>
                </template>
              </van-cell>
              <van-cell>
                <template #title>
                  <div class="left">
                    数量 {{ items.num | ThousandSeparator }} {{ item }}
                  </div>
                </template>
                <template #label>
                  <div>
                    限额 {{ items.amount1 | ThousandSeparator }} -
                    {{ items.amount2 | ThousandSeparator }} CNY
                  </div>
                  <Pay-Icons :items="items"></Pay-Icons>
                </template>
                <template>
                  <div class="right">
                    <span>单价</span>
                  </div>
                </template>
                <template>
                  <div class="right">
                    <span class="txt">￥{{ items.cny }}</span>
                  </div>
                </template>
                <template>
                  <div>
                    <van-button
                      class="comfig-button"
                      size="mini"
                      @click="SubmitTrading(i)"
                    >
                      {{ method }}
                      <!--  出售 -->
                    </van-button>
                  </div>
                </template>
              </van-cell>
            </van-cell-group>
            <!-- 交易列表 end -->
          </van-list>
        </van-tab>
      </van-tabs>
    </div>

    <!-- 出售交易弹窗 -->
    <van-popup
      v-model="isShowTradingPopup"
      :close-on-popstate="true"
      round
      @opened="showModel"
      @closed="closeModel"
      position="bottom"
      class="payPopou"
      get-container="body"
      closeable
      :style="{ height: '54%' }"
    >
      <!-- 出售交易弹窗 main 内容-->
      <saleFllow
        :curPayData="list[activeIndex]"
        :activePayType="typeList[active]"
        :key="activeIndex"
        ref="sell-popup"
      ></saleFllow>
    </van-popup>
  </div>
</template>

<script>
import PayIcons from "./pay-Icons";
import selectNav from "@/components/selectNav";
import { EotcBuyOrder, UserBind } from "@/api/trxRequest";
import payment_empty from "@/views/order-gather/payment-empty.vue";

import { payInfoUser } from "@/api/payverification";
import { myPayment } from "@/api/payverification";

import { getItem, getItemSession, setItemSession } from "@/utils/storage";

import saleFllow from "@/components/deal-Fllow/sale-Fllow.vue";
import { loadweb3, userBaseMes } from "@/utils/web3";

export default {
  name: "Currency-Type-content",
  components: {
    PayIcons,
    selectNav,
    saleFllow,
    payment_empty,
  },
  data() {
    return {
      active: 0, // 交易类型列表 当前激活项
      activeIndex: undefined, // 当前正在交易
      // activeSelect: 0, // 当前交易选择类型
      list: [], // 货单交易列表
      listLoading: true,
      pay: "", //支付交易方式列表
      loading: false, // 数据加载
      finished: false,
      isShowTradingPopup: false, // 购买交易弹窗控制
      sellerMthods: myPayment(), //用户可选择的 收款方式
      curTime: 0,
      select_pay_method: 0,
      select_money_range: 0,
      isShow_empty: false,
    };
  },
  provide() {
    return {
      sellerMthods: this.sellerMthods,
    };
  },
  props: ["method", "typeList"],
  created() {
    // this.onLoad({
    //   dtype: 1,
    //   otype: getItem("netType"),
    // });
    //console.log(getItem("netType"))
    this.$toast("正在努力加载中", {
      position: "bottom-right",
      timeout: 500,
    });
    this.$emit("set-cur-state");
    //出售订单出错，关闭出售订单窗口
    this.$bus.$on("close-OrderSaleInfo", () => {
      this.isShowTradingPopup = false;
    });
    // 订单更新
    this.$bus.$on("update-orderlist", () => {
      this.onLoad({
        pay: this.select_pay_method,
        dtype: 1,
        otype: getItem("netType"),
        amount: this.select_money_range,
      });
    });
    loadweb3(userBaseMes);
    setTimeout(() => {
      if (this.listLoading) {
        loadweb3(userBaseMes);
      }
    }, 20000);
  },
  methods: {
    async onLoad(params) {
      // 异步更新数据
      try {
        const { data } = await EotcBuyOrder(params);
        if (data.length == 0) {
          this.isShow_empty = true;
          this.loading = false;
          this.finished = true;
          this.listLoading = false;
          return false;
        }
        this.isShow_empty = false
        const result = await this.filterData(data);
        this.list = result;
        /**
         *  后端排序规则： 除去双方黑名单
         *  低价排名靠前
         *   是否在线
         */
        this.listLoading = false;
        setItemSession("selldataList", result);
      } catch (err) {
        this.list = getItemSession("selldataList");
        this.$toast.warning("数据请求过于频繁");
        console.warn(err);
      } finally {
        this.loading = false;
        this.finished = true;
        this.listLoading = false;
      }
    },
    async filterData(meta_data) {
      let data;
      try {
        data = await UserBind({
          type: 0, // 拉黑
        });
      } catch (err) {
        console.warn(err);
        return meta_data;
      }

      data = data.data;

      if (data.length === 0) {
        return meta_data;
      }

      const Blacklisted_user = [];
      const uid = localStorage.getItem("uid");
      data.forEach((user) => {
        if (uid === user.xid) {
          Blacklisted_user.push(user.uid);
        } else {
          Blacklisted_user.push(user.xid);
        }
      });
      // 1. 过滤掉我的黑名单 和  我被拉黑的用户订单
      meta_data = meta_data.filter((order) => {
        if (Blacklisted_user.includes(order.eid)) {
          // console.log("黑名单用户：", order.sname);
          return false;
        }
        return order;
      });
      return meta_data;
    },
    to_merchantInfo(item) {
      this.$router.push({
        name: "merchantInfo",
        params: {
          sell_Info: item,
        },
      });
    },
    closeModel() {
      this.$refs["sell-popup"].finishReset();
      this.$refs["sell-popup"].closeDelayTimeModel();
    },
    isActive_user(time) {
      const diff_30timeout = this.diff_30timeout(
        this.trsfTime_30timeout(time, 30),
        this.transformTime_Zh(Date.now())
      );

      return diff_30timeout >= 0 ? true : false;
    },
    showModel() {
      //每次打开 交易弹窗，resetCount
      this.$refs["sell-popup"].initTime();
    },
    changePay(pay) {
      this.select_pay_method = pay;
      this.onLoad({
        pay,
        dtype: 1,
        amount: this.select_money_range,
      });
    },
    changeSize(amount) {
      this.select_money_range = amount;
      this.onLoad({
        amount,
        dtype: 1,
        pay: this.select_pay_method,
      });
    },
    SubmitTrading(index) {
      let time = Date.now();
      if (time - this.curTime < 1000) {
        return false;
      } else {
        //出售订单
        this.curTime = time;
        this.activeIndex = index;
        // this.isShowTradingPopup = true;
        const userInfo = payInfoUser();
        // 收款方式是否满足
        if (this.payverification(userInfo) && this.isSatisfyPaymentMethod()) {
          this.isShowTradingPopup = true; // 前提条件完成，弹出出售窗口
        }
      }
    },
    payverification({ iskyc, csnum, userdsx, myjifen }) {
      let payVeriFicationCount = 0;
      // iskyc 实名认证审核通过 为2
      this.$toast.clear();
      if (iskyc === "2") {
        payVeriFicationCount += 1;
      } else {
        this.$toast.error(
          <div>
            <p style="font-size:13px;margin:5px">
              需要实名认证之后才能进行交易
            </p>
            <p style="font-size:13px;margin:5px">请您先完成实名认证！</p>
          </div>
        );

        return false;
      }
      //xdnum 下单数量 0
      if (csnum === "0") {
        payVeriFicationCount += 1;
      } else {
        this.$toast.error(
          <div>
            <p style="font-size:13px;margin:5px">
              您存在一笔正在进行的出售订单，
            </p>
            <p style="font-size:16px;margin:5px">处理完成后方可继续交易!</p>
          </div>
        );
        return false;
      }
      // 取消订单次数 每日8次  凌晨清零
      if (userdsx >= "0") {
        payVeriFicationCount += 1;
      } else {
        this.$toast.warning("您已连续多次撤销订单，请明天再下单！");
        return false;
      }
      // myjifen 用户积分必须大于10
      if (Number(myjifen) >= 10) {
        payVeriFicationCount += 1;
      } else {
        this.$toast.error("您积分已不足 10 ，无法出售！");
        return false;
      }
      return payVeriFicationCount === 4;
    },
    isSatisfyPaymentMethod() {
      const payMent = this.getCurPayList(this.list[this.activeIndex]);
      const viodFlg = Object.keys(this.sellerMthods).some(
        (payMethod) =>
          payMent.includes(payMethod) && this.sellerMthods[payMethod]
      );
      if (viodFlg) {
        return true;
      } else {
        this.$toast.clear();
        this.$toast.warning("您没有填写该收付款方式");
        return false;
      }
    },
    // 获得商家订单的 全部打款方式
    getCurPayList(item) {
      const Icons = [];
      function hasCurrentPay(value) {
        return Boolean(value.split("&")[1]);
      }
      for (const key of Object.keys(item)) {
        switch (key) {
          case "bank":
            if (hasCurrentPay(item[key])) {
              Icons.push("yhk", "mybank");
            }
            break;
          case "aipay":
            if (hasCurrentPay(item[key])) {
              Icons.push("zfb", "myalipay");
            }
            break;
          case "wechat":
            if (hasCurrentPay(item[key])) {
              Icons.push("wx", "mybmywechatnk");
            }
            break;
        }
      }
      return Icons;
    },
    currency_Change(tag_Name, title) {
      this.$toast.clear();
      if (title !== "USDT") {
        this.$toast.error(`目前暂时不支持 ${title}`);
        this.$nextTick(() => {
          this.active = 0;
        });
        return false;
      }
    },
  },
  filters: {
    ThousandSeparator(value) {
      if (!value) return "";
      return (
        value &&
        value
          .toString()
          .replace(/(^|\s)\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ","))
      );
    },
  },
};
</script>

<style lang="less" scoped>
@color-down: #e35e5e;
.currency {
  width: 100vw;
  position: relative;
  z-index: 0;
  top: 100px;
  /deep/ .van-tab--active {
    color: #000;
  }

  .comfig-button {
    background-color: #2483ff;
    color: #fff;
    width: 140px;
    border-radius: 10px;
  }
  .icon-jiantou {
    position: absolute;
    right: 20px;
    top: 28px;
  }
   .store{
    width: auto !important;
  }
  .left {
    display: flex;
    // width: 6rem;
    // color: #969799;
    align-items: center;

    font-size: 26px;
    padding: 10px 0 0 0;
    .text {
      color: #000;
      font-weight: 700;
    }

    .aut-img {
      width: 64px;
      margin-right: 10px;
      display: block;
      height: 64px;
      line-height: 64px;
      position: relative;
      text-align: center;
      border-radius: 50%;
      color: #fff;
      background-color: #2483ff;
      .online-icon {
        position: absolute;
        bottom: 0px;
        right: 10px;
        flex-direction: column;
        justify-content: center;
        display: flex;
        align-items: center;
      }
      .online-status {
        width: 10px;
        height: 10px;
        background: #00b464;
        border: 1px solid #fff;
        border-radius: 50%;
      }
    }
  }
  .right {
    line-height: 64px;
    font-size: 24px;
    vertical-align: middle;
    .txt {
      color: @color-down;
    }
  }
}

.selsect {
  position: sticky;
  top: 190px;
  z-index: 5;
}
/deep/ .van-tabs__wrap {
  position: sticky !important;
  top: 20px;
  z-index: 3;
  width: 100vw;
  overflow-x: auto;
  // background-color: #eee;
}
// /deep/ .van-tabs__content {
// padding-top: 180px !important;
// }

.van-cell::after {
  border-bottom: none;
}
</style>
