<template>
  <div class="content">
    <div class="order">
      <div class="title">
        <p>总订单号: {{ orderItem.id }}</p>
        <p class="title-p" :style="{ display: 'flex' }">
          <i @click="amend" class="iconfont icon-bianji"></i>
        </p>
      </div>
      <div class="text">
        <div>
          <p>单价</p>
          <p>{{ orderItem.cny }} CNY</p>
        </div>
        <div>
          <p>数量</p>
          <p>{{ orderItem.num }} USDT</p>
        </div>
        <div>
          <p>限额</p>
          <div class="quota">
            <span>{{ orderItem.amount1 }}CNY ~ {{ orderItem.amount2 }}CNY</span>
          </div>
        </div>

        <div>
          <p>更新时间</p>
          <p>{{ orderItem.eotc }}</p>
        </div>
      </div>

      <div v-if="orderItem.dsx == '200'">
        <van-button block round class="cancel_button" :disabled="true">已取消</van-button>
      </div>

      <div class="button" v-else>
        <!-- <van-button  type="danger"  round @click="handlecancel_order">
          取消订单
        </van-button>-->
        <van-button v-if="orderItem.dsx == '1'" round type="warning" block @click="soldout">暂时下架</van-button>
        <van-button v-else round type="info" @click="putaway">继续上架</van-button>
      </div>
    </div>

    <!-- 修改弹出层 -->
    <van-popup
      :close-on-click-overlay="isclose_on_click_overlay"
      v-model="show"
      position="center"
      get-container="body"
      closeable
      round
      class="pop"
    >
      <div class="pop-content">
        <div class="pop-title">收购单 {{ orderItem.id }}</div>
        <div class="cells">
          <div class="cell">
            <p class="cell_title">单价</p>
            <div class="inputs">
              <input type="number" v-model="price" @blur="onPriceInput(0.01, 100, $event)" />
              <p>CNY</p>
            </div>
          </div>
          <div class="cell">
            <p class="cell_title">数量</p>
            <div class="inputs">
              <input type="number" readonly v-model="number" @blur="onNumInput($event)" />
              <p>USDT</p>
            </div>
          </div>
          <div class="cell">
            <p class="cell_title">限购</p>
            <div class="cell_flex">
              <div class="inputs cell_Width">
                <input type="number" v-model="MinLegalTender" @blur="onMinLegalTender" />
                <p>CNY</p>
                <span v-if="eror[0]" class="error-text">输入金额不正确</span>
              </div>
              <div class="inputs cell_Width">
                <input type="number" v-model="MinDigitalCash" @blur="onMinDigitalCash" />
                <p>USDT</p>
                <span v-if="eror[1]" class="error-text">输入金额不正确</span>
              </div>
            </div>
            <div class="cell_flex">
              <div class="inputs cell_Width">
                <input type="number" v-model="MaxLegalTender" @blur="onMaxLegalTender" />
                <p>CNY</p>
                <span v-if="eror[2]" class="error-text">输入金额不正确</span>
              </div>
              <div class="inputs cell_Width">
                <input type="number" v-model="MaxDigitalCash" @blur="onMaxDigitalCash" />
                <p>USDT</p>
                <span v-if="eror[3]" class="error-text">输入金额不正确</span>
              </div>
            </div>
          </div>
        </div>
        <div class="buttons">
          <van-button color="#1B2945" block round @click="updata(1)">更新订单</van-button>
          <p @click="cancel">取消订单</p>
        </div>
      </div>
    </van-popup>
    <!-- 取消弹窗 -->
    <van-dialog
      v-model="cancelShow"
      title="取消提示"
      show-cancel-button
      confirm-button-color="#1B2945"
      confirm-button-text="确认"
      cancel-button-color="#666"
      cancel-button-text="取消"
      get-container="body"
      @confirm="cancel_yes"
    >
      <template #default>
        <div class="text_color">是否取消该收购订单？</div>
        <p :style="{ color: 'red', textAlign: 'center', margin: '0 0 15px 0' }">取消后，订单不能恢复！</p>
      </template>
    </van-dialog>
  </div>
</template>

<script>
import { Dialog } from 'vant'

import { UPdateOrder_sj } from '@/api/trxRequest'

import PubSub from 'pubsub-js'

export default {
  //收购 总订单
  name: 'my-buyBlanketOrder',
  components: {
    [Dialog.Component.name]: Dialog.Component,
  },
  props: {
    orderItem: {
      type: [Object],
      require: true,
    },
  },
  data() {
    return {
      isclose_on_click_overlay: true,
      //修改弹出层
      show: false,
      //取消提示
      cancelShow: false,
      //订单按钮状态
      orderShow: true,
      //单价
      price: '',
      //数量
      number: '',
      //最大法币
      MaxLegalTender: '',
      //最小法币
      MinLegalTender: '',
      //最大数字货币
      MaxDigitalCash: '',
      //最小数字货币
      MinDigitalCash: '',
      isChange_orderInfo: false, //是否有修改过
      eror: [false, false, false, false], // 对应错误信息展示
      vali_value: true, //所有值是否有效
    }
  },
  created() {
    this.price = this.orderItem.cny
    this.number = this.orderItem.num
    this.MaxLegalTender = this.orderItem.amount2
    this.MinLegalTender = this.orderItem.amount1
    this.MaxDigitalCash = (this.orderItem.amount2 / this.orderItem.cny).toFixed(6)
    this.MinDigitalCash = (this.orderItem.amount1 / this.orderItem.cny).toFixed(6)
  },
  methods: {
    amend() {
      //订单是否处于取消状态
      if (this.orderItem.dsx === '200') {
        return false
      }
      this.show = true
    },
    async updata(type) {
      if (!this.isChange_orderInfo) {
        this.show = false
        return false
      }
      this.isclose_on_click_overlay = false
      if (!this.vali_value) {
        try {
          await UPdateOrder_sj({
            cny: this.price,
            num: this.number,
            amount1: this.MinLegalTender,
            amount2: this.MaxLegalTender,
            did: this.orderItem.id,
            type,
          })
          this.$toast.success('订单修改成功')
          PubSub.publish('update_order')
        } catch (err) {
          this.$toast.error(err, {
            timeout: false,
          })
        } finally {
          this.show = false
        }
      } else {
        this.$toast.clear()
        this.$toast.warning('输入金额数量不正确，请重新输入')
      }
      this.isclose_on_click_overlay = true
    },
    cancel() {
      this.show = false
      this.cancelShow = true
    },
    async cancel_yes() {
      try {
        await UPdateOrder_sj({
          cny: this.price,
          num: this.number,
          amount1: this.MinLegalTender,
          amount2: this.MaxLegalTender,
          did: this.orderItem.id,
          type: 2, //取消订单
        })
        this.$toast.success('订单已经取消')
        PubSub.publish('update_order')
      } catch (err) {
        console.warn(err)
      }
    },
    soldout() {
      Dialog.confirm({
        title: '下架提示',
        message: '暂时下架交易后会暂时停止对外收购，\n是否暂时下架该笔订单 ',
        confirmButtonText: '下架',
        confirmButtonColor: 'red',
        cancelButtonText: '取消',
        cancelButtonColor: '#666',
      })
        .then(async () => {
          UPdateOrder_sj({
            cny: this.price,
            num: this.number,
            amount1: this.MinLegalTender,
            amount2: this.MaxLegalTender,
            did: this.orderItem.id,
            type: 220, //下架
          }).then(() => {
            this.$toast.success('订单已下架')
            PubSub.publish('update_order')
          })
        })
        .catch(() => {})
    },
    putaway() {
      // 订单上架
      Dialog.confirm({
        title: '上架提示',
        message: '上架后订单可正常进行交易，\n是否上架该笔订单 ',
        confirmButtonText: '上架',
        cancelButtonText: '取消',
        cancelButtonColor: '#666',
      })
        .then(() => {
          UPdateOrder_sj({
            cny: this.price,
            num: this.number,
            amount1: this.MinLegalTender,
            amount2: this.MaxLegalTender,
            did: this.orderItem.id,
            type: 221,
          }).then(() => {
            this.$toast.success('订单已上架，可正常进行交易')
            PubSub.publish('update_order')
          })
        })
        .catch(() => {
          // on cancel
        })
    },
    warning(index, flg) {
      this.$set(this.eror, index, flg)
      setTimeout(() => {
        this.$set(this.eror, index, !flg)
      }, 800)
    },
    onPriceInput(min, max, e) {
      this.isChange_orderInfo = true
      this.$toast.clear()
      if (min <= Number(e.target.value) && Number(e.target.value) <= max) {
        this.price = e.target.value
      } else if (Number(e.target.value) <= min) {
        e.target.value = min
        this.price = min
        this.$toast.warning(`该货币价格不能低于 ${min} CNY`)
      } else if (Number(e.target.value) >= max) {
        this.price = max
        e.target.value = max
        this.$toast.warning(`该货币价格不能高于 ${max} CNY`)
      }
      this.is_validVal()
    },
    onNumInput(e) {
      this.isChange_orderInfo = true
      // const max = localStorage.getItem("myeotc");
      // localStorage.getItem("otczy")
      // localStorage.getItem("giftEotc")

      const myEoct = localStorage.getItem('myeotc') * 1
      const otczy = localStorage.getItem('otczy') * 1
      const giftEotc = localStorage.getItem('giftEotc') * 1

      const max = myEoct + otczy + giftEotc

      if (Number(e.target.value) < 0) {
        e.target.value = 0
        this.number = 0
      }
      if (Number(e.target.value) > max * 10) {
        e.target.value = max * 10
        this.number = e.target.value
        this.$toast.clear()
        this.$toast.warning(`您最高收购 USDT 的数量不能超过质押的数量${max * 10}`)
      }
      this.is_validVal()
    },
    //限购 最小 法币值
    onMinLegalTender(e) {
      this.isChange_orderInfo = true
      const value = e.target.value
      if (
        0 < parseFloat(value) &&
        value <= (parseFloat(this.price) * parseFloat(this.number)).toFixed(2)
      ) {
        this.MinDigitalCash = (+e.target.value / this.price).toFixed(6)
      }
      this.is_validVal()
    },
    // 限购 最小 货币值
    onMinDigitalCash(e) {
      this.isChange_orderInfo = true
      const value = e.target.value
      if (0 <= +value && +value <= this.number) {
        this.MinLegalTender = (value * this.price).toFixed(2)
      }
      this.is_validVal()
    },
    // 限购 最高 金额
    onMaxLegalTender(e) {
      this.isChange_orderInfo = true
      const value = parseFloat(e.target.value)
      if (
        value >= parseFloat(this.MinLegalTender) &&
        value <= (parseFloat(this.price) * parseFloat(this.number)).toFixed(2)
      ) {
        this.MaxDigitalCash = (value / this.price).toFixed(6)
      }
      this.is_validVal()
    },
    onMaxDigitalCash(e) {
      this.isChange_orderInfo = true
      const value = e.target.value
      if (+this.MinDigitalCash <= value && value <= +this.number) {
        this.MaxLegalTender = (value * this.price).toFixed(2)
      }
      this.is_validVal(3)
    },
    is_validVal() {
      if ((this.price ?? '') === '') {
        this.vali_value = true
        return false
      }
      if ((this.number ?? '') === '') {
        this.vali_value = true
        return false
      }
      if ((this.MaxLegalTender ?? '') === '') {
        this.vali_value = true
        return false
      }
      if ((this.MinLegalTender ?? '') === '') {
        this.vali_value = true
        return false
      }
      if ((this.MaxDigitalCash ?? '') === '') {
        this.vali_value = true
        return false
      }
      if ((this.MinDigitalCash ?? '') === '') {
        this.vali_value = true
        return false
      }
      this.effective_range()
      return true
    },
    effective_range() {
      const MinLegalTender = parseFloat(this.MinLegalTender)
      const MinDigitalCash = parseFloat(this.MinDigitalCash)
      const MaxLegalTender = parseFloat(this.MaxLegalTender) // tender 法币
      const MaxDigitalCash = parseFloat(this.MaxDigitalCash)

      const price = parseFloat(this.price)
      const num = parseFloat(this.number)

      if (MinLegalTender <= 0 || MinLegalTender > (price * num).toFixed(2)) {
        this.vali_value = true
        this.warning(0, true)
        return false
      }

      if (MinDigitalCash <= 0 || MinDigitalCash > num) {
        this.vali_value = true
        this.warning(1, true)
        return false
      }

      if (MaxLegalTender < MinLegalTender || MaxLegalTender > (price * num).toFixed(2)) {
        this.vali_value = true
        this.warning(2, true)
        return false
      }

      if (MaxDigitalCash < MinDigitalCash || MaxDigitalCash > num) {
        this.vali_value = true
        this.warning(3, true)
        return false
      }
      this.vali_value = false
    },
  },
}
</script>

<style lang="less" scoped>
.error-text {
  font-size: 14px;
  position: absolute;
  bottom: -40px;
  color: red;
}

.order {
  margin: 24px;
  padding: 35px 32px 40px;
  font-size: 28px;
  background: #fff;
  color: #333;
  border-radius: 20px;
  .cancel_button {
    background-color: #999;
    color: #ccc;
  }
  .title {
    margin-bottom: 56px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    p {
      font-size: 32px;
      font-weight: bold;
    }
    i {
      font-size: 40px;
      color: #247ff7;
    }
  }
  .text {
    margin-bottom: 30px;
    div {
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      p:first-child {
        color: #999999;
      }
      .quota {
        color: #333 !important;
        display: flex;
        flex-flow: column;
        text-align: right;
      }
    }
  }
  .button {
    display: grid;
    grid-template: 1fr/1fr;
    gap: 20px;
  }
}
.pop {
  width: 686px;
  // height: 936px;
  .pop-content {
    padding: 30px;
    .pop-title {
      font-size: 36px;
      font-weight: bold;
      margin-bottom: 52px;
    }
    .cells {
      margin-bottom: 40px;
      .cell {
        font-size: 32px;
        margin-bottom: 30px;
        .cell_title {
          margin-bottom: 20px;
          font-weight: bold;
        }
        .cell_flex {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.6rem;
          .cell_Width {
            width: 48%;
            position: relative;
          }
        }
        .inputs {
          border: 1px solid #c8cfde;
          border-radius: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          input {
            width: 70%;
            height: 80px;
            border: none;
            background: none;
            padding-left: 24px;
          }
          p {
            padding-right: 10px;
            font-weight: 400;
          }
        }
      }
    }
    .buttons {
      padding: 0 16px;
      display: flex;
      flex-flow: column;
      align-items: center;
      p {
        padding: 40px 0 8px;
        font-size: 32px;
        color: #f37a4c;
      }
    }
  }
}
.text_color {
  margin: 30px 0px;
  text-align: center;
  color: #f37a4c;
}
</style>
