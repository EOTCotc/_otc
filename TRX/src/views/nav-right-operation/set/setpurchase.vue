<template>
  <div class="set-purchase-container">
    <Navwhite :title="title"></Navwhite>
    <div class="content">
      <div class="cell">
        <p class="cell_title">数量</p>
        <div class="inputs">
          <input type="number" v-model="number" @blur="onNumInput($event)" placeholder="最大收购数量" />
          <p style="color:#237FF8" @click="kindShow=false">{{kind}}</p>
        </div>
      </div>
      <div class="cell">
        <p class="cell_title">单价</p>
        <div class="inputs">
          <input
            type="number"
            v-model="price"
            @blur="onPriceInput(0.01, 100, $event,kind)"
            :placeholder="'收购'+kind+'的单价(CNY)'"
          />
          <p>CNY</p>
        </div>
      </div>

      <div class="cell">
        <p class="cell_title">限购</p>
        <div class="cell_flex">
          <div class="inputs cell_Width">
            <input
              type="number"
              :disabled="hasInput"
              v-model="MinLegalTender"
              @blur="onMinLegalTender"
              placeholder="最低收购总额"
            />
            <p>CNY</p>
            <span v-if="eror[0]" class="error-text">输入金额不正确</span>
          </div>
          <div class="inputs cell_Width">
            <input
              type="number"
              :disabled="hasInput"
              v-model="MinDigitalCash"
              @blur="onMinDigitalCash"
              placeholder="最低收购总额"
            />
            <p>{{kind}}</p>
            <span v-if="eror[1]" class="error-text">输入金额不正确</span>
          </div>
        </div>
        <div class="cell_flex">
          <div class="inputs cell_Width">
            <input
              type="number"
              :disabled="hasInput"
              v-model="MaxLegalTender"
              @blur="onMaxLegalTender"
              placeholder="最高收购总额"
            />
            <p>CNY</p>
            <span v-if="eror[2]" class="error-text">输入金额不正确</span>
          </div>
          <div class="inputs cell_Width">
            <input
              type="number"
              :disabled="hasInput"
              v-model="MaxDigitalCash"
              @blur="onMaxDigitalCash"
              placeholder="最高收购总额"
            />
            <p>{{kind}}</p>
            <span v-if="eror[3]" class="error-text">输入金额不正确</span>
          </div>
        </div>
      </div>
    </div>

    <footer class="footer">
      <h6>使用现金交易：</h6>
      <van-cell center :border="false">
        <template #icon>
          <img class="pay-img" :src="require('@/assets/currency-icons/unmoney.png')" alt="aug-icon" />
        </template>
        <template #title>
          <span class="custom-title">可接受现金</span>
        </template>
        <template #right-icon>
          <van-switch v-model="receiving_checked" @change="check_change('isMoney')" size="18px" />
        </template>
      </van-cell>
      <van-cell center :border="false">
        <template #icon>
          <img
            class="pay-img"
            :src="require('@/assets/currency-icons/curmoney.png')"
            alt="aug-icon"
          />
        </template>
        <template #title>
          <span class="custom-title">只接受现金</span>
        </template>
        <template #right-icon>
          <van-switch v-model="isMoney" @change="check_change('receiving_checked')" size="18px" />
        </template>
      </van-cell>
    </footer>

    <div class="button">
      <van-button type="primary" block round @click="popswitch" :disabled="vali_value">生成收购订单</van-button>
    </div>

    <van-popup
      class="popup"
      :close-on-click-overlay="isclose_on_click_overlay"
      v-model="popshow"
      @close="close"
      round
      closeable
      position="bottom"
    >
      <div class="popup-content">
        <p class="pop-title">确定收购订单</p>
        <p class="pop-message">请确认当前订单信息</p>
        <div class="pop-data">
          <div>
            <p>单价</p>
            <p>{{ price }} CNY</p>
          </div>
          <div>
            <p>数量</p>
            <p>{{ number }} {{kind}}</p>
          </div>
          <div>
            <p>限额</p>
            <p>{{ MinLegalTender }} CNY ~ {{ MaxLegalTender }} CNY</p>
          </div>
          <div>
            <p>限额</p>
            <p>{{ MinDigitalCash }} {{kind}} ~ {{ MaxDigitalCash }} {{kind}}</p>
          </div>
        </div>

        <van-checkbox shape="square" v-model="checked">我已认真核对</van-checkbox>
        <van-button
          class="pop-button"
          @click="jump()"
          round
          color="#1B2945"
          block
          :disabled="!checked"
        >确认生成</van-button>
      </div>
    </van-popup>

    <van-popup v-model="kindShow" round position="bottom">
      <van-picker
        show-toolbar
        :columns="columns"
        @cancel="showPicker = false"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>

<script>
import Navwhite from '@/components/Nav/white.vue'
import currency_mixin from '@/mixins/currency_mixins'
import loadingToast from '@/components/loading-toast'
import { addOrder } from '@/api/trxRequest'

export default {
  name: 'setpur-chase', //挂收购单
  components: {
    Navwhite,
  },
  mixins: [currency_mixin],
  data() {
    return {
      hasInput: true,
      title: '收购',

      kindShow: false,
      kind: 'USDT',
      columns: ['USDT', 'USDC', 'BTC', 'ETH', 'BNB'],
    }
  },
  methods: {
    onConfirm(value) {
      this.kind = value
      this.kindShow = false
    },
    //生成收购单
    async jump() {
      this.$toast.warning(
        {
          component: loadingToast,
          props: {
            title: '收购单生成中,请耐心等待。。。',
          },
        },
        {
          icon: false,
          timeout: false,
        }
      )
      this.isclose_on_click_overlay = false
      try {
        const { data } = await addOrder({
          cny: this.price,
          num: this.number,
          amount1: this.MinLegalTender,
          amount2: this.MaxLegalTender,
          cash: this.cash,
        })
        this.$toast.clear()
        if (data.State === '1') {
          this.$toast.error(
            <div>
              <p style="font-size:14px;margin:5px">挂单数量超过最大数额！</p>
            </div>,
            {
              timeout: 3000,
            }
          )
          this.isclose_on_click_overlay = true
          return false
        }
        if(data.State === '-1'){
          this.$toast.error(
            <div>
              <p style="font-size:14px;margin:5px">请优先完成出售订单，再来挂收购单！</p>
            </div>,
            {
              timeout: 3000,
            }
          )
          this.isclose_on_click_overlay = true
          return false
        }
        this.$router.replace({
          name: 'order-Ticket',
          params: {
            method: 'buy',
          },
        })
      } catch (err) {
        console.warn(err)
        this.$toast.error('网络有点小错误，请稍后重试。')
      }
      this.isclose_on_click_overlay = true
    },
  },
}
</script>

<style lang="less" scoped>
::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #999;
}

.error-text {
  font-size: 14px;
  position: absolute;
  bottom: -40px;
  color: red;
}

.set-purchase-container {
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow-y: auto;
  .pay-img {
    width: 60px;
    height: 60px;
    margin-right: 15px;
  }
}

.footer {
  position: relative;
  flex: 460px;
  margin-bottom: 25px;
  h6 {
    margin: 0px 25px 10px;
    padding: 15px 0;
    font-size: 0.45rem;
    position: sticky;
    text-indent: 0.2rem;
    border-radius: 15px;
    z-index: 2;
    background-color: #eee;
    line-height: 40px;
    height: 40px;
    top: 0;
  }
  overflow-y: auto;
}

.button {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0 25px 80px;
  height: 100px;
}

.content {
  padding: 32px 32px 0;
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
      margin-bottom: 20px;
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
        height: 96px;
        border: none;
        background: none;
        padding-left: 24px;
      }
      p {
        padding-right: 12px;
        font-weight: 400;
      }
    }
  }
}
.popup {
  .popup-content {
    padding: 32px;
    font-size: 28px;
    .pop-title {
      font-size: 40px;
      color: #1b2945;
      font-weight: bold;
      margin-bottom: 30px !important;
    }
    .pop-message {
      color: #fc7542;
      margin-bottom: 40px !important;
    }
    .pop-data {
      div {
        display: flex;
        justify-content: space-between;
        margin-bottom: 32px;
        p:first-child {
          color: #999;
        }
        p:last-child {
          font-weight: bold;
        }
      }
    }
    .pop-button {
      margin-top: 60px;
    }
  }
}
</style>
