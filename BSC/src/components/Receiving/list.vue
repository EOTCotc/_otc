<template>
  <div class="content">
    <div class="top">
      <div class="topTitle">收付款信息</div>
      <div class="currencyType">
        <div class="addCurrencyBtn">
          <van-button @click="handleClick" class="btn" size="small">
            <CurCurrencyType
              @show-currency-type="handleClick"
              :showCurrencyType="showCurrencyType"
              :payType="currencyId"
            ></CurCurrencyType>
          </van-button>
        </div>
        <div class="addPayBtn">
          <van-button
            @click="addpayFlgOpen(0, '', '')"
            class="btn bule"
            size="small"
            >设置收付款账号</van-button
          >
        </div>
      </div>
    </div>
    <div v-if="receivingList.length > 0">
      <van-swipe-cell
        v-for="(receiving, index) of receivingList"
        :border="false"
        :key="index"
      >
        <van-cell>
          <template #icon>
            <img
              class="pay-img"
              :src="require('@/static/image/' + receiving.icon + '.png')"
              alt="aug-icon"
            />
          </template>
          <template #title>
            <span class="custom-title">{{ receiving.title }}</span>
            <div>{{ receiving.account }}</div>
          </template>
          <template #right-icon>
            <!-- <van-switch v-model="receiving.checked" size="18px" /> -->
            <van-icon
              name="replay"
              @click="addpayFlgOpen(index, receiving.title, receiving.account)"
              size="22px"
            />
          </template>
        </van-cell>

        <template #right>
          <van-button
            square
            type="danger"
            text="删除"
            @click="delPaymentShou(receiving, index)"
          />
        </template>
      </van-swipe-cell>
      <div class="hint">向买家仅展示已开启的收款账户</div>
    </div>

    <div v-else>
      <van-empty description="还没有任何收付款方式" />
    </div>

    <!-- 选择当前交易货币类型弹窗 -->
    <van-popup
      v-model="showCurrencyType"
      round
      position="bottom"
      :style="{ height: '70%' }"
    >
      <div class="searchType">
        <van-form
          @submit="onSearch"
          validate-trigger="onChange"
          ref="CurrencyTypeipt"
          class="ipt"
        >
          <van-field
            name="moneyTtype"
            v-model.trim.lazy="moneyTtype"
            validate-trigger="onBlur"
            placeholder="搜索"
            :rules="currencyRules"
          />
        </van-form>
        <!-- title="默认货币"  label="CNY"  -->
        <div class="currency">
          <div class="defaultCurrency">默认货币</div>
          <div>
            <span class="span1" @click="changeCurID('CNY')">CNY</span>
            <van-icon
              name="success"
              class="van-icon1"
              v-if="currencyId == 'CNY'"
            />
          </div>
        </div>

        <!-- 货币可选择交易类型 -->
        <div class="currencyList">
          <div class="defaultCurrency">全部</div>
          <div
            class="currencyContent"
            v-for="imgnAme in searchStatus ? seachcountrie : countrieImgs"
            :key="imgnAme"
            @click="changeCurID(imgnAme)"
          >
            <!-- 注意 图片路径  -->
            <img
              :src="require('@/assets/countrie-imgs/' + imgnAme + '.png')"
              alt="资源未找到"
            />
            <span class="span1">{{ imgnAme }}</span>
            <van-icon
              name="success"
              class="van-icon2"
              v-if="currencyId == imgnAme"
            />
          </div>
        </div>
      </div>
    </van-popup>

    <van-popup class="pop" position="bottom" round v-model="addpayFlg">
      <van-picker
        :default-index="defaultIndex"
        show-toolbar
        :columns="addPaymentList"
        @confirm="onConfirm"
        @cancel="onCancel"
        @change="onChange"
      />
    </van-popup>
  </div>
</template>

<script>
import CurCurrencyType from "@/components/select-Currency-species";
import { myPayment } from "@/api/payverification";

import { SetPayType } from "@/api/payverification";

import { addpayscore } from '@/api/arbitrationMsg'

export default {
  name: "set-receivingList",
  components: {
    CurCurrencyType,
  },
  created() {
    addpayscore({})
    this.getCurPayList(this.sellerMthods);
  },
  data() {
    return {
      showCurrencyType: false, // 选择货币类型 弹窗
      currencyId: "CNY",
      moneyTtype: "", //交易货币类型
      currencyRules: [
        {
          validator: this.validator,
        },
      ],
      addPaymentList: ["银行卡", "支付宝", "微信"],
      defaultIndex: 0,
      searchStatus: false, // 搜索状态
      countrieImgs: ["AUD", "CAD", "EUR", "INR", "JPY", "KRW", "THB", "USD"],
      addpayFlg: false, //
      receivingList: [],
      sellerMthods: myPayment(), // 我的收付款方式
      paymentIndex: undefined, //默认不设置任何收付款方式
      curPay_type: undefined,
      curPay_account: undefined,
    };
  },
  methods: {
    onConfirm(value, index) {
      //console.log(value);
      this.addpayFlgClose();
      this.$router
        .push({
          name: "receiving",
          params: {
            paymentIndex: index,
            curPay_type: this.curPay_type,
            curPay_account: this.curPay_account,
          },
        })
        .catch((err) => {});
    },
    onChange(picker, value, index) {
      // alert('onchange',`当前值：${value}, 当前索引：${index}`);
    },
    onCancel() {
      this.addpayFlgClose();
    },
    addpayFlgOpen(index, account_Type, account) {
      this.defaultIndex = index;
      this.curPay_type = account_Type;
      this.curPay_account = account;
      this.addpayFlg = true;
    },
    addpayFlgClose() {
      this.addpayFlg = false;
    },
    onSearch(e) {
      //console.log(e);
    },
    handleClick() {
      this.showCurrencyType = true;
    },
    validator(val) {
      if ((val ?? "") === "") {
        this.searchStatus = false; //搜索状态下 会产生 temp 列表 给用户展示
      }
      this.searchStatus = true; //搜索状态下 会产生 temp 列表 给用户展示
      this.seachcountrie = this.countrieImgs.filter((type) => {
        return type.toLowerCase().includes(val.toLowerCase());
      });
      return /\w+/gi.test(val) || "";
    },
    changeCurID(payType) {
      console.log(payType);
      this.currencyId = payType;
      this.showCurrencyType = false;
    },
    //删除收付款信息
    async delPaymentShou(item, index) {
      try {
        let type;
        if (item.icon === "wechat") {
          type = 13;
        } else if (item.icon === "alipay") {
          type = 12;
        } else {
          type = 11;
        }
        await SetPayType({
          type,
          pay: "",
        });
        
        this.receivingList.splice(index, index + 1);
      } catch (err) {
        console.warn(err);
        this.$toast.err(err);
      }
    },
    //获取当前收付款方式
    getCurPayList(item) {
      function hasCurrentPay(value) {
        return value.split("&")[1] || value;
      }
      for (const key of Object.keys(item)) {
        switch (key) {
          case "mybank":
            if (hasCurrentPay(item[key])) {
              this.receivingList.push({
                title: item[key].split("&")[1],
                account: item[key].split("&")[0],
                icon: "bank",
                checked: false,
              });
            }
            break;
          case "myalipay":
            if (hasCurrentPay(item[key])) {
              this.receivingList.push({
                title: "支付宝",
                account: item[key].split("&")[0],
                icon: "alipay",
                checked: false,
              });
            }
            break;
          case "mybmywechatnk":
            if (hasCurrentPay(item[key])) {
              this.receivingList.push({
                title: "微信",
                account: item[key].split("&")[0],
                icon: "wechat",
                checked: false,
              });
            }
            break;
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  .currencyType {
    display: flex;
    align-items: center;
    padding: 32px 32px 0;
  }

  .btn {
    display: block;
    font-size: 28px;
    line-height: 42px;
    background-color: #fff;
    border: none;
    position: relative;
  }

  .addCurrencyBtn {
    flex: 1;
  }

  .ipt {
    border: 1px solid #ebedf0;
    margin: 50px 40px 0 40px;

    border-radius: 15px;

    .van-field {
      padding: 10px 10px 10px 20px;
      background-color: #eee;
    }
  }

  .currency,
  .currencyList {
    margin: 40px 0 0 40px;
    position: relative;
    padding: 10px 0 30px 0;
    border-bottom: 2px solid #eee;

    .van-icon1 {
      position: absolute;
      right: 20px;
      top: 60px;
      color: #2483ff;
    }
  }

  .currencyList {
    border: none;

    .currencyContent {
      display: flex;
      align-items: center;
      position: relative;
      margin-top: 40px;

      .van-icon2 {
        position: absolute;
        right: 20px;
        color: #2483ff;
      }

      img {
        width: 60px;
        border-radius: 50%;
        margin: 0px 20px 0 0px;
      }
    }
  }

  .defaultCurrency {
    font-size: 20px;
  }

  .span1 {
    font-size: 50px;
  }

  .van-cell {
    align-items: center;
  }

  /deep/ .van-tabs__line {
    background-color: #2483ff !important;
  }

  /deep/.van-cell__title {
    margin: 0 20px;
    line-height: 36px;
  }

  .bule {
    color: #237ff8ff;
  }

  .hint {
    color: #999999ff;
    font-size: 28px;
    padding: 32px;
  }

  /deep/.popupTop .van-cell__value {
    color: #000;
  }

  .popupItems .van-cell {
    text-align: center;
  }

  .topTitle {
    padding: 32px 32px 0;
    font-size: 40px;
  }
}
</style>
