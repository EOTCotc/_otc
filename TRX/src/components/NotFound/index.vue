<template>
    
  <van-empty image="error" :description="a" />
</template>

<script>

import {Toast } from "vant"


export default {
  name: "Not-Found",
  data(){
    return {
      a:'内容找不到了'
    }
  },
  created() {
    const toast = Toast.loading({
      duration: 0, 
      forbidClick: true,
      message: "倒计时 3 秒",
    });

    let second = 3;
    const timer = setInterval(() => {
      second--;
      if (second) {
        toast.message = `${second} 秒后将返回`;
      } else {
        clearInterval(timer);
       Toast.clear();
       this.$router.replace({
           name:"index"
       })
      }
    }, 1000);
  },
};
</script>

<style lang="less" scoped>
.van-empty{
  position: fixed;
  left: 0;
  right: 0;
  bottom:0;
  top:0;
}
</style>