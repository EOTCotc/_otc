<template>
  <div class="content">
    <p class="title">身份认证</p>

    <van-cell-group :border="false" class="field">
      <van-field
        :border="false"
        v-model="name"
        readonly
        label="姓名"
        name="naem"
      />
      <van-field
        v-model="phone"
        :border="false"
        readonly
        type="number"
        name="phone"
        label="手机号"
      />
      <van-field
        :border="false"
        v-model="ID"
        readonly
        label="证件号"
        name="ID"
      />
    </van-cell-group>
    <p class="secondary">上传身份证</p>
    <div class="idcard">
      <van-image :src="fileList1" @click="preview(0)" fit="cover" alt="" />
      <van-image :src="fileList2" @click="preview(1)" fit="cover" alt="" />
    </div>
    <p class="secondary">上传手持证件照</p>
    <div class="hand">
      <van-image :src="fileList3" @click="preview(2)" fit="cover" alt="" />
    </div>
    <div class="footer">
      <p>打回原因</p>
      <span e class="hint">{{ hintText }}</span>
      <van-button round block color="#1B2945" :to="{ name: 'identity' }"
        >重新审核</van-button
      >
    </div>
  </div>
</template>

<script>
import { Toast, ImagePreview } from "vant";
import { UserInfo } from "@/utils/web3";
import { GetKycMes } from "@/api/trxRequest";
export default {
  name: "identity",
  data() {
    return {
      name: "",
      phone: "",
      ID: "",
      fileList1: "",
      fileList2: "",
      fileList3: "",
      hintText: "",
    };
  },
  mounted() {
    let userdata = UserInfo();
    this.name = userdata.uname;
    this.phone = userdata.uphone;
    this.ID = userdata.ucid;

    let errdata = localStorage.getItem("errdata");
    if (errdata != null && errdata != "") {
      errdata = JSON.parse(errdata);
      this.hintText = errdata.Msg;
      this.fileList1 = this.$store.state.url + errdata.Img1;
      this.fileList2 = this.$store.state.url + errdata.Img2;
      this.fileList3 = this.$store.state.url + errdata.Img3;
    }

    GetKycMes({})
      .then((date) => {
        let data = date.data;
        this.hintText = data.Msg;
        this.fileList1 = this.$store.state.url + data.Img1;
        this.fileList2 = this.$store.state.url + data.Img2;
        this.fileList3 = this.$store.state.url + data.Img3;
        let errdata = JSON.stringify(data);
        localStorage.setItem("errdata", errdata);
      })
      .catch((err) => {
        console.warn(err);
      });
  },
  methods: {
    preview(index) {
      ImagePreview({
        images: [this.fileList1, this.fileList2, this.fileList3],
        startPosition: index,
      });
    },
  },
};
</script>
<style lang="less" scoped>
.content {
  padding: 32px;
  /deep/.van-cell {
    padding-left: 0;
    padding-right: 0;
  }
  p {
    font-size: 28px;
    font-weight: bold;
  }
  .title {
    font-size: 40px;
    padding-bottom: 40px;
    position: relative;
    img {
      z-index: 5;
      position: absolute;
      width: 160px;
      right: 50px;
      top: -10px;
    }
  }

  .field {
    padding-bottom: 40px;
  }
  .secondary {
    padding-bottom: 30px;
  }
  .idcard {
    padding-bottom: 40px;
    display: flex;
    justify-content: space-between;
    /deep/.van-image {
      width: 324px;
      height: 204px;
      border-radius: 20px;
      overflow: hidden;
    }

  }
  .hand {
    padding-bottom: 40px;
    /deep/.van-image {
      width: 686px;
      height: 340px;
      border-radius: 20px;
      overflow: hidden;
    }
  }
  .footer {
    p {
      margin-bottom: 30px;
    }
    .hint {
      display: block;
      margin-bottom: 60px;
      color: #fc7542;
      font-size: 24px;
    }
  }
}
</style>>

