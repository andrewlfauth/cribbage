<script setup>
import { computed, onUpdated } from 'vue'
import StartView from './components/StartView/StartView.vue'
import { useGameStore } from './stores/game'

const { game } = useGameStore()

onUpdated(() => {
  console.log(game.theme)
})
</script>

<template>
  <main
    :class="game.theme"
    class="w-screen h-screen overflow-hidden bg-gray-900"
  >
    <StartView />
  </main>
</template>
