<template>
  <div>
    <div class="top">
      <div class="top-left">
        <img :src="lefturl" alt="" />
        <img v-if="wang == 0" class="diadema" src="@/static/image/diadema.png" alt="" />
        <p>{{ leftnaem }}</p>
        <p>({{leftstatus}})</p>
      </div>
      <div class="top-right">
        <p>({{rightstatus}})</p>
        <p>{{ rightname }}</p>
        <img
          v-if="wang == 1"
          class="diadema"
          src="@/static/image/diadema.png"
          alt=""
        />
        <img :src="righturl" alt="" />
      </div>
    </div>
    <div class="both">
      <div>
        <p>原告</p>
        <span v-if="bankShow">{{ leftbank }}票</span>
      </div>
      <div>
        <span v-if="bankShow">{{ rightbank }}票</span>
        <p>被告</p>
      </div>
    </div>
    <van-progress
      v-if="planShow"
      :percentage="percentage"
      stroke-width="12"
      :show-pivot="false"
      color="#4EA0F5"
      track-color="#EC6F66"
    />
  </div>
</template>

<script>
export default {
    //进度条组件
  props: {
    //原告名字
    leftnaem: {
      type: String,
    },
    //原告头像
    lefturl: {
      type: String,
    },
    //原告身份
    leftstatus:{
      type:String,
      default:'卖家'
    },
    //被告名字
    rightname: {
      type: String,
    },
    //被告头像
    righturl: {
      type: String,
    },
    //被告身份
    rightstatus:{
      type:String,
      default:'买家'
    },
    //胜方状态 1原告胜 2被告胜 3仲裁中 
    wang: {
      type: Number,
      default: 3,
    },
    //仲裁票数开关
    bankShow: {
      type: Boolean,
      default: true,
    },
    // 原告票数
    leftbank: {
      type: Number,
    },
    //被告票数
    rightbank: {
      type: Number,
    },
    //进度条开关
    planShow: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      winShow: true,
      percentage:0
    };
  },
  mounted(){
      if(this.bankShow){
          this.percentage=this.leftbank/(this.leftbank + this.rightbank)*100
      }
  }
};
</script>

<style lang="less" scoped>
.top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: 28px;
  // align-items: center;
  img {
    width: 60px;
    height: 60px;
  }
  .top-left {
    display: flex;
    align-items: center;
    position: relative;
    .diadema {
      width: 60px;
      height: 79px;
      position: absolute;
      left: 0;
      top: -18px;
    }
    img:first-of-type {
      margin-right: 12px;
    }
    p:last-child {
      font-size: 24px;
      color: #999;
      margin-left: 5px;
    }
  }
  .top-right {
    display: flex;
    align-items: center;
    position: relative;
    .diadema {
      width: 60px;
      height: 79px;
      position: absolute;
      right: 0;
      top: -18px;
    }
    img {
      margin-left: 12px;
    }
    p:first-child {
      font-size: 24px;
      color: #999;
      margin-right: 5px;
    }
  }
}
.both {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 24px;
  div {
    display: flex;
    align-items: center;
  }
  div:first-child {
    p {
      background: #4ea0f5;
      color: #fff;
      font-weight: bold;
      padding: 8px 24px;
      border-radius: 0 24px 24px 24px;
      margin-right: 12px;
    }
    span {
      color: #4ea0f5;
    }
  }
  div:last-child {
    p {
      background: #ec6f66;
      color: #fff;
      font-weight: bold;
      padding: 8px 24px;
      border-radius: 24px 0 24px 24px;
      margin-left: 12px;
    }
    span {
      color: #ec6f66;
    }
  }
}
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
</style>

