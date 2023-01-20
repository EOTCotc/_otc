<!--
 * @Name: 学习仲裁规则
 * @Author: webQDI svb1474155018@163.com
 * @Date: 2022-05-25 17:40
 * @LastEditTime: 
 * @FilePath: \etoc514\src\views\rightItem\chain.vue
-->
<template>
    <div>
        <!-- <div class="nav">
            <van-nav-bar title="了解学习相关规则" left-arrow @click-left="onClickLeft()" />
        </div> -->
        <White :title="title"></White>
        <div class="content">
            <div class="top">仲裁规则</div>
            <div class="center">
                <div class="ruleList">
                    <div class="ruleItem" v-for="item of ruleList">
                        <div class="ruleTitle">{{ item.title }}</div>
                        <div class="ruleContent">{{ item.content }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="bottom">
            <van-button color="#1B2945" round block class="bottomBtn" :class="!studyState ? 'unfinishStateBtn' : 'finishStateBtn'" @click="btnClick()">
                <van-count-down :time="time" @finish="finishStudy()" /> 我已完成学习
            </van-button>
        </div>
    </div>
</template>

<script>
import White from "@/components/Nav/white.vue";

export default {
    name: 'arbitratorStudy',
    components: {
        White
    },
    data() {
        return {
            title: '了解学习相关规则',
            ruleList: [{
                title: '规则1',
                content: '大大大是的大大大是的大大大是的大大大是的大大大是的大大大是的大大大是的'
            }, {
                title: '规则2',
                content: '大大大是的大大大是的大大大是的大大大是的大大大是的大大大是的大大大是的'
            }, {
                title: '规则3',
                content: '大大大是的大大大是的大大大是的大大大是的大大大是的大大大是的大大大是的'
            }],
            time: 5 * 1000, //5分钟
            studyState: false,
        }
    },
    methods: {
        onClickLeft() {
            this.$router.push({ name: 'arbitrator' });
        },
        finishStudy() {
            this.studyState = true
        }
    }
}
</script>

<style scoped>
.top {
    background-image: url('@/static/image/studyTop.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    color: #FFFFFF;
    font-size: 48px;
    padding: 47px 32px;
}

.ruleList {
    padding: 0 32px;
}

.ruleItem {
    padding: 32px 0 8px;
}

.ruleTitle {
    font-size: 36px;
    margin-bottom: 20px;
}

.ruleContent {
    font-size: 28px;
}

.bottom {
    position: fixed;
    bottom: 0px;
    left: 0;
    right: 0;
    padding: 0 32px 60px;
}

.bottomBtn {
    border: none;
}

.unfinishStateBtn {
    color: #000 !important;
    background-color: #8C93A1 !important;
}

.finishStateBtn {
    color: #b1b1b1 !important;
}
</style>