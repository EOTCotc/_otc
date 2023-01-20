<template>
  <div>
    <white :title="title"></white>
    <div class="content">
      <div class="top">
        <p>提现</p>
        <p>当前状态</p>
        <p>提现日期</p>
      </div>

      <div class="list" v-for="(item, index) in list" :key="index">
        <p>{{ item.Coin }}</p>
        <p class="listState">{{ item.Chu }}</p>
        <p>{{ item.Zdate }}</p>
      </div>
      <div v-if="list.length == 0">
        <van-empty image="error" description="暂无收益数据" />
      </div>
    </div>
  </div>
</template>

<script>
import white from '@/components/Nav/white.vue'
import { Toast } from 'vant'
import { GetSymx, Gettbjl } from '@/api/trxRequest'
export default {
  components: {
    white,
  },
  data() {
    return {
      title: '提现记录',
      list: [],
      loading: false,
      finished: false,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      Toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: '加载中',
      })
      Gettbjl({})
        .then((res) => {
          let data = res.data
          console.log(data)
          for (let i of data) {
            switch (i.Chu) {
              case '0':
                i.Chu = '排队中'
                break
              case '9':
                i.Chu = '确认中'
                break
              case '1':
                i.Chu = '已完成'
                break
            }
          }
          this.list = data
          Toast.clear()
          Toast.success('加载成功')
          // console.log(data);
        })
        .catch((err) => {
          Toast.clear()
          Toast.fail('加载失败')
          console.log(err)
        })
    },
  },
}
</script>

<style lang="less" scoped>
.content {
  .top {
    background: #f3f4f5;
    padding: 20px 40px 20px 48px;
    color: #999;
    font-size: 28px;
    display: flex;
    justify-content: space-between;
    // p:last-child {
    //   width: 30%;
    //   text-align: center;
    // }
  }
  .list {
    padding: 28px 48px;
    color: #666;
    font-size: 28px;
    display: flex;
    justify-content: space-between;
    p:nth-child(2) {
      // flex: 1;
      width: 28%;
      text-align: end;
    }
  }
}
</style>