<template>
  <div class="order-pay-container">
    <div class="header-div">
      <van-icon name="arrow-left" @click="$router.back()" />
      <span class="hd-txt">
        <van-icon @click="gotoRelation">
          <van-icon name="orders-o" :badge="cacheData.badge_info" />
        </van-icon>
      </span>
    </div>

    <header class="header">
      <h4 class="title">等待买家付款</h4>
      <div class="pay-timeDown">
        <van-count-down
          class="pay-time"
          ref="countDown"
          :time="time"
          format="mm:sss"
          @finish="cancel_order_timeDown"
        />
        <div class="pay-text">买家正在向您转账，请注意查收</div>
      </div>
    </header>

    <!-- 边框线 -->
    <van-divider
      :style="{
        borderColor: 'rgb(177,177,177)',
        margin: '0 0 18px 0',
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
          <li @click="showPayInfo">
            <span>交易主链</span>
            <span>
              {{ netType }}
              <van-icon name="arrow" />
            </span>
          </li>
          <li v-show="isShowPayInfo">
            <span>交易钱包</span>
            <span @click="copyContent(myaddress, '钱包地址已复制')"
              >{{ myaddress | briefMyAddress }}
              <i class="iconfont icon-copy" :style="{ color: '#999' }"></i
            ></span>
          </li>
          <li v-show="isShowPayInfo">
            <span>商家钱包</span>
            <span
              @click="
                copyContent(cacheData.MerchanInfo.bank, '商家钱包地址 已复制')
              "
            >
              {{ cacheData.MerchanInfo.bank | briefMyAddress }}
              <i class="iconfont icon-copy" :style="{ color: '#999' }"></i
            ></span>
          </li>
          <li v-show="isShowPayInfo">
            <span>合约地址</span>
            <span @click="copyContent(contractAddress, '合约地址 已复制')"
              >{{ contractAddress | briefMyAddress }}
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
              <i class="iconfont icon-copy" :style="{ color: '#999' }"></i>
            </span>
          </li>

          <!-- 只支持现金 -->
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

          <!-- 可能接受 现金 -->
          <li
            class="payInfo"
            v-if="cacheData.item.cash === '0' || cacheData.item.cash === '1'"
          >
            <span>收款方式</span>
            <span
              v-if="curpaymentterm[1] === 'default'"
              @click="selectPay_begin"
            >
              请选择收款方式
              <van-icon name="arrow" :style="{ margin: '2.5px 0 0 6px' }" />
            </span>
            <span v-else @click="changePayMode">
              <payIcons
                :style="{ marginRight: '10px' }"
                :items="cacheData.item"
                :cuePayType="curpaymentterm[1]"
              />
              <span class="pay-txt">{{ curpaymentterm[0] }}</span>
              <van-icon name="arrow" :style="{ margin: '2.5px 0 0 6px' }" />
            </span>
          </li>
          <template v-if="curpaymentterm[1] !== 'default'">
            <li v-if="curpaymentterm[1] !== 'xj'">
              <span>收款账号</span>
              <span v-if="cacheData.curpaymentterm === 'yhk'">
                {{ cacheData.sellerMthods.mybank.split("&")[1] }}
                {{ cacheData.sellerMthods.mybank.split("&")[0] }}
              </span>
              <span v-if="cacheData.curpaymentterm === 'zfb'">
                {{ cacheData.sellerMthods.myalipay }}
              </span>
              <span v-if="cacheData.curpaymentterm === 'wx'">
                {{ cacheData.sellerMthods.mybmywechatnk }}
              </span>
            </li>
          </template>

          <li class="van-divider"></li>
          <li>
            <span>卖家昵称</span>
            <span>
              {{ cacheData.item.sname }} &nbsp;
              <span :style="{ color: 'blue' }" @click="gotoRelation"
                >(@联系卖家)</span
              >&nbsp;
              <img
                class="info-rz"
                src="@/assets/currency-icons/rz.png"
                alt=""
              />
            </span>
          </li>
          <li>
            <span>订单编号</span>
            <span
              @click="copyContent(cacheData.item.id, '出售订单编号 已复制')"
            >
              {{ cacheData.item.id }}
              ({{ cacheData.MerchanInfo.odid }})
              <i
                class="iconfont icon-copy"
                :style="{ color: '#999' }"
                @click.stop="
                  copyContent(cacheData.MerchanInfo.odid, '生成订单编号 已复制')
                "
              ></i>
            </span>
          </li>
          <li>
            <span>下单时间</span>
            <span>{{ cacheData.nowTime | transformTime_Zh }}</span>
          </li>
        </ul>
      </div>
    </main>

    <!-- start  收款方式 提示弹窗 -->
    <van-popup
      v-model="showOrderSaleInfo"
      v-if="cacheData.item.cash !== '-1'"
      :close-on-popstate="true"
      get-container="body"
      position="bottom"
      class="saleInfo"
      :style="{ height: '350px' }"
    >
      <template>
        <div>
          <header class="header">
            <van-icon name="arrow-left" @click="goBack" />
            <span class="header-text" @click="goBack">选择收款方式</span>
          </header>
          <main class="main">
            <template
              v-if="cacheData.item.cash === '0' || cacheData.item.cash === '1'"
            >
              <van-cell
                center
                v-for="(payType, i) in playList"
                :key="i"
                @click="handlePayChange(payType)"
              >
                <template #title>
                  <span class="custom-title">{{ getpayType(payType) }}</span>
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
                <template #right-icon>
                  <van-icon
                    name="success"
                    v-if="curpaymentterm[1] == payType"
                  />
                </template>
              </van-cell>
            </template>

            <!-- 现金交易 -->
            <template
              v-if="cacheData.item.cash === '-1' || cacheData.item.cash === '1'"
            >
              <van-cell @click="handlePayChange('xj')">
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
                <template #right-icon>
                  <van-icon name="success" v-if="curpaymentterm[1] == 'xj'" />
                </template>
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

    <article class="Riskwarning" v-if="cacheData.item.smes !== ''">
      <div :style="{ color: 'rgb(252,184,66)' }">商家提示：</div>
      <div>{{ cacheData.item.smes }}</div>
    </article>

    <article class="Riskwarning" v-else>
      <div :style="{ color: 'rgb(252,184,66)' }">商家提示：</div>
      <div>商家付款需要一定时间，请耐心等待</div>
    </article>

    <!-- start 出售 信息 loading 提示弹窗 -->

    <van-dialog v-model="orderSaleLoading" :showConfirmButton="false">
      <van-loading size="36px" text-color="#000" vertical>转币中</van-loading>
      <div class="ld-text">正在转币到合约，请稍等...</div>
    </van-dialog>

    <!-- end 出售 信息 loading  提示弹窗  -->

    <!-- 底部 该收款按钮，默认禁用状态，买家点击已付款后，会变色，可以点击确认，
         买家没点付款前灰色，禁用状态不能点击
         dsx == 0 未转币到合约 显示该按钮
         dsx == 2 已经转币到合约  赢藏该按钮
    -->
    <footer class="footer">
      <div>
        <van-button @click="cancel_order" class="appeal" type="danger">
          <span>取消订单</span>
        </van-button>
      </div>
      <div class="cancel">
        <van-button @click="handleEmitIssueMoney">转币到合约</van-button>
      </div>
    </footer>

    <van-dialog
      v-model="cancelOrderModel_show"
      :showConfirmButton="false"
      class="mask-infoTips"
    ></van-dialog>
  </div>
</template>

<script>
import payIcons from "@/components/ChooseWay/pay-Icons.vue";
import loadingToast from "@/components/loading-toast";
import { contractAddress } from "@/utils/abi";
import { runSign } from "@/utils/web3";
import { myPayment } from "@/api/payverification";

import {
  Reconstruction_getTrxBalance,
  Reconstruction_myApprove,
  Reconstruction_verifyUSDT,
  Reconstruction_sellOrder_user,
} from "@/utils/web3";

import { subbuysellorder } from "@/api/trxRequest";
import { getItem, removeItem } from "@/utils/storage";

export default {
  name: "outflows-currency",
  // sellerMthods 我的收款方式记录  MerchanInfo 商家信息
  props: ["item", "num", "totalMoney", "sellerMthods", "MerchanInfo"],
  components: {
    payIcons,
  },
  data() {
    return {
      time: 30 * 60 * 1000,
      isShowPayInfo: false,
      cancelOrderModel_show: false,
      contractAddress: contractAddress,
      myaddress: getItem("myaddress") || contractAddress,
      netType: getItem("netType") || "trx",
      orderSaleLoading: false, // 转币中 loading显隐
      //数据缓存
      cacheData: {},
      showOrderSaleInfo: false, // 出售订单详情信息弹窗 显隐
      playList: [], //对方收款方式列表
      curpaymentterm: ["", "default"], // 收款方式
    };
  },
  created() {
    if (this.time < 0) return false;
    this.handlecacheData();
    // 30分钟 待转币
    //console.log("30分钟 待转币");
    this.time = this.diff_30timeout(
      this.trsfTime_30timeout(this.cacheData.nowTime, 30),
      this.transformTime_Zh(Date.now())
    );
    this.getInit_payList();

  },
  methods: {
    gotoRelation() {
      this.cacheData.badge_info = 0;
      //console.log("Payment-waterbill");
      const item = {
        ...this.cacheData.item,
        mail: this.cacheData.MerchanInfo.aipay,
      };
      this.$router.push({
        name: "Payment-waterbill",
        params: {
          item,
          num: this.cacheData.num,
          totalMoney: this.cacheData.totalMoney,
          curpaymentterm: this.cacheData.curpaymentterm,
          sellerMthods: this.cacheData.sellerMthods,
          MerchanInfo: this.cacheData.MerchanInfo,
        },
        query: {
          inTrading: true,
          role: "buyer",
        },
      });
    },
    goBack() {
      this.showOrderSaleInfo = false;
    },
    selectPay_begin() {
      this.changePayMode();
    },
    setPlay(e) {
      this.playList = e;
      this.cacheData.curpaymentterm = e[0];
      // ['银行卡’，‘yhk’]
      this.curpaymentterm = [this.getpayType(e[0]), e[0]];
    },
    getpayType(value) {
      switch (value) {
        case "yhk":
          return "银行卡";
        case "zfb":
          return "支付宝";
        case "wx":
          return "微信支付";
        default: {
          this.$toast.error("未知收款方式");
        }
      }
    },
    handlePayChange(curType) {
      if (curType == "xj") {
        this.cacheData.curpaymentterm = curType;
        this.curpaymentterm = ["现金交易", curType];
        this.showOrderSaleInfo = false;
        return true;
      }
      if (!this.hasOwnthisPay(curType)) {
        return false;
      }
      this.cacheData.curpaymentterm = curType;
      this.curpaymentterm = [this.getpayType(curType), curType];
      this.showOrderSaleInfo = false;
    },
    //重新选择了收付款方式
    changePayMode() {
      this.showOrderSaleInfo = true;
    },
    showPayInfo() {
      this.isShowPayInfo = !this.isShowPayInfo;
    },
    hasCurrentPay(value) {
      return Boolean(value.split("&")[1]);
    },
    getInit_payList() {
      if (this.time < 0) return false;
      if (this.cacheData.item.cash === "-1") {
        this.playList = ["xj"];
        this.cacheData.curpaymentterm = "xj";
        this.curpaymentterm = ["现金交易", "xj"];
        return false;
      }
      const Icons = [];
      const item = this.cacheData.item;
      for (const key of Object.keys(item)) {
        switch (key) {
          case "bank":
            if (this.hasCurrentPay(item[key])) {
              Icons.push("yhk");
            }
            break;
          case "aipay":
            if (this.hasCurrentPay(item[key])) {
              Icons.push("zfb");
            }
            break;
          case "wechat":
            if (this.hasCurrentPay(item[key])) {
              Icons.push("wx");
            }
            break;
        }
      }
      this.playList = Icons;
    },
    // 判断用户是否有填 改支付方式
    hasOwnthisPay(curType) {
      if (curType === "wx" && this.cacheData.sellerMthods["mybmywechatnk"]) {
        return true;
      }
      if (curType === "zfb" && this.cacheData.sellerMthods["myalipay"]) {
        return true;
      }
      if (curType === "yhk" && this.cacheData.sellerMthods["mybank"]) {
        return true;
      }
      this.$toast.clear();
      this.$toast.error(
        <div>
          <p style="font-size:16px;margin:5px">您没有填写当前收款方式，</p>
          <p style="font-size:16px;margin:5px">请重新选择</p>
        </div>
      );
      return false;
    },
    handlecacheData() {
      if (this.item) {
        this.cacheData.item = this.item; //订单信息
        this.cacheData.nowTime = this.item?.order_time || Date.now(); //订单时间
        this.cacheData.num = this.num; // 本次购买 usdt 数量
        this.cacheData.badge_info =
          localStorage.getItem("csnum") !== "0" ? 1 : 0;
        this.cacheData.totalMoney = this.totalMoney;
        this.cacheData.sellerMthods = myPayment(); // 我的可选收款方式
        this.cacheData.MerchanInfo = this.MerchanInfo; // 商家和订单的 信息
        //二次备份 给路由备份
        this.$route.meta.cacheData = this.cacheData;
      } else {
        this.cacheData = this.$route.meta.cacheData; // 商家和订单的 信息
      }
    },
    //转币到合约
    async handleEmitIssueMoney() {
      this.$toast.clear();
      if (this.curpaymentterm[1] === "default") {
        this.$toast.warning(
          <p style="font-size:16px;color:red">请选择您的收款方式</p>
        );
        return false;
      }
      const value = this.curpaymentterm;
      if (
        value.includes("yhk") ||
        value.includes("wx") ||
        value.includes("zfb") ||
        value.includes("xj")
      ) {
        //console.log(value);
        //我已放币到合约
        this.orderSaleLoading = true;
        const cny = this.cacheData.MerchanInfo.amount1; // 本次出售的 usdt 可以获得的总金额
        const usdt = this.cacheData.num; // 本次出售的 usdt数量
        const oid = this.cacheData.MerchanInfo.odid; //子订单id
        const sj_ads = this.cacheData.MerchanInfo.bank; // 卖家的收货地址
        const mail = this.cacheData.MerchanInfo.aipay;
        // wx 微信号   支付宝 zfb 支付宝账号   银行卡  开户行  银行卡 -卡号
        const selectpayk =
          this.getMoneyInfo(this.curpaymentterm[1]) || "网络&出现&问题";
        const type = 1;

        try {
          await Reconstruction_getTrxBalance();
          await Reconstruction_myApprove(usdt);
          await Reconstruction_verifyUSDT(parseFloat(usdt));
          await Reconstruction_sellOrder_user(oid, usdt.toString(), sj_ads);
          const data = await subbuysellorder({
            oid,
            usdt,
            mail, //卖家邮箱
            selectpayk,
            type,
            cny,
          });
          const it = eval(data);
          if (it.data.State != "0") {
            // type = 0 or 1 区分 收购 和 出售
            if (type == 0) {
              localStorage.setItem("xdnum", "0");
              this.$toast.success("您的订单已完成付款，请等待卖家确认");
            } else {
              localStorage.setItem("csnum", "0");
              this.$toast.success("已转币至合约，请等待买家付款", {
                timeout: 3000,
              });
              const mynum =
                parseFloat(localStorage.getItem("myamount")) - parseFloat(usdt);
              localStorage.setItem("myamount", mynum);
            }
          }
          this.$router.replace({
            name: "Payment-waterbill",
            params: {
              item: {
                ...this.cacheData.item,
                mail: this.cacheData.MerchanInfo.aipay,
              },
              num: this.cacheData.num,
              totalMoney: this.cacheData.totalMoney,
              curpaymentterm: this.cacheData.curpaymentterm,
              sellerMthods: this.cacheData.sellerMthods,
              MerchanInfo: this.cacheData.MerchanInfo,
            },
            query: {
              inTrading: true,
              role: "buyer",
            },
          });
        } catch (err) {
          // 过程中发生错误
          console.warn(err);
          this.$toast.error(err, {
            timeout: false,
          });
        }
        this.orderSaleLoading = false;
      } else {
        this.$toast.error("请重新选择收款方式!!");
      }
    },
    // 我的收款方式
    getMoneyInfo(payMethos) {
      switch (payMethos) {
        case "yhk": {
          let name = localStorage.getItem("uname");
          let methds = this.cacheData.sellerMthods.mybank?.split("&");
          return `${name} & ${methds[0]} &  ${methds[1]}`;
        }
        case "zfb": {
          let name = localStorage.getItem("uname");
          return `${name} & ${this.cacheData.sellerMthods.myalipay} & 支付宝`;
        }
        case "wx": {
          let name = localStorage.getItem("uname");
          return `${name} & ${this.cacheData.sellerMthods.mybmywechatnk} & 微信`;
        }
        case "xj": {
          let name = localStorage.getItem("uname");
          return `${name} & 现金 & 现金交易`;
        }
      }
    },
    cancel_order() {
      let oid; //子订单id
      this.$dialog
        .confirm({
          title: "取消订单",
          message:
            "<span class='activeInfo'>频繁取消订单会被 【限制下单】</span> <br />确定取消订单吗？",
        })
        .then(async () => {
          // 确认取消订单
          try {
            this.cancelOrderModel_show = true;
            this.$toast.warning(
              {
                component: loadingToast,
                props: {
                  title: "正在取消该订单。。。",
                },
              },
              {
                icon: false,
                timeout: false,
              }
            );
            oid = this.cacheData.MerchanInfo?.odid ?? this.cacheData.item.oid; //子订单id
            await runSign();
            const { data } = await subbuysellorder({
              oid,
              selectpayk: getItem("mysign"),
              type: 1,
            });
            //console.log(data);
            this.$toast.clear();
            if (data.State === "1") {
              this.$toast.error(oid + "  号订单重复取消");
              this.$router.replace({
                name: "outflows",
              });
            } else {
              this.$toast.warning(oid + "  号订单已取消");
              this.$router.replace({
                name: "outflows",
              });
              localStorage.setItem("csnum", "0");
            }
          } catch (err) {
            console.warn(err);
            this.$toast.error(err, {
              timeout: false,
            });
          }
          this.cancelOrderModel_show = false;
          removeItem(oid);
        })
        .catch(() => {
          // on cancel 取消订单 取消选择
        });
    },
    //倒计时自动取消订单
    cancel_order_timeDown() {
      const oid = this.cacheData.MerchanInfo?.odid ?? this.cacheData.item.oid;
      subbuysellorder({
        oid,
        type: 1,
        selectpayk: getItem("mysign"),
      })
        .then(() => {
          this.$toast.warning(oid + "  号订单已自动取消");
        })
        .catch((err) => {
          console.warn(err);
          this.$toast.error(err, {
            timeout: false,
          });
        })
        .finally(() => {
          this.$router.replace({
            name: "CurrencyTrading",
          });
        });
      localStorage.setItem("csnum", "0");
      removeItem(oid);
    },
  },
  filters: {
    briefMyAddress(value) {
      value = value?.trim() ?? "";
      if (value) {
        let startMyAddress = value.substr(0, 10);
        let midMyAddress = ".".repeat(3);
        let endMyAddress = value.substr(-10, 10);
        return startMyAddress + midMyAddress + endMyAddress;
      }
      return "地址出现错误";
    },
  },
};
</script>

<style lang="less" scoped>
.mask-infoTips {
  display: none;
}
/deep/ .icons9 {
  position: static !important;
}
.order-pay-container {
  position: fixed;
  overflow-y: auto;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  display: flex;
  flex-direction: column;
  background-color: #fff;

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

  .header {
    margin: 0 25px 25px 25px;
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
      color: #b1b1b1;
      font-size: 26px;
      margin-left: 15px;
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
      padding: 25px 15px;
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
    line-height: 40px;
  }

  .footer {
    display: flex;
    flex: 1;
    align-items: flex-end;
    justify-content: space-evenly;
    padding-bottom: 25px;
    .appeal {
      color: #fff;
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
    }
    .van-button {
      height: 1rem;
    }
    .cancel {
      button {
        padding: 0 40px;
        color: #fff;
        background-color: var(--main--color);
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

  .van-loading {
    padding: 80px 25px 0;
    height: 150px;
    font-weight: 700;
  }
  .ld-text {
    text-align: center;
    font-size: 26px;
    padding: 0.5rem 0;
  }
  .payInfo {
    position: relative;
    span:last-child {
      position: relative;
      display: flex;
      align-items: center;
    }
  }
}
.iconfont {
  margin-right: 15px;
}

.van-icon-success {
  color: var(--main--color);
  font-size: 36px;
}

.saleInfo {
  background-color: #fff !important;
  box-sizing: border-box;
  h6 {
    margin: 0;
    font-size: 36px;
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
  .sell-info {
    font-size: 26px;
    ul {
      display: flex;
      flex-direction: column;
      li {
        padding: 15px;
        display: flex;
        justify-content: space-between;
        span:last-child {
          font-weight: 700;
        }
      }
    }
  }
}
</style>
<style></style>
