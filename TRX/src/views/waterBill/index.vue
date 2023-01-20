<template>
  <div class="water-bill">
    <!-- 流水审查页面 -->
    <header class="header">
      <div @click="$router.back(-1)">
        <van-icon name="arrow-left" />
        <span class="hd-txt">{{ item.sname }}</span>
      </div>
      <p @click="$router.push({name:'appeal',params:{MerchanInfo:MerchanInfo}})">申诉</p>
    </header>
    <section class="water-bill-content">
      <div class="top-content" v-if="+item.dsx >= 1">
        已付款
        <van-tag type="warning" size="large" v-if="!isReminders" @click="urge_payCoin">催放币</van-tag>
        <van-tag type="primary" size="large" v-else>已催放币</van-tag>
      </div>
      <div class="top-content" v-else>待付款</div>
      <div class="top-mid-content">
        <span class="price">￥{{ ThousandSeparator(money) }}</span>
        <span class="mid-r-content" v-if="+item.dsx < 1">
          <van-count-down class="pay-time" ref="countDown" :time="time" format="mm:sss " />
          <van-button v-if="!ischangecheck_rcoin" @click="gotoPayMoeny" size="mini">去付款</van-button>
          <van-button
            v-else
            @click="throttle(lxmaijia, 1500)"
            type="info"
            size="mini"
            :style="{background:'#1989fa',color:'#fff'}"
          >去付款</van-button>
        </span>
      </div>
    </section>
    <section class="water-bill-tips">
      <span>
        <van-icon name="warn-o" />
      </span>
      <span>
        转账请认准订单详情中展示的卖家收款账号，或卖家分享
        的收款账号卡片。其余卖家私聊发送的账号信息一律不要 转账。
      </span>
    </section>

    <article class="dialogue" ref="dialogue-content">
      <van-pull-refresh v-model="isLoading_before" @refresh="get_chatting_records">
        <!-- 卖家信息展示 -->
        <template v-for="(message, index) in megList">
          <!-- 商家信息 -->
          <div
            ref="dialogue-content-child"
            class="seller-sends-info mesInfo"
            v-if="message.role === 'seller' && message.message"
            :key="index"
          >
            <span class="author-img">{{ item.sname.slice(0, 1) }}</span>
            <span class="author-info">
              <p class="payAuthor-name">{{ item.sname }}</p>
              <span class="payAuthor-content breakword" v-content:[message]></span>
              <!-- @click="copyContent(message.message,'内容已复制.')" -->
            </span>
          </div>

          <!-- 用户信息 -->
          <div
            ref="dialogue-content-child"
            class="buyer-sends-info mesInfo"
            :key="index"
            v-else-if="message.role === 'buyer' && message.message"
          >
            <span class="author-img">
              <!-- 用户头像 -->
              {{ myname.slice(0, 1) }}
            </span>
            <span class="author-info breakword">
              <span class="payAuthor-content breakword" v-content:[message]></span>
            </span>
          </div>
        </template>
      </van-pull-refresh>
    </article>

    <van-form
      ref="footer"
      class="footer"
      @submit="onSend"
      :show-error="false"
      validate-trigger="onSubmit"
    >
      <van-icon @click="imageShow=true,fileList=[]" name="add-o" />
      <van-field
        v-model="message"
        @focus="ipt_focus"
        @blur="ipt_blur"
        name="message"
        :rules="rules"
        autocomplete="off"
        rows="1"
        autofocus
        autosize
        clearable
        type="textarea"
        maxlength="200"
      ></van-field>
      <van-button
        :disabled="isSend"
        size="small"
        native-type="submit"
        type="primary"
      >{{ isSend ? "连线中" : "发送" }}</van-button>
    </van-form>

    <van-popup class="popup" v-model="imageShow" round position="bottom">
      <div class="popBox">
        <p>请上传图片</p>
        <van-uploader :after-read="afterRead" v-model="fileList" multiple :max-count="9" />
        <!-- <img src="" width="100px" alt=""> -->
        <van-button @click="updata()" size="small" type="primary">上传</van-button>
      </div>
    </van-popup>
    <van-image-preview v-model="show" :images="images">
      <template v-slot:index>第{{ index }}页</template>
    </van-image-preview>
  </div>
</template>

<script>
import { domain } from '@/utils/request'

import { Toast, Notify, ImagePreview } from 'vant'

import { GetOidMsg } from '@/api/payverification'

import { Reminders, ChatUpdate } from '@/api/trxRequest'

import { getItem } from '@/utils/storage'

import waterBillBuyer from '@/mixins/water-bill-buyer'
//用户收购聊天
export default {
  name: 'water-bill',
  props: [
    'odid',
    'MerchanInfo',
    'item',
    'money',
    'time',
    'num',
    'cuePayType',
    'servicefee',
    'sellerMthods',
  ],
  mixins: [waterBillBuyer],
  data() {
    return {
      isSend: true,
      isReminders: false,
      myname: localStorage.getItem('uname'),
      isLoading_before: false,
      token: undefined,
      message: '',
      rules: [
        {
          required: true,
          validator: this.validator,
          message: '发送内容不能为空',
        },
      ],
      megList: [],
      againList: [],
      page: 1,
      ischangecheck_rcoin: true,
      iscreate_DefaultMs: true,
      unread: 0,
      curRole: '', //本聊天室 当前身份

      imageShow: false,
      fileList: [],

      show: false,
      index: 1,
      images: [],
      //避免重复连接
      lockReconnect: false,
    }
  },
  created() {
    window.preview = this.preview
    const tokenObj = getItem(this.odid)
    console.log(this.MerchanInfo)
    console.log(123)
    /**
     * tokenObj = { buyer:{ token },seller:{ token }  }
     */
    this.curRole = this.$route.query.role
    this.get_token(tokenObj, '0')
    this.changecheck_rcoin()
  },
  methods: {
    afterRead(File) {
      // 此时可以自行将文件上传至服务器
      console.log(File)
      this.$reduce(File, 1).then((data) => {
        File.file = data.fileZip
        console.log(data)
        this.url = data.base64
      })
      console.log(this.fileList)
    },
    light(fun, time) {
      return new Promise((res) => {
        setTimeout(() => {
          fun()
          res()
        }, time)
      })
    },
    //图片上传
    async updata() {
      if (this.fileList.length <= 0) {
        this.$toast.warning('请至少上传一张图片！')
        return
      }
      Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: '加载中',
      })

      let urlTop = 'https://api.eotcyu.club/img/'
      for (let i of this.fileList) {
        console.log(i)
        let fd = new FormData()
        fd.append('proof', i.file)
        await ChatUpdate(fd)
          .then((res) => {
            let url = res.data.State
            console.log(urlTop + url)
            this.megList.push(
              this.cinit_mes(
                'buyer',
                `<img onclick="preview('${urlTop + url}')" src="${
                  urlTop + url
                }" width="200px"  style="display:block;"   alt="">`,
                true
              )
            )
            this.$nextTick(() => {
              let length = this.$refs.buyers.length
              this.$refs.buyers[length - 1].style.padding = 0
              console.log(this.$refs.buyers)
            })

            this.soket.send(urlTop + url)
          })
          .catch((err) => {
            this.$toast.warning('图片上传失败，请稍后上传！')
            console.log(err)
          })
      }
      this.imageShow = false
      console.log(this.images)
      Toast.clear()
    },

    preview(url) {
      this.images = []
      console.log(url)
      this.images.push(url)
      this.show = true
    },
    ipt_focus() {
      // this.$refs["footer"].$el.style.marginBottom = "78%";
    },
    ipt_blur() {
      // this.$refs["footer"].$el.style.marginBottom = "0";
    },
    lxmaijia() {
      this.$toast.warning('请联系卖家通过您的流水审查！')
    },
    async urge_payCoin() {
      try {
        await Reminders({
          did: this.odid,
          mail: this.MerchanInfo.aipay,
          type: 3, //  商家催用户放币
        })
        this.$toast.success(
          <div>
            <p style="font-size:13px;margin:5px">已发送邮件至对方邮箱！</p>
          </div>
        )
        this.megList.push(
          this.cinit_mes(
            'buyer',
            '<div style="padding:10px">老板您好，我已付款，请尽快放币！！</div> ',
            true
          )
        )
        this.soket.send('老板您好，我已付款，请尽快放币！！')
      } catch (err) {
        this.$toast.error('请不要频繁催促对方！！！')
      }
      this.isReminders = true
    },
    gotoPayMoeny() {
      let payVal
      let MerchanInfo
      let pay = this.cuePayType

      if (pay === 'wx') {
        payVal = this.item.wechat
      } else if (pay === 'yhk') {
        payVal = this.item.bank
      } else if (pay === 'zfb') {
        payVal = this.item.aipay
      } else {
        payVal = '未知&未知&未知&'
      }

      if (!this.MerchanInfo?.cur_payData) {
        MerchanInfo = {
          ...this.MerchanInfo,
          cur_payData: payVal, // "清茶树&现金交易&现金"
        }
      } else {
        MerchanInfo = this.MerchanInfo
      }

      this.$router.replace({
        name: 'CompleteOrderPayment',
        params: {
          item: this.item,
          num: this.num,
          cuePayType: this.cuePayType,
          money: this.money,
          MerchanInfo,
          nowTime: this.time,
          servicefee: this.servicefee,
          sellerMthods: this.sellerMthods,
        },
      })
    },
    init_pagewater_bill() {
      const role = this.$route.query.role
      if (role === 'buyer') {
        const url = `wss://${domain}/api/wss/Connect?token=${this.token}`
        //console.log(url);
        this.soket = new WebSocket(url)
        this.soket.onopen = () => {
          this.$toast.clear()
          //连接成功 发送默认消息 只有首次会创建并发送
          if (this.iscreate_DefaultMs) {
            this.init_mesgList()
          }
          this.iscreate_DefaultMs = false
          //console.log("连接成功 Connected!");
        }
        // 监听离线消息
        this.soket.onmessage = (result) => {
          console.log(result.data)

          if (result.data === '我已通过您的流水审查，您可以进行下一步付款') {
            this.item.rcoin = 0
            this.$nextTick(this.changecheck_rcoin)
          }

          let re = new RegExp('https://api.eotcyu.club/img')
          let show = re.test(result.data)
          if (show) {
            this.megList.push(
              this.cinit_mes(
                'seller',
                `<img onclick="preview('${result.data}')" src="${result.data}" width="200px"  style="display:block;"   alt="">`,
                true
              )
            )
          } else {
            this.megList.push(
              this.cinit_mes('seller', `<div style="padding:10px">${result.data}</div>`, true)
            )
          }
        }
        this.soket.onerror = function (error) {
          console.warn('连接错误 error')
          this.reconnect(url)
          //console.log(error.data);
        }
        this.soket.onclose = () => {
          console.warn('连接错误，断开连接。。')
          this.reconnect(url)
        }
      }
    },
    reconnect(url) {
      if (this.lockReconnect) {
        return
      }
      this.lockReconnect = true
      //没连接上会一直重连，设置延迟避免请求过多
      // tt && clearTimeout(tt)
      let that = this
      setTimeout(function () {
        // createWebSocket(url)
        that.init_pagewater_bill()
        that.lockReconnect = false
      }, 4000)
    },
    messageScrollIntoView() {
      this.$nextTick(() => {
        if (this.$refs['dialogue-content-child'] instanceof Array) {
          this.$refs['dialogue-content-child']?.slice(-1)[0]?.scrollIntoView()
        }
      })
    },
    onSend() {
      if (this.soket.readyState == WebSocket.OPEN) {
        this.megList.push(
          this.cinit_mes('buyer', `<div style="padding:10px">${this.message}</div>`, true)
        )
        this.soket.send(this.message)
      }
      this.messageScrollIntoView()
      this.message = ''
    },
    init_mesgList() {
      this.megList.push(
        this.cinit_mes('seller', `<div style="padding:10px">${this.item.mes}</div>`, true),
        this.cinit_mes(
          'seller',
          `<div style="padding:10px">
          联系方式
          <a href="tel:${this.MerchanInfo.wechat}">${this.MerchanInfo.wechat}</a>\n
              <a href="mailto:${this.MerchanInfo.aipay}">${this.MerchanInfo.aipay}<a></div>
             `,
          true
        )
      )
      try {
        this.messageScrollIntoView()
        this.isSend = false
      } catch {
        this.isSend = true
      }
    },
    cinit_mes(role, message, htmlflg, date, serial) {
      return {
        role,
        message,
        html: htmlflg,
        date: date ?? this.transformTime_Zh(Date.now()),
        pid: serial ?? 0,
      }
    },
    validator(value) {
      if ((value ?? '') === '') {
        //console.log(value);
        return false
      }
      return true
    },
    // 获取聊天记录 每次10条
    async get_chatting_records() {
      let page = this.page
      try {
        const { data } = await GetOidMsg({
          oid: this.odid,
          page: this.page,
        })

        if (data.length > 0) {
          let arr = this.againList.concat(data)
          console.log(arr)
          const newDataList = []
          for (let i of arr) {
            const role = i.user === '0' ? 'buyer' : 'seller'
            let re = new RegExp('https://api.eotcyu.club/img')
            let show = re.test(i.msg)
            if (show) {
              console.log(show)
              newDataList.push(
                this.cinit_mes(
                  role,
                  `<img onclick="preview('${i.msg}')" src="${i.msg}" width="200px"  style="display:block;"   alt="">`,
                  true,
                  i.date,
                  i.uid
                )
              )
            } else {
              newDataList.push(
                this.cinit_mes(
                  role,
                  `<div style="padding:10px">${i.msg}</div>`,
                  true,
                  i.date,
                  i.uid
                )
              )
            }
          }
          this.againList = data
          Promise.resolve()
            .then(() => {
              this.megList = []
              return '首次刷新数据'
            })
            .then(() => {
              for (let i of newDataList) {
                this.megList.unshift(i)
              }
            })
            .finally(() => {
              this.init_mesgList()
              this.isLoading_before = false
              this.page++
            })
        } else {
          this.isLoading_before = false
        }
      } catch (err) {
        this.isLoading_before = false
        console.log(err)
      }
    },
    changecheck_rcoin() {
      console.log(this.item)
      if (this.item.rcoin === null) {
        this.ischangecheck_rcoin = true
        return false
      }
      if (this.item.rcoin === '-1') {
        this.ischangecheck_rcoin = true
        return true
      } else if (+this.item.rcoin === 0 && +this.item.rcoin >= 0) {
        this.ischangecheck_rcoin = false
        return false
      } else if (!this.item.rcoin) {
        this.ischangecheck_rcoin = true
        return true
      }
    },
  },
  // computed: {
  //   isToPayMoney() {
  //     const rcoin = this.item.rcoin;
  //     if (rcoin === "-1") {
  //       //console.log(rcoin);
  //       return true;
  //     } else if (rcoin && +rcoin >= 0) {
  //       //console.log(rcoin);
  //       return false;
  //     } else if (!rcoin) {
  //       //console.log(rcoin);
  //       return true;
  //     }
  //     return true;
  //   },
  // },
  directives: {
    content: {
      bind(el, binding) {
        if (binding.arg.html) {
          el.innerHTML = binding.arg.message
        } else {
          el.innerText = binding.arg.message
        }
      },
    },
  },
}
</script>

<style lang="less" scoped>
.popup {
  height: 50%;
  position: relative;

  .popBox {
    padding: 20px;
    p {
      font-size: 40px;
      margin-bottom: 10px;
    }
    button {
      position: absolute;
      right: 40px;
      bottom: 60px;
    }
    /deep/.van-button--small {
      padding: 0 40px;
    }
  }
}
.water-bill {
  position: fixed;
  z-index: 99;
  background-color: #fff;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  /deep/ .van-pull-refresh {
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
  }
  .header {
    padding: 25px 25px 10px;
    font-size: 0.45rem;
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
    .hd-txt {
      font-weight: 700;
      margin-left: 25px;
    }
    p {
      color: #2483ff;
    }
  }
  .water-bill-content {
    padding: 25px;
    background-color: #eee;
    font-size: 30px;

    .price {
      color: var(--main--color);
      font-weight: 700;
    }
    .top-mid-content {
      display: flex;
      padding: 15px 15px 0 0;
      align-items: center;
      span {
        flex: 1;
      }
      .mid-r-content {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        button {
          margin: 0 15px;
          background-color: rgb(196, 195, 195);
          padding: 25px;
          color: #000;
        }
        .pay-time {
          color: rgb(252, 184, 66);
        }
      }
    }
  }
  .water-bill-tips {
    padding: 25px;
    display: flex;
    background-color: rgb(255, 241, 230);
    color: rgb(252, 184, 66);
    font-size: 24px;
    span:first-child {
      width: 36px;
      font-size: 36px;
    }
  }

  .dialogue {
    padding: 25px;
    flex: 1;
    overflow-y: auto;
    // background-color: red;
    // 卖家信息展示
    .seller-sends-info {
      display: flex;
      font-size: 0.5rem;
      .author-img {
        background-color: rgb(111, 179, 250);
        color: #fff;
        line-height: 40px;
        font-size: 30px;
        text-align: center;
        width: 40px;
        height: 40px;
        padding: 15px;
        border-radius: 50%;
      }
      .author-info {
        flex: 1;
        max-width: 70%;
        display: flex;
        padding: 10px 15px;
        flex-direction: column;
        .payAuthor-name {
          font-size: 24px;
        }
        .payAuthor-content {
          overflow: hidden;
          font-size: 0.4rem;
          width: fit-content;
          background-color: #eee;
          margin: 15px 0;
          // padding: 15px;
          line-height: 50px;
          border-radius: 15px;
          --webkit--word-wrap: break-word;
          max-width: 100%;
        }
      }
    }

    // 买家信息展示
    .buyer-sends-info {
      display: flex;
      font-size: 0.5rem;
      flex-direction: row-reverse;
      .author-img {
        background-color: rgb(38, 207, 225);
        color: #fff;
        line-height: 40px;
        font-size: 30px;
        text-align: center;
        width: 40px;
        height: 40px;
        padding: 15px;
        border-radius: 50%;
      }

      .author-info {
        max-width: 70%;
        display: flex;
        padding: 0 15px;
        .payAuthor-content {
          overflow: hidden;
          font-size: 0.4rem;
          flex: auto;
          width: fit-content;
          background-color: var(--main--color);
          color: #fff;
          margin: 15px 0;
          overflow: hidden;
          // padding: 15px;
          --webkit--word-wrap: break-word;
          border-radius: 15px;
        }
      }
    }
  }
  /* 强制不换行 */
  .nowrap {
    white-space: nowrap;
  }
  /* 允许单词内断句，首先会尝试挪到下一行，看看下一行的宽度够不够，
不够的话就进行单词内的断句 */
  .breakword {
    word-wrap: break-word;
  }
  /* 断句时，不会把长单词挪到下一行，而是直接进行单词内的断句 */
  .breakAll {
    word-break: break-all;
  }
  /* 超出部分显示省略号 */
  .ellipsis {
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .footer {
    background-color: rgb(247, 247, 247);
    padding: 15px 25px 45px 25px;
    position: relative;
    margin-bottom: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .van-cell {
      padding: 10px;
      // width: auto;
      margin: 0 10px;
    }
    button {
      width: 25%;
    }

    /deep/ .van-field__control {
      // padding-left: 25px;
    }
  }
}
</style>
