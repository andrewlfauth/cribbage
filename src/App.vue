<script setup>
import CutView from './components/CutView/CutView.vue'
import CribSelectionView from './components/CribSelectionView/CribSelectionView.vue'
import StartView from './components/StartView/StartView.vue'
import PeggingView from './components/PeggingView/PeggingView.vue'
import { useGameStore } from './stores/game'
import ScoreBoard from './components/ScoreBoard.vue'
import Toast from './components/Toast.vue'
import CountingView from './components/CountingView/CountingView.vue'
import GameOver from './components/GameOver.vue'

const { game } = useGameStore()
</script>
<template>
  <GameOver v-if="game.winner" />
  <main :class="game.theme" class="h-screen overflow-hidden bg-gray-900">
    <StartView v-if="!game.stage" />
    <CutView v-if="game.stage == 'cut'" />
    <CribSelectionView v-if="game.stage == 'deal'" />
    <PeggingView v-if="game.stage == 'pegging'" />
    <CountingView v-if="game.stage == 'count'" />
    <ScoreBoard />
    <Toast />
  </main>
</template>
