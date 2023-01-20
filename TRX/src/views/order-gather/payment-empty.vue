<template>
  <div class="payment-empty">
       <img src="../../assets/tools-svg/emptyData.svg" alt="暂无数据">
       <span>{{title}}</span> 
  </div>
</template>

<script>
export default {
  name: "payment-empty",
  props:{
    title:{
      default:"暂无数据"
    }
  }
};
</script>

<style lang='less' scoped>
.payment-empty {
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
  justify-content: center;
  padding: 5rem 0;
}
img{
    width: 100px;
    height: 100px;
}
span{
    font-size: .4rem;
    color: #999;
}
</style>