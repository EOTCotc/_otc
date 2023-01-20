<template>
  <div>
    <div class="tips-info" v-if="!againAffirmInfo">
      <h3>确认付款信息</h3>
      <div class="tipMainmessage">
        平台不会自动扣款，您需要打开第三方支付平台转账给卖家
      </div>
      <dl>
        <dt>交易信息：</dt>
        <dd>
          <span>交易类型：</span>
          <span class="title" v-if="curPay === 'wx'">微信支付</span>
          <span class="title" v-else-if="curPay === 'xj'">现金交易</span>
          <span class="title" v-else-if="curPay === 'yhk'">银行卡</span>
          <span v-else>支付宝</span>
        </dd>
        <dd>
          <span>对方姓名：</span>
          <span>{{ name }}</span>
        </dd>
        <dd v-if="curPay === 'yhk'">
          <span>对方收款账号：</span>
          <span class="title">
              {{account}}
          </span>
        </dd>
        <dd v-else-if="curPay === 'wx'">
          <span>对方收款账号：</span>
          <span class="title">
              {{account_wx}}
          </span>
        </dd>
        <dd v-else-if="curPay === 'zfb'">
          <span>对方收款账号：</span>
          <span class="title">
              {{account_zfb}}
          </span>
        </dd>
      </dl>

      <van-button @click="accountPaid" size="large">我已经完成转账</van-button>
      <van-button @click="unAccountPaid" size="large"
        >我还未完成转账</van-button
      >
    </div>
    <div class="tips-info" v-if="againAffirmInfo">
      <h3>确认付款</h3>
      <div :style="{marginBottom:'20px'}">
        <van-form class="tips-form">
          <van-field name="checkbox">
            <template #input>
              <van-checkbox v-model="checkbox" shape="square" />
            </template>
          </van-field>
          <span
            class="tips-text"
            @click="handleAffirmInfo"
            :class="{ 'error-text': ischeckbox }"
          >
            尚未付款就点击
            <b :style="{ color: 'red' }">【我已转账，通知卖家】</b
            >将被视为恶意操作，冻结用户
          </span>
        </van-form>
      </div>
      <van-button
        @click="throttle(handlePayOK, 2000)"
        class="default-btn"
        type="default"
        size="large"
      >
        我已经完成转账
      </van-button>
      <van-button @click="unAccountPaid" size="large">我再想想</van-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "pay-info-tips",
  props: ["curPay", "name",'account','account_wx','account_yhk'],
  data() {
    return {
      checkbox: false,
      againAffirmInfo: false,
      ischeckbox: false,
    };
  },
  methods: {
    accountPaid() {
      this.againAffirmInfo = true;
    },
    init() {
      this.againAffirmInfo = false;
      this.checkbox = false;
    },
    handleAffirmInfo() {
      this.checkbox = !this.checkbox;
    },
    unAccountPaid() {
      this.$emit("set-info-tips", false);
    },
    handlePayOK() {
      if (this.checkbox) {
        this.$emit("go-await-seller-affirm", true);
      } else {
        this.$toast.warning("请点击同意确认付款协议。");
        this.ischeckbox = true;
        setTimeout(() => {
          this.ischeckbox = false;
        }, 1500);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.tips-info {
  padding: 30px 50px 30px 30px;
  box-sizing: content-box;
  .title{
    color: red;
  }
  dl {
    font-size: 30px;
    dd {
      padding: 5px 10px;
    }
  }
  .tipMainmessage {
    border-radius: 15px;
    text-indent: 0.3rem;
    padding: 20px;
    line-height: 0.7rem;
    color: var(--main-test-color);
    background-color: rgb(249, 249, 249);
  }

  h3 {
    margin: 0;
    font-size: .6rem;
    margin-bottom: 30px;
  }
  .van-cell {
    padding: 0;
  }
  .error-text {
    color: red;
  }
  .tips-form {
    position: relative;
  }

  .tips-text {
    position: absolute;
    left: 0.8rem;
    top: -5px;
  }
  .van-field {
    margin-bottom: 0;
  }
  div {
    font-size: 30px;
  }
  .van-button {
    font-weight: 700;
    background-color: rgb(242, 245, 252);
  }
  .default-btn {
    background-color: var(--main--color);
    color: #fff;
  }
}
/deep/ .van-icon {
  border-radius: 6px !important;
}
</style>
