<template>
  <div>
    <div class="transition"></div>
    <div class="center">
      <div class="flexbox">
        <p>官方网站</p>
        <a href="https://eotc.im">https://eotc.im</a>
      </div>
      <div class="flexbox">
        <p>官方电报</p>
        <a href="https://t.me/EOTOTC">https://t.me/EOTOTC</a>
      </div>
      <div class="flexbox">
        <p>官方推特</p>
        <a href="https://twitter.com/EOTC9">https://twitter.com/EOTC9</a>
      </div>
      <div class="flexbox">
        <p>DAO</p>
        <p>coin@eotc.me</p>
      </div>
      <div class="flexbox" @click="show = true">
        <p>我的推荐人</p>

        <div>
          <p>
            UID:{{ parentID }}<span>({{ pidData.userName }})</span>
          </p>
          <img src="@/static/icon/document.png" alt="" />
        </div>
      </div>
      <van-popup v-model="show" round closeable :style="{ width: '80%' }">
        <div class="popBox">
          <div class="top">我的推荐人</div>
          <div class="van-hairline--bottom"></div>
          <div class="center">
            <div>
              <p>UID: {{ parentID }}<span>({{ pidData.userName }})</span></p>
            </div>
            <div>
              <p>
                电话: <a :href="'tel:' + pidData.phone">{{ pidData.phone }}</a>
              </p>
              <i
                class="iconfont icon-fuzhi icon"
                @click="handleCopy(pidData.phone)"
              ></i>
            </div>
            <div>
              <p>
                邮箱:
                <a :href="'mailto:' + pidData.mail">{{ pidData.mail }}</a>
              </p>
              <i
                class="iconfont icon-fuzhi icon"
                @click="handleCopy(pidData.mail)"
              ></i>
            </div>
            <div v-if="pidData.telegram != ''">
              <p>
                电报群: <a :href="pidData.telegram"></a>{{ pidData.telegram }}
              </p>
              <i
                class="iconfont icon-fuzhi icon"
                @click="handleCopy(pidData.telegram)"
              ></i>
            </div>
          </div>
        </div>
      </van-popup>
      <!-- <div class="flexbox">
        <p>上级节点电报</p>
        <p>UID:{{parentID}}</p>
      </div> -->
    </div>
  </div>
</template>

<script>
import { PidMsg } from "@/api/trxRequest";
import { Toast } from "vant";
export default {
  data() {
    return {
      parentID: "",
      show: false,
      pidData: "",
    };
  },
  mounted() {
    this.parentID = localStorage.getItem("parentID");
    this.init();
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
    init() {
      PidMsg({}).then((res) => {
        res.data.userName = res.data.userName.substring(0, 1);
        console.log(res);

        this.pidData = res.data;
      });
    },
  },
};
</script>

<style lang="less" scoped>
a:link {
  color: #333;
}
a:visited {
  color: #333;
}
.topbox {
  padding: 32px 32px 40px;
  font-size: 28px;
  color: #333;
  p:first-child {
    font-size: 40px;
    font-weight: bold;
    color: #1b2945;
    margin-bottom: 40px;
  }
}
.transition {
  height: 10px;
  background: #f3f4f5;
}
.center {
  font-size: 28px;
  .flexbox {
    display: flex;
    justify-content: space-between;
    padding: 28px 32px;
    p:first-child {
      font-weight: bold;
    }
    div {
      display: flex;
      align-items: center;
      p {
        font-weight: normal !important;
      }
      img {
        width: 30px;
        height: 30px;
      }
    }
  }
  .popBox {
    .top {
      padding: 30px 30px 20px;
      font-size: 36px;
      font-weight: 500;
    }
    .center {
      padding: 30px;
      div {
        display: flex;
        justify-content: space-between;
        margin-bottom: 30px;
      }
      div:first-child {
        margin-top: 30px;
      }
    }
  }
}
</style>
