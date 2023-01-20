<template>
  <div class="content" :class="contentBottom ? 'contentMB600' : 'contentMB100'">
    <White :title="title"></White>
    <div class="text">
      <van-form @submit="onSubmit" ref="form">
        <van-cell-group inset @input="onInput()">
          <van-field
            v-model="userName"
            name="userName"
            type="text"
            label="姓 名"
            readonly
            :rules="nameRules"
            placeholder="请输入真实姓名"
          />
          <van-field
            v-model="userBankName"
            type="text"
            name="bankName"
            v-if="paymentIndex == 0"
            show-error
            label="开户银行"
            :rules="bankRulesFlg ? bankNameRules : noRules"
            placeholder="请输入开户银行"
            @focus="fieldFocus(0)"
          />
          <van-field
            v-model="userBankNumber"
            type="number"
            name="bankNumber"
            v-if="paymentIndex == 0"
            show-error
            label="银行卡号"
            :rules="bankRulesFlg ? bankNumberRules : noRules"
            placeholder="请输入银行卡账号"
            @focus="fieldFocus(0)"
          />
          <van-field
            v-model="userAlipayNumber"
            type="text"
            name="alipayName"
            v-if="paymentIndex == 1"
            show-error
            label="支 付 宝"
            :rules="alipayRulesFlg ? alipayNumberRules : noRules"
            placeholder="请输入支付宝账号"
            @focus="fieldFocus(0)"
          />
          <van-field
            v-model="userWechatNumber"
            type="text"
            name="wechatName"
            v-if="paymentIndex == 2"
            show-error
            label="微 信 号"
            :rules="wechatRulesFlg ? wechatNumberRules : noRules"
            placeholder="请输入微信账号"
            @focus="fieldFocus(0)"
          />
        </van-cell-group>

        <div class="bottomBtnDiv">
          <van-button round block class="okBottomBtn" native-type="submit"
            >提交</van-button
          >
        </div>
      </van-form>
    </div>

    <van-popup
      class="pop"
      :position="position"
      round
      v-model="show"
      :close-on-click-overlay="isclose_on_click_overlay"
      @click-overlay="popclose()"
    >
      <div v-show="loadingFlg" class="loadingDiv">
        <van-loading type="spinner" size="24px" vertical>加载中...</van-loading>
      </div>
      <div class="popupTop">
        <van-row>
          <van-col span="12" class="popupTitle">{{ popup.title }}</van-col>
          <van-col span="12" class="popupAscertain"
            ><img
              class=""
              @click="popclose()"
              src="../../static/image/cancel.svg"
              alt=""
            />
          </van-col>
        </van-row>
      </div>

      <div class="popupCenter">
        <div class="popupMsg">
          {{ popup.msg }}
        </div>
        <div class="popupForm" v-show="state == 1">
          <van-cell-group>
            <van-cell
              title="姓名"
              :value="popup.popupForm.name"
              v-show="userName != ''"
              :border="false"
            />
            <van-cell
              title="开户银行"
              :value="popup.popupForm.bankName"
              v-show="userBankName != ''"
              :border="false"
            />
            <van-cell
              title="银行账号"
              class="yh_accout"
              :value="popup.popupForm.bankNumber"
              v-show="userBankNumber != ''"
              :border="false"
            />
            <van-cell
              title="支付宝"
              :value="popup.popupForm.alipayNumber"
              v-show="userAlipayNumber != ''"
              :border="false"
            />
            <van-cell
              title="微信"
              :value="popup.popupForm.wechatNumber"
              v-show="userWechatNumber != ''"
              :border="false"
            />
          </van-cell-group>
        </div>
        <div class="popupCheckDiv" v-show="state == 1">
          <van-checkbox
            v-model="popup.checked"
            @change="checked_change"
            icon-size="20px"
          >
            我已认证核对
          </van-checkbox>
        </div>
        <div class="bottomBtnDiv">
          <van-button
            round
            block
            :disabled="formBtnFlg"
            class="okBottomBtn"
            @click="nextBtnClick()"
          >
            {{ popup.btnName }}
          </van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Toast } from "vant";
import White from "@/components/Nav/white.vue";

import { SetPayType } from "@/api/payverification";

export default {
  name: "my-receivig",
  data() {
    return {
      title: "设置收付款信息",
      verfyMsg: "",
      show: false,
      state: 0,
      formFlg: false,
      bankRulesFlg: false,
      alipayRulesFlg: false,
      wechatRulesFlg: false,
      userName: localStorage.getItem("uname"),
      userBankName: "",
      userBankNumber: "",
      userAlipayNumber: "",
      userWechatNumber: "",
      noRules: [],
      popup: {
        title: "",
        msg: "",
        popupFormFlg: false,
        popupForm: {
          name: " ",
          bankName: "",
          bankNumber: "",
          alipayNumber: "",
          wechatNumber: "",
        },
        btnName: "",
      },
      nameRules: [
        {
          required: true,
          message: "名称不能为空",
          trigger: "onBlur",
        },
        {
          validator: (value) => {
            return /^([a-zA-Z0-9]|[\u4e00-\u9fa5])([a-zA-Z0-9]|[\u4e00-\u9fa5])*([a-zA-Z0-9]|[\u4e00-\u9fa5])$/g.test(
              value
            );
          },
          message: "名称需要两位字符以上！",
          trigger: "onBlur",
        },
      ],
      bankNameRules: [
        {
          validator: (value) => {
            return /^[\u4e00-\u9fa5]{4,}$/.test(value);
          },
          message: "请输入正确的开户银行",
          trigger: "onBlur",
        },
      ],
      bankNumberRules: [
        {
          validator: (value) => {
            
            return /^(\d{16,19})$/.test(value);
            // return /^([1-9]{1})(\d{14}|\d{18})$/.test(value);
          },
          message: "请输入正确的银行卡号码",
          trigger: "onBlur",
        },
      ],
      alipayNumberRules: [
        {
          validator: (value) => {
            return /(^[a-zA-Z0-9_.@]{0,30}$)|(^(?=\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$).{0,30}$)/.test(
              value
            );
          },
          message: "请输入正确的支付宝账号",
          trigger: "onBlur",
        },
      ],
      wechatNumberRules: [
        {
          validator: (value) => {
            return /^[a-zA-Z][-_a-zA-Z0-9]{5,19}$/.test(value);
          },
          message: "请输入正确的微信账号",
          trigger: "onBlur",
        },
      ],
      withdrawAddressRules: [
        {
          required: true,
          message: "提币地址不能为空",
          trigger: "onBlur",
        },
        {
          validator: (value) => {
            return /(^[T][a-zA-Z0-9]{33}$)/.test(value);
          },
          message: "请输入正确的提币地址",
          trigger: "onBlur",
        },
      ],
      dealPasswordRules: [
        {
          required: true,
          message: "交易密码不能为空",
          trigger: "onBlur",
        },
        {
          validator: (value) => {
            return /^(?=.*[a-zA-Z])(?=.*\d)[^]{8,16}$/.test(value);
          },
          message: "交易密码需要由字母和数字组成，且在8-16之间",
          trigger: "onBlur",
        },
      ],
      //验证码输入提交后显示加载页面 控制
      loadingFlg: false,
      //添加支付方式的index
      paymentIndex: 0,
      position: "bottom",
      //是否给content加外边距
      contentBottom: false,
      //浏览器高度
      windowHeight: window.screen.availHeight,
      formBtnFlg: true,
      vaild_fromData: null, //表单验证成功 数据
      isclose_on_click_overlay: true,
    };
  },
  components: {
    White,
  },
  created() {
    this.paymentIndex = this.$route.params.paymentIndex;
    if (![0, 1, 2].includes(this.paymentIndex)) {
      this.$router.back();
      this.$toast.warning("暂不支持该收付款方式");
    }
    if (this.paymentIndex === 0) {
      this.userBankName = this.$route.params.curPay_type;
      this.userBankNumber = this.$route.params.curPay_account;
    } else if (this.paymentIndex === 1) {
      this.userAlipayNumber = this.$route.params.curPay_account;
    } else {
      this.userWechatNumber = this.$route.params.curPay_account;
    }
  },
  methods: {
    checked_change() {
      if (this.popup.checked) {
        this.formBtnFlg = false;
      }
    },
    showPopup() {
      this.show = true;
    },
    popclose() {
      this.show = false;
      this.state = 0;
      this.position = "bottom";
    },
    fieldFocus(e) {
      if (e == 1) {
        this.contentBottom = true;
      } else {
        this.contentBottom = false;
      }
    },
    nickname() {
      this.$router.push({
        name: "amend",
      });
    },
    hideKeyboard() {
      // 输入完成隐藏键盘
      document.activeElement.blur(); // ios隐藏键盘
      this.$refs.input.blur(); // android隐藏键盘
    },

    handleSubmit() {
      this.$emit("input", this.value);
    },

    handleInput(e) {
      this.$refs.input.value = this.value;
      if (this.value.length >= this.number) {
        this.hideKeyboard();
      }
      this.handleSubmit();
    },
    //选择支付方式
    submitCheck() {
      if (this.userName != "") {
        if (
          (this.userBankName !== "" && this.userBankNumber !== "") ||
          this.userAlipayNumber !== "" ||
          this.userWechatNumber !== ""
        ) {
          this.formFlg = true;
          if (
            (this.userBankName !== "" && this.userBankNumber === "") ||
            (this.userBankName === "" && this.userBankNumber !== "")
          ) {
            Toast("银行信息请填写完整！");
            this.formFlg = false;
          }
        } else {
          Toast("请填写最少一种支付方式");
          this.formFlg = false;
        }
      }
    },
    handleFocus() {
      this.position = "center";
    },
    handleBulr() {
      this.position = "bottom";
    },
    //按钮颜色
    onInput() {
      if (this.userName != "") {
        //支付方式 选一种
        //添加银行
        if (this.userBankName != "" && this.userBankNumber != "") {
          //console.log("银行卡");
          this.bankRulesFlg = true;
        } else if (
          (this.userBankName != "" && this.userBankNumber == "") ||
          (this.userBankName == "" && this.userBankNumber != "")
        ) {
          // Toast('请输入银行卡的完整信息');
          return;
        } else {
          this.bankRulesFlg = false;
        }
        //添加支付宝
        if (this.userAlipayNumber != "") {
          //console.log("支付宝");
          this.alipayRulesFlg = true;
        } else {
          this.alipayRulesFlg = false;
        }
        //添加微信
        if (this.userWechatNumber != "") {
          //console.log("微信");
          this.wechatRulesFlg = true;
        } else {
          this.wechatRulesFlg = false;
        }
      }
      return this.formFlg;
    },
    onSubmit(values) {
      if (
        (this.userBankName != "" && this.userBankNumber == "") ||
        (this.userBankName == "" && this.userBankNumber != "")
      ) {
        Toast("请输入银行卡的完整信息");
      }
      this.submitCheck();
      let flg = false;
      this.$refs.form
        .validate()
        .then(() => {
          this.formBtnFlg = false;
          let flg1 = false;
          let flg2 = false;
          if (
            (this.userBankName != "" && this.userBankNumber != "") ||
            this.userAlipayNumber != "" ||
            this.userWechatNumber != ""
          ) {
            flg = true;
          }
          //验证成功 执行的方法
          if (this.formFlg && flg) {
            this.showPopup();
            //console.log("信息验证成功", values);
            this.vaild_fromData = values;
            this.popup = {
              title: "温馨提示",
              msg: "收付款信息涉及交易，请核对信息无误之后再进行提交",
              btnName: "好的",
              popupFormFlg: false,
              popupForm: {
                name: "",
                bankName: "",
                bankNumber: "",
                alipayNumber: "",
                wechatNumber: "",
              },
            };
          }
        })
        .catch(() => {
          //验证失败 执行的方法
        });
    },
    async nextBtnClick() {
      if (this.state == 0) {
        this.formBtnFlg = true;
        this.popup = {
          title: "温馨提示",
          msg: "请确认当前信息无误",
          popupFormFlg: true,
          popupForm: {
            name: this.userName,
            bankName: this.userBankName,
            bankNumber: this.userBankNumber,
            alipayNumber: this.userAlipayNumber,
            wechatNumber: this.userWechatNumber,
          },
          btnName: "确定",
        };
        this.state++;
      } else {
        //打开加载中
        this.loadingFlg = true;
        let pay;
        //加载中进行的操作
        if (+this.paymentIndex === 0) {
          pay = `${this.vaild_fromData.bankNumber}&${this.vaild_fromData.bankName}`;
        }
        if (+this.paymentIndex === 1) {
          pay = this.vaild_fromData.alipayName;
        }
        if (+this.paymentIndex === 2) {
          pay = this.vaild_fromData.wechatName;
        }
        this.isclose_on_click_overlay = false;

        try {
          const { data } = await SetPayType({
            type: this.paymentIndex + 1,
            pay,
          });
          //console.log(data);
          if (Number(data.State) < 0) {
            this.$toast.error("设置失败，请重试。。。");
            return false;
          }
          if (this.paymentIndex === 0) {
            localStorage.setItem("mybank", pay);
          } else if (this.paymentIndex === 1) {
            localStorage.setItem("myalipay", pay);
          } else {
            localStorage.setItem("mywechat", pay);
          }
          this.$router
            .replace({
              name: "receivingList",
            })
            .catch((err) => {});
        } catch (err) {
          this.$toast.error("设置失败，请重试。。。");
          console.warn(err);
        }

        this.loadingFlg = false;
        this.popclose(); //关闭弹出层
        this.isclose_on_click_overlay = true;
        // 验证成功后，调用接口
        this.state = 0;
        Toast("添加付款方式成功！");
      }
    },
  },
};
</script>

<style lang="less" scoped>

.yh_accout{
  /deep/ .van-cell__title{
    flex: 0;
    flex-basis: 150px;
  }
}

.content {
  padding: 0px 0 152px;
  .ccctext {
    color: #ccc;
  }

  p {
    margin: 0;
    padding: 0 32px 32px;
    font-size: 40px;
    font-weight: bold;
    color: #1b2945;
  }

  .van-hairline--top-bottom::after {
    border-width: 0;
  }

  .bottomBtnDiv {
    padding: 0.42667rem;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .okBottomBtn {
    background-color: #1b2945ff;
    color: #fff;
  }

  .noBottomBtn {
    background-color: #8c93a1;
    color: #fff;
  }

  .text {
    font-size: 28px;
    color: #333 !important;

    .van-cell-group--inset {
      margin: 0;
    }

    .van-cell {
      padding: 28px 32px;
    }

    /deep/.van-field__label {
      font-weight: 700;
    }

    .bankCell::after {
      color: #1d58;
      border-bottom: 0;
    }
  }

  .pop {
    background: #ffffff;
    border-color: #fff;
    font-weight: bold;
    color: #333333;
    box-sizing: border-box;
    padding: 20px 32px 140px;
    border-radius: 20px 20px 0 0;

    .popupCenter {
      padding: 20px 0;
    }

    .popupCenter > div:not(:last-of-type) {
      margin-bottom: 20px;
      font-size: 28px;
    }

    .popupTop {
      text-align: center;
      font-size: 36px;
      line-height: 48px;
      font-weight: 700;
      padding: 24px 32px;
      border-bottom: 1px solid #f3f4f5;

      .popupTitle {
        text-align: left;
        color: #1b2945ff;
        font-size: 0.5rem;
      }

      .popupAscertain {
        font-size: 0.5rem;
        text-align: right;
        color: #1b2945ff;
        height: 24px;
      }
    }

    .popupMsg {
      font-size: 28px;
      color: #fc7542ff;
    }
  }

  .security-code-wrap {
    overflow: hidden;
  }

  //验证码
  .security-code-container {
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;

    .field-wrap {
      list-style: none;
      display: block;
      width: 80px;
      height: 80px;
      line-height: 80px;
      font-size: 32px;
      background-color: #fff;
      margin: 4px;
      text-align: center;
      color: #000;
      border: 1px solid #f3f4f5ff;

      .char-field {
        font-style: normal;
      }
    }
  }

  .verfy {
    color: #237ff8ff;
    font-size: 20px;
    display: block;
    text-align: center;
    margin-top: 25px;
  }

  .verfy:target {
    color: #999999ff;
  }

  .input-code {
    position: absolute;
    left: -9999px;
    top: -99999px;
    width: 0;
    height: 0;
    opacity: 0;
    overflow: visible;
    z-index: -1;
  }
}

.loadingDiv {
  z-index: 2005;
  position: fixed;
  top: 50%;
  left: 0;
  right: 0;
}

.contentMB600 {
  padding-bottom: 600px;
}

.contentMB100 {
  padding-bottom: 100px;
}
</style>
