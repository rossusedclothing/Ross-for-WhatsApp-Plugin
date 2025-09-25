<template>
  <div id="crx-injected-top-tabs" class="fixed inset-x-0 top-0 h-10 flex items-center gap-2 px-3 text-white z-[2147483646] shadow">
    <button
      v-for="(tab, idx) in tabs"
      :key="tab.key"
      class="crx-tab-button h-[26px] px-2.5 rounded-md border border-white/10 bg-white/10 text-xs transition"
      :class="{ 'bg-emerald-500 border-emerald-500': idx === activeIndex }"
      @click="selectTab(tab.key, idx)">
      {{ tab.label }}
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export type TabKey = 'overview' | 'contacts' | 'automation' | 'settings'

export default defineComponent({
  name: 'TopTabs',
  emits: {
    select: (_key: TabKey) => true,
  },
  setup(_props, { emit }) {
    const tabs: Array<{ key: TabKey; label: string }> = [
      { key: 'overview', label: '总览' },
      { key: 'contacts', label: '联系人' },
      { key: 'automation', label: '自动化' },
      { key: 'settings', label: '设置' },
    ]
    const activeIndex = ref(0)
    function selectTab(key: TabKey, idx: number) {
      activeIndex.value = idx
      emit('select', key)
    }
    return { tabs, activeIndex, selectTab }
  },
})
</script>

<style scoped>
</style>


