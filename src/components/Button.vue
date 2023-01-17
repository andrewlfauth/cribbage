<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { wait } from '../utils/helpers'

const props = defineProps({
  text: String,
})

let button = ref(null)
let intervalId

onMounted(() => {
  intervalId = setInterval(async () => {
    button.value.classList.add('animate-wiggle')
    await wait(2)
    button.value.classList.remove('animate-wiggle')
  }, 10000)
})

onUnmounted(() => clearInterval(intervalId))
</script>

<template>
  <button
    ref="button"
    class="block px-4 py-2 text-xl font-medium text-gray-200 duration-150 border-4 border-gray-800 rounded-md w-fit hover:ring-2 hover:ring-offset-2 ring-gray-600 ring-offset-gray-900 active:ring-offset-0"
  >
    {{ props.text }}
  </button>
</template>
