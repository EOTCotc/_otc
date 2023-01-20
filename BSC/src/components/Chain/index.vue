<!-- 
 * @Author: webQDI svb1474155018@163.com
 * @Date: 2022-05-25 15:00
 * @update 2022-05
 * @LastEditTime: 
 * @FilePath: \etoc514\src\views\rightItem\chain.vue
 -->

<template>
  <div class="content">
    <p>账号信息</p>
    <div class="text">
      <van-cell
        v-for="(item, key) in chainList"
        :key="key"
        :title="item"
        @click="showPopup(item)"
      >
        <van-icon name="arrow" v-if="item.label != ''" />
      </van-cell>
    </div>
  </div>
</template>

<script>
import { MemberWallet } from "@/api/trxRequest";
export default {
  data() {
    return {
      chainList: [],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    showPopup(item) {
      if (item.toLowerCase() == localStorage.getItem("netType")) {
        this.$router.push({
          name: "chainDetails",
          params: { addressItem: item },
        });
      }else{
        this.$router.push({
          name: "chainOther",
          params: { addressItem: item },
        });
      }
    },
    init() {
      MemberWallet({ uid: localStorage.getItem("uid"), net: "" }).then(
        (res) => {
          let data = res.data;
          let list = [];
          for (let i of data) {
            list.push(i.net);
          }
          for (let j = 0; j < list.length; j++) {
            list[j] = list[j].toUpperCase();
          }
          list = new Set(list);
          this.chainList = list;
        }
      );
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  padding-top: 32px;

  p {
    margin: 0;
    padding: 0 32px 32px;
    font-size: 40px;
    font-weight: bold;
    color: #1b2945;
  }

  .text {
    font-size: 28px;
    color: #333 !important;

    .van-cell {
      align-items: center;
    }

    .pop {
      background: #ffffff;
      border-color: #fff;
      font-weight: bold;
      color: #333333;
      .popupItems {
        padding: 32px;
      }
      .popupItem {
        padding: 20px 32px;
        background-color: #f3f4f5;
        border-radius: 16px;
      }
      .popupItem:not(:last-of-type) {
        margin-bottom: 20px;
      }

      .popupTop {
        text-align: center;
        font-size: 36px;
        line-height: 48px;
        font-weight: 700;
        padding: 24px 32px;
        border-bottom: 1px solid #f3f4f5;

        .popupCancel {
          text-align: left;
          color: #666666;
          font-size: 28px;
        }

        .popupAscertain {
          font-size: 28px;
          text-align: right;
          color: #1b2945;
        }
      }

      //   position: relative;
      .convention {
        height: 32%;
      }

      .convention:last-child {
        margin-top: 10px;
      }
    }
  }
}
</style>