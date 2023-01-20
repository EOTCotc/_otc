<template>
  <div>
    <white :title="title"></white>
    <div class="content">
        <div class="top">
          <span>转入(出)UID</span><span>USDT数量</span><span>转账日期</span>
        </div>

      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div class="list" v-for="item in list" :key="item">
          <span>123458</span><span>-45.20</span><span>2022.05.24 22:21</span>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
import white from "@/components/Nav/white.vue";
export default {
  components: {
    white,
  },
  data() {
    return {
      title: "转账记录",
      list: [],
      loading: false,
      finished: false,
    };
  },
  methods: {
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1);
        }

        // 加载状态结束
        this.loading = false;

        // 数据全部加载完成
        if (this.list.length >= 40) {
          this.finished = true;
        }
      }, 1000);
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
  }
  .list {
    padding: 28px 40px;
    color: #666;
    font-size: 28px;
    display: flex;
    justify-content: space-between;
  }
}
</style>