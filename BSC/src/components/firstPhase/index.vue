<template>
  <div>
    <div class="top">
      <div class="top-title">
        <div>
          <p>一期可提</p>
          <van-icon name="point-gift-o" />
        </div>
        <!-- <button>提币</button> -->
      </div>
      <div class="top-content">
        <div>
          <p>USDT余额</p>
          <p>{{ usdt_ye }}</p>
        </div>
        <div>
          <p>释放EOTC</p>
          <p>{{ eotc_sf }}</p>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="information">
        <p class="title">
          总数据
          <span>（一期 ）</span>
        </p>
        <div class="listbox">
          <div class="list" v-for="(item, index) in information" :key="index">
            <p>{{ item.title }}</p>
            <p>{{ item.number }}</p>
          </div>
        </div>
      </div>
      <!-- <div class="information">
        <p class="title">
          收益及奖励
          <span>（一期 ）</span>
        </p>
        <div class="listbox">
          <div class="list" v-for="(item, index) in earnings" :key="index">
            <p>{{ item.title }}</p>
            <p>{{ item.number }}</p>
          </div>
        </div>
      </div>-->
      <div class="footer">
        <p class="look" @click="go()">查看收益明细</p>
        <van-button color="#1B2945" round block :to="{name:'pledge'}">转二期质押</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { UserInfo } from '@/utils/web3'

import { EotcLoginmes } from '@/api/trxRequest'

export default {
  data() {
    return {
      usdt_ye: '',
      eotc_sf: '',
      information: [
        { title: 'USDT总量', number: '' },
        { title: 'EOTC总量', number: '' },
        { title: '九期待释放(EOTC)', number: '' },
        { title: '下期可释放', number: '' },
      ],
      earnings: [
        { title: '空投(EOTC)', number: '10000.88' },
        { title: '质押收益(EOTC)', number: '15620.26' },
        { title: '平级奖(EOTC)', number: '856.68' },
        { title: '分享奖励(USDT)', number: '15620.88' },
        { title: '辅助奖励(USDT)', number: '52369.16' },
        { title: '节点补助(USDT)', number: '15620.66' },
      ],
    }
  },
  async created() {
    await EotcLoginmes({
      wallet: localStorage.getItem('myaddress'),
    })
      .then((data) => {
        var it = eval(data.data)
        // console.log("用户Uid", it);
        if (it.Uid != '0') {
          localStorage.setItem('uid', it.Uid) // 主键 6位 唯一标识 id
          localStorage.setItem('parentID', it.Paypwd) //推荐人 注册邀请地址  两种形式  1 用户uid  和  邀请者的uid
          localStorage.setItem('email', it.Token) //注册邮箱   邮箱和uid 一一对应 是唯一的
          var myid = it.Item.split('@') // 姓名、证件号码、电话
          localStorage.setItem('uname', myid[0].trim()) //本人姓名
          localStorage.setItem('ucid', myid[1].trim()) //身份证号码
          localStorage.setItem('uphone', myid[2].trim()) //电话
          localStorage.setItem('iskyc', it.VIP) //是否已实名 -1 审核未通过  0 未实名  1 已提交 未审核或   2 实名认证审核通过
          localStorage.setItem('usdtsq', it.Ztrs) //USDT授权金额
          localStorage.setItem('item', it.item) //节点类型
          //当前购买订单号，0表示当前无购买单   每次购买 必须先处理上一次的订单
          // 0 表示 没有订单，
          localStorage.setItem('xdnum', it.zyman)
          // 当前出售订单号，0表示当前无出售单
          //只能 挂一个出售单
          localStorage.setItem('csnum', it.csnum)
          localStorage.setItem('userdsx', it.iss) //取消下单的次数(每日清零)  max 8次
          //收款 支付方式
          localStorage.setItem('mybank', it.bank.trim()) //收款银行卡
          localStorage.setItem('myalipay', it.tgyj.trim()) //收款支付宝
          localStorage.setItem('mywechat', it.USDT.trim()) //收款微信
          localStorage.setItem('tcoin', it.Tcoin.trim()) //奖励地址（提币地址）
          localStorage.setItem('myeotc', it.eotc) //用户质押的eotc数量  质押5000以上才能成为商家 进行挂单出售
          localStorage.setItem('shnum', it.snum) //未审核的实名认证会员人数
          localStorage.setItem('bsnum', it.bnum) //用户待放币的订单数
          // localStorage.setItem('myjifen', it.jifen) //用户积分 至少10分才能 购买 or 出售
          localStorage.setItem('allMan', it.allMan) //团队人数
          localStorage.setItem('stakeMan', it.stakeMan) //有效节点
          localStorage.setItem('usdt_teams', it.usdt_teams) //总业绩
          localStorage.setItem('usdt_ye', it.usdt_ye) //USDT余额
          localStorage.setItem('eotc_stake', it.eotc_stake) //EOTC总量
          localStorage.setItem('eotc_air', it.eotc_air) //EOTC空投
          localStorage.setItem('eotc_sf', it.eotc_sf) //EOTC待释放
          localStorage.setItem('Ssyj', it.Ssyj) //质押收益
          localStorage.setItem('Pjj', it.Pjj) //平级奖
          localStorage.setItem('Lrfc', it.Lrfc) //分享奖励
          localStorage.setItem('Syfh', it.Syfh) //辅助奖励
          localStorage.setItem('Tdj', it.Tdj) //节点补助
          this.init()
        } else {
          // sysMes("请先注册EOTC", function () { window.location.href = "login.html" });
          console.warn('请先注册EOTC')
          this.$router.replace({
            name: 'login',
          })
        }
      })
      .catch((err) => {
        this.$toast.error(err)
      })
  },
  methods: {
    go() {
      this.$router.push({ name: 'look' })
    },
    init() {
      let data = UserInfo()
      this.usdt_ye = data.usdt_ye
      this.eotc_sf = data.eotc_sf
      for (let i in this.information) {
        switch (i) {
          case '0':
            this.information[i].number = data.usdt_ye
            break
          case '1':
            this.information[i].number = data.eotc_stake
            break
          case '2':
            this.information[i].number = localStorage.getItem('eotc9')
            break
          case '3':
            this.information[i].number = localStorage.getItem('eotcStaging')
            break
        }
      }
      for (let j in this.earnings) {
        switch (j) {
          case '0':
            if (data.eotc_air == '') {
              this.earnings[j].number = 0
            } else {
              this.earnings[j].number = data.eotc_air
            }
            break
          case '1':
            this.earnings[j].number = data.Ssyj
            break
          case '2':
            this.earnings[j].number = data.Pjj
            break
          case '3':
            this.earnings[j].number = data.Lrfc
            break
          case '4':
            this.earnings[j].number = data.Syfh
            break
          case '5':
            this.earnings[j].number = data.Tdj
            break
        }
      }
    },
  },
}
</script>

<style lang="less" scoped>
.top {
  font-size: 28px;
  background: #1b2945;
  color: #fff;
  padding: 32px 32px 60px;
  .top-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 60px;
    div {
      font-size: 32px;
      display: flex;
      align-items: center;
      p {
        margin-right: 10px;
      }
    }
    button {
      background: #1b2945;
      border-color: #fff;
      border-width: 1px;
      padding: 12px 48px;
      border-radius: 40px;
    }
  }
  .top-content {
    display: flex;
    justify-content: space-around;
    text-align: center;
    div {
      p:last-child {
        margin-top: 10px;
        font-size: 32px;
      }
    }
  }
}
.content {
  min-height: calc(100vh - 440px);
  padding: 24px 24px 40px;
  font-size: 28px;
  background: #f3f4f5;
  .information {
    padding: 26px 30px 0;
    background: #fff;
    border-radius: 20px;
    .title {
      font-size: 32px;
      font-weight: bold;
      span {
        font-weight: normal;
        font-size: 28px;
        color: #999;
      }
    }
    .listbox {
      margin-top: 40px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .list {
        width: 45%;
        padding-left: 20px;
        p:first-child {
          color: #999;
          margin-bottom: 10px;
        }
        p:last-child {
          margin-bottom: 40px;
          font-size: 32px;
          font-weight: bold;
        }
      }
    }
  }
  .footer {
    margin-top: 100px;
    .look {
      font-size: 28px;
      text-align: center;
      color: #247ff6;
      margin-top: 40px;
    }
  }
}
</style>
