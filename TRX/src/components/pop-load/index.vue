<template>
  <van-popup
    round
    v-model="loadShow"
    :close-on-click-overlay="false"
    class="load"
    get-container="body"
  >
    <div class="loadbox">
      <VueLoading
        type="beat"
        :size="{ width: '35px', height: '35px' }"
      ></VueLoading>
      <p class="loading">{{ text }}</p>
      <p>{{ loadtext }}</p>
    </div>
  </van-popup>
</template>

<script>
import { VueLoading } from "vue-loading-template";

export default {
  name: "PopLoad",
  components: {
    VueLoading,
  },
  props: {
    loadShow: {
      type: Boolean,
      default: false,
      require: true,
    },
    text: {
      type: String,
      default: "转币中",
    },
    loadtext: {
      type: String,
      default: "正在向合约转币，请稍后…",
    },
  },
};
</script>

<style lang="less" scoped>
.load {
  width: 80%;
  .loadbox {
    text-align: center;
    padding: 60px 0;
    .loading {
      font-size: 32px;
      color: #333;
      font-weight: bold;
      margin: 20px 0 30px;
    }
    p:last-child {
      font-size: 28px;
      color: #999;
    }
  }
}
</style>
