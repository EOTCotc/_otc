<template>
  <div class="content">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多信息了"
      @load="onLoad"
    >
      <div class="listbox">
        <div class="top">
          <div :class="proofStatic == 0 ? '' : 'top-left'">
            <van-icon name="underway-o" />
            <p v-if="proofStatic == 0">等待仲裁结果</p>
            <p v-else>
              <van-count-down :time="time" format="DD 天 HH 时 mm 分 " />
            </p>
          </div>
          <p>2022.05.26 12:54</p>
        </div>
        <div class="van--bottom"></div>
        <both
          :leftnaem="details.leftnaem"
          :rightname="details.rightname"
          :lefturl="details.lefturl"
          :righturl="details.righturl"
          :wang="details.wang"
          :bankShow="false"
          :planShow="false"
        ></both>
        <div class="text">原告卖家发起仲裁，仲裁事件为账户冻结</div>

        <div v-if="proofStatic == 1" class="buttons">
          <van-button type="info" plain round :to="{ name: 'adjourn' }"
            >申请延期</van-button
          >
          <van-button type="info" round :to="{ name: 'forArbitrationDetails' }">
            <van-icon name="orders-o" />
            仲裁详情</van-button
          >
        </div>
        <div v-else class="details">
          <van-cell
            icon="orders-o"
            title="仲裁详情"
            is-link
            :to="{ name: 'forArbitrationDetails' }"
          />
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
import both from "@/components/arbitration/module/both.vue";
export default {
  //待仲裁
  components: {
    both,
  },
  data() {
    return {
      details: {
        leftnaem: "吴敏",
        rightname: "王晓雷",
        lefturl: require("@/static/image/usdt.svg"),
        righturl: require("@/static/image/usdc.svg"),
        wang: 3,
      },
      // 列表状态
      proofStatic: 1,//0:等待仲裁结果 1：举证可延期 2：举证不可延期
      time: 72 * 60 * 60 * 1000,

      list: [],
      loading: false,
      finished: false,
    };
  },
  methods: {
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1);
        }

        // 加载状态结束
        this.loading = false;

        // 数据全部加载完成
        if (this.list.length >= 40) {
          this.finished = true;
        }
      }, 1000);
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  padding: 24px;
}
.listbox {
  padding: 32px 32px 40px;
  background: #fff;
  border-radius: 20px;
  font-size: 28px;
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    .top-left {
      color: #237ff8;
      /deep/.van-count-down {
        color: #237ff8;
      }
    }
    div {
      display: flex;
      align-items: center;
      font-size: 32px;
      font-weight: bold;
      i {
        font-size: 48px;
      }
      p {
        margin-left: 12px;
      }
    }
  }
  .van--bottom {
    border-bottom: 1px #f3f4f5 solid;
    margin-bottom: 30px;
  }
  .text {
    padding: 24px;
    background: #f3f4f5;
    border-radius: 0px 20px 20px 20px;
  }
  .details {
    /deep/.van-cell {
      padding-left: 0;
      margin-top: 20px;
    }
    /deep/.van-cell__left-icon {
      color: #237ff8;
    }
    /deep/.van-cell__title {
      color: #237ff8;
    }
  }
  .buttons {
    margin-top: 30px;
    display: flex;
    justify-content: space-between;
    button {
      width: 45%;
    }
  }
}
</style>
