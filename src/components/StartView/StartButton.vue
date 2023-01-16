<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useGameStore } from '../../stores/game'
import { wait } from '../../utils/helpers'

const { changeStage } = useGameStore()

const button = ref(null)
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
    @click="changeStage('cut')"
    class="px-4 py-2 text-4xl font-medium text-white duration-150 border-4 border-gray-800 rounded-md w-fit hover:ring-2 hover:ring-offset-2 ring-gray-300 ring-offset-gray-900 active:ring-offset-0"
  >
    Start Game
  </button>
</template>
