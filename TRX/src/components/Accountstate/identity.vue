<template>
  <div class="content">
    <p class="title">身份认证</p>
    <van-form
      v-if="homeShow"
      validate-first
      @failed="onFailed"
      @submit="onSubmit"
    >
      <van-cell-group class="field" :border="false">
        <van-field
          v-model="name"
          :border="false"
          label="姓名"
          name="naem"
          placeholder="请输入真实姓名"
          :rules="[{ validator: nameRule, message: '长度至少为三个字母' }]"
        />
        <van-field
          v-model="phone"
          :border="false"
          type="number"
          name="phone"
          label="手机号"
          maxlength="11"
          placeholder="请输入手机号码"
          :rules="[{ validator: phoneRule, message: '请输入正确的手机号' }]"
        />
        <van-field
          v-model="ID"
          :border="false"
          label="证件号"
          name="ID"
          maxlength="18"
          placeholder="请输入证件号码"
          :rules="[{ validator: IDRule, message: '请输入正确的证件号码' }]"
        />
      </van-cell-group>
      <van-button round block native-type="submit" color="#1B2945"
        >下一步</van-button
      >
    </van-form>
    <div v-else-if="personShow">
      <p class="secondary">示例图片</p>
      <div class="sample">
        <img src="@/static/sample-picture/obverse.png" alt="" />
      </div>

      <p class="secondary">上传身份证人像面</p>
      <div class="idcard">
        <van-uploader
          multiple
          v-model="fileList"
          name="1"
          :after-read="afterRead"
          :max-count="1"
        >
          <template #default>
            <div class="upload">
              <div class="upload_text">
                <i class="iconfont icon-paizhao"></i>
                <p>点击上传人像面</p>
              </div>
            </div>
          </template>
        </van-uploader>
        <p class="hint">*请按照示例图来上传身份证人像面照片</p>
      </div>
      <div class="audit" v-if="url != ''">
        <van-image
          class="left"
          @click="imgStatic(0)"
          :src="url"
          fit="cover"
          alt=""
        >
          <div></div>
        </van-image>
        <van-image
          class="right"
          @click="imgStatic(1)"
          :src="url"
          fit="cover"
          alt=""
        >
          <div></div>
        </van-image>
        <van-notice-bar
          wrapable
          :scrollable="false"
          text="您上传的身份证照片进行局部模糊后，将由不同的节点审核。"
        />

        <van-image-preview
          v-model="imgShow"
          :images="images"
          :show-index="false"
        >
          <template v-slot:cover>
            <div
              @click="imgShow = false"
              :class="show ? 'shade-left' : 'shade-right'"
            ></div>
          </template>
        </van-image-preview>
      </div>

      <van-button
        round
        block
        color="#1B2945"
        :disabled="fileList.length != 0 ? false : true"
        @click="updata(fileList)"
        >下一步</van-button
      >
    </div>
    <div v-else-if="countryShow">
      <p class="secondary">示例图片</p>
      <div class="sample">
        <img src="@/static/sample-picture/reverse.png" alt="" />
      </div>

      <p class="secondary">上传身份证国徽面</p>
      <div class="idcard">
        <van-uploader
          multiple
          v-model="fileList1"
          name="2"
          :after-read="afterRead"
          :max-count="1"
        >
          <template #default>
            <div class="upload">
              <div class="upload_text">
                <i class="iconfont icon-paizhao"></i>
                <p>点击上传国徽面</p>
              </div>
            </div>
          </template>
        </van-uploader>
        <p class="hint">*请按照示例图来上传身份证国徽面照片</p>
      </div>
      <van-button
        round
        block
        color="#1B2945"
        :disabled="fileList1.length != 0 ? false : true"
        @click="updata(fileList1)"
        >下一步</van-button
      >
    </div>
    <div v-else-if="handShow">

      <p class="secondary">示例图片</p>
      <div class="sample">
        <img src="@/static/sample-picture/hand.png" alt="" />
      </div>

      <p class="secondary">上传手持证件照</p>
      <div class="idcard">
        <van-uploader
          multiple
          v-model="fileList2"
          name="3"
          :after-read="afterRead"
          :max-count="1"
        >
          <template #default>
            <div class="upload">
              <div class="upload_text">
                <i class="iconfont icon-paizhao"></i>
                <p>点击上传手持证件照</p>
              </div>
            </div>
          </template>
        </van-uploader>
        <p class="hint">*请按照示例图来上传手持身份证照片</p>
      </div>
      <!-- <div class="footer"> -->
      <van-button
        round
        block
        color="#1B2945"
        :disabled="fileList2.length != 0 ? false : true"
        @click="updata(fileList2)"
        >提交</van-button
      >
      <!-- </div> -->
    </div>
  </div>
</template>

<script>
import { Toast, Notify, ImagePreview } from "vant";
import { SetUID, Update } from "@/api/trxRequest";
import { userSign } from "@/utils/web3";
export default {
  name: "identity",
  components: {
    [ImagePreview.Component.name]: ImagePreview.Component,
  },
  data() {
    return {
      name: "",
      phone: "",
      ID: "",
      fileList: [],
      fileList1: [],
      fileList2: [],

      homeShow: true,
      personShow: false,
      countryShow: false,
      handShow: false,

      sign: "",

      url: "",
      images: [],
      imgShow: false,
      show: false,
    };
  },
  mounted() {
    //签名
    this.sign = localStorage.getItem("mysign");
    if (this.sign == null || this.sign == "") {
      userSign(window.signMes, null);
    }
  },
  methods: {
    afterRead(File) {
      this.$reduce(File, 0).then((data) => {
        File.file = data.fileZip;
        this.url = data.base64;
        this.images = [data.base64];
      });
    },
    nameRule(val) {
      return /^.{2,20}$/.test(val);
    },
    phoneRule(val) {
      let num = val.length;
      if (num > 4 && num < 11) {
        return true;
      } else if (num == 11) {
        return /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(
          val
        );
      } else {
        return false;
      }
    },
    IDRule(val) {
      let num = val.length;
      if (num > 6 && num < 19) {
        return true;
      } else if (num == 18) {
        return /^[1-8]{2}[0-9]{4}[0-9]{4}((0[1-9]{1})|(1[0-2]{1}))((0[1-9]{1})|(1[0-9]{1})|(2[0-9]{1})|(3[0-1]{1}))[0-9]{3}[0-9xX]{1}$/.test(
          val
        );
      } else {
        return false;
      }
    },
    //表单验证失败
    onFailed(errorInfo) {
      Toast.fail(errorInfo.errors[0].message);
    },
    // 表单验证成功
    onSubmit(values) {
      Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: "加载中",
      });
      SetUID({
        username: this.name,
        myzd: this.phone,
        ccid: this.ID,
        sign: this.sign,
      })
        .then((data) => {
          let datas = data.data.State;
          if (datas != "-1") {
            Toast.clear();
            this.homeShow = false;
            this.personShow = true;
          } else {
            Toast.clear();
            Notify({ type: "danger", message: "证件号码已被认证" });
          }
        })
        .catch((err) => {});
    },
    updata(item) {
      Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: "加载中",
      });
      let yanzheng;
      if (this.personShow) {
        yanzheng = 1;
      } else if (this.countryShow) {
        yanzheng = 2;
      } else if (this.handShow) {
        yanzheng = 3;
      }

      var fd = new FormData();
      fd.append("uid", localStorage.getItem("uid"));
      fd.append("ctype", yanzheng);
      fd.append("proof", item[0].file);
      fd.append("sign", this.sign);

      Update(fd).then((res) => {
        Toast.clear();
        let state = res.data.State;
        if (state != "x") {
          if (yanzheng == 1) {
            this.personShow = false;
            this.countryShow = true;
          }
          if (yanzheng == 2) {
            this.countryShow = false;
            this.handShow = true;
          }
          if (yanzheng == 3) {
            this.$router.push({ name: "index" });
          }
        } else {
          Toast.fail("请重新提交");
        }
      });
    },
    imgStatic(index) {
      if (index == 0) {
        this.show = true;
      } else {
        this.show = false;
      }
      this.imgShow = true;
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
  }

  .field {
    padding-bottom: 40px;
  }
  .secondary {
    padding-bottom: 30px;
  }
  .sample {
    display: flex;
    justify-content: center;
    margin-bottom: 30px;
    img {
      width: 80%;
    }
  }
  .idcard {
    padding-bottom: 40px;
    /deep/.van-uploader__preview-image {
      width: 686px;
      height: 340px;
    }
    /deep/.van-uploader__preview {
      margin: 0;
    }
    .hint {
      margin-top: 10px;
      font-weight: normal;
      color: #fc7542;
    }
    .upload {
      width: 686px;
      height: 340px;
      border: 1px dashed #eeeeee;
      border-radius: 20px;
      font-size: 24px;
      display: flex;
      justify-content: center;
      align-items: center;
      .upload_text {
        text-align: center;
        color: #999;
        i {
          font-size: 48px;
        }
        p {
          margin-top: 14px;
          font-weight: normal;
        }
      }
    }
  }
  .audit {
    margin-bottom: 30px;
    .left,
    .right {
      border-radius: 10px;
      overflow: hidden;
    }
    .left {
      width: 200px;
      margin-right: 20px;
      position: relative;
      div {
        width: 60%;
        height: 100%;
        -webkit-backdrop-filter: blur(8px);
        backdrop-filter: blur(8px);
        position: absolute;
        top: 0;
      }
    }
    .right {
      width: 200px;
      position: relative;
      div {
        width: 40%;
        height: 100%;
        -webkit-backdrop-filter: blur(8px);
        backdrop-filter: blur(8px);
        position: absolute;
        top: 0;
        right: 0;
      }
    }
  }
}
.shade-left {
  width: 60vw;
  height: 100vh;
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
}
.shade-right {
  position: absolute;
  left: 40vw;
  width: 40vw;
  height: 100vh;
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
}
</style>>

