<template>
  <div>
    <white :title="title"></white>
    <div class="content">

      <div class="header">
        <img src="../../static/icon/nft2.png" alt="" />
        <p>推广总收益</p>
        <div class="currency">
          <div>
            <p>EOTC</p>
            <p>19716.37</p>
          </div>
          <div>
            <p>USDT</p>
            <p>19716.37</p>
          </div>
        </div>
      </div>
      <div class="datum">
        <div>
          <p>分享奖励(USDT)</p>
          <p>154.23</p>
        </div>
        <div>
          <p>辅助奖励(USDT)</p>
          <p>456.00</p>
        </div>
        <div>
          <p>社区奖励(USDT)</p>
          <p>4899.08</p>
        </div>
        <div>
          <p>盲盒奖励(个)</p>
          <p>23</p>
        </div>
        <div>
          <p>卡牌奖励(个)</p>
          <p>23</p>
        </div>
      </div>
      <div class="datum">
        <div>
          <p>EOTC资金池<br />合约分配</p>
          <p>562.00</p>
        </div>
        <div>
          <p>USDT资金池<br />合约分配</p>
          <p>456.00</p>
        </div>
        <div>
          <p>交易手续费<br />合约分配</p>
          <p>1564.00</p>
        </div>
      </div>
      <div class="box"></div>
      <div class="footer">
        <van-button color="#1B2945" block round @click="jump()">EOTC NFT</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import white from "@/components/Nav/white.vue";
//NFT收益
export default {
  components: {
    white,
  },
  data() {
    return {
      title: "EOTC NFT",
    };
  },
  methods:{
    jump(){
         window.location.href = 'https://nft.eotc.im/';
    }
  }
};
</script>

<style lang="less" scoped>
.content {
  padding: 30px 32px 0;
  min-height: calc(100vh - 126px);
  font-size: 28px;
  background: #f3f4f5;
  .header {
    background: #237ff8;
    border-radius: 20px;
    color: #fff;
    padding: 40px 30px;
    margin-bottom: 30px;
    position: relative;
    .currency {
      display: flex;
      justify-content: space-between;
      margin-top: 40px;
      div {
        width: 49%;
        p:first-child {
          margin-bottom: 10px;
        }
        p:last-child {
          font-size: 40px;
          font-weight: bold;
        }
      }
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
    padding: 28px 30px 0;
    background: #fff;
    box-shadow: 0px 3px 12px 1px rgba(27, 41, 69, 0.06);
    border-radius: 20px 20px 20px 20px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: 30px;
    div {
      width: 45%;
      margin-bottom: 30px;
    }
    div p:first-child {
      font-size: 28px;
      color: #666;
      margin-bottom: 12px;
    }
    div p:last-child {
      font-size: 36px;
      font-weight: bold;
    }
  }
  .datum:last-child{
    margin-bottom: 100px;
  }
  .box{
    height: 160px;
  }
  .footer {
    width: calc(100vw - 128px);
    position: fixed;
    bottom: 60px;
    right: 64px;
  }
}
</style>