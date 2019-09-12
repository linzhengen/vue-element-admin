<template>
  <div class="tab-container">
    <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
      <el-tab-pane label="モール側の設定" name="mall">
        <tab-mall :mall="mall" />
      </el-tab-pane>
      <el-tab-pane label="ショップガイド" name="guide">
        <tab-guide />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import TabGuide from '@/views/shops/components/TabGuide'
import TabMall from '@/views/shops/components/TabMall'

export default {
  name: 'ShopsEdit',
  components: { TabGuide, TabMall },
  data() {
    return {
      mall: 'rakuten',
      activeName: 'mall'
    }
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },
  created() {
    const tab = this.$route.query.tab
    if (tab) {
      this.activeName = tab
    }
  },
  methods: {}
}
</script>

<style scoped>
  .tab-container {
    margin: 30px;
  }
</style>
