
<template>
  <div class="">
    <Nav></Nav>
    <div class="contatiner">
      <div class="top">
        <router-view ></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import Nav from "@/components/Nav";

export default {
  name: "right",
  components: {
    Nav,
  },
   data(){
    return{
    }
  },
  mounted(){
  },
  methods:{
    
  }
};
</script>
<style lang="less" scoped>
.contatiner {
  width: 100%;
}
</style>