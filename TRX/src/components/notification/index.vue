<template>
  <van-overlay
    :show='show'
    @click='toggle(false)'>
    <div class='dialog_wrap'>
      <slot name='headerIcon'>
        <img
          class='dialog-header-icon'
          :src='headerIcon'
          alt='' />
      </slot>
      <div class='dialog-title'>{{ title }}</div>
      <div class='dialog-message'>{{ message }}</div>
      <div class='dialog-btn'>
        <van-button
          round
          block
          class='btn'
          :color='buttonColor'
          @click.stop='handleButtonClick'>
          {{ buttonText }}
        </van-button>
      </div>
      <div class='close'>
        <van-icon name='close' />
      </div>
    </div>
  </van-overlay>
</template>
<script>
export default {
  name: 'notification',
  props: {
    headerIcon: {type: String},
    title: {type: String},
    message: {type: String},
    buttonColor: {type: String},
    buttonText: {type: String},
    closeOnClick: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      show: false
    }
  },
  mounted() {
  },
  methods: {
    toggle(show) {
      this.show = show
      !show && this.$nextTick().then(() => this.$emit('closed'))
    },
    handleButtonClick() {
      this.$emit('buttonClick')
      this.closeOnClick && this.toggle(false)
    }
  }
}
</script>
<style scoped lang='less'>
.dialog_wrap {
  position: absolute;
  left: 50%;
  top: 40%;
  width: 80%;
  padding: 30px;
  transform: translateX(-50%);
  border-radius: 48px;
  box-sizing: border-box;
  background-color: #fff;

  .dialog-header-icon {
    display: block;
    width: 150px;
    margin: -80px auto 0;
  }

  .dialog-title {
    color: #333;
    font-size: 36px;
    font-weight: bold;
    margin-top: 30px;
    text-align: center;
  }

  .dialog-message {
    color: #333;
    font-weight: bold;
    font-size: 30px;
    margin-top: 20px;
    line-height: 1.3;
    text-align: center;
  }

  .dialog-btn {
    width: 60%;
    margin: 40px auto 0;
  }

  .close {
    position: absolute;
    left: 50%;
    bottom: -120px;
    transform: translate(-50%);
    color: #fff;
    font-size: 60px;
  }
}
</style>