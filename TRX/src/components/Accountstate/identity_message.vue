<template>
  <div class="content">
    <div class="title">
      <p class="bold">身份信息</p>
      <van-button size="small" round type="info" @click="jump()">信用评分:{{grade}}</van-button>
    </div>
    <div>
      <div v-for="(item, index) in list" :key="index" class="cell_flex">
        <p>{{ item.title }}</p>
        <p>{{ item.data }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { UserInfo } from "@/utils/web3";
export default {
  name: "identity_message",
  data() {
    return {
      list: [
        { title: "姓名", data: "陈粒" },
        { title: "邮箱", data: "13445692541@qq.com" },
        { title: "手机号", data: "13445692541" },
        { title: "证件号", data: "435896155245878" },
        { title: "推荐人", data: "李弥" },
        // { title: "审核节点", data: "ADD" },
      ],
      grade:''
    };
  },
  mounted(){
    let data=UserInfo()
    this.list[0].data=data.uname
    this.list[1].data=data.email
    this.list[2].data=data.uphone
    this.list[3].data=data.ucid
    this.list[4].data=data.parentID
    this.grade=data.myjifen
    // this.list[5].data=data.uname
  },
  methods:{
    jump(){

      // this.$router.push({name:'credit'})
    }
  },

};
</script>

<style lang="less" scoped>
.content {
  padding: 32px;
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
    p {
      font-size: 50px;
      font-weight: bold;
    }
    /deep/.van-button--small {
      padding: 0 40px;
      font-size: 28px;
    }
  }
  .cell_flex {
    height: 96px;
    display: flex;
    align-items: center;
    font-size: 28px;
    color: #333;
    p:first-child {
      //   margin-right: 80px;
      text-align: justify;
      width: 200px;
      font-weight: bold;
    }
  }
}
</style>>
