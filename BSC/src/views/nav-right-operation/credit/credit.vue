<template>
  <div class="content">
    <van-nav-bar
      title="信用评分"
      fixed
      placeholder
      left-arrow
      @click-left="onClickLeft"
    />
    <!-- <van-circle v-model="currentRate" :rate="30" :speed="100" :text="text" /> -->
    <div class="grade">
      <div class="text">
        <p>
          <countTo
            :startVal="startVal"
            :endVal="endVal"
            :duration="duration"
          ></countTo>
        </p>
        <p>信用评分低</p>
      </div>
      <div class="svgbox">
        <svg class="svg" viewBox="0 0 300 300">
          <circle
            cx="150"
            cy="90"
            r="75"
            stroke="#323E57"
            stroke-width="10"
            fill="none"
            stroke-dasharray="236"
            stroke-dashoffset="-236"
            stroke-linecap="round"
          />
          <circle
            class="square"
            cx="150"
            cy="90"
            r="75"
            stroke="#2E85F8"
            stroke-width="10"
            fill="none"
            stroke-dasharray="236 236"
            stroke-dashoffset="-236"
            stroke-linecap="round"
          />
        </svg>
      </div>

      <img src="@/static/image/bg-footer.png" alt="" />
    </div>
    <van-tabs
      swipeable
      animated
      background="#2C84F5"
      color="#fff"
      title-active-color="#fff"
      title-inactive-color="#96C2FA"
      v-model="active"
    >
      <van-tab title="加分记录">
        <div class="center">
          <div class="box" v-for="(item, index) in 10" :key="index">
            <div class="box-left">
              <p>完成强关系链身份认证</p>
              <p>20220.05.21 02:45</p>
            </div>
            <p class="box-right color-green">+8</p>
          </div>
        </div>
      </van-tab>
      <van-tab title="扣分记录">
        <div class="center">
          <div class="box" v-for="(item, index) in 10" :key="index">
            <div class="box-left">
              <p>被推荐人陈粒非恶意交易失败</p>
              <p>20220.05.21 02:45</p>
            </div>
            <p class="box-right color-orange">-1</p>
          </div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { Toast } from "vant";
import countTo from "vue-count-to";
export default {
  name: "credit",
  components: {
    countTo,
  },
  data() {
    return {
      // 需要滚动的时间
      duration: 3000,
      // 初始值
      startVal: 0,
      // 最终值
      endVal: 8,
      active:0
    };
  },
  computed: {},
  mounted(){
    this.endVal=localStorage.getItem('myjifen')
  },
  methods: {
    onClickLeft() {
      this.$router.back();
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  /deep/.van-nav-bar {
    background-color: #1b2945;
    z-index: 10;
  }
  /deep/.van-nav-bar .van-icon {
    color: #fff;
  }
  /deep/.van-nav-bar__title {
    color: #fff;
  }
  /deep/[class*="van-hairline"]::after {
    border: none;
  }
  .grade {
    background: #1b2945;
    padding: 42px 0;
    display: flex;
    justify-content: center;
    position: relative;
    img {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 300px;
    }
    .text {
      margin: 100px 0;
      text-align: center;
      color: #fff;
      p:first-child {
        font-size: 100px;
        // font-weight: bold;
      }
      p:last-child {
        margin-top: 30px;
        font-size: 28px;
      }
    }
    .svgbox {
        position: absolute;

      width: 540px;
      height: 540px;
      .svg {
        left: 25%;
        width: 100%;
        height: 100%;
        .square {
          animation: anim 3s linear 1;
        }

        @keyframes anim {
          0% {
            stroke-dasharray: 5 480;
          }
          100% {
            stroke-dasharray: 471;
          }
        }
      }
    }
  }
  .center {
    padding: 24px;
    background: #f3f4f5;
    .box {
      background: #fff;
      padding: 22px 24px 22px 32px;
      margin-bottom: 20px;
      border-radius: 16px;
      display: flex;
      justify-content: space-between;
      .box-left {
        p:first-child {
          font-size: 36px;
          margin-bottom: 10px;
          font-weight: bold;
        }
        p:last-child {
          font-size: 28px;
          color: #999;
        }
      }
      .box-right {
        display: flex;
        align-items: center;
      }
      .color-green {
        color: #1d9c3f;
      }
      .color-orange {
        color: #fc7542;
      }
    }
  }
}
</style>