<template>
  <div>
    <White :title="title"></White>
    <van-cell-group title="其他地址" :border="false">
      <van-cell
        v-for="(item, index) of historyList"
        :key="index"
        :border="false"
      >
        <template #title>
          <span>{{ item }}</span>
          <i
            class="iconfont icon-fuzhi icon"
            @click="handleCopy(list[index])"
          ></i>
        </template>
        <!-- <div :style="{ color: '#237ff8' }">
          <span>解除绑定</span>
        </div> -->
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import { Toast } from "vant";
import White from "@/components/Nav/white.vue";
import { MemberWallet } from "@/api/trxRequest";
export default {
  components: {
    White,
  },
  data() {
    return {
      title: "",
      net: "",
      historyList: [],
      list: [],
    };
  },
  mounted() {
    this.title = this.$route.params.addressItem;
    this.net = this.title.toLowerCase();
    this.init();
  },
  methods: {
    init() {
      MemberWallet({ uid: localStorage.getItem("uid"), net: this.net }).then(
        (res) => {
          let data = res.data;
          for (let i of data) {
            i.ads = i.ads.trim();
            this.list.push(i.ads);
            this.historyList.push(this.string(i.ads));
          }
        }
      );
    },
    string(data) {
      return (
        data.substring(0, 10) +
        "..." +
        data.substring(data.length - 10, data.length)
      );
    },
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
  },
};
</script>

<style>
</style>