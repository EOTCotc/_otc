<template>
  <div>
    <van-nav-bar fixed placeholder :title="title" left-arrow @click-left="onClickLeft" />
  </div>
</template>

<script>
export default {
  //白色导航栏，带返回
  name: "Nav-white",
  props: { title: String },
  data(){
      return{

      }
  },
  methods: {
    onClickLeft() {
        this.$router.back()
      // //console.log("back");
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.van-nav-bar .van-icon {
  color: #000;
}
/deep/.van-nav-bar__title {
  font-size: 36px;
  font-weight: bold;
}
</style>>
