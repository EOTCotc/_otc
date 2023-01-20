<template>
  <div class="zh-container" v-if="isVoild_token">
    <van-field v-model="token_val" center placeholder="请输入Token">
      <template #button>
        <van-button size="small" type="primary" @click="volidToken(token_val)">确认</van-button>
      </template>
    </van-field>
  </div>
  <div class="zh-container" v-else>
    <p class="qb_bancle">我的钱包余额：</p>
    <div class="balance">
      <div>
        <p>TRX: {{ myTrx }}</p>
      </div>
      <div>
        <p>USDT: {{ myUsdt }}</p>
      </div>
    </div>
    <van-field
      readonly
      v-model="value"
      label="转币地址："
      :style="{ color: 'red', fontWeight: '700' }"
      input-align="right"
    />

    <div class="balance">
      <div>
        <p :style="{ color: 'red', fontWeight: '700' }">TRX: {{ Transfers_TRX }}</p>
      </div>
      <div>
        <p :style="{ color: 'red', fontWeight: '700' }">USDT: {{ Transfers_USDT }}</p>
      </div>
    </div>
    <main>
      <div class="main">
        <section class="content" :style="{ position: 'sticky', top: '0', background: '#eee' }">
          <p>姓名</p>
          <p>钱包地址</p>
          <p>邮箱</p>
          <p>数量</p>
          <p>电话</p>
          <p>时间</p>
        </section>
        <section class="content p2" v-for="(user, i) in dataList" :key="i">
          <p>{{ user.UserName }}</p>
          <p>{{ briefMyAddress(user.ads.trim()) }}</p>
          <p>{{ user.mail }}</p>
          <p>{{ user.num }}</p>
          <p>{{ user.tel }}</p>
          <p>{{ user.date }}</p>
        </section>
      </div>
      <van-row class="bottom" type="flex" justify="space-around">
        <van-col
          span="10"
          :style="{ color: 'red', fontWeight: '700' }"
        >预估手续费：{{ total_trxServer() }}</van-col>
        <van-col span="10" :style="{ color: 'red', fontWeight: '700' }">提币总量：{{ total_coin() }}</van-col>
      </van-row>
    </main>

    <footer class="footer">
      <div class="cancel">
        <van-button type="default" @click="reharge">充值</van-button>
      </div>
      <div class="next">
        <van-button type="default" :disabled="Transfers_Btn" @click="transfer">转账</van-button>
      </div>
    </footer>

    <van-dialog
      v-model="rehargeModel"
      show-cancel-button
      @confirm="confirm"
      :confirmButtonText="type === 'transfer' ? '转账' : '充值'"
    >
      <template #title>
        <Reharge ref="numInput" :action="action" @num-input="onInput" @change-Type="changeType"></Reharge>
      </template>
      <template>
        <div class="reharge_coin"></div>
      </template>
    </van-dialog>
  </div>
</template>

<script>
import { contractAddress_usdt } from '@/utils/abi'

import { tcoinFee, SendUSDT } from '@/utils/web3'

import { AutoCoin } from '@/api/payverification'

import Reharge from './rehargeinput.vue'

export default {
  components: {
    Reharge,
  },
  data() {
    return {
      value: this.briefMyAddress('THNYKGqFBcs3V6WrEr1Qq4LCV8mvKuK6Hh'),
      myTrx: '0.00',
      myUsdt: localStorage.getItem('myamount'),
      Transfers_TRX: '0.00',
      Transfers_USDT: '0.00',
      rehargeModel: false,
      type: '',
      Transfers_val: '',
      action: { text: 'USDT', icon: require('@/static/image/usdt.svg') },
      isVoild_token: true,
      token_val: '',
      dataList: [],
      Transfers_Btn: false,
    }
  },

  methods: {
    async volidToken(val) {
      const { data } = await AutoCoin(0, this.token_val.trim())
      if (data.State === '0') {
        this.$router.replace({
          name: 'error',
        })
        return false
      }
      this.dataList = data
      this.isVoild_token = false
      if (data.length == 0) {
        this.Transfers_Btn = true
      }
      this.update_Data()
    },
    async update_Data() {
      this.init()
      this.Transfers_USDT = await this.loadingUsdt()
    },
    async loadingUsdt() {
      return new Promise(async (resolve, reject) => {
        let mynum
        let mytron_usdt = await window.tronWeb.contract().at(contractAddress_usdt)
        let ads = 'THNYKGqFBcs3V6WrEr1Qq4LCV8mvKuK6Hh'
        mytron_usdt.balanceOf(ads).call(
          {
            from: ads,
          },
          function (error, result) {
            if (!error) {
              mynum = (result / 1000000).toFixed(2)
              console.log('mynum', mynum)
              resolve(mynum)
            } else {
              console.log(error)
              reject(error)
            }
          }
        )
      })
    },
    init() {
      window.tronWeb.trx.getBalance(window.tronWeb.defaultAddress.base58).then((result) => {
        console.log('myTrx:', result)
        this.myTrx = (result / 1000000).toFixed(2)
      })

      window.tronWeb.trx.getBalance('THNYKGqFBcs3V6WrEr1Qq4LCV8mvKuK6Hh').then((result) => {
        console.log(result)
        this.Transfers_TRX = (result / 1000000).toFixed(2)
      })
    },
    onInput(val) {
      this.Transfers_val = val
    },
    changeType(item) {
      this.action = item
    },
    async confirm() {
      const coin_type = this.action.text
      const val = this.Transfers_val
      const action_type = this.type
      if ((this.Transfers_val ?? '') !== '') {
        if (action_type === 'recharge' && coin_type === 'TRX') {
          if (parseFloat(val) > parseFloat(this.myTrx)) {
            this.$toast.error('TRX钱包余额不足！')
            return false
          }
          await tcoinFee(val)
          await this.update_Data()
          this.myTrx = parseFloat(this.myTrx) - parseFloat(val)
          this.Transfers_TRX = parseFloat(this.Transfers_TRX) + parseFloat(val)
          return true
        }

        if (action_type === 'recharge' && coin_type === 'USDT') {
          if (parseFloat(val) > parseFloat(this.myUsdt)) {
            this.$toast.error('USDT 钱包余额不足！')
            return false
          }
          try {
            await SendUSDT(val, 'THNYKGqFBcs3V6WrEr1Qq4LCV8mvKuK6Hh', coin_type)
            await this.update_Data()
            this.myUsdt = this.myUsdt - val
          } catch (err) {
            this.$toast.error(err)
          }
        }
      }
      return false
    },
    total_trxServer() {
      return parseInt(this.dataList.length * 7)
    },
    total_coin() {
      return this.dataList
        .reduce((preCoin, user) => (preCoin += parseFloat(user.num)), 0)
        .toFixed(2)
    },
    reharge() {
      this.type = 'recharge'
      this.rehargeModel = true
      this.$nextTick(this.$refs['numInput']?.clearNum)
    },
    async transfer() {
      if (
        parseFloat(this.Transfers_TRX) >= parseFloat(this.total_trxServer()) &&
        parseFloat(this.Transfers_USDT) >= parseFloat(this.total_coin())
      ) {
        try {
          const { data } = await AutoCoin(1, this.token_val)
          if (data.State === '1') {
            await this.update_Data()
            this.$toast.success('转账成功')
          }
        } catch (err) {
          this.$toast.error(err)
        }
      } else {
        this.$toast.error('钱包余额不足，请充值！')
      }
    },
  },
}
</script>

<style lang="less" scoped>
.zh-container {
  .van-dialog {
    background-color: #eee;
  }
  /deep/ .van-dialog__header {
    background-color: #eee;
    padding-bottom: 15px;
  }
  .qb_bancle {
    font-size: 0.4rem;
    padding: 0.26667rem 0.42667rem;
  }
  /deep/ .van-field__label {
    color: red !important;
  }
  /deep/ .van-cell::after {
    border: none !important;
  }
  .balance {
    display: flex;
    justify-content: space-around;
    padding: 10px 52px 40px;
    div {
      width: 45%;
      background: #f3f4f5;
      // padding: 30px 20px;
      font-size: 28px;
      border-radius: 40px;
      // color: #fff;
      text-align: center;
      p {
        padding: 20px 0;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }
  main {
    width: 100vw;
    height: 40vh;
    overflow-y: auto;
    font-size: 0.45rem;
    position: relative;
    text-align: center;
    padding-bottom: 1rem;
    display: flex;
    .p2:nth-child(even) {
      background-color: #fff;
    }
    .p2:nth-child(odd) {
      background-color: rgb(250, 250, 250);
    }
    .p2 {
      border-bottom: 1px solid rgb(250, 250, 250);
    }
    overflow: hidden;
    .content {
      display: flex;
      justify-content: center;
      align-items: center;
      width: fit-content;
      overflow-x: auto;
      font-size: 0.4rem;
      p {
        padding: 15px;
      }
      p:nth-child(1) {
        width: 2rem;
      }
      p:nth-child(2) {
        width: 6rem;
      }
      p:nth-child(3) {
        width: 5rem;
      }
      p:nth-child(4) {
        width: 3rem;
      }
      p:nth-child(5) {
        width: 3rem;
      }
      p:nth-child(6) {
        width: 4rem;
      }
    }
    .main {
      flex: 1;
      overflow-y: auto;
    }
    .bottom {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      line-height: 1rem;
    }
  }
  .footer {
    display: flex;
    flex: 1;
    align-items: flex-end;
    justify-content: space-evenly;
    padding-bottom: 25px;
    margin-top: 1rem;
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
        padding: 0 100px;
      }
    }
  }
}
</style>
