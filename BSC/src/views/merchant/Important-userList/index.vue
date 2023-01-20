<template>
  <van-tabs
    v-model="activeName"
    swipeable
    color="#237DF4"
    sticky
    :offset-top="offsetTop"
    background="#1B2945"
    title-active-color="#fff"
    title-inactive-color="#8D94A2"
  >
    <van-tab title="关注" name="concern">
      <!-- 关注列表 -->
      <div
        v-for="(item, i) in 60"
        :key="i"
        class="van-cell van-cell--clickable van-cell--center van-cell--borderless van-contact-card van-contact-card--edit"
      >
        <van-icon
          name="user-o"
          size="24px"
          :style="{ marginRight: '5px' }"
          @click="to_userHome"
        />
        <div
          class="van-cell__value van-cell__value--alone van-contact-card__value"
        >
          <div>姓名：李清茶</div>
        </div>
        <i
          class="van-icon van-icon-arrow van-cell__right-icon"
          @click="to_userHome"
        ></i>
      </div>
    </van-tab>
    <van-tab title="交易过" name="Old_customers">
      <!-- 交易过的用户 -->
      <importTantList
        v-for="(item, i) in 6"
        :key="i"
        :activeName="activeName"
      ></importTantList>
    </van-tab>
    <van-tab title="黑名单" name="blacklist">
      <!-- 黑名单用户 -->
      <importTantList
        v-for="(item, i) in 6"
        :key="i"
        :activeName="activeName"
      ></importTantList>
    </van-tab>
  </van-tabs>
</template>

<script>
import importTantList from "./important.vue";
import { UserBind } from "@/api/trxRequest";

export default {
  name: "important-userList",
  components: {
    importTantList,
  },
  data() {
    return {
      offsetTop: "45px",
      activeName: "concern",
      currentUser: {
        name: "张三",
      },
    };
  },
  created() {
    this.activeName = this.$route.query.source;
    this.$nextTick(() => {
      this.offsetTop = document
        .getElementById("nav")
        .getBoundingClientRect().height;
    });
    this.init();
  },
  methods: {
    to_userHome() {
      // this.$router.push({
      //   name:"merchantInfo"
      // })
    },
    async init() {
      const { data } = await UserBind({
        type: 10, //我的关注列表
      });
      console.log(data)
    },
  },
};
</script>

<style></style>
