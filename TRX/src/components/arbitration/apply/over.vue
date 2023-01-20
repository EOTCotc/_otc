<template>
  <div>
    <white :title="title"></white>
    <div class="content">
      <div class="title">
        <div v-if="state==1">
          <i class="iconfont icon-bianji"></i>
          <span>败诉</span>
        </div>
        <div v-else>
          <i class="iconfont icon-bianji"></i>
          <span>胜诉</span>
        </div>
        <p :class="state==1 ? 'colour':'colour1'">-100EOTC</p>
      </div>
      <div class="top">
        <both
          :leftnaem="bothData.leftnaem"
          :rightname="bothData.rightname"
          :lefturl="bothData.lefturl"
          :righturl="bothData.righturl"
          :wang="bothData.wang"
          :leftbank="bothData.leftbank"
          :rightbank="bothData.rightbank"
        ></both>
        <div class="case_text">
          <p class="title">仲裁结果</p>
          <div class="text_flex">
            <p class="van-multi-ellipsis--l2">
              本次参与仲裁判决的仲裁员共计11人，通过双方提交举证，10位仲裁员判定原告方胜。
            </p>
            <div><van-icon name="orders-o" size="0.5rem" />详情</div>
          </div>
        </div>
      </div>
      <div class="center">
        <p>说明</p>
        <p>该仲裁案已结案，败诉扣除您100 EOTC 如有异议可在结案后七日内进入详情申请再仲裁，注意逾期将无法队此案进行再仲裁</p>
      </div>
      <div class="footer">
        <van-button color="#1B2945" round block>申请再次仲裁</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import white from "@/components/Nav/white.vue";
import both from "@/components/arbitration/module/both.vue";
export default {
  //结案通知
  components: {
    white,
    both,
  },
  data() {
    return {
      title: "结案通知",
      bothData: {
        leftnaem: "吴敏",
        rightname: "我",
        lefturl: require("@/static/image/usdt.svg"),
        righturl: require("@/static/image/usdc.svg"),
        wang: 0,
        leftbank: 7,
        rightbank: 4,
      },
      state:2
    };
  },
};
</script>

<style lang="less" scoped>
.content {
  padding: 30px 32px 60px;
  font-size: 28px;
  color: #333;
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 20px;
    div {
      font-size: 36px;
      display: flex;
      align-items: center;
      i {
        font-size: 50px;
      }
    }
    .colour {
      color: #fc7542;
    }
    .colour1{
        color: #00B87A;
    }

  }
  .top {
    padding: 32px;
    box-shadow: 0px 3px 12px 1px rgba(27, 41, 69, 0.03);
    border-radius: 20px 20px 20px 20px;
    margin-bottom: 40px;
    .case_text {
      margin-top: 32px;
      .title {
        font-size: 32px;
        font-weight: bold;
        margin-bottom: 16px;
      }
      .text_flex {
        display: flex;
        justify-content: space-between;
        div {
          width: 40%;
          font-weight: bold;
          display: flex;
          align-items: flex-end;
          padding-left: 24px;
        }
      }
    }
  }
  .center{
    p:first-child{
        font-size: 32px;
        font-weight: bold;
        margin-bottom: 20px;
    }
  }
  .footer{
    position: fixed;
    bottom: 60px;
    right: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    button{
        width: 90%;
    }
  }
}
</style>
