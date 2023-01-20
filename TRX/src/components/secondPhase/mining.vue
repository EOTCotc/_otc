<template>
  <div>
    <white :title="title"></white>
    <div class="content">
      <div class="header">
        <img src="../../static/icon/shovel.png" alt />
        <p>
          推广总收益
          <span>(EOTC)</span>
        </p>
        <p>{{ num }}</p>
      </div>
      <div class="datum">
        <div>
          <p>直推收益</p>
          <p>{{ zt }}</p>
        </div>
        <div>
          <p>间推收益</p>
          <p>{{ jt }}</p>
        </div>
        <div>
          <p>社区补贴</p>
          <p>{{ team }}</p>
        </div>
        <div>
          <p>节点补贴</p>
          <p>{{ node }}</p>
        </div>
      </div>
      <div class="rule">
        <p class="title">流动性挖矿规则</p>
        <div>
          <p>质押EOTC\USDT交易对LP凭证6-24个月</p>100-4999个双币质押LP凭证 正常年化收益
          <br />5000-49999个双币质押LP凭证 1.2倍年化收益
          <br />50000个及以上双币质押LP凭证 1.4倍年化收益
          <br />年化收益计算按双币质押LP凭证个数乘以年化收益率，奖励EOTC代币
        </div>
        <div>
          <p>质押EOTCUSDT交易对LP凭证6-24个月</p>6个月收益48%
          <br />12个月收益72%
          <br />24个月收益100%
          <br />收益根据二级市场价格自动调整
        </div>
        <div>
          <p>流动性挖矿推广奖励</p>质押EOTC\USDT交易对LP凭证6-24个月到DAPP(24个月与12个月的推广奖励相同)，用户和上级获得EOTC代币奖励
          <br />直推收益的20%
          <br />间推收益的5%
          <br />社区补贴 收益的1%
          拿下级十代社区
          <br />节点补贴
          <br />1、高级节点15%
          <br />2、中级节点13%
          <br />3、实时节点10%
          <br />4、信用节点5%
        </div>
        <div> EOTC SWAP聚合币币交易所收取千分之3手续费，其中千分之0.5归属平台，千分之2.5按比例分给所有LP持有人。质押LP凭证进行流动性挖矿不影响手续费收益，可以获得手续费和流动性挖矿双重收益。</div>
      </div>
      <div class="footer">
        <van-button color="#f69540" block round @click="jump()">流动性挖矿</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import white from '@/components/Nav/white.vue'
//流动性挖矿收益
export default {
  components: {
    white,
  },
  data() {
    return {
      title: '流动性挖矿',
      num: '',
      zt: '',
      jt: '',
      team: '',
      node: '',
    }
  },
  created() {
    this.zt = localStorage.getItem('lpZt')
    this.jt = localStorage.getItem('lpJt')
    // console.log()
    this.team = localStorage.getItem('lpTeams')
    this.node = localStorage.getItem('lpNode')
    this.num = this.zt * 1 + this.jt * 1 + this.team * 1 + this.node * 1
  },
  methods: {
    jump() {
      window.location.href = 'https://swap.eotc.im'
    },
  },
}
</script>

<style lang="less" scoped>
.content {
  padding: 30px 32px 0;
  min-height: calc(100vh - 126px);
  font-size: 28px;
  background: #f3f4f5;
  .header {
    background: #f69540;
    border-radius: 20px;
    color: #fff;
    padding: 40px 30px 60px;
    margin-bottom: 30px;
    position: relative;
    span {
      font-size: 24px;
    }
    p:last-child {
      margin-top: 30px;
      font-size: 40px;
      font-weight: bold;
    }
    img {
      width: 180px;
      position: absolute;
      right: 30px;
      top: 23px;
    }
  }
  .datum {
    width: calc(100vw - 128px);
    padding: 28px 30px 40px;
    margin-bottom: 30px;
    background: #fff;
    box-shadow: 0px 3px 12px 1px rgba(27, 41, 69, 0.06);
    border-radius: 20px 20px 20px 20px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    div {
      width: 45%;
    }
    div:first-child {
      margin-bottom: 30px;
    }
    div p:first-child {
      font-size: 24px;
      color: #666;
      margin-bottom: 12px;
    }
    div p:last-child {
      font-size: 36px;
      font-weight: bold;
    }
  }
  .rule {
    background: #fff;
    border-radius: 20px;
    padding: 40px 30px 30px;
    box-shadow: 0px 3px 12px 1px rgba(27, 41, 69, 0.06);
    font-size: 28px;
    .title {
      font-size: 32px;
      font-weight: bold;
      margin-bottom: 30px;
    }
    div {
      color: #666;
      margin-bottom: 20px;
      p {
        margin-bottom: 20px;
        font-weight: bold;
      }
    }
  }
  .footer {
    // width: calc(100vw - 128px);
    // position: fixed;
    // bottom: 60px;
    // right: 64px;
    margin: 30px 0 60px;
  }
}
</style>
