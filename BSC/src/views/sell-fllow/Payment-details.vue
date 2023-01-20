<template>
  <div class="order-pay-container">
    <div class="header-div">
      <van-icon name="arrow-left" @click="$router.go(-1)" />
      <span class="hd-txt">
        <van-icon @click="gotoRelation">
          <van-icon name="orders-o" :badge="badge" />
        </van-icon>
      </span>
    </div>

    <header class="header">
      <h4 class="title">买家已付款</h4>
      <div class="pay-timeDown">
        <div class="pay-text">买家已标记为转账成功，请确认收款</div>
      </div>
    </header>

    <!-- 边框线 -->
    <van-divider
      :style="{
        borderColor: 'rgb(177,177,177)',
        margin: '15px 0 18px 0',
        padding: '0 16px',
      }"
    />

    <!-- 订单主要信息 -->
    <main class="main">
      <div class="top-text">
        <img
          class="icon-img"
          :src="require('@/assets/currency-icons/usdt.svg')"
          alt=""
        />
        <span>出售 USDT</span>
      </div>
      <div class="top-main">
        <ul>
          <li @click="showPayInfo(cacheData.item.id)">
            <span>交易主链</span>
            <span>
              {{ netType }}
              <van-icon name="arrow" />
            </span>
          </li>
          <li
            v-show="isShowPayInfo"
            @click="copyContent(myaddress, '钱包地址 已复制')"
          >
            <span>交易钱包</span>
            <span>
              {{ briefMyAddress(myaddress) }}
              <i class="iconfont icon-copy" :style="{ color: '#999' }"></i
            ></span>
          </li>
          <li
            v-show="isShowPayInfo"
            @click="
              copyContent(
                cacheData.MerchanInfo.bank.trim(),
                '商家钱包地址 已复制'
              )
            "
          >
            <span>商家钱包</span>
            <span>
              {{ briefMyAddress(cacheData.MerchanInfo.bank.trim()) }}
              <i class="iconfont icon-copy" :style="{ color: '#999' }"></i
            ></span>
          </li>
          <li
            v-show="isShowPayInfo"
            @click="copyContent(contractAddress, '合约地址 已复制')"
          >
            <!-- 新增合约地址 -->
            <span>合约地址</span>
            <span>
              {{ briefMyAddress(contractAddress) }}
              <i class="iconfont icon-copy" :style="{ color: '#999' }"></i
            ></span>
          </li>
          <li>
            <span>单价</span>
            <span>￥{{ cacheData.item.cny }}</span>
          </li>
          <li>
            <span>数量</span>
            <span>{{ cacheData.num }} USDT</span>
          </li>
          <li>
            <span>总金额</span>
            <span
              class="importan-tTsxt"
              @click="
                copyContent(
                  ThousandSeparator(cacheData.totalMoney),
                  '总金额 复制成功'
                )
              "
              >￥{{ ThousandSeparator(cacheData.totalMoney) }}.00
              <i class="iconfont icon-copy" :style="{ color: '#999' }"></i
            ></span>
          </li>
          <li>
            <span>手续费</span>
            <span>{{ cacheData.item.service_charge }} USDT</span>
          </li>
          <li v-if="cacheData.item.cash === '-1'">
            <span>收款方式</span>
            <span :style="{ display: 'flex', alignItems: 'center' }">
              <img
                class="xj_moeny"
                src="@/assets/currency-icons/moeny-c.png"
                alt="xj"
              />
              &nbsp;&nbsp;
              <span>现金交易</span>
            </span>
          </li>
          <li class="payInfo" v-else-if="cacheData.item.cash !== '-1'">
            <span>收款方式</span>
            <span :style="{ display: 'flex', position: 'relative' }">
              <payIcons
                :style="{ marginRight: '10px' }"
                :items="cacheData.item"
                :cuePayType="cacheData.curpaymentterm"
              />
              {{ paytype(cacheData.curpaymentterm) }}
            </span>
          </li>

          <li v-if="cacheData.item.cash !== '-1'">
            <span>收款账号</span>
            <span v-if="cacheData.curpaymentterm === 'yhk'">
              {{ cacheData.sellerMthods.mybank.split("&")[1] }}
              {{ cacheData.sellerMthods.mybank.split("&")[0] }}
            </span>
            <span v-else-if="cacheData.curpaymentterm === 'zfb'">
              {{ cacheData.sellerMthods.myalipay }}
            </span>
            <span v-else-if="cacheData.curpaymentterm === 'wx'">
              {{ cacheData.sellerMthods.mybmywechatnk }}
            </span>
            <span v-else> 现金交易 </span>
          </li>
          <li class="van-divider"></li>
          <li>
            <span>卖家昵称</span>
            <span>
              {{ cacheData.item.sname }}
              <img
                class="info-rz"
                src="@/assets/currency-icons/rz.png"
                alt="fig"
              />
            </span>
          </li>
          <li>
            <span>订单编号</span>
            <span @click="copyContent(cacheData.item.id, '订单编号 已复制')">
              {{ cacheData.item.id }}
              （{{ cacheData.MerchanInfo.odid }}）
              <i class="iconfont icon-copy" :style="{ color: '#999' }"></i>
            </span>
          </li>
          <li>
            <span>下单时间</span>
            <span>{{ cacheData.item.order_time | transformTime_Zh }}</span>
          </li>
        </ul>
      </div>
    </main>

    <article class="Riskwarning">
      买家转账时备注或您收到非实名汇款，请联系卖家退回或发起仲裁
    </article>

    <!-- 底部 该收款按钮，默认禁用状态，买家点击已付款后，会变色，可以点击确认，
         买家没点付款前灰色，禁用状态不能点击-->
    <footer class="footer">
      <div :class="{ next: !isDisabled, 'default-pd': isDisabled }">
        <van-button
          :disabled="isDisabled"
          @click="$toast.warning('仲裁功能暂未开放，请等待！')"
          class="appeal"
          type="default"
        >
          <span>仲裁</span>&nbsp;
          <van-count-down
            ref="countDown"
            v-if="isDisabled"
            @finish="finishReset"
            :time="cacheData.appealTime"
            format="mm:sss"
          />
        </van-button>
      </div>
      <div class="cancel">
        <van-button @click="PaymentInfoAffirm">我已收到付款</van-button>
      </div>
    </footer>

    <!-- start 出售 收款详细信息窗口 -->
    <van-popup
      :close-on-popstate="true"
      closeable
      v-model="showPaymentInfoAffirmWindow"
      get-container="body"
      position="bottom"
      class="saleInfo"
      :style="{ height: '500px' }"
    >
      <div class="PaymentInfoAffirm">
        <h6 class="PaymentInfoAffirm-info">确认收款</h6>
        <van-divider
          :style="{
            color: '#1989fa',
            borderColor: '#eee',
            padding: '0 3px',
          }"
        >
        </van-divider>
        <div class="notice-bar">
          <van-notice-bar
            wrapable
            :scrollable="false"
            text="请去第三方平台仔细核对以下收款信息，点击确认收款，合约将放币给对方。"
          />
        </div>
        <ul>
          <li>
            <div>1.打开第三方收款账号</div>
            <span
              :style="{ display: 'flex', height: '30px ' }"
              v-if="cacheData.item.cash === '-1'"
            >
              <span :style="{ display: 'flex', alignItems: 'center' }">
                <img
                  class="xj_moeny"
                  src="@/assets/currency-icons/moeny-c.png"
                  alt="xj"
                />
                <span>现金交易</span>
              </span>
            </span>
            <span :style="{ display: 'flex' }" v-else>
              <payIcons
                :style="{ marginRight: '10px' }"
                :items="cacheData.item"
                :cuePayType="cacheData.curpaymentterm"
              />
              {{ paytype(cacheData.curpaymentterm) }}
            </span>
          </li>
          <li>
            <div>2.确认到账金额</div>
            <span>
              <span
                class="importan-tTsxt"
                @click="
                  copyContent(
                    ThousandSeparator(cacheData.totalMoney),
                    '到账金额 复制成功'
                  )
                "
                >￥{{ ThousandSeparator(cacheData.totalMoney) }}.00 &nbsp;&nbsp;
                <i class="iconfont icon-copy" :style="{ color: '#999' }"></i
              ></span>
            </span>
          </li>

          <li v-if="get_other_name() === '现金交易'">
            <div>3.我确认付款人信息</div>
            <span
              class="payFullinfo"
              :style="{ paddingTop: '20px !important' }"
              v-if="cacheData.item.cash === '1'"
            >
              付款方式：现金交易
            </span>
          </li>

          <li v-else>
            <div>3.我确认付款人信息</div>
            <span
              class="payFullinfo"
              :style="{ paddingTop: '20px !important', color: 'red' }"
            >
              付款人姓名：{{ get_other_name() }}
            </span>
            <span class="payFullinfo" v-if="cacheData.item.cash !== '-1'">
              付款方式：
              {{ cacheData.MerchanInfo.payment_account[0] }}
            </span>
            <span class="payFullinfo" v-if="cacheData.item.cash !== '-1'">
              付款账号：
              {{ cacheData.MerchanInfo.payment_account[1] }}
            </span>
          </li>
        </ul>

        <van-form>
          <van-field
            name="infoIsOk"
            label="我已确认【收到买家付款】"
            @click="changeinfoIsOk"
          >
            <template #input>
              <van-checkbox v-model="infoIsOk" class="info-ok" shape="square" />
            </template>
          </van-field>
        </van-form>

        <footer class="footer">
          <div>
            <van-button @click="cencel"> 暂未收到 </van-button>
            <van-button :disabled="!infoIsOk" @click="releaseCurrency">
              确认收款
            </van-button>
          </div>
        </footer>
      </div>
    </van-popup>
    <!-- end 出售 收款详细信息窗口   -->

    <van-dialog
      v-model="releaseLd"
      show-cancel-button
      :showCancelButton="false"
      :showConfirmButton="false"
    >
      <van-loading size="36px" text-color="#000" vertical>放币中</van-loading>
      <div class="ld-text">正在放币给对方，请稍等...</div>
    </van-dialog>
  </div>
</template>

<script>
import payIcons from "@/components/ChooseWay/pay-Icons.vue";

import { GetBusinessAds, UpdateOrderType } from "@/api/trxRequest";

import loadingToast from "@/components/loading-toast";

import {
  Reconstruction_getTrxBalance,
  Reconstruction_outOrder_user,
} from "@/utils/web3";

import { paytype } from "@/utils/utils";

import { contractAddress } from "@/utils/abi";
import { getItem } from "@/utils/storage";

export default {
  name: "Payment-details",
  //item --> 当前订单  num --> 出售udst的数量
  // totalMoney --> 该订单可以获得多少 money
  props: [
    "item",
    "num",
    "totalMoney",
    "curpaymentterm",
    "sellerMthods",
    "MerchanInfo",
  ],
  components: {
    payIcons,
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        document.querySelector(".payInfo .icons9").style.position = "static";
      }, 1200);
    });
  },
  data() {
    return {
      cuePayType: "wx", // 当前 收款方式
      // appealTime: 300 * 1000, // 仲裁时间 启用时间 默认 五分钟
      isDisabled: true, // 仲裁按钮 是否禁用  默认 true
      showPaymentInfoAffirmWindow: false, // 已付款订单信息 弹窗
      infoIsOk: false, // 信息确认 ok
      releaseLd: false, // 放币 加载
      isShowPayInfo: false,
      contractAddress: contractAddress,
      //数据缓存
      cacheData: {},
      netType: localStorage.getItem("netType") || "trx",
      myaddress: localStorage.getItem("myaddress") || contractAddress,
      badge: getItem("bsnum"),
    };
  },
  activated() {
    this.handlecacheData();
  },
  created() {
    this.handlecacheData();
  },
  methods: {
    gotoRelation() {
      const MerchanInfo = {
        ...this.cacheData.MerchanInfo,
        amount1: this.cacheData.totalMoney,
        sname: this.cacheData.item.sname,
      };
      this.$router.push({
        name: "Payment-waterbill",
        params: {
          item: this.cacheData.item,
          MerchanInfo,
        },
        query: {
          role: "buyer",
        },
      });
    },
    getArbitration_time() {
      const order_5Time = this.trsfTime_30timeout(this.item.order_time, 5);
      const curTime = this.trsfTime_30timeout(Date.now(), 0);
      const diff_time = this.diff_30timeout(order_5Time, curTime);
      if (diff_time <= 0) {
        return 0;
      } else {
        return diff_time;
      }
    },
    handlecacheData() {
      if (this.item) {
        this.cacheData.item = this.item;
        this.cacheData.appealTime = this.getArbitration_time();
        this.cacheData.num = this.num;
        this.cacheData.totalMoney = this.totalMoney;
        this.cacheData.curpaymentterm = this.curpaymentterm;
        this.cacheData.sellerMthods = this.sellerMthods;
        this.cacheData.MerchanInfo = this.MerchanInfo;
        //二次备份 给路由备份
        this.$route.meta.cacheData = this.cacheData;
      } else {
        this.cacheData = this.$route.meta.cacheData;
      }
    },
    //根据大订单id 获取商家地址
    async showPayInfo(oid) {
      if (!this.cacheData.MerchanInfo.bank) {
        try {
          const { data } = await GetBusinessAds(Number(oid));
          this.cacheData.MerchanInfo.bank = data.State?.trim();
        } catch (err) {
          console.warn(err);
          this.cacheData.MerchanInfo.bank = "地址&获取&错误";
        }
      }
      this.isShowPayInfo = !this.isShowPayInfo;
    },
    cencel() {
      this.showPaymentInfoAffirmWindow = false;
    },
    paytype(value) {
      return paytype(value);
    },
    // 已确认收款，进行放币
    async releaseCurrency() {
      try {
        this.showPaymentInfoAffirmWindow = false;
        this.releaseLd = true; // 确认信息 放币中....
        this.$toast.warning(
          {
            component: loadingToast,
            props: {
              title: `我已收到买家付款：<br/><span style="color:red">￥ ${this.cacheData.totalMoney}</span> CNY`,
            },
          },
          {
            icon: false,
            timeout: false,
          }
        );
        await Reconstruction_getTrxBalance();
        //oid --当前子订单id  num 数量
        const oid = this.cacheData.item.oid || this.cacheData.MerchanInfo.odid;
        const mail =
          this.cacheData.item.mail || this.cacheData.MerchanInfo.aipay;
        await Reconstruction_outOrder_user(oid, this.cacheData.num);
        // 合约操作验证通过，订单可执行交易
        const { data } = await UpdateOrderType({
          did: String(oid),
          type: 12,
          mail: mail,
        });
        this.releaseLd = false;

        console.log("Usdt 释放成功", data);
        let bsnum = parseInt(localStorage.getItem("bsnum"));
        localStorage.setItem("bsnum", --bsnum);
        this.$toast.clear();
        this.$toast.success("Usdt 释放完成，成功出售！", {
          timeout: false,
        });
        this.$router.replace({
          name: "sell-success",
          params: {
            totalMoney: this.cacheData?.totalMoney ?? 0,
            num: this.cacheData?.num ?? 0,
          },
        });
      } catch (err) {
        console.warn(err);
        this.$toast.error(err, {
          timeout: false,
        });
        this.$toast.error(
          <div>
            <p style="font-size:14px">区块繁忙。。释放过程出现错误！</p>
            <p style="font-size:14px">USDT 释放请稍后重试！</p>
          </div>,
          {
            timeout: false,
          }
        );
      }
      this.releaseLd = false;
    },
    // 改变我已确认信息 勾选
    changeinfoIsOk() {
      this.infoIsOk = !this.infoIsOk;
    },
    // 仲裁按钮是否禁用
    finishReset() {
      this.isDisabled = false;
    },
    PaymentInfoAffirm() {
      // 展示 订单付款 信息 弹窗
      this.infoIsOk = false;
      this.showPaymentInfoAffirmWindow = true;
    },
    // 获取订单 商家的姓名
    get_other_name() {
      const item = this.cacheData.item;
      if (item.aipay.includes("现金")) {
        return "现金交易";
      } else if (item.aipay?.split("&")[0]) {
        return item.aipay?.split("&")[0] ?? ["", ""];
      } else if (item.bank?.split("&")[0]) {
        return item.bank?.split("&")[0] ?? ["", ""];
      } else {
        return item.wechat?.split("&")[0] ?? ["", ""];
      }
    },
  },
};
</script>

<style lang="less" scoped>
.van-dialog__header {
  padding-top: 0;
}
.warning_Tips-text {
  padding: 10px 25px;
  font-size: 0.35rem;
}
.header-div {
  display: flex;
  align-items: center;
  padding: 25px 25px;
  font-size: 0.45rem;
  margin-bottom: 15px;
  .hd-txt {
    font-weight: 700;
    flex: 1;
    font-size: 40px;
    text-align: right;
  }
}

.van-loading {
  padding: 80px 25px 0;
  height: 150px;
  font-weight: 700;
}
.van-form {
  margin-bottom: 25px;
}

.ld-text {
  text-align: center;
  font-size: 26px;
  padding-bottom: 25px;
}

.PaymentInfoAffirm {
  .PaymentInfoAffirm-info {
    margin: 0;
    padding: 20px 20px 0 20px;
  }
  .info-ok {
    font-size: 30px;
    color: #999;
    /deep/ .van-icon {
      border-radius: 10px;
    }
  }
  /deep/ .van-field__label {
    position: absolute;
    width: 7rem;
    left: 90px;
  }
  .notice-bar {
    margin: 0 20px;
  }
  ul {
    margin: 20px;
    background-color: rgb(247, 247, 247);
    border-radius: 10px;
    padding: 25px;
  }
  li {
    font-size: 30px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    span {
      line-height: 40px;
      padding: 30px 0;
    }
    div {
      color: #999;
    }
    span:last-child {
      text-indent: 30px;
      font-weight: 700;
      color: #000;
    }
  }
  .footer {
    margin: 0 25px;
    font-weight: 700;
    div {
      display: flex;
      justify-content: space-evenly;
      button {
        width: 47%;
        border-radius: 15px;
        span {
          padding-right: 40px;
        }
      }
      button:last-child {
        background-color: rgb(235, 235, 235);
        color: #000;
      }
    }
  }
}

.order-pay-container {
  overflow-y: auto;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  .header {
    margin: 0px 25px 25px 25px;
    font-size: 40px;
    .title {
      margin: 0;
    }
    .pay-timeDown {
      display: flex;
      height: 40;
      font-weight: 700;
      align-items: center;
      margin: 25px 0 0 0;
    }
    .pay-text {
      color: rgba(0, 0, 0, 0.705);
      font-size: 26px;
      line-height: 42px;
      font-weight: 700;
    }
    .pay-time {
      font-size: 26px;
      font-weight: bolder;
      color: #1989fa;
      line-height: 42px;
    }
  }
  .info-rz {
    width: 40px;
    height: 40px;
    position: relative;
    top: 8px;
  }
  .main {
    margin: 25px;
    font-size: 26px;
    .top-text {
      display: flex;
      align-items: center;
      font-weight: 700;
      .icon-img {
        width: 40px;
        height: 40px;
        margin-right: 25px;
      }
    }
    /deep/ .van-divider {
      margin: 0;
    }
    li {
      padding: 18px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      span:first-child {
        color: var(--main-test-color);
      }

      span:last-child {
        font-weight: 700;
      }
    }
  }
  .importan-tTsxt {
    color: var(--main--color);
    font-weight: 700;
    font-size: 42px;
  }
  .Riskwarning {
    color: var(--main-test-color);
    font-size: 24px;
    padding: 25px;
    margin: 25px;
    border-radius: 15px;
    line-height: 35px;
    background-color: rgb(235, 235, 235);
  }

  .footer {
    display: flex;
    flex: 1;
    align-items: flex-end;
    justify-content: space-evenly;
    padding-bottom: 25px;
    .appeal {
      color: var(--main-test-color);
      .van-button__text {
        display: flex;
        align-items: center;
      }
    }
    button {
      font-size: 26px;
      display: block;
      font-weight: 700;
      border-radius: 15px;
      border: 4px solid rgb(235, 235, 235);
    }
    .van-button {
      height: 1rem;
    }
    .cancel {
      button {
        padding: 0 40px;
        color: #fff;
        background-color: blue;
      }
    }
    .next {
      button {
        padding: 0 100px;
        color: #000;
      }
    }
    .default-pd {
      button {
        padding: 0 40px;
      }
    }
  }
}
.payFullinfo {
  text-indent: 25px;
  padding: 15px 0 !important;
}
</style>
>
