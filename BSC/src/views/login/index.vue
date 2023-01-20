
<template>
  <div class="content">
    <div class="logo">
      <img src="@/static/image/login.png" alt="" />
      <p>EOTC</p>
    </div>
    <div class="login">
      <div class="login_content">
        <div class="out" @click="asd()">
          <div :class="actionShow ? 'action' : ''">登录</div>
          <div :class="!actionShow ? 'action' : ''"></div>
          <!-- <div :class="!actionShow ? 'action' : ''">注册</div> -->
        </div>
        <Login @switched="asd()" ref="log" v-show="actionShow"></Login>
        <signin @switched="asd()" ref="sig" v-show="!actionShow"></signin>
      </div>
    </div>
  </div>
</template>

<script>
import Login from "@/components/Logcomponent/index.vue";
import signin from "@/components/Logcomponent/Signin.vue";
export default {
  components: {
    Login,
    signin,
  },
  data() {
    return {
      actionShow: true,
    };
  },
  mounted() {
    if (this.$route.query.pid != undefined) {
      this.actionShow=false
    }
  },
  methods: {
    asd() {
      // this.actionShow = !this.actionShow;
      //重置input输入
      if (this.actionShow) {
        this.$refs.log.email = "";
        this.$refs.log.verification = "";
      } else {
        this.$refs.sig.email = "";
        this.$refs.sig.verification = "";
        this.$refs.sig.address = "";
        this.$refs.sig.checked = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  min-height: 100vh;
  // overflow: hidden;
  background: #1b2945;
}
.logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 52px 0 88px 0;
  img {
    width: 144px;
    height: 144px;
  }
  p {
    margin-top: 20px;
    font-size: 46px;
    color: #e2ecff;
    font-weight: bold;
  }
}
.login {
  padding: 0 32px;
  .login_content {
    background: #fff;
    border-radius: 0px 20px 0px 0px;
    padding: 98px 32px 60px;
    position: relative;
    .out {
      width: 320px;
      height: 96px;
      background: #ffffff;
      box-shadow: 0px 6px 12px 2px rgba(204, 204, 204, 0.2);
      border-radius: 48px;
      position: absolute;
      top: -40px;
      left: 0;
      font-size: 40px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      div {
        width: 45%;
        height: 80%;
        text-align: center;
        line-height: 77px;
      }
      .action {
        color: #fff;
        background: #1b2945;
        border-radius: 48px;
      }
    }
  }
}
</style>