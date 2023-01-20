<template>
  <div class="content">
    <div class="content_person">
      <div class="person" @click="personCenter()">
        <div class="person_i">
          <img src="../../static/image/head.png" alt />
        </div>
        <div class="person_text">
          <div class="person_title">
            <p v-if="iskyc_text === '已认证'">{{ uname }}</p>
            <p v-else>{{ iskyc_text }}</p>
            <van-button
              v-if="iskyc == 2"
              round
              type="info"
              size="mini"
              plain
              hairline
              >{{ item }}</van-button
            >
          </div>
          <div class="person_asset">
            <p>
              <span>UID:</span>
              {{ uid }}
            </p>
            <div>{{ briefMyAddress(myaddress) }}</div>
            <van-icon class="text_icon" name="arrow" />
          </div>
        </div>
      </div>
      <div class="balance">
        <div
          v-for="(item, index) in moneylist"
          :key="index"
          @click="jump(item)"
          :style="{ visibility: item.isshow ? 'hidden' : 'visible' }"
        >
          <template>
            <p>{{ item.title }}:{{ item.num }}</p>
          </template>
        </div>
      </div>
    </div>
    <div class="audit">
      <!-- <van-cell
        v-if="iskyc == 2"
        title="认证审核"
        is-link
        @click="auditing('audit')"
      >
        <template #icon>
          <i class="iconfont icon-renzhengshenhe icon_left"></i>
        </template>
      </van-cell> -->
      
      <van-cell title="二期推广" is-link @click="auditing('secondPhase')">
        <template #icon>
          <img src="@/static/icon/second.png" alt="" />
        </template>
      </van-cell>
    </div>
    <van-collapse v-model="activeName" accordion class="coll">
      <van-collapse-item
        v-for="(item, index) in list"
        :key="index"
        :title="item.title"
        :name="index"
        :border="false"
        :ref="index + 'name'"
      >
        <template #icon>
          <i :class="item.icon" class="coll_icon"></i>
        </template>
        <van-cell
          v-for="(item2, index2) in item.childlist"
          :key="index2"
          :title="item2.title"
          is-link
          clickable
          @click="go(item2)"
        >
          <template #default>
            <div v-if="item2.iskyc">
              <div v-if="iskyc == 2"></div>
              <div v-else :class="setClass(iskyc)">{{ iskyc_text }}</div>
            </div>
          </template>
        </van-cell>
      </van-collapse-item>
    </van-collapse>
    <div class="audit">
      <van-cell title="交易数据" is-link @click="auditing('transaction')">
        <template #icon>
          <img src="@/static/icon/chart.png" alt="" />
        </template>
      </van-cell>
      <van-cell title="新手引导" is-link @click="auditing(1)">
        <template #icon>
          <i class="iconfont icon-xinshouyindao icon_left"></i>
        </template>
      </van-cell>
      <van-cell title="常见问题" is-link @click="auditing(2)">
        <template #icon>
          <i class="iconfont icon-changjianwenti icon_left"></i>
        </template>
      </van-cell>
      <van-cell title="联系我们" is-link @click="auditing('contact')">
        <template #icon>
          <i class="iconfont icon-lianxiwomen icon_left"></i>
        </template>
      </van-cell>
      <van-cell title="反馈&建议" is-link @click="auditing('feedback')">
        <template #icon>
          <i class="iconfont icon-fankuijianyi icon_left"></i>
        </template>
      </van-cell>
    </div>
  </div>
</template>

<script>
import { UpdateOrder } from '@/api/trxRequest'

import { UserInfo } from '@/utils/web3'
import { getItem } from '@/utils/storage'
import { Toast } from 'vant'
export default {
  name: 'Nav_right',
  data() {
    return {
      activeName: null,
      list: [
        {
          title: '个人信息',
          icon: 'iconfont icon-gerenxinxi',
          childlist: [
            {
              title: '身份信息',
              iskyc: true,
              event: 'identity',
            },
            { title: '收付款信息', event: 'receivingList' },
            { title: '各公链绑定地址信息', event: 'chain' },
          ],
        },
        {
          title: '推广信息',
          icon: 'iconfont icon-tuiguangxinxi',
          childlist: [
            { title: '一期推广', event: 'firstPhase' },
            // { title: '分享链接', event: 'share' },
            { title: '团队节点', event: 'team' },
            // { title: '二期推广', event: 'secondPhase' },
          ],
        },

        {
          title: '交易管理',
          icon: 'iconfont icon-jiaoyiguanli',
          childlist: [
            { title: '订单', event: 'orderGather-full' },
            { title: '委托单', event: 'order-Ticket' },
            { title: '仲裁', event: 'arbitration' },
            { title: '仲裁员', event: 'arbitrator' },
            { title: '关注/黑名单', event: 'important-userList' },
          ],
        },
      ],
      moneylist: [
        { title: 'USDT', num: '12.00' },
        { title: 'EOTC', num: '1', event: 'release' },
      ],
      orderShow: false,
      myaddress: localStorage.getItem('myaddress'),
      uid: '',
      iskyc: '',
      iskyc_text: '',
      name: '',
      uname: '',
      item: '',
    }
  },
  mounted() {
    let data = UserInfo()
    const netType = localStorage.getItem('netType')
    if (netType === 'bsc') {
      this.moneylist[1].isshow = true
    }
    this.moneylist[1].num = data.eotcAmount
    this.moneylist[0].num = data.myamount

    this.name = data.uname
    
    let sum = Number(localStorage.getItem('otczy')) + Number(localStorage.getItem('giftEotc'))
    if (data.myjifen > 10 && sum > 100) {
      this.item = '有效用户'

      if (data.ztvip == '2') {
        this.item = '信用节点'
      }
      if (data.ztvip == '3') {
        this.item = '实时节点'
      }
      if (data.ztvip == '4') {
        this.item = '中级节点'
      }
      if (data.ztvip == '5') {
        this.item = '高级节点'
      }
    } else {
      this.item = '游客'
    }

    this.myaddress =
      data.myaddress.substring(0, 10) +
      '...' +
      data.myaddress.substring(data.myaddress.length - 10, data.myaddress.length)

    this.uid = data.uid
    this.iskyc = data.iskyc
    this.uname = data.uname
    switch (data.iskyc) {
      case '-1':
        this.iskyc_text = '认证失败'
        break
      case '0':
        this.iskyc_text = '未认证'
        break
      case '1':
        this.iskyc_text = '审核中'
        break
      case '2':
        this.iskyc_text = '已认证'
        break
    }
  },
  methods: {
    pulldown() {
      this.orderShow = !this.orderShow
    },
    personCenter() {
      this.$router.push({ name: 'accountstate' })
    },
    // go 点击菜单 去哪个页面
    go(data) {
      if (data.event != undefined) {
        if (this.iskyc == 2 && data.iskyc) {
          this.$router.push({ name: 'identity_message' })
        } else if (this.iskyc == 1 && data.iskyc) {
          Toast.loading({
            message: '审核中...',
            forbidClick: true,
          })
        } else if (this.iskyc == -1 && data.iskyc) {
          this.$router.push({ name: 'erroridentity' })
        } else {
          if (data.event === 'order-Ticket') {
            if (
              localStorage.getItem('myeotc') < 5000 &&
              Number(localStorage.getItem('giftNFT')) == 0
            ) {
              this.$toast.warning(
                <div>
                  <p style="font-size:14px;margin:5px;color:red">
                    您质押的EOTC不足
                  </p>
                  <p style="font-size:14px;margin:5px 0;">
                    EOTC质押5000以上的会员才能挂单
                  </p>
                </div>
              )
              return false
            }
            if (getItem('myjifen') < 9) {
              this.$toast.warning(
                <div>
                  <p style="font-size:14px;margin:5px;color:red">
                    您的积分不足
                  </p>
                  <p style="font-size:14px;margin:5px">
                    拥有10积分的会员才能挂单
                  </p>
                </div>
              )
              return false
            }
            // 刷新订单状态
            // UpdateOrder(getItem('uid'))
          }
          this.screen(data.event)
          this.$router.push({ name: data.event })
        }
      }
      if (data.url != undefined) {
        window.location.href = data.url
      }
    },
    // 释放跳转
    jump(data) {
      if (data.event != undefined) {
        this.$router.push({ name: data.event })
      }
    },

    auditing(name) {
      if (name == 1) {
        window.location.href = 'https://eotc.im/html/guide/guide.html'
      } else if (name == 2) {
        window.location.href = 'https://eotc.im/html/question/question.html'
      } else {
        this.$router.push({ name: name })
      }
    },
    screen(name) {
      if (this.$route.name == name) {
        this.$bus.$emit('sendBus', false)
      }
    },
    setClass(num) {
      if (num == 0) {
        return 'coll_renzhen'
      } else if (num == 1) {
        return 'coll_shenhe'
      } else if (num == -1) {
        return 'coll_error'
      }
      //console.log(num);
    },
  },
}
</script>

<style lang="less" scoped>
/deep/[class*='van-hairline']::after {
  border: none;
}
/deep/.van-cell::after {
  border: none;
}
.content {
  min-height: calc(100vh - 92px);
  color: #333;
  background: #fff;
  .content_person {
    .person {
      padding: 40px 32px;
      align-items: center;
      display: flex;
      .person_i {
        width: 96px;
        height: 96px;
        border-radius: 50%;
        margin-right: 24px;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .person_text {
        width: 80%;
        position: relative;
        .person_title {
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          // justify-content: center;
          p {
            font-size: 36px;
            font-weight: 800;
            margin-right: 14px;
          }
        }
        .person_asset {
          width: 100%;
          font-size: 24px;
          color: #999;
          line-height: 40px;
          .text_icon {
            position: absolute;
            right: 0;
            top: 50%;
            font-size: 30px;
          }
          div {
            width: 75%;
          }
        }
      }
    }
  }
  .audit {
    .icon_left {
      font-size: 48px;
    }
    img {
      width: 48px;
    }
  }
  .coll {
    .coll_icon {
      font-size: 48px;
    }
    .coll_renzhen {
      color: #fc7542;
    }
    .coll_shenhe {
      color: #999;
    }
    .coll_error {
      color: #e52a2a;
    }
  }
  .balance {
    display: flex;
    justify-content: space-around;
    padding: 10px 52px 40px;
    div {
      width: 45%;
      background: #f3f4f5;
      font-size: 28px;
      border-radius: 40px;
      text-align: center;
      p {
        padding: 20px 0;
      }
    }
  }
  .content_chose {
    // min-height: 100px;
    line-height: 100px;
    padding: 0 48px;
    font-size: 36px;
    color: hsla(0, 0%, 100%, 0.8);
    /deep/.van-cell {
      // color: #fff;
      // background: none;
    }
  }

  .content_button {
    font-size: 36px;
    padding: 48px;
  }
}
</style>
