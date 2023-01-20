<template>
  <div>
    <van-tabs
      v-model="active"
      animated
      swipeable
      @click="tabHandler"
      background="#F3F4F5"
    >
      <van-tab v-if="show" title="待处理">
        <pending></pending>
      </van-tab>
      <van-tab title="待仲裁">
        <forArbitration></forArbitration>
      </van-tab>
      <van-tab title="已结案 ">
        <finish></finish>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
//我的仲裁案
import pending from "@/components/arbitration/pending.vue";
import forArbitration from "@/components/arbitration/forArbitration.vue";

import finish from "@/components/arbitration/finish.vue";
export default {
  components: { pending, forArbitration, finish },
  data() {
    return {
      show: true,
      active: 0,
    };
  },
  mounted() {
    this.active = Number(localStorage.getItem("activeIndex"));
  },
  methods: {
    tabHandler(idx) {
      this.active = idx;
      localStorage.setItem("activeIndex", idx); // 将选中的tab缓存起来
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.van-tabs__nav--line {
  height: 90%;
}
/deep/.van-tab {
  background: #fff;
  border-radius: 60px;
  margin: 24px 20px 0;
}
/deep/.van-tab--active {
  color: #2483ff;
  border: 2px solid #247ff7;
  background: #e8f2ff;
}
/deep/.van-tabs__line {
  background: none;
}
</style>
