<!-- 
 * @Name: 申请成为仲裁员 
 * @Author: webQDI svb1474155018@163.com
 * @Date: 2022-05-25 15:00
 * @update 2022-05
 * @FilePath: \etoc514\src\views\rightItem\arbitrator.vue
 -->

<template>
  <div class="content">
    <div class="item" v-for="(item, index) of contentList" v-if="index == contentIndex">
      <div class="top">
        <span class="presentIndex">{{ index + 1 }}</span><span class="totalCount">/ {{ contentList.length }}</span>
      </div>
      <div class="topic">
        {{ item.topic }}
      </div>
      <div class="answer">
        <div :class="activeIndex == i || item.answerIndex == i ? 'answerActiveItem' : 'answerItem'"
          v-for="(answerItem, i) of item.answerList" @click="answerItemClick(answerItem, index, i)">{{ answerItem }}
        </div>
      </div>
    </div>
    <div class="bottomBtn">
      <div v-show="contentIndex == 0">
        <van-button :disabled="bottomBtnFlg" block round color="#1B2945" @click="answerBtn(1)">下一题</van-button>
      </div>
      <div v-show="contentIndex != 0 && contentIndex < contentList.length - 1" style="display: flex;">
        <van-button block round color="#1B2945" @click="answerBtn(-1)" style="margin: 0 10px;">
          上一题</van-button>
        <van-button :disabled="bottomBtnFlg" block round color="#1B2945" @click="answerBtn(1)" style="margin: 0 10px;">
          下一题</van-button>
      </div>
      <div v-show="contentIndex >= contentList.length - 1">
        <van-button :disabled="bottomBtnFlg" block round color="#1B2945" @click="answerBtn(0)">提交</van-button>
      </div>
    </div>

    <van-dialog v-model="dialogShow" theme="round-button" className="dialog" confirmButtonText="知道了"
      confirmButtonColor="#237FF8" @confirm="dialogBtn">
      <div><img class="gradeIcon"
          :src="examGrade < 90 ? require('@/static/image/examNo.png') : require('@/static/image/examOk.png')" alt="">
      </div>
      <!-- <div><img src= '@/static/image/examNo.png' alt=""></div> -->
      <div class="grade">{{ examGrade }}分</div>
      <div class="msg">{{ examGrade < 90 ? '很遗憾未通过仲裁考试' : '恭喜通过仲裁考试' }}</div>
    </van-dialog>

  </div>
</template>

<script>
import { Dialog } from 'vant';
export default {
  name: 'exam',
  data() {
    return {
      contentList: [{
        topic: '问题1----------------------------',
        answerList: ['答案1', '答案2', '答案3', '答案4'],
        answerIndex: -1
      }, {
        topic: '问题2----------------------------',
        answerList: ['答案1', '答案2', '答案3', '答案4'],
        answerIndex: -1
      }, {
        topic: '问题3----------------------------',
        answerList: ['答案1', '答案2', '答案3', '答案4'],
        answerIndex: -1
      }, {
        topic: '问题4----------------------------',
        answerList: ['答案1', '答案2', '答案3', '答案4'],
        answerIndex: -1
      }],
      //考试结果
      examGrade: 88.5,
      contentIndex: 0,//显示第几个题目
      activeIndex: -1,
      bottomBtnFlg: true,
      dialogShow: false
    };
  },
  mounted() {
    document.body.style.backgroundColor = '#F3F4F5';
  },
  methods: {
    /**
     * -1 上一页
     * 0 提交
     * 1 下一页
     */
    answerBtn(state) {
      if (state == -1) {
        this.contentIndex--
        this.activeIndex = this.contentList[this.contentIndex].answerIndex
      } else if (state == 1) {
        this.contentIndex++
      }
      this.bottomBtnFlg = true
      this.activeIndex = -1

      if (state == 0) {
        this.dialogShow = true
      }
    },
    dialogBtn() {
      document.body.style.backgroundColor = 'transparent';
      this.$router.push({ name: 'arbitrator' });
    },
    answerItemClick(obj, index, activeIndex) {
      if (this.bottomBtnFlg) {
        this.bottomBtnFlg = false
      }
      this.activeIndex = activeIndex;
      this.contentList[index].answerIndex = this.activeIndex
    }
  },
};
</script>

<style lang="less" scoped>
.content {
  position: relative;
  font-size: 36px;
  background-color: #F3F4F5;

  .item {
    padding: 36px;
    margin: 36px;
    background-color: #FFFFFF;
    border-radius: 20px;

    .top {
      margin-bottom: 40px;

      .presentIndex {
        font-size: 48px;
        color: #237FF8;
        font-weight: 700
      }

      .totalCount {
        font-size: 28px;
        color: #999999;
        margin-left: 2px;
      }
    }

    .topic {
      margin-bottom: 40px;
    }

    .answer {
      .answerItem {
        border-radius: 20px;
        text-align: center;
        margin-bottom: 30px;
        padding: 23px 0;
        background-color: #F9F9F9;
      }

      .answerActiveItem {
        border-radius: 20px;
        text-align: center;
        margin-bottom: 30px;
        padding: 23px 0;
        background-color: #237FF8;
      }
    }
  }

  .dialog {
    text-align: center;
    overflow: inherit;

    /deep/.van-dialog__content {
      position: relative;
      top: -40px;
    }

    .gradeIcon {}

    .grade {
      font-size: 48px;
      color: #237FF8;
      margin-top: 20px;
    }

    .msg {
      font-size: 36px;
      color: #333333;
      margin-top: 16px;
    }
  }

  .bottomBtn {
    position: fixed;
    bottom: 60px;
    left: 0;
    right: 0;
    padding: 0 80px;
  }
}
</style>