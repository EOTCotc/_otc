<template>
  <div class="order-pay-container">
    <aside></aside>
    <header class="header">
      <h4 class="title">等待卖家确认收款</h4>
      <div class="pay-timeDown">
        <div class="pay-text">
          <span>预计</span>
          <van-count-down
            class="pay-time"
            ref="countDown"
            :time="time"
            format="HH:mm:sss"
          />
          <span>内收到USDT</span>
        </div>
      </div>
    </header>

    <!-- 边框线 -->
    <van-divider
      :style="{
        borderColor: 'rgb(177,177,177)',
        margin: '0',
        padding: '0 16px',
      }"
    >
    </van-divider>
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
          <li>
            <span>订单编号</span>
            <span>{{ item.id }}({{ odid }})</span>
          </li>
          <li>
            <span>单价</span>
            <span>￥{{item.cny}}</span>
          </li>
          <li>
            <span>数量</span>
            <span>{{ num }} USDT</span>
          </li>
          <li>
            <span>总金额</span>
            <span class="importan-tTsxt"
              >￥{{ ThousandSeparator(money) }}</span
            >
          </li>
          <li>
            <span>手续费</span>
            <span>{{ servicefee }} USDT</span>
          </li>
          <li :style="{display:'flex',alignItems:'center'}">
            <span>我的付款方式</span>
            <span v-if="cuePayType === 'wx'" :style="{display:'flex',alignItems:'center'}">
              <i
                :class="['iconfont', `icon-wx`, `pay-iconwx`, `pay-icon3`]"
              ></i>
              &nbsp;&nbsp;微信支付
            </span>
            <span v-if="cuePayType === 'zfb'" :style="{display:'flex',alignItems:'center'}">
              <i
                :class="['iconfont', `icon-zfb`, `pay-iconzfb1`, `pay-iconzfb`]"
              ></i>
              &nbsp;&nbsp;支付宝
            </span>
            <span v-if="cuePayType === 'yhk'" :style="{display:'flex',alignItems:'center'}">
              <i
                :class="['iconfont', `icon-yhk`, `pay-icon1`, `pay-iconyhk`]"
              ></i>
              &nbsp;&nbsp;银行卡
            </span>
            <span v-if="cuePayType === 'xj'" :style="{display:'flex',alignItems:'center'}">
              <img
                class="xj_moeny"
                :style="{ marginTop: '5px' }"
                src="@/assets/currency-icons/moeny-c.png"
                alt=""
              />
              &nbsp;&nbsp;现金交易
            </span>
          </li>
          <li v-if="cuePayType !== 'xj'"> 
            <span>商家收款账号</span>
             <span v-if="cuePayType === 'wx'" :style="{display:'flex',alignItems:'center'}">
              &nbsp;&nbsp;{{item.account_wx}}
            </span>
            <span v-if="cuePayType === 'zfb'" :style="{display:'flex',alignItems:'center'}">
             
              &nbsp;&nbsp;{{item.account_zfb}}
            </span>
            <span v-if="cuePayType === 'yhk'" :style="{display:'flex',alignItems:'center'}">
              {{item.account[2]}}&nbsp;&nbsp;{{item.account[1]}}
            </span>
          </li>
          <li>
            <span>卖家姓名</span>
            <span>
              {{ MerchanInfo.sname }}
              <img class="info-rz" src="@/assets/currency-icons/rz.png" alt=""
            /></span>
          </li>
          <li>
            <span>商家钱包地址</span>
            <span>
              {{briefMyAddress(MerchanInfo.bank)}}
            </span>
          </li>
          
        </ul>
      </div>
    </main>

    <!-- 底部取消订单 or 下一波 button -->
    <footer class="footer">
      <div class='cancel'>
          <van-button @click='to_orderList'>
              查看订单
          </van-button>
      </div>
      <div class="next">
        <van-button
          :disabled="isDisabled"
          class="appeal"
          type="default"
          @click="payNextStep"
        >
          <span>申诉</span>&nbsp;
          <van-count-down
            ref="countDown"
            v-if="isDisabled"
            @finish="finishReset"
            :time="appealTime"
            format="mm:sss"
          />
        </van-button>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "await-seller-affirm",
  props: [
    "odid",
    "MerchanInfo",
    "item",
    "money",
    "num",
    "cuePayType",
    "servicefee",
    "sellerMthods",
  ],
  data() {
    return {
      time: 24 * 60 * 60 * 1000,
      appealTime: 300 * 1000,
      isDisabled: true,
    };
  },
  methods: {
    to_orderList(){
        this.$router.replace({
            name:'orderGather-full',
            params:{
              done:false,
            }
        })
    },
    payNextStep() {
      this.$toast.warning("申诉功能暂未开放，请耐心等待")
    },
    finishReset() {
      this.isDisabled = false;
    },
  },
};
</script>

<style lang="less" scoped>
.order-pay-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  .importan-tTsxt {
    color: var(--main--color);
    font-weight: 700;
    font-size: 42px;
  }
  .header {
    margin: 70px 25px 25px 25px;
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
      display: grid;
      grid: 1fr/60px 1fr 1fr;
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
  .main {
    margin: 25px;
    font-size: 26px;
    .info-rz {
      font-size: 16;
      width: 32px;
      height: 32px;
      padding-left: 5px;
    }
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
  .footer {
    display: flex;
    flex: 1;
    align-items: center;
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
        padding: 0 60px;
      }
    }
  }
}
</style>
>
