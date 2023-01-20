<template>
  <div class="main">
    <white :title="title"></white>
    <div class="content">
      <div class="gross">
        <p class="title">交易总量</p>
        <div class="grossBox">
          <div>
            <p>总交易量(USDT)</p>
            <p>{{dealSum}}万</p>
          </div>
          <div></div>
          <div>
            <p>总交易人数(人)</p>
            <p>{{peopleSum}}</p>
          </div>
        </div>
      </div>
      <div class="chart">
        <p class="chartTitle">交易数据图表</p>
        <div class="chartBox">
          <div class="boxTop">
            <p>USDT购买出售情况</p>
            <div class="zysh">
              <p
                class="buysell"
                :class="{ 'active-btn': !isPledges }"
                size="large"
                @click="isPledge()"
              >交易量</p>
              <p
                :class="{ 'active-btn': isPledges }"
                class="btn2 buysell"
                plain
                size="large"
                @click="isPledge()"
              >人数</p>
            </div>
          </div>
          <!-- <div class="boxCenter">
            <span
              :class="{'active':item.show}"
              v-for="(item,index) in date"
              :key="index"
              @click="dateClick(index)"
            >{{item.name}}</span>
          </div>-->
          <div id="main"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { Dialog } from 'vant'
import { TradingVolume } from '@/api/trxRequest'
import white from '@/components/Nav/white.vue'
export default {
  components: {
    white,
  },
  data() {
    return {
      title: '交易数据',
      isPledges: true,
      //交易总人数
      peopleSum: '',
      //交易总量
      dealSum: '',
      //出售人数
      sellPeoeleArr: '',
      //购买人数
      buyPeopleArr: '',
      //出售交易量
      sellDealArr: '',
      //购买交易量
      buyDealArr: '',
      //日期
      dateArr: '',
      // date: [
      //   { name: '日', show: true },
      //   { name: '月', show: false },
      //   { name: '年', show: false },
      // ],
    }
  },
  created() {},
  mounted() {
    let dealData = localStorage.getItem('dealData')
    console.log(dealData)

    if (dealData != null) {
      dealData = JSON.parse(dealData)
    }
    let time =
      new Date(new Date().getTime() - 24 * 60 * 60 * 1000).getMonth() +
      1 +
      '-' +
      new Date(new Date().getTime() - 24 * 60 * 60 * 1000).getDate()

    console.log(time)
    if (dealData != null && time == dealData[1].date) {
      this.screen(dealData)
      this.drawChart()
    } else {
      this.init()
    }
  },
  methods: {
    init() {
      TradingVolume().then((res) => {
        let data = res.data
        this.screen(data)
        this.drawChart()
        let dealData = JSON.stringify(data)
        localStorage.setItem('dealData', dealData)
      })
    },
    screen(data) {
      this.peopleSum = data[0].buyMan * 1 + data[0].sellMan * 1
      this.dealSum = ((data[0].buyTotal * 1 + data[0].sellTotal * 1) / 10000).toFixed(2)
      let dateArr = [],
        sellPeoeleArr = [],
        buyPeopleArr = [],
        sellDealArr = [],
        buyDealArr = []
      for (let i = 1; i < data.length; i++) {
        dateArr.unshift(data[i].date)
      }
      for (let i = 0; i < data.length - 1; i++) {
        sellPeoeleArr.unshift(data[i].sellMan * 1 - data[i + 1].sellMan * 1)
        buyPeopleArr.unshift(data[i].buyMan * 1 - data[i + 1].buyMan * 1)
        sellDealArr.unshift((data[i].sellTotal * 1 - data[i + 1].sellTotal * 1).toFixed(0))
        buyDealArr.unshift((data[i].buyTotal * 1 - data[i + 1].buyTotal * 1).toFixed(0))
      }

      this.dateArr = dateArr
      this.sellPeoeleArr = sellPeoeleArr
      this.buyPeopleArr = buyPeopleArr
      this.sellDealArr = sellDealArr
      this.buyDealArr = buyDealArr
    },

    dateClick(index) {
      for (let i of this.date) {
        i.show = false
      }
      this.date[index].show = true
    },
    isPledge() {
      this.isPledges = !this.isPledges
      // if (this.isPledges) {
      //   this.drawChart(1)
      // } else {
      this.drawChart()
      // }
    },
    drawChart() {
      let data1, data2, date
      if (this.isPledges) {
        data1 = this.buyDealArr
        data2 = this.sellDealArr
      } else {
        data1 = this.buyPeopleArr
        data2 = this.sellPeoeleArr
      }
      date = this.dateArr
      // 基于准备好的dom，初始化echarts实例
      var myChart = this.$echarts.init(document.getElementById('main'))
      // 绘制图表
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999',
            },
          },
        },
        legend: {
          data: ['购买(USDT)', '出售(USDT)'],
        },
        xAxis: [
          {
            type: 'category',
            data: date,
            axisPointer: {
              type: 'shadow',
            },
          },
        ],
        grid: {
          top: 48,
          left: 50, // 调整这个属性
          right: 10,
          bottom: 50,
        },
        yAxis: [
          {
            type: 'value',
            // name: 'Precipitation',
            min: 0,
            max: 'dataMax',
            // interval: 20,
            axisLabel: {
              // formatter: '{value}',
            },
          },
        ],
        series: [
          {
            name: '购买(USDT)',
            type: 'bar',
            tooltip: {
              valueFormatter: function (value) {
                return value + ' ml'
              },
            },
            data: data1,
            itemStyle: {
              color: '#00B87A',
            },
          },
          {
            name: '出售(USDT)',
            type: 'bar',
            tooltip: {
              valueFormatter: function (value) {
                return value + ' ml'
              },
            },
            data: data2,
            itemStyle: {
              color: '#FC7542',
            },
          },
        ],
      }
      myChart.setOption(option)
    },
  },
}
</script>

<style lang="less" scoped>
.main {
  min-height: 100vh;
  background: #f3f4f5;
  .content {
    padding: 30px;
    font-size: 32px;
    .gross {
      margin-bottom: 40px;
      .title {
        margin-bottom: 30px;
      }
      .grossBox {
        padding: 17px 0 35px 0;
        background: #fff;
        border-radius: 16px;
        display: flex;
        justify-content: space-around;
        div {
          p:first-child {
            margin-bottom: 5px;
            font-size: 24px;
            color: #666;
          }
          p:last-child {
            font-size: 36px;
            font-weight: bolder;
          }
        }
        div:nth-child(2) {
          border-right: 1px solid #ccc;
        }
      }
    }
    .chart {
      .chartTitle {
        margin-bottom: 40px;
      }
      .chartBox {
        padding: 40px 30px;
        border-radius: 16px;
        background: #fff;
        .boxTop {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          .zysh {
            width: 200px;
            display: flex;
            justify-content: space-around;
            font-size: 28px;
            padding: 4px;
            background-color: #f1f1f1;
            border-radius: 8px;
            .buysell {
              width: 50%;
              text-align: center;
              padding: 10px 6px;
              border-radius: 8px;
              background-color: #fff;
              color: #000;
            }
            .active-btn {
              background-color: #f1f1f1;
              color: #999;
            }
          }
        }
        .boxCenter {
          margin-bottom: 30px;
          span {
            padding: 4px 36px;
          }
          .active {
            background: #f1f1f1;
            border-radius: 8px;
          }
        }

        #main {
          width: 100%;
          height: 600px;
        }
      }
    }
  }
}
</style>
