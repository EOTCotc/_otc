<template>
  <van-cell center>
    <template #icon>
      <span class="aut-img">西</span>
    </template>
    <template>
      <div class="merchant-info1">西红柿首付</div>
    </template>
    <template #right-icon v-if="!(activeName === 'blacklist')">
      <van-button
        v-if="!is_Attention"
        class="btn-Attention"
        type="info"
        round
        size="small"
        icon="plus"
        @click="Attention"
      >
        关注TA
      </van-button>
      <van-button
        v-else
        class="btn-Attention"
        round
        size="small"
        @click="cancel_Attention"
      >
        已关注
      </van-button>
    </template>

    <template #right-icon v-else>
      <van-button
        class="btn-Attention"
        round
        size="small"
        icon="delete"
        @click="cancel_Attention"
      >
        移除
      </van-button>
    </template>
  </van-cell>
</template>

<script>
export default {
  name: "importantList",
  props: {
    activeName: {
      require: true,
      default: "concern",
    },
  },
  data() {
    return {
      is_Attention: false,
    };
  },
  methods: {
    Attention() {
      this.is_Attention = true;
    },
    cancel_Attention() {
      this.$dialog
        .confirm({
          title: "移除黑名单",
          message: "<span class='activeInfo'>确认将该商家移除黑名单？</span>",
        })
        .then(() => {
          // on confirm
        })
        .catch(() => {
          // on cancel
        });
    },
  },
};
</script>

<style lang="less" scoped>
.van-cell {
  padding: 0.4rem;
}

.aut-img {
  width: 0.75rem;
  height: 0.75rem;
  line-height: 0.75rem;
  background-color: var(--main--color);
  color: #fff;
  border-radius: 50%;
  text-align: center;
  margin-right: 15px;
}
.merchant-info1 {
  font-weight: 700;
}
.merchant-info2 {
  color: var(--main-test-color);
}
.btn-Attention {
  width: 2.2rem;
}
.order-info {
  padding: 30px;
  font-size: 0.4rem;
  font-weight: 700;
  display: flex;
  justify-content: space-between;
  box-shadow: 0 1.5px 1.5px 1px #eee;
  align-items: center;
  .btn-order {
    background-color: #eee;
  }
  button {
    margin-right: 30px;
    width: 1.3rem;
    color: #999;
  }
}
</style>
