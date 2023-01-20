<template>
  <div>
    <white :title="title"></white>
    <div class="content">
      <div class="text">
        <p>文字信息举证</p>
        <van-field
          v-model="message"
          rows="2"
          :autosize={maxHeight:192}
          type="textarea"
          maxlength="3000"
          placeholder="描述具体情况及提供仲裁员可核实情况所需信息"
          show-word-limit
        />
        <p>如提交相关查询密码请注意保证个人资产安全</p>
      </div>
      <div class="image">
        <p>图片信息举证</p>
        <van-uploader
          v-model="fileList"
          :after-read="afterRead"
          preview-size=100
          :max-count="6"
        />
        <p>
          特别提示:
          伪造变造打款凭证是严重违法行为，请确保提交证据为真实有效的信息
        </p>
      </div>
      <div class="stance">

      </div>
      <div class="button">
        <van-button color="#1B2945" round block>提交</van-button>
    </div>
    </div>
    
  </div>
</template>

<script>
import white from "@/components/Nav/white.vue";
export default {
  //追加举证
  components: {
    white,
  },
  data() {
    return {
      title: "追加举证",
      message: "",
      fileList: [],
    };
  },
  methods: {
    afterRead(file) {
      // 此时可以自行将文件上传至服务器
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  padding: 32px 32px 60px;
  font-size: 28px;
  .text {
    margin-bottom: 40px;
    p:first-child {
      font-size: 32px;
      margin-bottom: 20px;
    }
    /deep/.van-cell {
      border: 1px solid #c8cfde;
      border-radius: 20px;
    }
    p:last-child {
      margin-top: 20px;
      color: #999;
    }
  }
  .image {
    p:first-child {
      font-size: 32px;
      margin-bottom: 20px;
    }
    p:last-child{
        margin-top: 60px;
        color: #FC7542;
    }
  }
  .button{
    width: 90%;
    position: fixed;    
    bottom: 60px;
    left: 5%;
  }
  .stance{
    width: 100%;
    height: 156px;
  }
}
</style>