<template>
  <div class="content">
    <div class="top">
      <div class="top-title">
        <i class="iconfont icon-zongshouyi"></i>
        <span>总收益</span>
      </div>
      <div class="top-content">
        <div>
          <p>USDT</p>
          <p>35565.88</p>
        </div>
        <div>
          <p>EOTC</p>
          <p>35565.88</p>
        </div>
      </div>
    </div>
    <div class="center">
      <div
        class="centerList"
        v-for="(item, index) in list"
        :key="index"
        :class="setClass(item.bg)"
      >
        <p class="title">
          <span>{{ item.title }}</span
          ><span>{{ item.currency }}</span>
        </p>
        <div>
          <p>{{ item.number }}</p>
          <img :src="require(`@/static/image/${item.url}.png`)" alt="" />
        </div>
      </div>
    </div>
    <p class="look" @click="go()">查看收益明细</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          title: "分享奖励",
          currency: "(USDT)",
          number: "4562.25",
          url: "201",
        },
        {
          title: "辅助奖励",
          currency: "(USDT)",
          number: "154.12",
          url: "204",
        },
        {
          title: "节点补助",
          currency: "(USDT)",
          number: "10000.00",
          url: "232",
        },
        {
          title: "平级奖",
          currency: "(USDT)",
          number: "52.88",
          url: "209",
        },
        {
          title: "社区补贴",
          currency: "(USDT)",
          number: "15000.00",
          url: "235",
        },
        {
          title: "手续费分红",
          currency: "(USDT)",
          number: "452.63",
          url: "238",
        },
      ],
    };
  },
  created() {
    for (let i in this.list) {
      let a = i % 5;
      this.list[i].bg = a;
    }
  },
  methods: {
    setClass(num) {
      switch (num) {
        case 0:
          return "background1";
        case 1:
          return "background2";
        case 2:
          return "background3";
        case 3:
          return "background4";
        case 4:
          return "background5";
        default:
      }
    },
    go(){
      this.$router.push({ name: "look" });
    }
  },
};
</script>

<style lang="less" scoped>
.top {
  padding: 32px;
  background-image: url("@/static/image/earnings-top.png");
  color: #fff;
  .top-title {
    display: flex;
    align-items: center;
    font-size: 32px;
    margin-bottom: 40px;
    i {
      font-size: 32px;
    }
  }
  .top-content {
    display: flex;
    justify-content: space-around;
    margin-bottom: 56px;
    div {
      text-align: center;
      p:first-child {
        font-size: 24px;
        margin-bottom: 8px;
      }
      p:last-child {
        font-size: 40px;
      }
    }
  }
}
.center {
  padding: 32px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .centerList {
    width: 280px;
    padding: 30px 24px;
    border-radius: 20px;
    .title {
      color: #666;
      span:first-child {
        font-size: 32px;
      }
      span:last-child {
        font-size: 24px;
      }
    }
    div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      p {
        font-size: 36px;
      }
    }
  }
  
  .background1 {
    background: linear-gradient(180deg, #ffdede 0%, #fffafa 80%, #ffffff 100%);
  }
  .background2 {
    background: linear-gradient(180deg, #ffe7db 0%, #fffcfb 79%, #ffffff 100%);
  }
  .background3 {
    background: linear-gradient(180deg, #d8f4ff 0%, #f9fdff 79%, #ffffff 100%);
  }
  .background4 {
    background: linear-gradient(180deg, #fff2de 0%, #fffcf7 81%, #ffffff 100%);
  }
  .background5 {
    background: linear-gradient(180deg, #e8f1ff 0%, #fbfcff 82%, #ffffff 100%);
  }
}
.look {
    font-size: 28px;
    text-align: center;
    color: #247ff6;
    margin-top: 40px;
  }
</style>
