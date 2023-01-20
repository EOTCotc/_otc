<template>
  <router-view v-if="isRouterAlive"></router-view>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      isRouterAlive: true,
    };
  },
  provide() {
    return {
      reload: this.reload,
    };
  },
  created() {
    if (this.bug < 0) {
      setInterval(() => {
        this.reload();
      });
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        this.isRouterAlive = true;
      });
    },
  },
};
</script>

<style lang="less">
:root {
  --main--color: #2483ff;
  --main-test-color: rgb(177, 177, 177);
  --icon-size: 0.5rem;
}
</style>

<style lang="less">
::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

.van-pull-refresh {
  overflow: hidden;
  user-select: text !important;
}

html,
body {
  font-family: "PingFang SC", "Microsoft YaHei", "SimHei", "Arial", "SimSun" !important;
}

p {
  margin: 0;
}

.xj_moeny {
  width: 38px;
  height: 38px;
}
.pay-iconyhk {
  color: rgb(251, 159, 68);
  font-size: var(--icon-size);
}

.pay-iconwx {
  color: rgb(76, 180, 63);
  font-size: var(--icon-size);
}
.pay-iconzfb {
  color: rgb(78, 157, 252);
  font-size: var(--icon-size);
}
.min-width {
  min-width: 80vw !important;
  .el-message__content {
    line-height: 40px;
  }
}

.Vue-Toastification__container.top-center .Vue-Toastification__toast {
  margin-left: auto;
  margin-right: auto;
  margin-top: 40px;
}
.Vue-Toastification__container.bottom-right .Vue-Toastification__toast {
  margin-left: auto;
}

// @media only screen and (max-width: 600px) {
//   .Vue-Toastification__container .Vue-Toastification__toast {
//     width: 60% !important;
//   }
// }

.Vue-Toastification__toast-body {
  line-height: 100% !important ;
  font-size: 0.35rem !important;
}

.Vue-Toastification__close-button {
  font-size: 0.5rem !important;
}
.Vue-Toastification__toast {
  align-items: center !important;
}
.Vue-Toastification__icon {
  width: 0.8rem !important;
}
.bottom-right {
  .Vue-Toastification__toast {
    width: 55% !important;
  }
}

.activeInfo {
  color: red !important;
  font-weight: 700;
  line-height: 50px;
}

.toast {
  display: flex;
  align-items: center;
  .vue-loading {
    width: 40px;
    margin-right: 25px;
  }
  .main {
    flex: 1;
    font-size: 0.35rem;
    line-height: 40px;
  }
}
.mask {
  position: relative;
  filter: blur(10px);
  user-select: none;
}

/* 换一换 图标动画 */
.rotate-center {
  -webkit-animation: rotate-center 0.6s linear both;
  animation: rotate-center 0.6s linear both;
}

@-webkit-keyframes rotate-center {
  0% {
    -webkit-transform: rotate(0);
    transform: rotate(0);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes rotate-center {
  0% {
    -webkit-transform: rotate(0);
    transform: rotate(0);
  }
  100% {
    -webkit-transform: rotate(540deg);
    transform: rotate(540deg);
  }
}
</style>
