<script setup>
import Card from './components/Card.vue'
import CutView from './components/CutView/CutView.vue'
import StartView from './components/StartView/StartView.vue'
import { useGameStore } from './stores/game'

const { game } = useGameStore()
</script>
<template>
  <main :class="game.theme" class="h-screen overflow-hidden bg-gray-900">
    <StartView v-if="!game.stage" />
    <CutView v-if="game.stage == 'cut'" />
  </main>
</template>
