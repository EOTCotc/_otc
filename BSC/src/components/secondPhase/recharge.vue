<template>
  <div>
    <white :title="title"></white>
    <div class="content">
      <div class="top">
        <p>充值类别</p>
        <div class="category">
          <p
            v-for="(item,index) in category"
            :key="index"
            :class="item.show?'action':''"
            @click="switchTo(index)"
          >{{item.title}}</p>
        </div>
      </div>
      <div>
        <van-field v-model="netType" :border="false" readonly label="充值网络" />
        <van-field v-model="address2" :border="false" readonly label="充值地址" />
        <van-field v-model="num" type="number" :border="false" label="充值数量" placeholder="请输入充值数量" />
      </div>
      <div class="footer">
        <van-button type="info" block round :disabled="num!=''?false:true" @click="recharge()">完成充值</van-button>
        <p @click="look()">查看充值记录</p>
      </div>
    </div>
  </div>
</template>
<script>
import { SendUSDT, Reconstruction_getTrxBalance, loadweb3,userBaseMes} from '@/utils/web3'
import { Recharge } from '@/api/trxRequest'
import { Dialog } from 'vant'
import white from '@/components/Nav/white.vue'

export default {
  //充值
  components: {
    white,
  },
  data() {
    return {
      title: '充值',
      category: [
        { title: 'EOTC', show: true },
        { title: 'USDT', show: false },
        { title: 'LP', show: false },
        { title: 'NFT', show: false },
      ],
      netType: '',
      address: '',
      address2: '',
      num: '',
    }
  },
  created() {
     setTimeout(() => {
      loadweb3(userBaseMes)
    }, 1000)
    this.netType = localStorage.getItem('netType')
    let net = localStorage.getItem('netType')
    if (net == 'bsc'||net=='asd') {
      this.address = '0xdCAaB3E9Ade1000fd23Fa0EAcd2D7E1359300D8B'
    } else {
      this.address = 'TA6jfgkurdTrwqic3G56GpG2Keh5EWx2kq'
    }
    this.address2 =
      this.address.substring(0, 10) +
      '...' +
      this.address.substring(this.address.length - 10, this.address.length)
  },
  methods: {
    switchTo(index) {
      for (let i of this.category) {
        i.show = false
      }
      this.category[index].show = true
    },
    async recharge() {
      let money
      for (let i of this.category) {
        if (i.show) {
          if (i.title == 'USDT' || i.title == 'EOTC') {
            money = i.title
          } else {
            this.$toast.warning(`${i.title}充值功能尚未开放！`)
            return
          }
        }
      }
      // if (money == 'USDT') {
      //   await myUsdtAmount()
      //   num = Number(localStorage.getItem('myamount'))
      // } else if (money == 'EOTC') {
      //   await myEOTCAmount()
      //   num = Number(localStorage.getItem('eotcAmount'))
      // }
      let min=money.toLowerCase()

      await Reconstruction_getTrxBalance()
      SendUSDT(this.num, this.address, min).then((res) => {
        let net
        if (money == 'EOTC') {
          net = money.toLowerCase()
        } else if (money == 'USDT') {
          net = localStorage.getItem('netType')
        }
        Recharge({ hx: res, usdt: this.num, net: net }).then((res) => {
          console.log(res)
          if (res.data.State > 0) {
            Dialog.alert({
              message: '充值成功!\n您充值的金额将在5分钟之内到账.',
            }).then(() => {
              // on close
            })
          }
        })
      })
    },

    look() {
      this.$router.push({ name: 'rechargeRecord' })
    },
  },
}
</script>

<style lang="less" scoped>
/deep/.van-cell {
  padding-left: 0;
  padding-right: 0;
}
.content {
  padding: 35px 30px 0;
  font-size: 28px;
  .top {
    .category {
      display: flex;
      justify-content: space-between;
      margin: 30px 0;
      p {
        padding: 14px 0;
        width: 20%;
        text-align: center;
        background: #f3f4f5;
        border: 1px solid #f3f4f5;
        border-radius: 16px;
      }
      .action {
        color: #237ff8;
        background: #fff;
        border: 1px solid #237ff8;
      }
    }
  }
  .footer {
    margin-top: 40px;
    p {
      text-align: center;
      color: #237ff8;
      margin-top: 30px;
    }
  }
}
</style>
