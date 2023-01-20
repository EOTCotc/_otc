<template>
    <div class="content">
        <van-form @submit="submit" @failed="onFailed">
            <van-cell :value="title" class="feedbackContentTitle" :border="false" />

            <div>
                <van-cell :value="titleList[0]" class="feedbackTitle" :border="false" />
                <div v-for="(item, index) of feedbackTypeList"  :key="index"  class="feedbackTypeItem"
                    @click="feedbackTypeChange(index)" :class="active == index ? 'active' : 'noActive'">{{ item.title }}
                </div>
            </div>
            <div>
                <van-cell :value="titleList[1]" name="feedbackText" class="feedbackTitle" :border="false" />
                <van-field v-model="feedbackText" class="feedbackText" rows="10" autosize type="textarea"
                    maxlength="300" placeholder="请详细说明，以便于我们为您解决问题" required show-word-limit />
            </div>
            <div>
                <van-cell class="feedbackTitle" :border="false">
                    <template #title>
                        <span class="custom-title">{{ titleList[2] }}</span>
                        <span class="custom-msg">(选填，添加问题截图)</span>
                    </template>
                </van-cell>
                <van-uploader v-model="fileList" :max-size="500 * 1024" @oversize="onOversize" multiple :max-count="2" />
            </div>
            <div>
                <van-cell :value="titleList[3]" class="feedbackTitle" :border="false" />
                <van-field v-model="phone" name="phone" placeholder="请输入手机号码" @focus="focusFun()" @blur="show = false"
                    class="phone" required :rules="phone != '' ? [{ pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, message: '输入的手机号码有误！' }] : [{ pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, message: '' }]" />
            </div>

            <div v-show="show" class="heightDiv"></div>

            <div class="bottom">
                <van-button class="bottomBtn" round block native-type="submit" :disabled="btnSwitch">提交</van-button>
            </div>
        </van-form>
    </div>
</template>

<script>
import { Toast } from "vant";

export default {
    data() {
        return {
            title: '反馈&建议',
            //分类标签选中的下标
            active: 0,
            titleList: ['分类标签', '反馈及建议描述', '添加图片', '联系方式'],
            feedbackText: '',
            phone: '',
            show: false,
            fileList: [],
            //按钮禁用开关
            btnSwitch: false,
            phonePattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
            feedbackTypeList: [{
                title: '异常反馈',
                index: 0
            },
            {
                title: '功能建议',
                index: 1
            },
            {
                title: 'BUG反馈',
                index: 2
            }],

        };
    },
    created() {

    },
    methods: {
        phoneValidator(val) {
            return /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(val);
        },

        onOversize(file) {
            Toast('文件大小不能超过 500kb');
        },
        feedbackTypeChange(index) {
            this.active = index
        },
        focusFun() {
            this.show = true;
        },
        submit(val) {
            if (val.feedbackText!='' && val.phone!='') {
                this.$router.push({ name: 'userInfo' });
                Toast('提交成功')
            }
        },
        onFailed(errorInfo) {
        },
    },
};
</script>

<style lang="less" scoped>
.feedbackContentTitle {
    font-size: 40px;
    color: #1B2945;
    font-weight: 700;
    padding: 32px;
}

.feedbackTitle {
    font-size: 34px;
    color: #333333;
    font-weight: 700;
    padding: 40px 32px;
}

.feedbackTypeItem {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 180px;
    height: 68px;
    font-size: 28px;
    box-sizing: border-box;
    background-color: #F3F4F5;
    border-radius: 16px;
    border: 1px solid #FFF;
}

.feedbackTypeItem.active {
    border: 1px solid #247FF7;
}

.feedbackTypeItem:not(:first-of-type) {
    margin-left: 30px;
}

.feedbackText {
    border: 1px solid #C8CFDE;
    width: auto;
    height: 192px;
    margin: 0 32px;
}

.custom-msg {
    color: #999999;
    font-size: 30px;
}

.van-uploader {
    padding: 0 32px;
}

.phone {
    margin: 0 32px;
    border: 1px solid #C8CFDE;
    width: auto;
}

.bottom {
    margin: 32px;
    width: auto;
}

.bottomBtn {
    background-color: #1B2945;
    color: #FFFFFF;
}

.heightDiv {
    height: 600px;
}

.active {
    border: 1px solid #247FF7;
}

.noActive {
    border: 1px solid #F3F4F5;
}
</style>
