<script setup>
import Card from './components/Card.vue'
import StartView from './components/StartView/StartView.vue'
import { useGameStore } from './stores/game'

const { game } = useGameStore()
</script>

<template>
  <main
    :class="game.theme"
    class="w-screen h-screen overflow-hidden bg-gray-900"
  >
    <StartView v-if="!game.stage" />
  </main>
</template>
