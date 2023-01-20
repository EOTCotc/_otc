<template>
  <van-pull-refresh v-model="loading" @refresh="getList">
    <div class="content">
      <div class="case">
        <template v-if="!!list.data.length">
          <div class="caselist" v-for="item in list.data" :key="item.arbitrateInfoId">
            <div class="result" v-if='!item.isCancel'>
              <div class="left" :class='item.isVictory ? "green" : "orange"'>
                <van-icon v-if='item.isVictory' name="fire-o" />
                <span>{{ item.isVictory ? '胜诉' : '败诉' }}</span>
              </div>
              <div :class="item.isVictory ? 'green' : 'orange'">{{ item.isVictory ? '+' : '-' }}{{ item.eotc }} EOTC</div>
            </div>
            <div class="result" v-else>
              <div class="left gray">
                <span>取消仲裁</span>
              </div>
            </div>
            <both :info='item'></both>
            <div class="case_text" @click="details(item)">
              <p class="title">仲裁结果</p>
              <div class="text_flex">
                <p class="van-multi-ellipsis--l2">
                  本次参与仲裁判决的仲裁员共计{{ item.total }}人，通过双方提交举证，{{ item.plaintiffNum > item.defendantNum ? `${item.plaintiffNum}位仲裁员判定原告方胜` : `${item.defendantNum}位仲裁员判定被告方胜` }}。
                </p>
                <div><van-icon name="orders-o" size="0.5rem" />详情</div>
              </div>
            </div>
            <div v-if="!item.isVictory && !item.isOver" class="again">
              <van-button color="#1B2945" round block :to="{name:'appeal', query: {id: item.arbitrateInfoId}}">申请再仲裁</van-button>
            </div>
          </div>
        </template>
        <van-empty
          v-else
          :image="require('../../assets/currency-icons/empty.png')"
          description="暂无数据"
        />
      </div>
    </div>
  </van-pull-refresh>
</template>

<script>
import both from "@/components/arbitration/module/both.vue";
import {
  $loading,
  $toast
} from '@/utils/utils'
import {list} from '@/api/arbitration'
export default {
  //已结案
  components: {
    both,
  },
  data() {
    return {
      loading: false,
      list: {
        data: []
      },
    };
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      const uid = localStorage.getItem('uid')
      const loading = $loading('加载中…')
      this.loading = true
      list(1).then(res => {
        const now = new Date().getTime()
        this.list.data = res.items.map(item => {
          if (item.status > 1) {
            // 判断是否胜诉
            item.isVictory = (item.status === 2 && item.plaintiffUId === uid) || (item.status === 3 && item.defendantUId === uid)
            item.isOver = this.$dayjs().diff(this.$dayjs('2022-10-08T17:40:17.55Z').utc(), 'day') >= 7
          } else {
            item.time = new Date(item.status === 0 ? item.adduceDate : item.voteDate) - now
          }
          item.total = item.plaintiffNum + item.defendantNum
          return item
        })
      }).catch(() => {
        $toast('fail', "加载失败！")
      }).finally(() => {
        loading.clear()
        this.loading = false
      })
    },
    details(item) {
      this.$router.push({ name: "finishDetails", query: {id: item.arbitrateInfoId} });
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  min-height: calc(100vh - 100px);
  background: #f3f4f5;
}
.case {
  .caselist {
    background: #fff;
    margin: 24px;
    border-radius: 20px;
    padding: 30px;
    font-size: 28px;
    .result {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 58px;
      font-weight: bold;
      .left {
        display: flex;
        font-size: 36px;
        align-items: center;
        span {
          display: block;
          margin-left: 17px;
        }
      }
      .green {
        color: #00b87a;
      }
      .orange {
        color: #fc7542;
      }
      .gray {
        color: #999;
      }
    }
    .case_text {
      margin-top: 32px;
      .title {
        font-size: 32px;
        font-weight: bold;
        margin-bottom: 16px;
      }
      .text_flex {
        display: flex;
        justify-content: space-between;
        div {
          width: 40%;
          font-weight: bold;
          display: flex;
          align-items: flex-end;
          padding-left: 24px;
        }
      }
    }
    .again {
      margin-top: 30px;
    }
  }
}
</style>
