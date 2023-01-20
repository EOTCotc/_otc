<template>
  <div>
    <p class="rule">EOTC采用严格的邀请注册制</p>
    <van-cell-group :border="false">
      <!-- <van-popover
        v-model="showPopover"
        trigger="click"
        theme="dark"
        placement="bottom-end"
        :actions="actions"
        @select="onSelect"
      >
        <template #reference> -->
      <p class="hint">当前网络</p>
      <van-field
        class="cell"
        v-model="value1"
        readonly
        is-link
        arrow-direction="down"
      />
      <!-- </template>
      </van-popover> -->
      <p class="hint">钱包地址</p>
      <van-field class="cell" readonly clearable v-model="wallet" />
      <p class="hint">输入邮箱地址</p>
      <van-field
        class="cell"
        v-model="email"
        center
        autocomplete="off"
        :clearable="true"
        @focus="focus()"
        @blur="blur()"
      >
        <template #button>
          <van-button
            size="small"
            class="cell_button"
            v-show="!countShow"
            :class="{ button_action: buttonShow && !countShow }"
            :disabled="!buttonShow"
            @click="gain"
          >
            <span>发送验证码</span>
          </van-button>
          <van-count-down
            ref="countDown"
            v-show="countShow"
            format="ss秒"
            @finish="finish"
            :auto-start="false"
            :time="time"
          />
        </template>
      </van-field>
      <p class="hint">输入邮箱验证码</p>
      <van-field
        class="cell"
        autocomplete="off"
        clearable
        v-model="verification"
      />
      <p class="hint">填写邀请地址</p>
      <van-field class="cell" clearable :readonly="readShow" v-model="invite" />
    </van-cell-group>
    <van-checkbox
      shape="round"
      class="check"
      checked-color="#1B2945"
      v-model="checked"
    >
      我已阅读并同意
      <span>《用户协议》</span>
    </van-checkbox>
    <div class="footer">
      <van-button
        round
        block
        :disabled="
          value1 != '' &&
          email != '' &&
          verification != '' &&
          invite != '' &&
          wallet != '' &&
          checked
            ? false
            : true
        "
        color="#1B2945"
        @click="register"
        >确定注册</van-button
      >
      <p>
        已有账户
        <span @click="switched()">去登录</span>
      </p>
    </div>
  </div>
</template>

<script>
import { yzm, reg } from "@/utils/login";
export default {
  name: "my-signin",
  data() {
    return {
      //主链
      value1: localStorage.getItem("netType"),
      //邮箱
      email: "",
      //验证码
      verification: "",
      //邀请地址
      invite: "",
      //钱包地址
      wallet: "",
      //弹出气泡状态
      showPopover: false,
      // 主链分支菜单
      actions: [
        { text: "BSC" },
        { text: "TRX" },
        { text: "HECO" },
        { text: "ETH" },
      ],
      //获取验证码按钮状态
      buttonShow: false,
      //倒计时切换
      countShow: false,
      time: 60 * 1000,
      //复选框
      checked: false,

      readShow: false,
    };
  },
  async mounted() {
    const netType = localStorage.getItem("netType");
    if (netType === "asd") {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      this.wallet = accounts[0].toLocaleLowerCase();
    } else if (netType === "trx") {
      this.wallet = window.tronWeb.defaultAddress.base58;
    } else if (netType === "bsc") {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      this.wallet = accounts[0].toLocaleLowerCase();
      // console.log(accounts[0].toLocaleLowerCase());
    }
    this.value1 = netType;

    if (this.$route.query.pid != undefined) {
      this.invite = this.$route.query.pid;
      this.readShow = true;
    }
  },
  methods: {
    onSelect(action) {
      this.value1 = action.text;
    },
    focus() {
      this.buttonShow = true;
    },
    blur() {
      if (this.email != "") {
        this.buttonShow = true;
      } else {
        this.buttonShow = false;
      }
    },
    gain() {
      //触发获取验证码事件
      //切换倒计时，禁止按钮
      yzm(this.email).then((data) => {
        this.countShow = true;
        this.buttonShow = false;
        this.$refs.countDown.start();
      });
    },
    finish() {
      this.countShow = false;
      this.buttonShow = true;
      this.$refs.countDown.reset();
    },
    switched() {
      this.$emit("switched");
    },
    register() {
      reg(
        this,
        this.value1,
        this.wallet,
        this.email,
        this.verification,
        0,
        this.invite,
        this.checked
      );
    },
  },
};
</script>

<style lang="less" scoped>
p {
  margin: 0;
}
.rule {
  font-size: 28px;
  color: #1b2945;
  margin-bottom: 30px;
}
/deep/.van-popover__wrapper {
  width: 100%;
}
.cell {
  border: 1px solid #c8cfde;
  border-radius: 16px;
  margin-bottom: 30px;
  font-size: 28px;
  .cell_button {
    background: #fff;
    border-color: #fff;
    // border-radius: 5px;
    color: #999;
  }
  .button_action {
    background: #1b2945;
    // border-radius: 5px;
    color: #fff;
  }
}
.hint {
  font-size: 28px;
  margin-bottom: 20px;
}
.check {
  font-size: 28px;
  span {
    color: #2483ff;
  }
}
.footer {
  margin-top: 38px;
  p {
    font-size: 28px;
    margin-top: 40px;
    text-align: center;
    span {
      color: #2483ff;
    }
  }
}
</style>
