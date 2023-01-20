<template>
  <div class="app">
    <Nav></Nav>
    <div class="contatiner">
      <div class="top">
        <transition-page>
          <router-view></router-view>
        </transition-page>
      </div>
    </div>
    <notification
    ref="notification"
    title="仲裁消息"
    button-text="前往处理"
    button-color="#237FF8"
    :message="`最近有 ${msgNum} 条消息待处理`"
    :headerIcon="icon"
    @buttonClick="$router.push({name:'arbitrationMsg'})"
    />

  </div>
</template>

<script>
import Nav from '@/components/Nav'

import transitionPage from '@/components/transitionPage'
import { getmessageopen } from '@/api/arbitrationMsg'
import Notification from '@/components/notification'

export default {
  name: 'home-index',
  components: {
    Nav,
    transitionPage,
    Notification,
  },

  data() {
    return {}
  },
  created() {
    this.getMsg()
  },
  methods: {
    getMsg() {
      getmessageopen().then((res) => {
        this.msgNum = res.items
        this.$nextTick(() => {
          this.$refs.notification.toggle(!!this.msgNum)
        })
      })
    },
  },
}
</script>
<style lang="less" scoped>
.app {
  width: 100vw;
  height: 100vh;
}
.popImg {
  width: 152px;
  position: absolute;
  top: -60px;
  left: 240px;
}
.popText {
  text-align: center;
  padding: 120px 0 40px;
}
</style>
