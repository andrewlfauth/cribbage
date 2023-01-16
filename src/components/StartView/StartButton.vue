<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useGameStore } from '../../stores/game'
import { wait } from '../../utils/helpers'
const { game } = useGameStore()

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

const startGame = () => (game.stage = 'cut')
</script>

<template>
  <button
    ref="button"
    @click="startGame"
    class="text-4xl font-medium text-white rounded-md py-2 px-4 border-4 border-gray-800 w-fit hover:ring-2 hover:ring-offset-2 ring-gray-300 ring-offset-gray-900 duration-150 active:ring-offset-0"
  >
    Start
  </button>
</template>
