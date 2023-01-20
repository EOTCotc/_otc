<template>
  <div class="chooseWay">
    <main class="left">
      <div class="mid">
        <van-button
          @click="trading"
          class="buysell"
          :class="{ 'active-btn': !curState }"
          plain
          size="small"
          :to="{
            name: 'CurrencyTrading',
          }"
        >
          购买
        </van-button>
        <van-button
          @click="sell"
          :class="{ 'active-btn': curState }"
          class="btn2 buysell"
          plain
          size="small"
          :to="{
            name: 'outflows',
          }"
        >
          出售
        </van-button>

        <!-- 选择当前交易货币类型 -->
        <van-button @click="handleClick" class="cny-text" size="small">
          <CurCurrencyType
            @show-currency-type="handleClick"
            :showCurrencyType="showCurrencyType"
            :payType="CurrencyId"
          ></CurCurrencyType>
        </van-button>

        <!-- 当前支链交易类型 -->

        <template>
          <van-button class="curChain" size="small">{{ curChain }}</van-button>
        </template>
        <!-- <van-popover
          v-model="showPopover"
          trigger="click"
          :actions="actions"
          @select="onSelect"
          @open="onOpen"
          @close="onClose"

        >
          <template #reference>
            <van-button  class="curChain" size="small">{{
              curChain
            }}</van-button>
            <van-icon
              :name="showcurChainType ? 'arrow-up' : 'arrow-down'"
              class="payType-icon"
            />
          </template>
        </van-popover> -->

        <!-- 选择当前交易货币类型弹窗 -->
        <van-popup
          :close-on-popstate="true"
          v-model="showCurrencyType"
          round
          position="bottom"
          :style="{ height: '70%' }"
        >
          <div class="searchType">
            <van-form
              @submit="onSearch"
              validate-trigger="onBlur"
              ref="CurrencyTypeipt"
              class="ipt"
            >
              <van-field
                name="moneyTtype"
                v-model.trim.lazy="moneyTtype"
                validate-trigger="onBlur"
                placeholder="搜索"
                :rules="CurrencyRules"
              />
            </van-form>
            <!-- title="默认货币"  label="CNY"  -->
            <div class="Currency">
              <div class="defaultCurrency">默认货币</div>
              <div @click="changeCurID('CNY')">
                <span class="span1">CNY</span>
                <van-icon
                  name="success"
                  class="van-icon1"
                  v-if="CurrencyId == 'CNY'"
                />
              </div>
            </div>

            <!-- 货币可选择交易类型 -->
            <div class="CurrencyList">
              <div class="defaultCurrency">全部</div>
              <div
                class="CurrencyContent"
                v-for="imgnAme in searchStatus ? seachcountrie : countrieImgs"
                :key="imgnAme"
                @click="changeCurID(imgnAme)"
              >
                <!-- 注意 图片路径  -->
                <img
                  :src="require('@/assets/countrie-imgs/' + imgnAme + '.png')"
                  alt="资源未找到"
                />
                <span class="span1">{{ imgnAme }}</span>
                <van-icon
                  name="success"
                  class="van-icon2"
                  v-if="CurrencyId == imgnAme"
                />
              </div>
            </div>
          </div>
        </van-popup>
      </div>
    </main>
    <!-- :key="randomKey" -->

    <router-view
      @set-cur-state="setCurState"
      :typeList="typeList"
      ref="dataList"
    ></router-view>

    <!-- 右侧图标小工具 -->
    <div class="right">
      <span class="icon-span" v-if="false">
        <i class="iconfont icon-document"></i>
      </span>
      <span>
        <van-popover v-model="shortcut" trigger="click" :offset="[-60, 8]">
          <van-grid
            square
            clickable
            :border="false"
            column-num="1"
            style="width: 120px"
            direction="horizontal"
          >
            <van-grid-item
              v-for="(active, index) in shortcutActions"
              :key="index"
              :badge="active.badge"
              :text="active.text"
              :icon="active.icon"
              @click="utils_toView(active)"
              :to="handle_toView(active)"
            >
            </van-grid-item>
          </van-grid>

          <template #reference>
            <i class="iconfont icon-zhankai"></i>
          </template>
        </van-popover>
      </span>
    </div>
  </div>
</template>

<script>
import CurCurrencyType from "@/components/select-Currency-species";

import PubSub from "pubsub-js";

import { UpdateOrder } from "@/api/trxRequest";
import { getItem } from "@/utils/storage";

export default {
  name: "ChooseWay",
  components: {
    CurCurrencyType,
  },
  inject: ["reload"],
  data() {
    return {
      token: null,
      typeList: [],
      curState: true, // 买币 和 卖币切换
      showCurrencyType: false, // 选择货币类型 弹窗
      moneyTtype: "", //交易货币类型
      showcurChainType: false,
      shortcut: false,
      undone_order: undefined,
      shortcutActions: [
        {
          text: "订单",
          icon: require("@/assets/tools-svg/order_2.svg"),
          badge: this.undone_order,
          view_name: "orderGather-full",
        },
        {
          text: "委托单",
          icon: require("@/assets/tools-svg/wtd.svg"),
          view_name: "order-Ticket",
        },
        {
          text: "收付款设置",
          icon: require("@/assets/tools-svg/sfk.svg"),
          view_name: "receivingList",
        },
        {
          text: "新手引导",
          icon: require("@/assets/tools-svg/xsyz.svg"),
          isLink: true,
          view_name: "https://eotc.im/html/guide/guide.html",
        },
        {
          text: "关注",
          icon: require("@/assets/tools-svg/gz.svg"),
          // view_name: "important-userList",
          query: {
            source: "concern",
          },
        },
        {
          text: "黑名单",
          icon: require("@/assets/tools-svg/hmd.svg"),
          // view_name: "important-userList",
          query: {
            source: "blacklist",
          },
        },
        {
          text: "系统语言",
          icon: require("@/assets/tools-svg/yy.svg"),
        },
        {
          text: "常见问题",
          icon: require("@/assets/tools-svg/cjwt.svg"),
          isLink: true,
          view_name: "https://eotc.im/html/question/question.html",
        },
        {
          text: "在线客服",
          icon: require("@/assets/tools-svg/kf.svg"),
        },
      ],
      showPopover: false, // 支链弹窗
      curChain: localStorage.getItem("netType")?.toUpperCase() ?? "", // 当前支公链
      actions: [
        // 当前支链集合
        { text: "TRX" },
        { text: "BSC" },
        { text: "HECO" },
        { text: "ETH" },
      ],
      searchStatus: false, // 搜索状态
      CurrencyId: "CNY", //当前支付类型 货币
      countrieImgs: ["AUD", "CAD", "EUR", "INR", "JPY", "KRW", "THB", "USD"],
      seachcountrie: [], // 搜索
      CurrencyRules: [
        {
          validator: this.validator,
        },
      ],
    };
  },
  destroyed() {
    PubSub.unsubscribe(this.token);
  },
  created() {
    this.token = PubSub.subscribe("setUid", () => {
      this.get_Order_num();
    });
  },
  methods: {
    setCurState() {
      if (this.$route.name === "outflows-center") {
        this.curState = false;
      } else {
        this.curState = true;
      }
    },
    utils_toView(view) {
      if (view.view_name === "order-Ticket") UpdateOrder(getItem("uid"));
      if (view.isLink) window.location.href = view.view_name; // https://eotc.im/html/guide/guide.html

      if (!view.view_name) {
        this.$toast.clear();
        this.$toast.warning("此功能暂未开放，请等待！");
      }
    },
    get_Order_num() {
      const xdnum = localStorage.getItem("xdnum") === "0" ? 0 : 1;
      const csnum = localStorage.getItem("csnum") === "0" ? 0 : 1;
      const bsnum = localStorage.getItem("bsnum");
      const netType = localStorage.getItem("netType");
      this.curChain = netType?.toUpperCase();
      if (this.curChain === "BSC") {
        this.typeList = ["USDT", "USDC", "BTC", "ETH", "BNB"];
      } else {
        this.typeList = ["USDT", "USDC", "BTC", "ETH", "TRX"];
      }
      if (this.curState) {
        this.$refs["dataList"]?.onLoad();
      } else {
        this.$refs["dataList"]?.onLoad(
          {
            dtype: 1,
          },
          1
        );
      }
      this.shortcutActions[0].badge =
        xdnum + csnum + Number(bsnum) === 0
          ? undefined
          : xdnum + csnum + Number(bsnum);
    },
    handle_toView(view) {
      return {
        name: view.view_name,
        query: view.query,
      };
    },
    trading() {
      // 购买状态
      this.curState = true;
    },
    sell() {
      // 出售状态
      this.curState = false;
    },
    handleClick() {
      this.showCurrencyType = true;
    },
    changeCurID(payType) {
      this.$toast.clear();
      if (payType) {
        this.$toast.warning("暂时不支持切换 法币交易！！！");
        return false;
      }
      this.CurrencyId = payType;
      this.showCurrencyType = false;
    },
    onSearch(e) {
      console.log(e);
    },
    onSelect(action) {
      // if(action.text==='TRX'){
      //     location.href = 'https://trx.eotc.im'
      // }else if(action.text==='BSC'){
      //   location.href = 'https://bsc.eotc.im'
      // }else{
      //   this.$toast.warning(`暂不支持 ${action.text} 链`)
      // }
    },
    onOpen() {
      // this.showcurChainType = true;
    },
    onClose() {
      // this.showcurChainType = false;
    },
    validator(val) {
      if ((val ?? "") === "") {
        this.searchStatus = false; //搜索状态下 会产生 temp 列表 给用户展示
        return false;
      }
      this.searchStatus = true; //搜索状态下 会产生 temp 列表 给用户展示
      this.seachcountrie = this.countrieImgs.filter((type) => {
        return type.toLowerCase().includes(val.toLowerCase());
      });
      return /\w+/gi.test(val) || "";
    },
  },
  computed: {
    randomKey() {
      return Math.random(1, 100);
    },
  },
};
</script>

<style lang="less" scoped>
.van-grid-item {
  padding-top: 100px !important;
}

.chooseWay {
  width: 100vw;
  display: flex;
  position: relative;

  .left {
    flex: 1;
    /deep/ .van-tab {
      flex: auto !important;
    }
    /deep/ .van-tabs__wrap {
      z-index: 2;
      position: fixed;
      height: 70px;
      .van-tab {
        padding: 0 15px;
      }
    }
    /deep/ .van-tabs__content {
      padding-top: 70px;
    }
  }
  .curChain {
    border: none !important;
  }
  /deep/ .van-button::before {
    background-color: transparent !important;
  }
  .ipt {
    border: 1px solid #ebedf0;
    margin: 50px 40px 0 40px;
    border-radius: 15px;
    .van-field {
      padding: 10px 10px 10px 20px;
      background-color: #eee;
    }
  }
  .Currency,
  .CurrencyList {
    margin: 40px 0 0 40px;
    position: relative;
    padding: 10px 0 30px 0;
    border-bottom: 2px solid #eee;
    .van-icon1 {
      position: absolute;
      right: 20px;
      top: 60px;
      color: #2483ff;
    }
  }
  .CurrencyList {
    border: none;
    .CurrencyContent {
      display: flex;
      align-items: center;
      position: relative;
      margin-top: 40px;
      .van-icon2 {
        position: absolute;
        right: 20px;
        color: #2483ff;
      }
      img {
        width: 60px;
        border-radius: 50%;
        margin: 0px 20px 0 0px;
      }
    }
  }
  .defaultCurrency {
    font-size: 20px;
  }
  .span1 {
    font-size: 50px;
  }
  /deep/ .van-tabs__line {
    background-color: #2483ff !important;
  }
  .right {
    position: fixed;
    right: 0;
    top: 95px;
    z-index: 2;
  }

  .el-dropdown-link {
    cursor: pointer;
    color: #409eff;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .select-test2 {
    margin-left: 10px;
  }
  .mid {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    position: fixed;
    top: 93px;

    height: 100px;
    z-index: 2;
    width: 100%;
    flex-wrap: wrap;
    .van-button {
      margin-top: 7px;
      width: 150px;
      height: 70px;
      color: #000;
      line-height: 70px;
    }
    .buysell {
      background-color: var(--main--color);
      color: #fff;
    }
    .active-btn {
      background-color: rgb(235, 235, 235);
      color: #646566;
    }
    .van-popover__wrapper {
      line-height: 60px;
      height: 60px;
      width: 130px;
      margin-top: 7px;
      position: relative;
      background-color: transparent;
      .van-button {
        margin: 0;
        top: 0;
        position: absolute;
        line-height: 60px;
        height: 60px;
        line-height: 60px;
        color: #000;
        background-color: transparent;
        padding: 0;
      }
      .payType-icon {
        font-size: 0.32rem;
        position: absolute;
        right: -5px;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }

    .cny-text {
      font-size: 0.32rem;
      line-height: 42px;
      background-color: #fff;
      border: none;
      position: relative;
    }
  }
}
.btn2 {
  margin-left: -2px;
}
.iconfont {
  font-size: 40px;
  padding: 15px;
  display: inline-block;
  transform: rotateY(180deg);
}

.icon-zhankai:hover {
  background-color: #ebedf0;
  border-radius: 50%;
}
</style>

<style>
.van-popover__arrow {
  display: none;
}
.van-icon__image {
  font-size: 0.6rem !important;
}

.van-grid-item__content--horizontal
  .van-grid-item__icon
  + .van-grid-item__text {
  margin-top: 6px;
}
.van-grid-item__content {
  justify-content: flex-start;
}
</style>
