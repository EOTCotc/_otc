<template>
  <div class="Nav-container" id="nav">
    <van-nav-bar
      fixed
      placeholder
      z-index="10"
      @click-left="onClickLeft"
      @click-right="onClickRight"
      :border="false"
    >
      <template #left>
        <i class="iconfont icon-menu"></i>
      </template>
      <template #title>
        <img @click="gohome()" src="@/assets/currency-icons/eotc.png" alt="" />
      </template>
      <template #right v-if="uid != null">
        <i  class="iconfont icon-wode"></i>
      </template>
    </van-nav-bar>

    <van-popup
      v-model="zhiyaShow"
      position="left"
      get-container="#nav"
      class="pop"
    >
      <div class="content">
        <div v-for="(item, index) in list" :key="index" @click="skip(item)">
          <p>
            {{ item.title }}
          </p>
          <img src="@/static/image/xie-jiantou.png" alt="" />
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import PubSub from "pubsub-js";

export default {
  name: "MyNav",
  data() {
    return {
      zhiyaShow: false,
      list: [
        { title: "EOTC官网", event: "https://eotc.im" },
        { title: "链上理财赚币", event: "https://fi.eotc.im/" },
        { title: "去中心化币币交易所",event: "https://swap.eotc.im/" },
        { title: "去中心化借贷交易所" },
        { title: "去中心化合约交易所" },
        { title: "DID去中心化身份系统",event: "https://did.eotc.im/" },
        { title: "去中心化应用系统" },
        { title: "EOTC NFT", event: "https://nft.eotc.im/" },
        { title: "EOTC 元宇宙" },
        { title: "EOTC DAO" ,event: "https://dao.eotc.im/"},
      ],
      uid: "",
    };
  },
  created() {
    this.uid = localStorage.getItem('uid') 
    PubSub.subscribe("setUid", (EventType,uid) => {
      this.uid = uid;
    });
  },
  mounted() {
    this.$bus.$on("sendBus", (data) => {
      this.getPath();
    });
  },

  methods: {
    onClickLeft() {
      this.zhiyaShow = !this.zhiyaShow;
    },
    onClickRight() {
      this.zhiyaShow = false;
      // this.pass();
      if (this.$route.name == "userInfo") {
        this.$router.back();
      } else {
        this.$router.push({
          name: "userInfo",
        });
      }
    },
    skip(item) {
      if (item.event != undefined) {
        const nextType = localStorage.getItem('netType')
        if(nextType ==='bsc' && item.event ==='https://fi.eotc.im/'){
           this.$toast.warning("功能即将上线！");
           return false
        }
        window.location.href = item.event;
      } else {
        this.$toast.warning("功能即将上线！");
      }
    },

    //点击中间logo回到首页
    gohome() {
      this.zhiyaShow = false;
      this.$router.replace({ name: "index" });
    },
  },
};
</script>

<style lang="less" scoped>

/deep/ .van-nav-bar__title{
  display: flex !important;
  align-content: center;
}

/deep/.van-nav-bar {
  background-color: #1b2945;
}
/deep/.van-overlay {
  z-index: 9 !important;
}
/deep/.van-popup--left {
  top: calc(50% + 92px);
}
.pop {
  width: 80%;
  height: 100vh;
  z-index: 10 !important;
  background: #1b2946;

  .content {
    div {
      height: 100px;
      line-height: 100px;
      margin: 0 48px;
      border-bottom: 1px solid #2b374f;
      font-size: 28px;
      color: #b4b7c2;
      display: flex;
      justify-content: space-between;
      align-items: center;
      img {
        width: 32px;
        height: 32px;
      }
    }
  }
}

.iconfont {
  font-size: 40px;
  color: #e5ebf5;
}
img {
  width: 56px;
  height: 56px;
  vertical-align: center;
}
</style>
