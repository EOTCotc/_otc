 <template>
  <div class="toast">
    <VueLoading
      type="spiningDubbles"
      :size="{ width: '35px', height: '35px' }"
      :style="{ fill: 'rgb(219,9, 9)' }"
    ></VueLoading>
    <main class="main" v-html="title"></main>
  </div>

</template>
  <script>
import { VueLoading } from "vue-loading-template";

export default {
  name: "toast-container",
  components: {
    VueLoading,
  },
  props:{
      title:{
          default:"正在处理中，请耐心等待"
      }
  },
};
</script>
