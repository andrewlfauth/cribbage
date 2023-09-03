<script setup>
import { ref, watchEffect } from 'vue'
import { useGameStore } from '../stores/game'

const { endGame } = useGameStore()
const isComfirming = ref(false)
const handleClick = () => {
  isComfirming.value ? endGame() : (isComfirming.value = true)
}

watchEffect((onCleanup) => {
  if (isComfirming) {
    let id = setTimeout(() => (isComfirming.value = false), 5000)
    onCleanup(() => clearTimeout(id))
  }
})
</script>
<template>
  <button
    @click="handleClick"
    class="absolute block px-4 py-2 text-xl font-medium text-gray-200 duration-150 scale-75 border-4 border-gray-800 rounded-md w-fit hover:ring-2 hover:ring-offset-2 ring-gray-600 ring-offset-gray-900 active:ring-offset-0 bottom-2 right-4"
  >
    {{ isComfirming ? 'You sure?' : 'End game' }}
  </button>
</template>
