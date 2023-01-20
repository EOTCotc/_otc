<template>
  <div class="delay-currency-container">
    <!--  延迟放币 view -->
    <header class="header-top">
      <van-icon name="arrow-left" />
      <span class="hd-txt" @click="$router.go(-1)"> 延时放币 </span>
    </header>

    <div class="header-main">
      <h4 class="title">等待卖家放币中</h4>
      <div class="pay-timeDown">
        <van-count-down class="pay-time" :time="time" />
        <div class="pay-text">后将会放币,请注意查收</div>
      </div>
    </div>

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
          <li>
            <span>单价</span>
            <span>6.35 CNY</span>
            <!-- <span>￥{{ item.cny }}</span> -->
          </li>
          <li>
            <span>数量</span>
            <span>99999999 USDT</span>
          </li>
          <li>
            <span>总金额</span>
            <span class="importan-tTsxt"
              >￥{{ ThousandSeparator(totalMoney) }}.00
              <i class="iconfont icon-copy" :style="{ color: '#999' }"></i
            ></span>
          </li>
          <li>
            <span>钱包地址</span>
            <span>{{ walletAddress | briefAddress }}</span>
          </li>
        </ul>
      </div>
    </main>

    <main class="main payMain">
      <div class="top-main">
        <ul>
          <li>
            <span>卖家信息</span>
            <span class="importan-tTsxt" :style="{ fontSize: '18px' }">
              <van-icon name="chat-o" size="20px" />&nbsp;联系卖家
            </span>
          </li>
          <li>
            <span>卖家昵称</span>
            <span> 西红柿首付 </span>
          </li>
          <li>
            <span>订单编号</span>
            <span
              >4879854645
              <i class="iconfont icon-copy" :style="{ color: '#999' }"></i
            ></span>
          </li>
          <li>
            <span>钱包地址</span>
            <span>{{ walletAddress | briefAddress }}</span>
          </li>
          <li>
            <span>下单时间</span>
            <span>{{ Date.now() | transformTime_Zh }}</span>
            <!-- 下单时间  测试阶段用 新时间戳代替 -->
            <!-- <span>{{ orderTime }}</span> -->
          </li>
        </ul>
      </div>
    </main>

    <!-- 底部 该收款按钮，默认禁用状态，买家点击已付款后，会变色，可以点击确认，
         买家没点付款前灰色，禁用状态不能点击-->
    <footer class="footer">
      <van-button round :disabled="isDisabled" class="appeal" type="default">
        <span>发起仲裁</span>&nbsp;
        <van-count-down
          ref="countDown"
          v-if="isDisabled"
          :time="time"
          @finish="clearDisabled"
        />
      </van-button>
    </footer>
  </div>
</template>

<script>
import { paytype } from "@/utils/utils";

export default {
  name: "delay-currency",
  //item --> 当前订单  num --> 出售udst的数量
  // totalMoney --> 该订单可以获得多少 money  orderTime --> 下单时间

  data() {
    return {
      time: 24 * 60 * 60 * 1000, //延迟放币倒计时
      cuePayType: "wx", // 当前 收款方式
      isDisabled: true, // 仲裁按钮 是否禁用  默认 true
      totalMoney: 9000,
      walletAddress: "TSQwewG64dNYy9pRr9e1be4GwxDqhNh3tL",
    };
  },

  methods: {
    paytype(value) {
      return paytype(value);
    },
    clearDisabled(){
        this.isDisabled = false
    }
  },
  filters: {
    briefAddress(value) {
      let startMyAddress = value.substr(0, 10);
      let midMyAddress = ".".repeat(3);
      let endMyAddress = value.substr(-10, 10);
      return startMyAddress + midMyAddress + endMyAddress;
    },
  },
};
</script>

<style lang="less" scoped>
//延迟放币
.header-top {
  display: flex;
  align-items: center;
  padding: 25px 25px;
  font-size: 0.45rem;
  margin-bottom: 15px;
  border-bottom: 2px solid #eee;
  .hd-txt {
    font-weight: 700;
    flex: 1;
    text-align: center;
  }
}

.delay-currency-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  .header-main {
    margin: 20px 25px 25px 25px;
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
      margin-left: 25px;
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
    margin: 0 25px 35px 25px;
    font-size: 26px;
    border: 2px solid #eee;
    border-radius: 15px;
    padding: 25px;
    font-weight: 700;
    .top-text {
      display: flex;
      align-items: center;
      .icon-img {
        width: 40px;
        height: 40px;
        margin-right: 25px;
      }
    }
    .top-main {
      margin-top: 20px;
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
    }
  }
  .payMain {
    padding-top: 0;
    li:first-child {
      font-size: 36px;
    }
  }
  .importan-tTsxt {
    color: var(--main--color);
    font-weight: 700;
    font-size: 42px;
  }

  .footer {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    margin: 0 1rem 1.5rem;
    flex: 1;
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
      color: #fff;
      background-color: #1989fa;
      border: 4px solid rgb(235, 235, 235);
    }
    .van-button {
      height: 1.2rem;
    }
  }
}
</style>
>
