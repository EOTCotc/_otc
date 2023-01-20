<template>
  <div>
    <white :title="title"></white>
    <div class="content">
      <van-form validate-first>
        <van-field
          readonly
          clickable
          :value="value"
          label="钱包地址"
          placeholder="点击选择钱包地址"
          @click="showPicker = true"
        />
        <van-popup v-model="showPicker" round position="bottom">
          <van-picker
            show-toolbar
            :columns="columns"
            @confirm="onConfirm"
            @cancel="showPicker = false"
          />
        </van-popup>

        <van-field
          readonly
          clickable
          :value="money"
          label="选择币种"
          placeholder="点击选择币种"
          @click="moneyShow = true"
        />
        <van-popup v-model="moneyShow" round position="bottom">
          <van-picker
            show-toolbar
            :columns="moneyList"
            @confirm="moneyConfirm"
            @cancel="moneyShow = false"
          />
        </van-popup>

        <van-field
          v-model="number"
          type="number"
          name="转账数量"
          label="转账数量"
          ref="num"
          :placeholder="text"
          @focus="focus()"
          @blur="blur()"
        >
        </van-field>
        <!-- :disabled="usdtsq > 1 ? false : true"
          :rules="[{ pattern: numberRule, message: '转账数量至少为1' }]" -->

        <!-- <p class="hint" v-if="money">最少转 1{{money}},免手续费。</p> -->
        <div class="buttonBox">
          <!-- native-type="submit" -->
          <van-button
            round
            block
            color="#1B2945"
            @click="Onsubmit"
            :disabled="
              value != '' && money != '' && number != '' ? false : true
            "
            >确定</van-button
          >
          <p class="transfer" @click="checkEvent">查看转账记录</p>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant";
import { MemberWallet } from "@/api/trxRequest";
import { UserInfo, SendUSDT } from "@/utils/web3";
import white from "@/components/Nav/white.vue";
export default {
  //转账页面
  data() {
    return {
      title: "转账",
      showPicker: false,
      value: "",
      columns: [],

      wallet: [],
      address: "",

      money: "",
      moneyList: ["USDT", "EOTC"],
      moneyShow: false,
      //数量
      number: "",
      numberRule: /^\d{1,}$/,

      maxnum: "",
      text: "",

    };
  },
  components: {
    white,
  },
  mounted() {
    let uid = this.$route.params.uid;
    this.init(uid);
  },
  methods: {
    //表单验证失败
    onFailed(errorInfo) {
      Toast.fail(errorInfo.errors[0].message);
    },
    //提交
    Onsubmit() {
      SendUSDT(this.number, this.address, this.money);
    },

    checkEvent() {
      let net =localStorage.getItem('netType')
      if(net=='trx'){
        window.location.href=`https://tronscan.io/#/address/${localStorage.getItem('myaddress')}/transfers`
      }else if(net=='bsc'){
        window.location.href=`https://bscscan.com/address/${localStorage.getItem('myaddress')}#tokentxns`
      }
    },
    init(uid) {
      MemberWallet({ uid: uid }).then((res) => {
        let data = res.data;
        //console.log(data);
        for (let i of data) {
          i.ads = i.ads.trim();
          this.wallet.push(i.ads);
          this.columns.push(
            i.ads.substring(0, 10) +
              "..." +
              i.ads.substring(i.ads.length - 10, i.ads.length)
          );
        }
      });
    },
    onConfirm(value, index) {
      this.address = this.wallet[index];
      //console.log(this.address);
      this.value = value;
      this.showPicker = false;
    },
    moneyConfirm(value) {
      this.money = value;
      this.number = "";
      let data = UserInfo();
      if (value == "USDT") {
        this.maxnum = data.myamount;
        this.text = `可转账 ${this.maxnum}USDT`;
      } else {
        this.maxnum = data.eotcAmount;
        this.text = `可转账 ${this.maxnum}EOTC`;
      }
      this.moneyShow = false;
    },
    focus() {
      if (this.money == "") {
        this.$refs.num.blur();
        this.$toast.warning("请先选择币种！");
        this.moneyShow = true;
      }
    },
    blur() {
      if (this.number <= 0) {
        this.number = "";
        this.$toast.warning("请输入合法的数量！");
      }
      if (this.number > this.maxnum) {
        this.number = "";
        this.$toast.warning("您的钱包余额不足！");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  padding: 30px 0 0 0;
  .right-event {
    color: #247ff6;
    margin-right: 30px;
  }
  .hint {
    margin: 40px 0 0 32px;
    font-size: 28px;
    color: #fc7542;
  }
  .buttonBox {
    margin: 120px 40px 0;
    .transfer {
      font-size: 28px;
      text-align: center;
      color: #247ff6;
      margin-top: 40px;
    }
  }
}
</style>
