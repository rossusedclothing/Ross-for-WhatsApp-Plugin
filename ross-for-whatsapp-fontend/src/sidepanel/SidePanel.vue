<template>
  <aside
    id="crx-injected-right-sidebar"
    :class="[
      { open: opened },
      'fixed top-10 right-0 bottom-0 w-[360px] max-w-[75vw] flex flex-col bg-[#111b21] text-[#e9edef] z-[2147483647] shadow-xl border-l border-white/10 translate-x-full transition-transform duration-200',
    ]"
  >
    <div
      class="crx-sidebar-header h-11 flex items-center justify-between px-3 border-b border-white/10"
    >
      <div>助手侧栏</div>
      <button class="crx-close-btn text-sm px-2 py-1 rounded-md hover:bg-white/10" @click="close">
        收起
      </button>
    </div>

    <div class="crx-sidebar-content flex-1 overflow-auto p-3">
      <component :is="currentView" />
    </div>
  </aside>
</template>

<script lang="ts" setup name="RightSidebar">
import { computed, ref } from 'vue'
import OverviewView from './views/OverviewView.vue'
import ContactsView from './views/ContactsView.vue'
import AutomationView from './views/AutomationView.vue'
import SettingsView from './views/SettingsView.vue'

// 定义 props
const activeTab = 'overview' as 'overview' | 'contacts' | 'automation' | 'settings'

// 定义暴露方法
const opened = ref(false)
function open() {
  opened.value = true
}
function close() {
  opened.value = false
}
defineExpose({ open, close })

// 根据 activeTab 计算当前组件
const currentView = computed(() => {
  switch (activeTab) {
    case 'overview':
      return OverviewView
    case 'contacts':
      return ContactsView
    case 'automation':
      return AutomationView
    case 'settings':
      return SettingsView
    default:
      return OverviewView
  }
})
</script>

<style scoped></style>
