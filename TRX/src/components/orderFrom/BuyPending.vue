<template>
  <div class="content">
    <VueLoading
      v-if="showLoading"
      type="spiningDubbles"
      :size="{ width: '35px', height: '35px' }"
      :style="{ fill: 'rgb(219,9, 9)' }"
    ></VueLoading>
    <van-empty
      class="null"
      v-else-if="dataList.length == 0"
      description="暂无订单信息"
    />

    <div v-else class="order" v-for="(item, index) in dataList" :key="index">
      <div class="title">
        <p>
          <span>订单号</span>&nbsp;
          <span>{{ item.odid }}</span>
          <span>（{{ item.id }}）</span>
        </p>
        <span class="text-color" @click="to_buyerOrder_will(item)">
          <van-icon badge="1">
            <i class="iconfont icon-document" />
          </van-icon>
        </span>
      </div>
      <div class="text">
        <div>
          <p>对方质押数量</p>
          <p class="text-color">{{ item.stake }} EOTC</p>
        </div>
        <div>
          <p>交易数量</p>
          <p>{{ item.num }} USDT</p>
        </div>
        <div>
          <p>交易单价</p>
          <p>{{ item.cny }} CNY</p>
        </div>
        <div>
          <p>交易总价</p>
          <span class="text-color">{{ item.amount1 }} CNY</span>
        </div>
        <div>
          <p>卖家收款方式</p>
          <p>
            <span
              v-if="!isContractCheckList[index]"
              :style="{ color: 'red' }"
              @click="handleContractCheck(item, index)"
              >请先校验合约&nbsp;<van-icon name="arrow"
            /></span>
            <span v-else :style="{ color: '#999' }"
              >详细信息&nbsp;<van-icon name="arrow-down"
            /></span>
          </p>
        </div>
        <div v-if="isContractCheckList[index]">
          <div class="payInfo">
            <p>
              <span>收款方姓名</span>
              <span>{{ item.mes }}&nbsp;( {{ item.amount2 }} )</span>
            </p>
            <p>
              <span>收款方式</span>
              <span>
                <i v-if="getPayInfo(item)[2].trim() === '现金交易'">
                  <img
                    class="xj_moeny"
                    :style="{ marginTop: '5px' }"
                    src="@/assets/currency-icons/moeny-c.png"
                    alt=""
                  />
                </i>
                <i
                  v-else-if="getPayInfo(item)[2].trim() === '支付宝'"
                  :class="[
                    'iconfont',
                    `icon-zfb`,
                    `pay-iconzfb1`,
                    `pay-iconzfb`,
                  ]"
                ></i>
                <i
                  v-else-if="getPayInfo(item)[2].trim() === '微信'"
                  :class="['iconfont', `icon-wx`, `pay-iconwx`, `pay-icon3`]"
                ></i>
                <i
                  v-else
                  :class="['iconfont', `icon-yhk`, `pay-icon1`, `pay-iconyhk`]"
                ></i>
                &nbsp;{{ getPayInfo(item)[2] }}
              </span>
            </p>
            <p v-if="getPayInfo(item)[2].trim() !== '现金交易'">
              <span>收款账号</span>
              <span :style="{ color: '#f55d07' }">
                {{ getPayInfo(item)[1] }}
                &nbsp;
                <i
                  class="iconfont icon-copy"
                  :style="{ color: '#000' }"
                  @click="handleCopy(getPayInfo(item)[1])"
                ></i>
              </span>
            </p>
          </div>
        </div>
        <div>
          <p>提交时间</p>
          <p>{{ item.eotc }}</p>
        </div>
      </div>
      <div class="button">
        <section></section>
        <van-button
          round
          :disabled="!isContractCheckList[index]"
          type="info"
          @click="sure(item)"
        >
          确认已付款
        </van-button>
      </div>
    </div>

    <van-popup
      v-model="show"
      @close="close"
      :close-on-click-overlay="isclose_on_click_overlay"
      round
      closeable
      position="bottom"
      get-container="body"
    >
      <div class="pop-content">
        <p class="title">确认已付款</p>
        <van-divider />
        <p class="text">
          尚未付款就点击<span :style="{ color: 'red' }">【我已完成转账】</span
          >将被视为恶意操作，<span :style="{ color: 'red' }"
            >恶意操作会冻结用户</span
          >
        </p>
        <ul>
          <li>
            <span>转账金额</span>
            <span
              >￥
              {{ activeItem.amount1 }}
            </span>
          </li>
          <li>
            <span>收款账号</span>
            <span
              :style="{ display: 'flex', alignItems: 'center' }"
              v-if="getPayInfo(activeItem)[2].trim() === '现金交易'"
            >
              <img
                class="xj_moeny"
                src="@/assets/currency-icons/moeny-c.png"
                alt="xj"
              />
              &nbsp;&nbsp;
              <span>现金交易</span>
            </span>
            <span v-else>
              <i
                v-if="getPayInfo(activeItem)[2].trim() === '支付宝'"
                :class="['iconfont', `icon-zfb`, `pay-iconzfb1`, `pay-iconzfb`]"
              ></i>
              <i
                v-else-if="getPayInfo(activeItem)[2].trim() === '微信'"
                :class="['iconfont', `icon-wx`, `pay-iconwx`, `pay-icon3`]"
              ></i>
              <i
                v-else
                :class="['iconfont', `icon-yhk`, `pay-icon1`, `pay-iconyhk`]"
              ></i>
              {{ getPayInfo(activeItem)[2] }}
              ({{ getPayInfo(activeItem)[1] | filterContent }})</span
            >
          </li>
        </ul>
        <van-checkbox shape="square" v-model="checked">我已确认</van-checkbox>
        <div class="button">
          <van-button
            class="pop-button"
            @click="finish"
            round
            color="#1B2945"
            block
            :disabled="!checked"
            >我已完成转账</van-button
          >
          <p @click="close">我再想想</p>
        </div>
      </div>
    </van-popup>

    <van-dialog
      v-model="isContractCheckLoading"
      get-container="body"
      :showConfirmButton="false"
    />
  </div>
</template>

<script>
import { Eotcdis_Order, UpdateOrderType } from "@/api/trxRequest";

import { GetmyUSDT_User } from "@/utils/web3";

import loadingToast from "@/components/loading-toast";

import { VueLoading } from "vue-loading-template";

export default {
  // 待处理订单
  name: "pending-order",
  components: {
    VueLoading,
  },
  data() {
    return {
      show: false,
      checked: false,
      dataList: [],
      showLoading: true, // 加载loading
      activeItem: { sname: "xxx&xxx&xxx", amount1: "0" },
      isContractCheckList: [], // 合约校验结果列表
      isContractCheck: false, // 是否已校验合约
      isContractCheckLoading: false, //合约校验中的 loading
      isclose_on_click_overlay: true,
    };
  },
  created() {
    this.initData();
  },
  filters: {
    filterContent(value) {
      return value.slice(0, 3) + "*".repeat(6) + value.slice(-3);
    },
  },
  methods: {
    async sure(item) {
      if (!item.updateDate) {
        this.show = true;
        this.activeItem = item;
      } else {
        this.$toast.clear();
        this.$toast.warning("该订单正在仲裁中！");
      }
    },
    close() {
      this.show = false;
      this.checked = false;
    },
    async finish() {
      this.isclose_on_click_overlay = false;
      this.$toast.warning(
        {
          component: loadingToast,
        },
        {
          icon: false,
          timeout: false,
        }
      );
      try {
        //跟新订单状态
        await UpdateOrderType({
          did: this.activeItem.id,
          mail: this.activeItem.aipay,
          busPay: this.getPayInfo(this.activeItem)[2].trim(),
        });
        this.initData(); //更新数据
      } catch (err) {
        console.warn(err);
      }
      this.show = false;
      this.$toast.clear();
      this.isclose_on_click_overlay = true;
    },
    //校验合约
    async handleContractCheck(item, index) {
      if (item.updateDate) {
        this.$toast.clear();
        this.$toast.warning("该订单正在仲裁中！");
        return false;
      }

      this.isContractCheckLoading = true;
      this.$toast.warning(
        {
          component: loadingToast,
          props: {
            title: "合约校验中，请等待...",
          },
        },
        {
          icon: false,
          timeout: false,
        }
      );
      try {
        await GetmyUSDT_User(item.id, item.num);
        this.isContractCheckList[index] = true;
        this.$toast.clear();
        this.$toast.success("合约校验通过,可以给对方进行汇款！");
      } catch ({ usdt, zads }) {
        console.log(usdt);
        this.$toast.clear();
        this.$toast.error(
          <div>
            <span style="font-size:15px;color:rgb(230,212,82)">订单异常</span>
            <p style="font-size:14px;">合约中订单余额为：{usdt}</p>
            <p style="font-size:14px;line-height:24px">
              订单绑定的地址为：{zads}
            </p>
          </div>,
          {
            icon: false,
            timeout: false,
            showCloseButtonOnHover: false,
          }
        );
      } finally {
        this.isContractCheckLoading = false;
      }
    },
    initData() {
      const uid = localStorage.getItem("uid");
      Eotcdis_Order({
        uid,
      }).then((data) => {
        this.dataList = data.data;
        this.isContractCheckList = [];
        for (let i = data.data.length; i >= 0; i--) {
          this.isContractCheckList.push(false);
        }
        this.showLoading = false;
      });
    },
    getPayInfo(item) {
      if (!item.sname) return ["", "", ""];
      const value = item.sname.split("&");
      return value;
    },
    handleCopy(val) {
      this.$toast.clear();
      this.$copyText(val).then(
        (e) => {
          this.$toast.success("账号 已复制");
        },
        (e) => {
          this.$toast.error("请稍后重试");
        }
      );
    },
    to_buyerOrder_will(cur_item) {
      this.$router.push({
        name: "sellerBuy-water-bill",
        params: {
          item: cur_item,
          odid: cur_item.id,
          MerchanInfo: {
            odid: cur_item.id,
          },
        },
        query: {
          role: "seller",
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.van-dialog {
  display: none;
}
.content {
  position: relative;
  min-height: 50vh;
  .vue-loading {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  padding-bottom: 96px;
}
.text-color {
  color: #fc7542;
}
.order {
  margin: 24px;
  padding: 35px 32px 40px;
  font-size: 28px;
  background: #fff;
  color: #333;
  border-radius: 20px;
  .title {
    margin-bottom: 56px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    p {
      display: flex;
      align-items: center;
      font-size: 28px;
      font-weight: bold;
      height: 40px;
      line-height: 40px;
      span {
        display: flex;
        align-items: center;
      }
    }
    i {
      font-size: 40px;
    }
  }
  .text {
    margin-bottom: 30px;
    div {
      flex: 1;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      p:first-child {
        color: #999999;
      }
      .quota {
        color: #333 !important;
        display: flex;
        flex-flow: column;
        text-align: right;
      }
    }
  }
  .button {
    margin: 20xp;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.payInfo {
  display: flex;
  flex-direction: column;
  span {
    color: #999999;
    display: flex;
    align-items: center;
  }
  p {
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 0.7rem;
  }
}

.pop-content {
  padding: 32px;
  font-size: 28px;
  ul {
    margin-bottom: 25px;
  }
  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
  }
  .title {
    font-size: 40px;
    font-weight: bold;
    color: #1b2945;
    margin-bottom: 30px;
  }
  .text {
    margin-bottom: 40px;
    padding: 25px;
    color: #000;
    line-height: 45px;
    background-color: #eee;
    border-radius: 15px;
  }
  .button {
    margin-top: 40px;
    font-size: 32px;
    display: flex;
    flex-flow: column;
    align-items: center;
    p {
      padding: 40px 0 8px;
    }
  }
}
</style>
>
