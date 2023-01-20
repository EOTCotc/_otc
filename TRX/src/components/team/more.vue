<template>
  <div>
    <white :title="title"></white>
    <div class="content">
      <van-search
        class="search"
        v-model="value"
        background="#F3F4F5"
        placeholder="请输入搜索关键词"
      />
      <div class="node" v-for="(item, index) in 10" :key="index">
        <div class="node_title">
          <div>
            <img src="@/static/image/usdc.png" alt="" />
            <span>Ava1553</span>
          </div>
          <i @click="showClick" class="iconfont icon-renyuanxinxi"></i>
        </div>
        <div class="node_content">
          <div>
            <p>姓名: 颜**</p>
            <p>直推节点: 1</p>
          </div>
          <div>
            <p>节点类型: A6</p>
            <p>节点级别: v6</p>
          </div>
          <p class="time">注册日期: 2020.05.24 00:25</p>
        </div>
      </div>

      <van-popup v-model="show" closeable class="pop">
        <div class="pop-content">
          <p class="title">UID:123485</p>
          <div class="text">
            <p>手机号: 13589632145</p>
            <p>邮 箱: 13589632145qq.com</p>
            <p>EOTC质押: 135.00</p>
            <p>USDT余额: 5.00</p>
          </div>
          <van-button class="button" round color="#1B2945" block @click="skip"
            >给他转账</van-button
          >
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import white from "@/components/Nav/white.vue";
export default {
  //更多链接
  data() {
    return {
      title: "更多节点",
      value: "",
      show: false,
    };
  },
  components: {
    white,
  },
  methods: {
    showClick() {
      this.show = true;
    },
    skip() {
      this.$router.push({ name: "transfer" });
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  padding: 20px 24px;
  background: #f3f4f5;
  .search {
    margin-bottom: 20px;
    /deep/.van-search__content {
      background: #fff;
    }
    /deep/.van-search {
      padding-bottom: 0;
      border-radius: 16px;
    }
  }
  .node {
    padding: 24px;
    background: #fff;
    border-radius: 16px;
    margin-bottom: 20px;
    .node_title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 22px;
      div {
        display: flex;
        align-items: center;
        span {
          font-size: 32px;
          font-weight: bold;
        }
        img {
          width: 40px;
          height: 40px;
          margin-right: 14px;
          border-radius: 50%;
        }
      }
      i {
        font-size: 48px;
        color: #999;
      }
    }
    .node_content {
      font-size: 28px;
      div {
        display: flex;
        justify-content: space-between;
        margin-bottom: 16px;
        p:first-child {
          width: 50%;
        }
        p:last-child {
          width: 45%;
        }
      }
      .time {
        color: #999;
      }
    }
  }
  .pop {
    width: 686px;
    border-radius: 20px;
    .pop-content {
      padding: 30px 30px 40px;
      font-size: 28px;
      .title {
        font-size: 32px;
        font-weight: bold;
        color: #247ff6;
        margin-bottom: 30px;
      }
      .text {
        margin-bottom: 30px;
        p {
          margin-bottom: 20px;
        }
        p:last-child {
          margin: 0;
        }
      }
    }
  }
}
</style>
