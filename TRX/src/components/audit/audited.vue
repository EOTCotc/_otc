<template>
  <div>
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
            <img v-if="item.Kyc == 2" src="@/static/image/pass.png" alt="" />
            <img v-else src="@/static/image/nopass.png" alt="" />
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
            >
            </van-image>
          </div>
          <van-image-preview
            v-model="imgShow"
            :images="images"
            :show-index="false"
          >
            <template v-slot:cover>
              <div
                v-if="show"
                @click="imgShow = false"
                class="shade-left"
              ></div>
            </template>
          </van-image-preview>
          <div class="time">
            <div v-if="item.Kyc != 2">
              <p>打回原因</p>
              <p>{{ item.Msg }}</p>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <van-empty class="null" image="error" description="暂没有审核内容" />
      </div>
    </div>
  </div>
</template>

<script>
import { EotcKyc } from "@/api/trxRequest";
import { Toast, ImagePreview } from "vant";
// import { Image as VanImage } from 'vant';
export default {
  name: "audited",
  //已审核
  components: {
    [ImagePreview.Component.name]: ImagePreview.Component,
  },
  data() {
    return {
      list: [],

      imgShow: false,
      images: [],
      show: false,
    };
  },
  mounted() {

    this.init();
  },
  methods: {
    imgClick(item, index) {
      if (index == 0) {
        this.show = true;
        this.images = [item.Img1];
      } else {
        this.show = false;
        this.images = [item.Img2];
      }
      console.log(this.show);
      this.imgShow = true;
    },
    init() {
      EotcKyc({}).then((data) => {
        this.list = [];
        let list = data.data;
        for (let i of list) {
          if (i.Kyc != 1) {
            i.Img1 = this.$store.state.url + i.Img1;
            i.Img2 = this.$store.state.url + i.Img2;
            i.Img3 = this.$store.state.url + i.Img3;
            this.list.push(i);
          }
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
      position: relative;
      img {
        width: 200px;
        position: absolute;
        right: 0;
        top: -20px;
      }
      p:first-child {
        margin-bottom: 16px;
      }
    }
    .imgs {
      padding: 16px 0 28px;
      display: flex;
      justify-content: space-around;
      /deep/.van-image {
        width: 284px;
        height: 190px;
        border-radius: 10px;
        overflow: hidden;
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
      .right {
        position: relative;
        div {
          width: 40%;
          height: 100%;
          -webkit-backdrop-filter: blur(8px);
          backdrop-filter: blur(8px);
          position: absolute;
          right: 0;
          top: 0;
        }
      }
    }
    .time {
      .shtime {
        color: #999;
        padding-bottom: 30px;
      }
      div {
        p:first-child {
          padding-bottom: 16px;
        }
        p:last-child {
          color: #fc7542;
        }
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
</style>