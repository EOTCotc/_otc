<template>
  <div>
    <white :title="title"></white>
    <div class="content">
      <div class="header">
        <img src="../../static/icon/wallet2.png" alt />
        <p>
          定期质押
          <span>(EOTC)</span>
        </p>
        <p>{{sum}}</p>
      </div>
      <div class="datum">
        <div>
          <p>利息收益(EOTC)</p>
          <p>{{interest}}</p>
        </div>
        <div>
          <p>盲盒奖励(个)</p>
          <p>{{boxnum}}</p>
        </div>
        <div>
          <p>推荐质押(人数)</p>
          <p>{{people}}</p>
        </div>
        <div>
          <p>推荐质押总量(EOTC)</p>
          <p>{{peopleNum}}</p>
        </div>
      </div>
      <div class="rule">
        <p class="title">盲盒赠送规则</p>
        <div>
          用户质押1000-1999EOTC赠送推荐人1个盲盒
          <br />用户质押2000-2999EOTC赠送推荐人3个盲盒
          <br />用户质押3000-3999EOTC赠送推荐人4个盲盒
          <br />用户质押4000-4999EOTC赠送推荐人6个盲盒
          <br />用户质押5000EOTC以上赠送推荐人10个盲盒
        </div>
        <div>
          <p>定期质押六个月</p>1000-1999EOTC赠送用户1个盲盒
          <br />2000-2999EOTC赠送用户3个盲盒
          <br />3000-3999EOTC赠送用户4个盲盒
          <br />4000-4999EOTC赠送用户6个盲盒
          <br />5000EOTC赠送用户10个盲盒
          <br />5000EOTC以上每质押多500EOTC则加送用户1个盲盒
        </div>
        <div>
          <p>定期质押十二个月</p>1000-1999EOTC赠送用户2个盲盒
          <br />2000-2999EOTC赠送用户5个盲盒
          <br />3000-3999EOTC赠送用户7个盲盒
          <br />4000-4999EOTC赠送用户10个盲盒
          <br />5000EOTC赠送用户13个盲盒
          <br />5000EOTC以上每质押多400EOTC则加送用户1个盲盒
        </div>
        <div>
          <p>定期质押二十四个月</p>1000-1999EOTC赠送用户3个盲盒
          <br />2000-2999EOTC赠送用户6个盲盒
          <br />3000-3999EOTC赠送用户9个盲盒
          <br />4000-4999EOTC赠送用户12个盲盒
          <br />5000EOTC赠送用户14个盲盒
          <br />5000EOTC以上每质押多300EOTC则加送用户1个盲盒
        </div>
      </div>

      <div class="footer">
        <van-button color="#1B2945" block round @click="jump()">链上理财质押</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { allOrder, allOrder1 } from '@/utils/web3'
import white from '@/components/Nav/white.vue'
//流动性挖矿收益
export default {
  components: {
    white,
  },
  data() {
    return {
      title: '链上质押赚币',
      //链上定期总量
      sum: 0,
      //利息
      interest: 0,
      //盲盒数量
      boxnum: 0,
      //推荐质押人数
      people: 0,
      //推荐质押总量
      peopleNum: 0,
    }
  },
  mounted() {
    this.boxnum = localStorage.getItem('handselBox')
    this.people = localStorage.getItem('stakingMan')
    this.peopleNum = localStorage.getItem('stakingNum')
  },
  created() {
    this.init()
  },
  methods: {
    jump() {
      window.location.href = 'https://fi.eotc.im/'
    },
    init() {
      allOrder().then((res) => {
        console.log(res)
        // let list = []
        for (let i of res) {
          if (i.isStop == 0) {
            this.sum += i.amount
            this.interest += i.reward
          }
          // if (i.amount >= 1000) {
          //   if (i.cycle == 6) {
          //     this.calculate(i.amount, 1)
          //   } else if (i.cycle == 12) {
          //     this.calculate(i.amount, 2)
          //   } else if (i.cycle == 24) {
          //     this.calculate(i.amount, 3)
          //   }
          //   list.push(i)
          // }
        }
        allOrder1().then((res) => {
          for (let i of res) {
            if (i.isStop == 0) {
              this.sum += i.amount
              this.interest += i.reward
            }
          }
          this.sum = this.sum.toFixed(2)
          this.interest = this.interest.toFixed(2)
        })
      })
    },
    calculate(num, type) {
      let list
      if (type == 1) {
        list = [1, 3, 4, 6, 10, 500]
      } else if (type == 2) {
        list = [2, 5, 7, 10, 13, 400]
      } else if (type == 3) {
        list = [3, 6, 9, 12, 14, 300]
      }
      // if (num >= 1000 && num <= 1999) {
      //   this.boxnum += list[0]
      // } else if (num >= 2000 && num <= 2999) {
      //   this.boxnum += list[1]
      // } else if (num >= 3000 && num <= 3999) {
      //   this.boxnum += list[2]
      // } else if (num >= 4000 && num <= 4999) {
      //   this.boxnum += list[3]
      // } else if (num >= 5000) {
      //   this.boxnum += list[4]
      //   let five = Math.floor((num - 5000) / list[5])
      //   this.boxnum += five
      // }
    },
  },
}
</script>

<style lang="less" scoped>
.content {
  padding: 30px 32px 0;
  min-height: calc(100vh - 126px);
  font-size: 28px;
  background: #f3f4f5;
  .header {
    background: #ff9168;
    border-radius: 20px;
    color: #fff;
    padding: 40px 30px 60px;
    margin-bottom: 30px;
    position: relative;
    span {
      font-size: 24px;
    }
    p:last-child {
      margin-top: 30px;
      font-size: 40px;
      font-weight: bold;
    }
    img {
      width: 180px;
      position: absolute;
      right: 30px;
      top: 23px;
    }
  }
  .datum {
    width: calc(100vw - 128px);
    padding: 28px 30px 40px;
    margin-bottom: 30px;
    background: #fff;
    box-shadow: 0px 3px 12px 1px rgba(27, 41, 69, 0.06);
    border-radius: 20px 20px 20px 20px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    div {
      width: 45%;
    }
    div:first-child {
      margin-bottom: 30px;
    }
    div p:first-child {
      font-size: 24px;
      color: #666;
      margin-bottom: 12px;
    }
    div p:last-child {
      font-size: 36px;
      font-weight: bold;
    }
  }
  .rule {
    background: #fff;
    border-radius: 20px;
    padding: 40px 30px 30px;
    box-shadow: 0px 3px 12px 1px rgba(27, 41, 69, 0.06);
    font-size: 28px;
    .title {
      font-size: 32px;
      font-weight: bold;
      margin-bottom: 30px;
    }
    div {
      color: #666;
      margin-bottom: 30px;
      p {
        margin-bottom: 30px;
      }
    }
  }
  .footer {
    margin: 30px 0 60px;
  }
}
</style>
