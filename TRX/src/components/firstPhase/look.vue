<template>
  <div>
    <white :title="title"></white>
    <div class="content">
      <div class="top">
        <p>收益类型</p>
        <p>收益金额</p>
        <p>发放日期</p>
      </div>

      <div class="list" v-for="(item, index) in list" :key="index">
        <p>{{ item.Chu }}</p>
        <p>{{ item.Coin }}</p>
        <p>{{ item.Zdate }}</p>
      </div>
      <div v-if="list.length == 0">
        <van-empty image="error" description="暂无收益数据" />
      </div>
    </div>
  </div>
</template>

<script>
import white from "@/components/Nav/white.vue";
import { Toast } from "vant";
import { GetSymx } from "@/api/trxRequest";
export default {
  components: {
    white,
  },
  data() {
    return {
      title: "收益明细",
      list: [],
      loading: false,
      finished: false,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: "加载中",
      });
      GetSymx({})
        .then((res) => {
          let data = res.data;
          for (let i of data) {
            switch (i.Chu) {
              case "1":
                i.Chu = "质押收益";
                break;
              case "2":
                i.Chu = "分享奖励";
                break;
              case "3":
                i.Chu = "辅助奖励";
                break;
              case "4":
                i.Chu = "节点补助";
                break;
              case "5":
                i.Chu = "平级奖";
                break;
              case "6":
                i.Chu = "社区奖励";
                break;
              case "7":
                i.Chu = "OTC手续费分红";
                break;
              case "8":
                i.Chu = "分期释放";
                break;
              case "9":
                i.Chu = "额外奖励";
                break;
              case "11":
                i.Chu = "LP收益";
                break;
              case "12":
                i.Chu = "LP直推";
                break;
              case "13":
                i.Chu = "LP间推";
                break;
              case "14":
                i.Chu = "LP奖励";
                break;
            }
          }
          Toast.clear();
          this.list = data;
          Toast.success("加载成功");
          // console.log(data);
        })
        .catch((err) => {
          Toast.clear();
          Toast.fail("加载失败");
          console.log(err);
        });
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  .top {
    background: #f3f4f5;
    padding: 20px 40px;
    color: #999;
    font-size: 28px;
    display: flex;
    justify-content: space-between;
    p:last-child {
      width: 30%;
      text-align: center;
    }
  }
  .list {
    padding: 28px 40px;
    color: #666;
    font-size: 28px;
    display: flex;
    justify-content: space-between;
    // p:nth-child(2) {
    //   flex: 1;
    //   text-align: center;
    // }
  }
}
</style>