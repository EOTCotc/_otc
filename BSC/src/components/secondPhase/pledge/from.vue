<template>
  <div>
    <white :title="title"></white>
    <div class="content">
      <van-field v-model="uid" readonly label="质押账户" />
      <van-field v-model="gross" label="EOTC总量" readonly />

      <van-field
        readonly
        name="picker"
        :value="value"
        label="质押期限"
        placeholder="请选择"
        @click="showPicker = true"
      />
      <van-popup v-model="showPicker" position="bottom">
        <van-picker
          show-toolbar
          :columns="column"
          @confirm="onConfirm2"
          @cancel="showPicker = false"
        />
      </van-popup>

      <van-field v-model="number" type="number" label="质押数量" placeholder="请输入质押数量">
        <template #right-icon>
          <p>EOTC</p>
        </template>
        <template #extra>
          <p class="type" @click="show = true">{{ type }}</p>
        </template>
      </van-field>
      <div class="hint">提示: 质押6个月年化收益24%，质押12个月年化收益36%,质押24个月年化收益50%，质押36个月年化收益60%</div>
    </div>
    <div class="botton">
      <van-button
        block
        round
        color="#1B2945"
        @click="sumbit"
        :disabled="
          gross != '' && number != ''&&index!=0  ? false : true
        "
      >提交</van-button>
    </div>

    <van-popup round v-model="show" position="bottom" :style="{ height: '50%' }">
      <van-picker
        title="选择节点类型"
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
import white from '@/components/Nav/white.vue'
import { Toast } from 'vant'
import { StakingEotc } from '@/api/trxRequest'
export default {
  //质押表单
  components: {
    white,
  },
  data() {
    return {
      title: '交易质押',
      //质押账户
      uid: '',
      //数量
      number: '',

      type: '节点类型',
      show: false,
      columns: [
        '有效用户 100EOTC',
        '有效用户 1000EOTC',
        '信用节点 5000EOTC',
        '实时节点 10000EOTC',
        '中级节点 50000EOTC',
        '高级节点 100000EOTC',
      ],

      buttonShow: false,

      //EOTC总量
      gross: '',

      value: '',
      column: ['6个月', '12个月', '24个月', '36个月'],
      showPicker: false,
      index: 0,
    }
  },
  mounted() {
    this.uid = localStorage.getItem('uid')
    this.gross = localStorage.getItem('eotc_stake')
  },
  watch: {
    number(newName, old) {
      console.log(newName)
      if (newName < 0) {
        Toast.fail('请输入有效的质押数量')
        this.number = ''
      } else if (newName > Number(this.gross)) {
        Toast.fail('您的EOTC余额不足')
        this.number = ''
      }
      if (newName >= 100 && newName < 5000) {
        this.type = '有效用户'
      } else if (newName >= 5000 && newName < 10000) {
        this.type = '信用节点'
      } else if (newName >= 10000 && newName < 50000) {
        this.type = '实时节点'
      } else if (newName >= 50000 && newName < 100000) {
        this.type = '中级节点'
      } else if (newName >= 100000) {
        this.type = '高级节点'
      } else {
        this.type = '节点类型'
      }
    },
  },
  methods: {
    sumbit() {
      StakingEotc({ num: this.number, zq: this.index }).then((res) => {
        let data = res.data
        if (data.State < 0) {
          this.$toast.warning('质押失败！')
        } else {
          this.$toast.success('质押成功！')
          this.gross = this.gross - this.number
          let num = (Number(localStorage.getItem('otczy')) + Number(this.number)).toFixed(2)
          localStorage.setItem('otczy', num)
          localStorage.setItem('eotc_stake', this.gross)
        }
        console.log(res)
      })
    },

    onConfirm(value, index) {
      this.show = false
      switch (index) {
        case 0:
          this.number = 100
          this.type = '有效用户'
          break
        case 1:
          this.number = 1000
          this.type = '有效用户'
          break
        case 2:
          this.number = 5000
          this.type = '信用节点'
          break
        case 3:
          this.type = '实时节点'
          this.number = 10000
          break
        case 4:
          this.type = '中级节点'
          this.number = 50000
          break
        case 5:
          this.type = '高级节点'
          this.number = 100000
          break
      }
    },
    onConfirm2(value) {
      this.value = value
      this.showPicker = false
      console.log(value)
      if (value == '6个月') {
        this.index = 6
      } else if (value == '12个月') {
        this.index = 12
      } else if (value == '24个月') {
        this.index = 24
      } else {
        this.index = 36
      }
    },

    onCancel() {
      this.show = false
      Toast('取消')
    },
  },
}
</script>

<style lang="less" scoped>
.content {
  font-size: 28px;
  border-top: 20px solid #f3f4f5;
  .hint {
    padding: 40px 32px 0;
    color: #fc7542;
    line-height: 50px;
  }
  .type {
    color: #237ff8;
    margin-left: 49px;
  }
  .conversion {
    padding: 28px 32px;
  }
}

.botton {
  position: fixed;
  bottom: 60px;
  right: 32px;
  width: calc(100vw - 64px);
}
</style>
