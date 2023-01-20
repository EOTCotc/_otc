<template>
  <div class="order-pay-container">
    <header class="header">
      <h4 class="title">订单已经生成</h4>
      <div class="pay-timeDown">
        <div class="pay-text">付款剩余时间</div>
        <van-count-down
          class="pay-time"
          ref="countDown"
          :time="time"
          format="mm:sss "
          @finish="autoCancel_order"
        />
      </div>
    </header>
    <!-- 边框线 -->
    <div class="van-hairline--bottom"></div>

    <!-- 卖家信息 -->
    <section class="seller-info">
      <div class="seller-info-top">
        <span class="pay-info1">卖家提示</span>
        <div class="info2">
          <span>
            {{ cacheData.payItem.sname }}
            <img class="info-rz" src="@/assets/currency-icons/rz.png" alt="" />
          </span>
          <!-- pending 1 订单 -->
          <van-icon name="orders-o" badge="1" @click="gotoWaterBill" />
        </div>
      </div>
      <article class="full-info">
        <div class="info-box" v-html="cacheData.payItem.mes"></div>
      </article>
    </section>

    <!-- 订单主要信息 -->
    <main class="main">
      <div class="top-text">
        <img
          class="icon-img"
          :src="require('@/assets/currency-icons/usdt.svg')"
          alt=""
        />
        <span>购买 USDT</span>
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
              >{{ briefMyAddress(myaddress) }}
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
              {{ briefMyAddress(cacheData.MerchanInfo.bank) }}
              <i class="iconfont icon-copy" :style="{ color: '#999' }"></i
            ></span>
          </li>
          <li v-show="isShowPayInfo">
            <span>合约地址</span>
            <span @click="copyContent(contractAddress, '合约地址 已复制')"
              >{{ briefMyAddress(contractAddress) }}
              <i class="iconfont icon-copy" :style="{ color: '#999' }"></i
            ></span>
          </li>
          <li v-show="isShowPayInfo">
            <span :style="{ color: '#000' }">合约查询订单</span>
            <span @click="show_imgPreview" :style="{ color: 'red' }"
              >指导查看步骤</span
            >
          </li>

          <li>
            <span>单价</span>
            <span>￥{{ cacheData.payItem.cny }}</span>
          </li>
          <li>
            <span>数量</span>
            <span>{{ cacheData.ordernum }} USDT</span>
          </li>
          <li
            @click.stop="
              copyContent(
                ThousandSeparator(cacheData.ordermoney),
                '总金额 已复制'
              )
            "
          >
            <span>总金额</span>
            <span class="importan-tTsxt"
              >￥{{ ThousandSeparator(cacheData.ordermoney) }}.00
              <i class="iconfont icon-copy" :style="{ color: '#999' }"></i>
            </span>
          </li>
          <li>
            <span>卖家收款方式</span>
            <span :style="{ display: 'flex', position: 'relative' }">
              <payIcons
                :items="cacheData.payItem"
                :style="{ marginRight: '10px', position: 'static' }"
                :cuePayType="cacheData.ordercuePayType"
              />
              {{ paytype(cacheData.ordercuePayType) }}
            </span>
          </li>
          <li>
            <span>我的付款账号</span>
            <span v-if="cacheData.ordercuePayType === 'yhk'">
              {{ cacheData.sellerMthods.mybank.split("&")[1] }}
              {{ cacheData.sellerMthods.mybank.split("&")[0] }}
            </span>
            <span v-if="cacheData.ordercuePayType === 'zfb'">
              {{ cacheData.sellerMthods.myalipay }}
            </span>
            <span v-if="cacheData.ordercuePayType === 'wx'">
              {{ cacheData.sellerMthods.mybmywechatnk }}
            </span>
            <span v-if="cacheData.ordercuePayType === 'xj'"> 现金交易 </span>
          </li>
          <li class="van-divider"></li>
          <li>
            <span>订单编号</span>
            <span
              @click="copyContent(cacheData.payItem.id, '大订单编号 已复制')"
            >
              {{ cacheData.payItem.id }}
              (
              {{ cacheData.MerchanInfo.odid }} )
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
            <span>
              {{ cacheData.nowTime | transformTime_Zh }}
            </span>
          </li>
        </ul>
      </div>
    </main>

    <!-- 底部取消订单 or 下一波 button -->
    <footer class="footer">
      <div class="cancel">
        <van-button type="default" @click="cancel_order">取消订单</van-button>
      </div>
      <div class="next">
        <van-button type="info" @click="payNextStep">下一步</van-button>
      </div>
    </footer>
  </div>
</template>

<script>
import { toastComponent } from "@/utils/element-config";

import payIcons from "@/components/ChooseWay/pay-Icons.vue";
import { contractAddress } from "@/utils/abi";
import { ImagePreview } from "vant";
import loadingToast from "@/components/loading-toast";
import { runSign } from "@/utils/web3";
import { subbuysellorder } from "@/api/trxRequest";

import { paytype } from "@/utils/utils";

export default {
  name: "order-pay-fllow",
  props: [
    "item",
    "cuePayType",
    "num",
    "money",
    "MerchanInfo",
    "sellerMthods",
    "nowTime",
    'servicefee'
  ],
  components: {
    payIcons,
  },
  data() {
    return {
      isShowPayInfo: false,
      time: 30 * 60 * 1000,
      contractAddress: contractAddress,
      myaddress: localStorage.getItem("myaddress") || "暂时&未有地址",
      netType: localStorage.getItem("netType") || "trx",
      cacheData: {},
      imgs: [
        require("../../assets/img-preview/sele-1.png"),
        require("../../assets/img-preview/sele-2.png"),
      ], // 图片预览 列表
    };
  },
  activated() {
    this.initcacheData();
  },
  created() {
    this.initcacheData();
  },
  methods: {
    initcacheData() {
      if (this.item) {
        this.cacheData.payItem = this.item;
        this.cacheData.ordercuePayType = this.cuePayType;
        this.cacheData.ordernum = this.num;
        this.cacheData.ordermoney = this.money;
        this.cacheData.MerchanInfo = this.MerchanInfo;
        this.cacheData.sellerMthods = this.sellerMthods;
        this.cacheData.servicefee = this.servicefee
        this.cacheData.nowTime = this.nowTime || Date.now();
        //数据缓存
        this.$route.meta.cacheData = this.cacheData;
      } else {
        //console.log("页面回退数据缓存", this.$route.meta.cacheData);
        this.cacheData = this.$route.meta.cacheData;
        // 页面进行了缓存，切换数据需要 计算每一个订单
      }
      this.time = this.diff_30timeout(
        this.trsfTime_30timeout(this.cacheData.nowTime, 30),
        this.transformTime_Zh(Date.now())
      );
      const rcoin = this.cacheData.payItem.rcoin;
      if (!rcoin || rcoin === "-1") {
        this.$toast.info("等待商家通过对您的流水审查！",{
          timeout:false
        });
      } else {
        this.$toast.success(
          <div>
            <p style="font-size:14px;margin:5px">商家已通过您的流水审查</p>
            <p style="font-size:15px;margin:5px">可进行下一步汇款!</p>
          </div>
        );
      }
    },
    show_imgPreview() {
      ImagePreview({
        images: this.imgs,
        onClose() {
          this.$toast.clear();
        },
        closeable: true,
      });
      this.$copyText(
        "https://tronscan.io/#/contract/TBpcQXdZEX8vYqf2M2CQrHsGt9KZpAEVqu/code"
      ).then(
        (e) => {
          this.$toast.success(
            {
              component: toastComponent,
              props: {
                title: "网页连接已复制",
                content: "请在游览器中打开，按步骤查询！",
              },
            },
            {
              timeout: false,
            }
          );
        },
        (e) => {
          this.$toast.error("复制失败，请稍后重试");
        }
      );
    },
    showPayInfo() {
      this.isShowPayInfo = !this.isShowPayInfo;
    },
    cancel_order() {
      this.$dialog
        .confirm({
          title: "取消订单",
          message:
            "<span class='activeInfo'>频繁取消订单会被 【限制下单】</span> <br />确定取消订单吗？",
        })
        .then(() => {
          this.countDown_finish();
        })
        .catch(() => {
          // on cancel 取消订单 取消选择
        });
    },
    async countDown_finish() {
      let oid; //子订单id
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
        oid = this.cacheData.MerchanInfo?.odid ?? this.cacheData.payItem.oid; //子订单id
        await runSign();
        const { data } = await subbuysellorder({
          oid,
          selectpayk: "",
          type: 0,
        });
        this.$toast.clear();
        if (data.State === "1") {
          this.$toast.error(oid + "  号订单重复取消");
          this.$router.replace({
            name: "CurrencyTrading",
          });
        } else {
          this.$toast.warning(oid + "  号订单已取消");
          this.$router.replace({
            name: "CurrencyTrading",
          });
          localStorage.setItem("xdnum", "0");
        }
      } catch (err) {
        console.warn(err);
        this.$toast.clear();
        this.$toast.error(err,{
          timeout:false
        })
      }
      this.cancelOrderModel_show = false;
    },
    async autoCancel_order(){
      let oid; //子订单id
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
        oid = this.cacheData.MerchanInfo?.odid ?? this.cacheData.payItem.oid; //子订单id
        const { data } = await subbuysellorder({
          oid,
          selectpayk: "",
          type: 0,
        });
        this.$toast.clear();
        //console.log(data);
        if (data.State === "1") {
          this.$toast.error(oid + "  号订单重复取消");
          this.$router.replace({
            name: "CurrencyTrading",
          });
        } else {
          this.$toast.warning(oid + "  号订单已取消");
          this.$router.replace({
            name: "CurrencyTrading",
          });
          localStorage.setItem("xdnum", "0");
        }
      } catch (err) {
        console.warn(err);
        this.$toast.clear();
      }

    },
    gotoWaterBill() {
      const item  = {
        ...this.cacheData.payItem,
        dsx:'0',
      }
      
      this.$router.replace({
        name: "water-bill",
        params: {
          odid: this.cacheData.MerchanInfo.odid,
          MerchanInfo: this.cacheData.MerchanInfo,
          money: this.cacheData.ordermoney,
          time: this.time,
          item,
          num: this.cacheData.ordernum,
          cuePayType: this.cacheData.ordercuePayType,
          servicefee:this.cacheData.servicefee,
          sellerMthods:this.cacheData.sellerMthods
        },
        query: {
          role: "buyer",
        },
      });
    },
    payNextStep() {
      //中间插入 流水审查页面
      // rcoin 隔多长时间放币， 必须大于 0
      const rcoin = this.cacheData.payItem.rcoin;
      //console.log(this.cacheData.payItem);
      if (!rcoin || rcoin === "-1") {
        this.$toast.warning(
          <div>
            <p style="font-size:14px;margin:5px">
              商家需要对您的账户进行流水审查
            </p>
            <p style="font-size:15px;margin:5px">审查结果通过后可进行下一步!</p>
          </div>
        );
        setTimeout(() => {
          this.gotoWaterBill();
        }, 1300);
      } else {
        console.log(this.cacheData.MerchanInfo)
        this.$router.replace({
          name: "CompleteOrderPayment",
          params: {
            item: this.cacheData.payItem,
            num: this.cacheData.ordernum,
            cuePayType: this.cacheData.ordercuePayType,
            money: this.cacheData.ordermoney,
            MerchanInfo: this.cacheData.MerchanInfo,
            nowTime: this.time,
            servicefee:this.cacheData.servicefee,
            sellerMthods:this.cacheData.sellerMthods
          },
        });
      }
    },
    paytype(value) {
      return paytype(value);
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .icons9 {
  left: -0.8rem;
  bottom: 0;
}
/deep/ .van-divider {
  margin: 0;
}
.order-pay-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  display: flex;
  overflow-y: auto;
  flex-direction: column;
  background-color: rgb(255, 255, 255);
  .header {
    margin: 20px 25px 25px 25px;
    font-size: 36px;
    .title {
      margin: 0;
    }
    .pay-timeDown {
      display: flex;
      height: 40;
      align-items: center;
      margin: 25px 0 0 0;
      // color: #1989fa;
    }
    .pay-text {
      color: #b1b1b1;
      font-size: 26px;
      margin-right: 30px;
      line-height: 42px;
    }
    .pay-time {
      font-size: 26px;
      font-weight: bolder;
      color: #1989fa;
      line-height: 42px;
    }
  }
  .seller-info {
    // background: linear-gradient(to bottom,#d7e4e3,#b7e0de);
    background: url("@/static/image/pay-info-bg.png");
    background-size: cover;
    font-size: 30px;
    display: flex;
    padding: 20px;
    margin: 25px;
    border-radius: 15px;
    flex-direction: column;
    .seller-info-top {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      .pay-info1 {
        flex: 50%;
        font-weight: 700;
      }
      .info2 {
        span {
          margin-left: auto;
          padding-left: 20px;
          margin-right: 20px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          .info-rz {
            width: 32px;
            height: 32px;
            padding-left: 5px;
          }
        }
        flex: 70%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 15px;
        box-sizing: border-box;
      }
    }
    .full-info {
      font-size: 24px;
      overflow-y: auto;
      max-height: 200px;
      .info-box {
        color: #888;
        line-height: 40px;
        // color: var(--main-test-color);
      }
    }
  }
  .main {
    margin: 25px;
    font-size: 26px;
    .top-text {
      display: flex;
      align-items: center;
      .icon-img {
        width: 40px;
        height: 40px;
        margin-right: 25px;
      }
      span {
        font-weight: bold;
      }
    }
    li {
      padding: 25px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      span:first-child {
        color: var(--main-test-color);
      }
    }
  }
  .importan-tTsxt {
    color: var(--main--color);
    font-weight: 700;
    font-size: 42px;
  }
  .footer {
    display: flex;
    flex: 1;
    align-items: flex-end;
    justify-content: space-evenly;
    padding-bottom: 25px;

    button {
      font-size: 26px;
      display: block;
    }
    .van-button {
      height: 1rem;
    }
    .cancel {
      button {
        padding: 0 60px;
        color: #000;
      }
    }
    .next {
      button {
        padding: 0 100px;
      }
    }
  }
}
</style>
>
