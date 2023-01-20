<template>
  <div>

    <van-nav-bar
      title="质押赎回"
      left-arrow
      :border="false"
      fixed
      placeholder
      @click-left="onClickLeft"
    />
    <div class="content">
      <van-field v-model="num" :border="false" label="赎回数量" placeholder="可赎回 0 EOTC">
        <template #extra>
          <p class="all">全部</p>
        </template>
      </van-field>
      <div class="buttBox">
        <van-button color="#1B2945" round block :disabled="num!=''?false:true" @click="redeem()">赎回</van-button>
      </div>
      <van-dialog
        v-model="show"
        title="赎回提示"
        :message="`质押六个月以后才可以赎回.`"
        confirm-button-text="我知道了"
        confirm-button-color="#1B2945"
      ></van-dialog>
    </div>
  </div>
</template>

<script>
import { Dialog } from 'vant'
export default {
  components: {
    [Dialog.Component.name]: Dialog.Component,
  },
  data() {
    return {
      num: '',
      show:false
    }
  },
  methods: {
    onClickLeft() {
      this.$router.back()
    },
   
    redeem() {
      this.show=true

    },
  },
}
</script>

<style lang="less" scoped>
/deep/.van-dialog__message--has-title {
  color: #fc7542;
}
.content {
  font-size: 28px;
  border-top: 20px solid #f3f4f5;
  .all {
    color: #237ff8;
  }
  .buttBox {
    width: 90%;
    margin: 120px auto 0;
  }
}
</style>
