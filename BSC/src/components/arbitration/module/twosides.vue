<template>
  <div>
    <div class="accuserPapers" v-for="(item, index) in bothList" :key="index">
      <p v-if="item.accuserList" class="accuser">原告举证</p>
      <p v-else class="defendant">被告举证</p>
      <div v-if="item.accuserList">
        <div v-for="(item2, index2) in item.accuserList" :key="index2">
          <van-image
            v-if="item2.show"
            class="img"
            :src="item2.title"
            @click="preview(item2.title)"
            fit="cover"
            alt=""
          />
          <p v-else>{{ item2.title }}</p>
        </div>
      </div>
      <div v-else>
        <!-- <div v-if="item.defendantList.length != 0"> -->
          <div v-for="(item2, index2) in item.defendantList" :key="index2">
            <van-image
              v-if="item2.show"
              class="img"
              :src="item2.title"
              @click="preview(item2.title)"
              fit="cover"
              alt=""
            />
            <p v-else>{{ item2.title }}</p>
          <!-- </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ImagePreview } from "vant";
export default {
  //双方举证组件
  props: {
    bothList: {
      type: Array,
    },
  },
  data() {
    return {
      //   bothList: [
      //     {
      //       accuserList: [
      //         { title: require("@/static/image/456.png"), show: true },
      //         {
      //           title:
      //             "交易过程中账户被冻结，无法正常交易。核实电子回单查询密码: 12254",
      //           show: false,
      //         },
      //         { title: require("@/static/image/789.png"), show: true },
      //       ],
      //     },
      //     {
      //       defendantList: [
      //         { title: require("@/static/image/456.png"), show: true },
      //         {
      //           title:
      //             "交易过程中账户被冻结，无法正常交易。核实电子回单查询密码: 12254",
      //           show: false,
      //         },
      //         { title: require("@/static/image/789.png"), show: true },
      //       ],
      //     },
      //   ],
    };
  },
  methods: {
    preview(item) {
      ImagePreview({
        images: [item],
      });
    },
  },
};
</script>

<style lang="less" scoped>
.accuserPapers {
  background: #f3f4f5;
  padding: 92px 32px 30px;
  margin-bottom: 30px;

  border-radius: 20px;
  position: relative;
  .accuser {
    background: #4ea0f5;
    color: #fff;
    font-weight: bold;
    padding: 8px 24px;
    border-radius: 0 30px 30px 30px;
    position: absolute;
    top: 0;
    left: 0;
  }
  .defendant {
    background: #ec6f66;
    color: #fff;
    font-weight: bold;
    padding: 8px 24px;
    border-radius: 30px 0 30px 30px;
    position: absolute;
    top: 0;
    right: 0;
  }
  .img {
    width: 100%;
    height: 330px;
    overflow: hidden;
    margin-bottom: 20px;
    border-radius: 20px;
  }
  p {
    margin-bottom: 20px;
  }
}
</style>
