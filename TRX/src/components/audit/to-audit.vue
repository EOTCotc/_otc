<template>
  <div class="not_content">
    <div v-if="list.length != 0">
      <div class="content" v-for="(item, index) in list" :key="index">
        <div class="cont_title">
          <p>{{ item.UserName }}</p>
          <p>提交时间:{{ item.Date }}</p>
        </div>
        <div class="number">
          <p>手机号: {{ item.Phone }}</p>
          <p>证件号: {{ item.CID }}</p>
        </div>
        <p>证件及手持证件照</p>
        <div class="imgs">
          <van-image
            class="left"
            :src="item.Img1"
            lazy-load
            @click="imgClick(item, 0)"
            fit="cover"
            alt=""
          >
            <div></div>
          </van-image>
          <van-image
            :src="item.Img2"
            lazy-load
            @click="imgClick(item, 1)"
            fit="cover"
            alt=""
          />
        </div>
        
        <van-image-preview
            v-model="imgShow"
            :images="images"
            :show-index="false"
          >
            <template v-slot:cover>
              <div
                v-if="previewShow"
                @click="imgShow = false"
                class="shade-left"
              ></div>
            </template>
          </van-image-preview>

        <div class="buttons">
          <van-button plain round type="info" @click="nopass(index)"
            >打回</van-button
          >
          <van-button round type="info" @click="sure(item, index)"
            >通过</van-button
          >
        </div>
      </div>
    </div>
    <div v-else>
      <van-empty class="null" image="error" description="暂没有审核内容" />
    </div>
    <van-popup
      round
      v-model="show"
      position="bottom"
      :style="{ height: '50%' }"
    >
      <van-picker
        title="打回原因"
        show-toolbar
        :columns="columns"
        :default-index="2"
        @confirm="onConfirm"
        @cancel="onCancel"
      />
    </van-popup>
  </div>
</template>

<script>
import { Toast, ImagePreview } from "vant";
import { EotcKyc } from "@/api/trxRequest";
export default {
  name: "to-audit",
  //待审核组件
  components: {
    [ImagePreview.Component.name]: ImagePreview.Component,
  },
  data() {
    return {
      show: false,
      columns: [
        "信息不全",
        "信息错误",
        "证件照片有误",
        "证件照片不清晰",
      ],
      list: [],
      index: null,
      count: false,

      imgShow: false,
      images: [],
      previewShow:false
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    nopass(index) {
      this.show = true;
      this.index = index;
    },
    onConfirm(value, index) {
      this.show = false;
      let data = this.list[this.index];
      EotcKyc({ uid: data.UID, kyc: -1, msg: value }).then((res) => {
        if (res.data.State > 0) {
          this.count = true;
          this.list.splice(this.index, 1);
        }
      });
    },
    onCancel() {
      this.show = false;
      Toast("取消");
    },
    imgClick(item, index) {
      if (index == 0) {
        this.previewShow = true;
        this.images = [item.Img1];
      } else {
        this.previewShow = false;
        this.images = [item.Img2];
      }
      this.imgShow = true;
    },
    init() {
      EotcKyc({}).then((data) => {
        let list = data.data;
        for (let i of list) {
          if (i.Kyc == 1) {
            i.Img1 = this.$store.state.url + i.Img1;
            i.Img2 = this.$store.state.url + i.Img2;
            i.Img3 = this.$store.state.url + i.Img3;
            this.list.push(i);
          }
        }
      });
    },
    sure(data, index) {
      let uid = data.UID;
      let kyc = 2;
      EotcKyc({ uid: uid, kyc: kyc }).then((res) => {
        if (res.data.State > 0) {
          this.count = true;
          this.list.splice(index, 1);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.not_content {
  padding: 24px;
  background: #f3f4f5;
  min-height: calc(100vh - 228px);
  .null {
    min-height: calc(100vh - 228px);
  }
  .content {
    padding: 22px 30px 40px;
    margin-bottom: 24px;
    background: #fff;
    font-size: 28px;
    color: #333;
    border-radius: 28px;
    .cont_title {
      display: flex;
      justify-content: space-between;
      margin-bottom: 52px;
      p:first-child {
        font-size: 32px;
        font-weight: bold;
      }
      p:last-child {
        color: #999;
      }
    }
    .number {
      margin-bottom: 30px;
      p:first-child {
        margin-bottom: 16px;
      }
    }
    .imgs {
      padding: 16px 0 40px;
      display: flex;
      justify-content: space-around;
      /deep/.van-image {
        width: 284px;
        height: 190px;
        border-radius: 10px;
        overflow: hidden;
      }
      .right {
        position: relative;
        div {
          width: 60%;
          height: 100%;
          -webkit-backdrop-filter: blur(8px);
          backdrop-filter: blur(8px);
          position: absolute;
          right: 0;
          top: 0;
        }
      }
      .left {
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
    }
    .buttons {
      display: flex;
      justify-content: space-around;
      /deep/.van-button--normal {
        padding: 0 96px;
      }
    }
  }
}
// .cover {
//   width: 100vw;
//   height: 100vh;
//   color: #fff;
//   font-size: 100px;
//   opacity: 50%;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   p {
//     transform: rotate(-30deg);
//   }
// }
.shade-right {
  position: absolute;
  left: 40vw;
  width: 60vw;
  height: 100vh;
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
}
.shade-left {
  width: 60vw;
  height: 100vh;
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
}
</style>>