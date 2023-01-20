<template>
  <div>
    <white :title="title"></white>
    <div class="content">
      <both :info='info'></both>
      <div class="textbox">
        <div class="cause">卖家发起仲裁，仲裁事件为{{ getArbitrateType(info.arbitrateInType) }}</div>
        <div class="result">
          <p>仲裁结果</p>
          本次参与仲裁判决的仲裁员共计{{ info.total }}人，通过双方提交举证，{{info.plaintiffNum}}位仲裁员判定原告方胜。
        </div>
        <div class="time">
          <p>结案时间</p>
          {{ transformDate(info.voteDate) }}
        </div>
        <div class="judgment">
          <p class="title">公示判决</p>
          <div class="flex" v-for="item in info.votes" :key="item.number">
            <div class="right">
              <p>{{ item.name }}</p>
              <p>{{ item.number }}</p>
            </div>
            <div class="left" :class="item.voteStatus === 1 ? 'colour1' : 'colour2'">
              <van-icon name="good-job-o" />
              <p v-if="item.voteStatus === 1">原告</p>
              <p v-else>被告</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import white from "@/components/Nav/white.vue";
import both from "@/components/arbitration/module/both.vue";
import {detail} from '@/api/arbitration'
import {$toast, transformDate, getArbitrateType} from '@/utils/utils'

export default {
  //公示仲裁案详情
  components: {
    white,
    both,
  },
  data() {
    return {
      title: "仲裁案详情",
      info: {},
      show: false,
    };
  },
  created() {
    this.getDetail()
  },
  methods: {
    transformDate,
    getArbitrateType,
    getDetail() {
      const loading = $toast('loading', '加载中…')
      detail(this.$route.query.id).then(res => {
        console.log(res)
        const data = res.items
        data.total = data.plaintiffNum + data.defendantNum
        this.info = data
      }).finally(() => {
        loading.clear()
      })
    }
  }
};
</script>

<style lang="less" scoped>
.content {
  padding: 32px;
  .textbox {
    margin-top: 30px;
    font-size: 28px;
    .cause {
      padding: 24px;
      border-radius: 0 20px 20px 20px;
      background: #f3f4f5;
    }
    .result {
      margin-top: 30px;
      p {
        margin-bottom: 16px;
        font-size: 32px;
        font-weight: bold;
      }
    }
    .time {
      margin-top: 30px;
      p {
        margin-bottom: 16px;
        font-size: 32px;
        font-weight: bold;
      }
    }
    .judgment {
      margin-top: 30px;
      .title {
        margin-bottom: 34px;
        font-size: 32px;
        font-weight: bold;
      }
      .flex {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 45px;
        div {
          display: flex;
          align-items: center;
        }
        .right {
          p:first-child {
            margin-right: 52px;
          }
        }
        .left {
          p:last-child {
            margin-left: 10px;
          }
        }
        .colour1 {
          color: #4ea0f5;
        }
        .colour2 {
          color: #ed7269;
        }
      }
    }
  }
}
</style>
