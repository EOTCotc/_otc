<template>
  <div>
    <white :title="title"></white>
    <div class="content">
      <p>发起重新举证需满足以下一种条件</p>
      <van-radio-group v-model="radio">
        <van-radio name="1">举证不足，无法进行判决</van-radio>
        <van-radio name="2">部分举证不全</van-radio>
      </van-radio-group>
      <p class="title">申请延期说明</p>
      <van-field
        v-model="message"
        rows="1"
        autosize
        type="textarea"
        placeholder="请描述申请延期的说明"
      />
      <div class="button">
        <van-button
          round
          color="#1B2945"
          block
          :disabled="message == '' ? true : false"
          @click="submit"
          >提交</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import white from "@/components/Nav/white.vue";
import { Toast } from "vant";
export default {
  //发起重新举证
  components: {
    white,
  },
  data() {
    return {
      title: "发起重新举证",
      radio: "1",
      message: "",
    };
  },
  methods: {
    submit() {
      Toast.loading({
        message: "提交中...",
        forbidClick: true,
      });
      Toast.success('提交成功 3秒后返回');
      setTimeout(() => {
        this.$router.back()
      }, 3000);
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  font-size: 28px;
  padding: 32px;
  color: #333;
  p:first-child {
    margin-bottom: 30px;
  }
  /deep/.van-radio {
    margin-bottom: 30px;
  }
  .title {
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  /deep/.van-cell {
    border: 1px solid #c8cfde;
    border-radius: 20px;
  }
  /deep/.van-field__control {
    min-height: 300px;
  }
  .button {
    width: 90%;
    position: absolute;
    bottom: 100px;
    left: 36px;
  }
}
</style>
