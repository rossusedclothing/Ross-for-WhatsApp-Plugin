<template>
  <div>
    <TopTabs @select="onSelect" />
  </div>

  <!-- 虚拟挂载点（保持与原逻辑位置一致） -->
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TopTabs from './TopTabs.vue'

const activeTab = ref<'overview' | 'contacts' | 'automation' | 'settings'>('overview')

function onSelect(key: 'overview' | 'contacts' | 'automation' | 'settings') {
  activeTab.value = key
}
</script>

<style scoped>
/* 保持容器透明，不干扰页面布局 */
</style>
