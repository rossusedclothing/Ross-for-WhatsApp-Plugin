<template>
  <div>
    <h3 class="text-base font-semibold" @click="openSidebar">联系人</h3>
    <p class="text-sm opacity-85">示例内容。</p>
  </div>
</template>

<script lang="ts" setup name="ContactsView">
function openSidebar() {
  console.log('openSidebar')
  chrome.runtime.sendMessage({ type: 'open-sidepanel' })
}
</script>

<style scoped></style>
