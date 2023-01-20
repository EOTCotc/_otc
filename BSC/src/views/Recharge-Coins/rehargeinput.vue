<template>
  <div class="reharge-input van-button--round">
    <van-popover
      v-model="showPopover"
      trigger="click"
      @select="select_coin"
      :actions="actions"
    >
      <template #reference>
        <span class="t-log">
          <img :src="action.icon" alt="" /> {{ action.text }}
        </span>
      </template>
    </van-popover>
    <van-field
      :style="{ marginLeft: '20px' }"
      v-model="number"
      @input="onInput"
      type="number"
      placeholder="Min. ￥0.00"
    />
  </div>
</template>

<script>
export default {
  name: "reharge-input",
  props: ["action"],
  data() {
    return {
      showPopover: false,
      number: "",
      actions: [
        { text: "USDT", icon: require("@/static/image/usdt.svg") },
        { text: "TRX", icon: require("@/static/image/trx.svg") },
      ],
    };
  },
  methods: {
    select_coin(item) {
        this.$emit('change-Type',item)
      this.number = "";
    },
    onInput(num) {
      this.$emit("num-input", num);
    },
    clearNum() {
      this.number = "";
    },
  },
};
</script>

<style lang="less" scoped>
.reharge-input {
  background-color: #fff;
  margin: 0 0.4rem;
  height: 1rem;
  line-height: 1rem;
  display: flex;
  padding: 12px 0.5rem 12px 20px;
  /deep/ .van-icon__image {
    width: 1.3rem;
    height: 1.3rem;
  }

  .t-log {
    img {
      width: 0.8rem;
      height: 0.8rem;
    }
    display: flex;
    align-items: center;
    text-indent: 10px;
    position: relative;
  }
  .t-log::after {
    content: "";
    display: block;
    border-left: 10px solid transparent;
    border-top: 14px solid rgb(95, 78, 78);
    border-bottom: 10px solid transparent;
    border-right: 10px solid transparent;
    position: absolute;
    right: -20%;
    transform: translateY(-25%);
    top: 50%;
  }
}
</style>
