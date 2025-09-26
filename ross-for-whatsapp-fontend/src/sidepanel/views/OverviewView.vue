<template>
  <div class="flex flex-col gap-2">
    <h3 class="text-base font-semibold">总览</h3>
    <div class="space-y-2">
      <AccordionItem title="消息群发" />
      <AccordionItem title="导出联系人" />
      <AccordionItem title="号码验证" />
      <AccordionItem title="翻译配置" />
      <AccordionItem title="常用语快速回复" />
      <AccordionItem title="消息备份" />
      <AccordionItem title="自动回复" />
      <AccordionItem title="用语分析" />
      <AccordionItem title="客户标签" />
    </div>
  </div>
</template>

<script lang="ts" setup name="OverviewView">
import { defineComponent } from 'vue'
import AccordionItem from '../components/AccordionItem.vue'
</script>

<style scoped></style>
