<template>
  <div class="content">
    <p>账号信息</p>
    <div class="text">
      <!-- <van-uploader
        v-model="fileList"
        :after-read="afterRead"
        :preview-image="false"
      >-->
      <van-cell title="头像"
                value="内容"
                is-link>
        <template #default>
          <div class="img_flex">
            <div class="img_bg">
              <img :src="url"
                   alt />
            </div>
          </div>
        </template>
      </van-cell>
      <!-- </van-uploader> -->

      <van-cell title="邮箱"
                :value="email" />
      <van-cell title="UID"
                :value="uid">
        <template #right-icon>
          <i class="iconfont icon-fuzhi icon"
             @click="handleCopy(uid)"></i>
        </template>
      </van-cell>
      <van-cell title="节点类型"
                :value="item" />
      <van-cell title="设置电报群"
                is-link
                @click="show = true" />
      <van-cell title="绑定钱包地址">
        <template #default>
          <div class="van-ellipsis">{{ briefMyAddress(address) }}</div>
        </template>
        <template #right-icon>
          <i class="iconfont icon-fuzhi icon"
             @click="handleCopy(sureaddress)"></i>
        </template>
      </van-cell>
      <van-cell title
                is-link
                value="退出登录"
                @click="outshow = true" />
      <van-dialog v-model="outshow"
                  show-cancel-button
                  title="温馨提示"
                  message="确定要退出吗？"
                  @confirm="logout"></van-dialog>

      <van-dialog v-model="show"
                  show-cancel-button
                  title="设置"
                  @confirm="setSure"
                  :before-close="beforeClose">
        <template #default>
          <div class="setTelegram">
            <van-cell-group :border="false">
              <van-field v-model="value"
                         clearable
                         placeholder="请输入电报地址" />
            </van-cell-group>
          </div>
        </template>
      </van-dialog>
    </div>
  </div>
</template>

<script>
import { Toast, Dialog } from 'vant'
import { UserInfo } from '@/utils/web3'
import { SetTelegram } from '@/api/trxRequest'

import { clearmymes } from '@/api/payverification'

export default {
  //账号信息
  components: {
    [Dialog.Component.name]: Dialog.Component
  },
  data() {
    return {
      fileList: [],

      email: '',
      address: '',
      sureaddress: '',
      uid: '',

      url: require('@/static/image/head.png'),

      item: '',

      outshow: false,
      show: false,

      value: ''
    }
  },
  mounted() {
    this.userData()
  },
  methods: {
    logout() {
      clearmymes()
      this.$router.push({
        name: 'login'
      })
    },
    handleCopy(val) {
      this.$copyText(val)
        .then(() => {
          Toast('复制成功')
        })
        .catch(() => {
          Toast('复制失败')
        })
    },
    afterRead(Fail) {
      this.url = Fail.content
    },
    userData() {
      let asd = UserInfo()

      let sum = Number(localStorage.getItem('otczy')) + Number(localStorage.getItem('giftEotc'))
      if (sum == 100 || sum > 100) {
        this.item = '有效用户'
        if (asd.myjifen > 10) {
          if (asd.ztvip == '2') {
            this.item = '信用节点'
          }
          if (asd.ztvip == '3') {
            this.item = '实时节点'
          }
          if (asd.ztvip == '4') {
            this.item = '中级节点'
          }
          if (asd.ztvip == '5') {
            this.item = '高级节点'
          }
        }
      } else {
        this.item = '游客'
      }

      this.email = asd.email
      this.uid = asd.uid
      this.sureaddress = asd.myaddress
      this.address = asd.myaddress.substring(0, 10) + '...' + asd.myaddress.substring(asd.myaddress.length - 10, asd.myaddress.length)
      this.init()
    },
    init() {
      SetTelegram({}).then((res) => {
        if (res.data.State != '') {
          this.value = res.data.State
        }
      })
    },
    //确定设置电报群
    setSure() {
      let show = /^\d{16,50}$/.test(this.value)
      if (show) {
        SetTelegram({ telegram: this.value }).then((res) => {
          let data = res.data
          if (data.State == '1') {
            this.$toast.success('设置电报成功！')
          }
        })
      } else {
        this.$toast.warning('请填写正确的电报地址')
        this.value = ''
      }
      // console.log(show)
    },

    beforeClose(action, done) {
      if (action === 'confirm') {
        if (this.value == '') {
          done(false)
          return
        }
      }
      done()
      // }
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.van-cell__value {
  overflow: visible;
}
.icon {
  font-size: 32px;
}
.content {
  padding-top: 32px;
  p {
    padding: 0 32px 40px;
    font-size: 40px;
    font-weight: bold;
    color: #1b2945;
  }
  .text {
    font-size: 28px;
    color: #333 !important;
    /deep/.van-uploader__input-wrapper {
      width: 100vw;
    }
    .img_flex {
      display: flex;
      justify-content: flex-end;
      .img_bg {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        overflow: hidden;
        // background: #1b2945;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    // .pop {
    //   background: #f3f4f5;
    //   border-color: #fff;
    //   font-weight: bold;
    //   color: #333333;
    //   //   position: relative;
    //   /deep/.van-button--normal {
    //     font-size: 32px;
    //   }
    //   /deep/.van-button--default {
    //     border-color: #fff;
    //   }
    //   .convention {
    //     height: 32%;
    //   }
    //   .convention:last-child {
    //     margin-top: 10px;
    //   }
    // }
  }
}
.setTelegram {
  margin: 10px 0 30px;
  /deep/.van-cell-group {
    display: flex;
    justify-content: center;
  }
  /deep/.van-cell {
    width: 80%;
    border: 1px solid #c8cfde;
    border-radius: 20px;
  }
  // p{
  //   padding: 0;
  //   font-size: 28px;
  //   font-weight: normal;
  //   text-align: center;
  //   color: #F37A4C;
  // }
}
</style>
