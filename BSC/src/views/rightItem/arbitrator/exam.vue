<!--
 * @Name: 仲裁员
 * @Author: webQDI svb1474155018@163.com
 * @Date: 2022-05-25 15:00
 * @LastEditTime: 
 * @FilePath: \etoc514\src\views\rightItem\chain.vue
-->
<template>
    <div class="exam">
        <White :title="title"></White>

        <div class="contatiner">
            <div class="center">
                <Exam></Exam>
            </div>
        </div>
    </div>
</template>

<script>
import White from "@/components/Nav/white.vue";
import Exam from "@/components/arbitrator/exam.vue";

export default {
    name: 'exam',
    components: {
        White,
        Exam
    }, 
    data() {
        return {
            title: '仲裁考试'
        };
    },
    methods: {
        
    }
}
</script>

<style scoped>
    
</style>