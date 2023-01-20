<template>
  <div class="water-bill">
    <!-- 流水审查页面 -->
    <header class="header" @click="$router.back(-1)">
      <van-icon name="arrow-left" />
      <span class="hd-txt">{{ item.mes }}</span>
    </header>
    <section class="water-bill-content">
      <div class="top-content" v-if="item.dsx === '0'">
        对方待付款
        <van-tag type="warning" size="large" v-if="!isReminders" @click="urge_payMoney">催付款</van-tag>
        <van-tag type="primary" size="large" v-else>已催付款</van-tag>
        <van-button
          type="danger"
          size="mini"
          class="cancelBtn"
          v-if="ischangecheck_rcoin"
          @click="cancelOrder"
        >取消订单</van-button>
      </div>

      <div class="top-mid-content" v-if="item.dsx === '1'">
        <span>对方已付款</span>
      </div>

      <div class="top-mid-content">
        <span class="price">￥{{ item.amount1 }}</span>
        <span class="mid-r-content">
          <van-button
            type="danger"
            v-if="ischangecheck_rcoin"
            @click="Security_throughMoney"
            size="mini"
          >流水审查</van-button>
          <van-button v-else type="danger" size="mini">账户审核通过</van-button>
        </span>
      </div>
    </section>

    <section class="water-bill-tips">
      <span>
        <van-icon name="cash-back-record" />
      </span>
      <span :style="{ paddingLeft: '10px' }">
        为了防止黑钱流通、账号被封，
        只有您对对方账户进行通过流水审查之后，对方才可看到您的收付款账号进行汇款。
      </span>
    </section>

    <article class="dialogue" ref="dialogue-content">
      <van-pull-refresh v-model="isLoading_before" @refresh="get_chatting_records">
        <template v-for="(message, index) in megList">
          <div
            ref="dialogue-content-child"
            class="seller-sends-info mesInfo"
            v-if="message.role === 'buyer' && message.message"
            :key="index"
          >
            <span class="author-img">{{ item.mes.slice(0, 1) }}</span>
            <span class="author-info">
              <p class="payAuthor-name">{{ item.mes }}</p>
              <span class="payAuthor-content breakword" v-content:[message]></span>
            </span>
          </div>

          <div
            ref="dialogue-content-child"
            class="buyer-sends-info mesInfo"
            :key="index"
            v-else-if="message.role === 'seller' && message.message"
          >
            <span class="author-img">{{ myname.slice(0, 1) }}</span>
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
import { Dialog, Toast, ImagePreview } from 'vant'

// import io from "socket.io-client";

import loadingToast from '@/components/loading-toast'

import { GetOidMsg, OrderAudit } from '@/api/payverification'
import { Reminders, cancel_order, ChatUpdate } from '@/api/trxRequest'

import { domain } from '@/utils/request'

import { getItem } from '@/utils/storage'

import waterBillBuyer from '@/mixins/water-bill-buyer'
//商家出售待处理聊天
export default {
  name: 'sellwater-bill',
  props: ['odid', 'item'],
  mixins: [waterBillBuyer],
  components: {
    [ImagePreview.Component.name]: ImagePreview.Component,
  },
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
      iscreate_DefaultMs: true,
      curRole: '', //本聊天室 当前身份
      ischangecheck_rcoin: true,

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
    console.log(this.item)
    window.preview = this.preview
    this.curRole = this.$route.query.role
    const tokenOBJ = getItem(this.odid)
    this.get_token(tokenOBJ, '1')
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
                'seller',
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
    init_pagewater_bill() {
      const role = this.$route.query.role
      if (role === 'seller') {
        const url = `wss://${domain}/api/wss/Connect?token=${this.token}`
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
          console.log(result)
          let re = new RegExp('https://api.eotcyu.club/img')
          let show = re.test(result.data)
          if (show) {
            this.megList.push(
              this.cinit_mes(
                'buyer',
                `<img onclick="preview('${result.data}')" src="${result.data}" width="200px"  style="display:block;"   alt="">`,
                true
              )
            )
          } else {
            this.megList.push(
              this.cinit_mes('buyer', `<div style="padding:10px">${result.data}</div>`, true)
            )
          }
          // this.megList.push(this.cinit_mes('buyer', result.data, true))
        }
        this.soket.onerror = function (error) {
          console.warn('连接错误 error', error)
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
          this.cinit_mes('seller', `<div style="padding:10px">${this.message}</div>`, true)
        )
        this.soket.send(this.message)
      }
      this.messageScrollIntoView()
      this.message = ''
    },
    init_mesgList() {
      this.megList.push(
        this.cinit_mes(
          'buyer',
          ` <div style="padding:10px">
            联系方式
             <a href="tel:${this.item.amount2}">${this.item.amount2}</a>\n
              <a href="mailto:${this.item.aipay}">${this.item.aipay}</a>
          </div>
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
    Security_throughMoney() {
      Dialog.confirm({
        title: '是否通过对方的流水审查',
        cancelButtonText: '我在想想',
        confirmButtonText: '通过',
      })
        .then(async () => {
          // on confirm
          try {
            await OrderAudit({
              oid: this.odid,
              rcoin: 0,
            })
            this.item.rcoin = 0
            this.$nextTick(this.changecheck_rcoin)
            this.$toast.success(
              <div>
                <p style="font-size:13px;margin:5px">流水审查已通过</p>
                <p style="font-size:15px;margin:5px">等待买家汇款!</p>
              </div>
            )
            this.megList.push(
              this.cinit_mes(
                'seller',
                `<div style="padding:10px">我已通过您的流水审查，您可以进行下一步付款！</div>`,
                true,
                Date.now()
              )
            )
            this.soket.send(`我已通过您的流水审查，您可以进行下一步付款`)
          } catch (err) {
            console.warn(err)
          }
        })
        .catch(() => {
          // on cancel
        })
    },
    async cancelOrder() {
      //商家取消订单
      try {
        this.cancelOrderModel_show = true
        this.$toast.warning(
          {
            component: loadingToast,
            props: {
              title: ' 正在取消订单。。。',
            },
          },
          {
            icon: false,
            timeout: false,
          }
        )
        this.$dialog
          .confirm({
            title: '取消订单',
            message:
              "<span class='activeInfo'>恶意取消订单会被 【限制交易】</span> <br />确定取消订单吗？",
          })
          .then(async () => {
            const { data } = await cancel_order({
              id: this.odid,
              oid: this.item.odid,
              ads: this.item.smes.trim(),
            })
            if (data.State === '3') {
              this.$toast.error('订单取消成功')
            }
            this.$router.back()
          })
          .catch(() => {
            // on cancel 取消订单 取消选择
            this.$toast.clear()
          })

        this.$toast.clear()
      } catch (err) {
        console.warn(err)
        this.$toast.clear()
        this.$toast.error(err)
      }
    },
    async urge_payMoney() {
      try {
        await Reminders({
          did: this.odid,
          mail: this.item.aipay,
          type: 2, //  商家催用户付款
        })
        this.$toast.success(
          <div>
            <p style="font-size:13px;margin:5px">已发送邮件至对方邮箱！</p>
          </div>
        )
        this.isReminders = true
        this.megList.push(this.cinit_mes('seller', `<div style="padding:10px">老板您好，请尽快完成订单支付！</div>`, true))
        this.soket.send('老板您好，请尽快完成订单支付！')
      } catch (err) {
        this.isReminders = true
        this.$toast.error('请不要频繁催促对方！！！')
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
      /**
       * 滚动容器 .van-pull-refresh
       */
      let page = this.page
      try {
        const { data } = await GetOidMsg({
          oid: this.odid,
          page: this.page,
        })
        if (data.length > 0) {
          let arr = this.againList.concat(data)
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
              console.log('newDataList', newDataList)
              this.megList = []
              return '首次刷新数据'
            })
            .then(() => {
              for (let i of newDataList) {
                this.megList.unshift(i)
              }
              // this.megList.unshift(...newDataList.reverse())
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
        //console.log(err);
      }
    },
    changecheck_rcoin() {
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
    .hd-txt {
      font-weight: 700;
      margin-left: 25px;
    }
  }

  .top-content {
    position: relative;
  }

  .cancelBtn {
    position: absolute;
    right: 36px;
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
          padding: 25px;
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
    color: #fff;
    background-color: #f17806;
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
      margin: 0 10px;
    }
    button {
      width: 25%;
    }

    /deep/ .van-field__control {
      padding-left: 25px;
    }
  }
}
</style>
