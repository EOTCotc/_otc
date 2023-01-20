<template>
  <div>
    <white :title="title"></white>
    <div class="content">
      <div class="top">
        <div :class="proofStatic != 0 ? '' : 'black'">
          <van-icon name="underway-o" />
          <van-count-down
            v-if="proofStatic != 0"
            :time="time"
            format="DD 天 HH 时 mm 分 "
          />
          <p v-else>等待仲裁结果</p>
        </div>
        <van-button
          v-if="proofStatic == 1"
          type="info"
          plain
          size="small"
          round
          :to="{ name: 'adjourn' }"
          >申请延期</van-button
        >
      </div>
      <div class="time">
        <p>仲裁发起时间</p>
        <p>2022.05.26 12:54</p>
      </div>
      <div class="adverse">
        <div>
          <img src="@/static/image/cny.png" alt="" />
          <p>王晓雷</p>
          <span>(买家)</span>
        </div>
        <p v-if="userStatic == 2" class="identity bag2">原告</p>
        <p v-if="userStatic == 1" class="identity bag">被告</p>
        <div>
          <van-icon name="chat-o" />
          <p>联系买家</p>
        </div>
      </div>
      <p class="cause">卖家发起仲裁，仲裁事件为账户冻结</p>
      <twosides :bothList="bothList"></twosides>
      <orderDetails
        :messagelist="messagelist"
        :orderlist="orderlist"
      ></orderDetails>
      <div v-if="proofStatic !=0 " class="footer">
        <div class="accuserBox" v-if="userStatic == 1">
          <van-button type="default" round block @click="show = true"
            >取消仲裁</van-button
          >
          <van-button color="#1B2945" round block :to="{name:'additionalProof'}" 
            >追加举证</van-button
          >
        </div>
        <div class="accusedBox" v-else>
          <van-button color="#1B2945" round block :to="{name:'additionalProof'}" 
            >追加举证</van-button
          >
        </div>
      </div>
      <van-popup v-model="show" round closeable class="pop">
        <div class="popbox">
          <p class="title">取消仲裁原因</p>
          <van-radio-group v-model="radio">
            <van-radio name="1">与被告方达成和解</van-radio>
            <van-radio name="2">单方面撤诉</van-radio>
          </van-radio-group>
          <p class="hint">
            提示:
            是否取消该仲裁，取消后该仲裁案自动结案，将不对买卖双方进行任何处罚
          </p>
          <van-button color="#1B2945" round block @click="sumbit"
            >确定</van-button
          >
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import white from "@/components/Nav/white.vue";
import orderDetails from "@/components/arbitration/module/orderDetails.vue";
import twosides from "@/components/arbitration/module/twosides.vue";
export default {
  //待仲裁案件详情
  components: {
    white,
    orderDetails,
    twosides,
  },
  data() {
    return {
      title: "仲裁案详情",
      time: 72 * 60 * 60 * 1000,
      proofStatic: 1,//0:等待仲裁结果 1：举证可延期 2：举证不可延期

      userStatic: 2,//1是原告 2是被告
      bothList: [
        {
          accuserList: [
            { title: require("@/static/image/456.png"), show: true },
            {
              title:
                "交易过程中账户被冻结，无法正常交易。核实电子回单查询密码: 12254",
              show: false,
            },
            { title: require("@/static/image/789.png"), show: true },
          ],
        },
        {
          defendantList: [
            { title: require("@/static/image/456.png"), show: true },
            {
              title:
                "交易过程中账户被冻结，无法正常交易。核实电子回单查询密码: 12254",
              show: false,
            },
            { title: require("@/static/image/789.png"), show: true },
          ],
        },
      ],
      orderlist: [
        {
          title: "订单号",
          number: "7777781205789",
        },
        {
          title: "交易数量",
          number: "997.00000 USDT",
        },
        {
          title: "交易单价",
          number: "6.35 CNY",
        },
        {
          title: "交易总价",
          number: "6350.00 CNY",
          show: true,
        },
        {
          title: "交易时间",
          number: "2022.05.26 15:00:21",
        },
      ],
      messagelist: [
        { title: "姓名", value: "李牧" },
        { title: "开户银行", value: "工商银行" },
        { title: "银行卡号", value: "4005633224656232" },
      ],
      show: false,
      radio: "1",
    };
  },
  methods: {
    judgment() {},
    sumbit() {
      this.$router.back();
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  padding: 32px;
  font-size: 28px;
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 60px;
    .black {
      color: #333;
    }
    div {
      display: flex;
      align-items: center;
      color: #237ff8;
      font-weight: bold;
      font-size: 32px;
      i {
        font-size: 42px;
        padding-right: 12px;
      }
      /deep/.van-count-down {
        color: #237ff8;
      }
    }
  }
  .time {
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
    p:first-child {
      font-weight: bold;
    }
    p:last-child {
      color: #999;
    }
  }
  .adverse {
    padding: 80px 24px 24px;
    box-shadow: 0px 3px 12px 1px rgba(27, 41, 69, 0.03);
    border-radius: 0px 20px 20px 20px;
    display: flex;
    justify-content: space-between;
    position: relative;
    .identity {
      position: absolute;
      padding: 8px 24px;
      border-radius: 0px 24px 24px 24px;
      color: #fff;
      top: 0;
      left: 0;
    }
    .bag {
      background: #ec6f66;
    }
    .bag2 {
      background: #4ea0f5;
    }
    div {
      display: flex;
      align-items: center;
    }
    div:first-child {
      img {
        width: 60px;
        margin-right: 12px;
      }
      span {
        font-size: 24px;
        color: #999;
      }
    }
    div:last-child {
      color: #237ff8;
      p {
        margin-left: 12px;
      }
    }
  }
  .cause {
    margin: 30px 0;
    padding: 24px;
    border-radius: 0px 20px 20px 20px;
    background: #f3f4f5;
  }
  .footer {
    margin-top: 60px;
     .accuserBox {
      display: flex;
      justify-content: space-between;
      button {
        width: 45%;
      }
    }
    .accusedBox {
      display: flex;
      justify-content: center;
      button {
        width: 80%;
      }
    }
  }
  .pop {
    width: 90%;
    height: 550px;
    .popbox {
      padding: 32px 32px 40px;
      .title {
        font-size: 32px;
        font-weight: bold;
        margin-bottom: 60px;
      }
      /deep/.van-radio {
        margin-bottom: 36px;
      }
      .hint {
        margin-bottom: 40px;
        color: #fc7542;
      }
    }
  }
}
</style>
