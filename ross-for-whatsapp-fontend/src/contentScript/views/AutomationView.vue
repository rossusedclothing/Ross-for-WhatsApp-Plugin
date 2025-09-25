<template>
	<div>
		<h3 class="text-base font-semibold" @click="handleClick">自动化</h3>
		<p class="text-sm opacity-85">示例内容。</p>
	</div>
</template>

<script lang="ts" setup name="AutomationView">
import { defineComponent } from 'vue'

const handleClick = () => {
	console.log('自动化点击')
	fetch('https://api.52vmy.cn/api/img/tu/girl')
		.then(response => response.json())
		.then(data => {
			console.log(data)
		})
		.catch(error => {
			console.error(error)
		})
}

</script>

<style scoped>
</style>


