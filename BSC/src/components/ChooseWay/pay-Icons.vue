<template>
  <div class="icons2" v-if="items.cash === '-1'">
    <span v-show="false">{{ payList }}</span>
    <img class="xj_moeny" src="@/assets/currency-icons/moeny-c.png" alt="xj" />
  </div>
  <div class="icons" v-else-if="!cuePayType && items.cash === '1'">
    <i
      v-for="(pay, i) in payList"
      :key="i"
      :class="['iconfont', `icon-${pay}`, `pay-icon${i + 1}`, `pay-icon${pay}`]"
    ></i>
    <img
      class="xj_moeny"
      :class="{
        'pay-icon2': payList.length == 1,
        'pay-icon3': payList.length == 2,
        'pay-icon4': payList.length == 3,
      }"
      src="@/assets/currency-icons/moeny-c.png"
      alt="xj"
    />
  </div>
  <div class="icons" v-else-if="!cuePayType && items.cash === '0'">
    <i
      v-for="(pay, i) in payList"
      :key="i"
      :class="['iconfont', `icon-${pay}`, `pay-icon${i + 1}`, `pay-icon${pay}`]"
    ></i>
  </div>
  <div class="icons" v-else-if="cuePayType === 'xj'">
    <img
      class="xj_moeny icons9"
      src="@/assets/currency-icons/moeny-c.png"
      alt="xj"
    />
  </div>
  <div class="icons" v-else-if="cuePayType === 'default'">
    <i
      v-for="(pay, i) in payList.slice(0, 1)"
      :key="i"
      :class="['iconfont', `icon-${pay}`, `pay-icon${i + 1}`, `pay-icon${pay}`]"
    ></i>
  </div>
  <div v-else-if="cuePayType === 'buyer_payMethod'">
    <i
      v-for="(pay, i) in payList.slice(0, 1)"
      :key="i"
      :class="['iconfont', `icon-${pay}`, `pay-icon${i + 1}`, `pay-icon${pay}`]"
    ></i>
  </div>
  <div class="icons" v-else>
    <i
      :class="[
        'iconfont',
        `icon-${cuePayType}`,
        `pay-icon${cuePayType + 1}`,
        `pay-icon${cuePayType}`,
      ]"
    ></i>
  </div>
</template>

<script>
export default {
  name: "pay-icons",
  props: ["items", "cuePayType"],
  created() {
    // if(!this.cuePayType && this.items ==='-1'){
    // }
  },
  computed: {
    payList() {
      const Icons = [];
      for (const key of Object.keys(this.items)) {
        switch (key) {
          case "bank":
            if (this.hasCurrentPay(this.items[key])) {
              Icons.push("yhk");
            }
            break;
          case "aipay":
            if (this.hasCurrentPay(this.items[key])) {
              Icons.push("zfb");
            }
            break;
          case "wechat":
            if (this.hasCurrentPay(this.items[key])) {
              Icons.push("wx");
            }
            break;
        }
      }
      this.$emit("get-playList", Icons);
      return Icons;
    },
  },
  methods: {
    hasCurrentPay(value) {
      return Boolean(value.split("&")[1]);
    },
  },
};
</script>

<style lang="less" scoped>
.icons9 {
  position: absolute;
  bottom: 20px;
  left: 50px;
}
.icons2 {
  position: absolute;
  bottom: 20px;
  left: 30px;
}

.pay-icon4 {
  position: absolute;
  bottom: 20px;
  left: 170px;
}
.pay-icon1 {
  position: absolute;
  bottom: 20px;
  left: 30px;
  color: rgb(251, 159, 68);
}
.pay-iconyhk {
  color: rgb(251, 159, 68);
}
.pay-icon2 {
  position: absolute;
  bottom: 20px;
  left: 76px;
}
.pay-iconzfb {
  color: rgb(78, 157, 252);
}
.pay-icon3 {
  position: absolute;
  bottom: 20px;
  left: 125px;
}

.pay-iconwx {
  color: rgb(76, 180, 63);
}
</style>
