<template>
	<div class="border border-white/10 rounded-lg bg-white/5">
		<div class="crx-acc-header flex items-center justify-between px-3 py-2 cursor-pointer" @click="toggle">
			<div class="crx-acc-title text-[13px] font-semibold">{{ title }}</div>
			<div class="crx-acc-toggle text-xs opacity-85">{{ open ? '收起' : '展开' }}</div>
		</div>
		<div class="crx-acc-panel text-sm text-[#c6d1d5] px-3 py-2 border-t border-white/10" v-show="open">
			<slot>点击时仅打印日志，不实现业务逻辑。</slot>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
	name: 'AccordionItem',
	props: {
		title: { type: String, required: true },
	},
	setup() {
		const open = ref(false)
		function toggle() { open.value = !open.value }
		return { open, toggle }
	},
})
</script>

<style scoped>
</style>


