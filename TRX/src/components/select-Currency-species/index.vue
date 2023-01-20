<template>
  <div class="payType" size="small" @click="changeIcon">
    {{ payType }}
        <van-icon :name="showCurrencyType ? 'arrow-up':'arrow-down'"/>
  </div>
</template>

<script>
export default {
  name: "select-Currency-species",
  props: {
    payType: {
      default: "CNY",
    },
    showCurrencyType:{
        default:false
    }
  },
  methods:{
      changeIcon(){
          this.$emit('show-currency-type')
      }
  }
};
</script>

