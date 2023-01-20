<template>
  <div class="content">
    <div class="flexbox">
      <div class="topLoge">
        <i class="iconfont icon-logo"></i>
        <p>EOTC</p>
      </div>
      <div class="center">
        <img src="@/static/image/222.png" alt="" />
      </div>
      <div class="invite">
        <van-cell title="邀请链接" :value="link" icon-prefix="iconfont">
          <template #right-icon>
            <i class="iconfont icon-fuzhi icon" @click="handleCopy(link)"></i>
          </template>
        </van-cell>
        <van-cell title="邀请码" :value="code">
          <template #right-icon>
            <i class="iconfont icon-fuzhi icon" @click="handleCopy(code)"></i>
          </template>
        </van-cell>
      </div>

      <div class="share" @click="rqShow = true">
        <i class="iconfont icon-erweima"></i>
        <p>分享二维码</p>
      </div>
    </div>
    <!-- <vue-canvas-poster
      :widthPixels="590"
      :painting="painting"
      @success="success"
      @fail="fail"
    ></vue-canvas-poster> -->
    <!-- <van-popup v-model="posterShow" round class="poster">
      <div class="logo">
        <img src="@/assets/currency-icons/eotc.png" alt="" />
      </div>

      <img class="hai" :src="url" alt="" />
    </van-popup> -->
    <van-popup v-model="rqShow" round class="rq">
      <p>面对面邀请</p>
      <vue-qr :logoSrc="imageUrl" :logoScale="0.2" :text="link" :size="200"></vue-qr>
      <p>请使用</p>
      <p>DAPP浏览器扫码</p>
    </van-popup>
  </div>
</template>

<script>
import { Toast } from "vant";
import vueQr from "vue-qr";
export default {
  components: {
    vueQr,
  },
  data() {
    return {
      link: "",
      code: localStorage.getItem("uid"),
      // posterShow: false,
      rqShow: false,
      url: "",
      //   url2: "",

      imageUrl: require("@/static/eotc.jpg"),
      // painting: {
      //   width: "295px",
      //   height: "475px",
      //   background: "#1A2845",
      //   views: [
      //     {
      //       type: "image",
      //       url: require("@/static/image/enjoy.png"),
      //       css: {
      //         width: "295px",
      //         height: "475px",
      //       },
      //     },
      //     {
      //       type: "qrcode",
      //       content:
      //         window.location.origin +
      //         `/#/login?pid=${localStorage.getItem("uid")}`,
      //       css: {
      //         bottom: "20px",
      //         right: "20px",
      //         color: "#fff",
      //         borderWidth: "3px",
      //         borderColor: "#fff",
      //         borderRadius: "3px",
      //         width: "70px",
      //         height: "70px",
      //       },
      //     },
      //   ],
      // },
    };
  },
  mounted() {
    this.link = window.location.origin + `/#/login?pid=${this.code}`;
  },
  methods: {
    handleCopy(val) {
      const that = this;
      this.$copyText(val)
        .then(() => {
          Toast("复制成功");
        })
        .catch(() => {
          Toast("复制失败");
        });
    },
    success(src) {
      this.url = src;
    },
    fail(err) {
      //console.log("fail", err);
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.van-cell__value {
  white-space: nowrap;
  text-overflow: ellipsis;
}
.content {
  min-height: calc(100vh - 186px);
  padding: 32px 32px 60px;
  background: #1a2845;
  position: relative;

  .flexbox {
    .topLoge {
      // position: absolute;
      // top: 48px;
      // left: 30px;
      color: #fff;
      font-size: 50px;
      display: flex;
      align-items: center;
      i {
        font-size: 82px;
      }
    }
    .center {
      // position: absolute;
      // top: 164px;
      // right: 50px;
      width: 640px;
      height: 640px;
      margin: 0 auto 60px;
      img {
        margin: 0 auto;
        width: 100%;
      }
    }
  }
  .invite {
    background: #fff;
    margin-bottom: 40px;
    border-radius: 20px;
    overflow: hidden;
  }
  .share {
    background: #247ff6;
    border-radius: 20px;
    padding: 24px;
    font-size: 32px;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    i {
      font-size: 50px;
    }
  }

  .poster {
    width: 590px;
    height: 950px;
    background: #1a2845;
    /deep/.canvas[data-v-32b53ae9] {
      top: 0;
    }
    .hai {
      display: block;
      width: 100%;
      height: 100%;
    }
    // .logo {
    //   position: absolute;
    //   background: #fff;
    //   width: 35px;
    //   height: 35px;
    //   bottom: 94px;
    //   right: 94px;
    //   img {
    //     display: block;
    //     width: 100%;
    //     height: 100%;
    //   }
    // }
  }
  .rq {
    width: 590px;
    padding: 40px 0 60px;
    text-align: center;
    img {
      display: block;
      width: 100%;
    }
    p {
      font-size: 32px;
    }
    p:first-child {
      font-size: 44px;
    }
  }
}
</style>
