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
import EndGameButton from './components/EndGameButton.vue'

const { game } = useGameStore()
</script>
<template>
  <GameOver v-if="game.winner" />
  <main
    :class="game.theme"
    class="hidden h-screen overflow-hidden bg-gray-900 md:block"
  >
    <StartView v-if="!game.stage" />
    <CutView v-if="game.stage == 'cut'" />
    <CribSelectionView v-if="game.stage == 'deal'" />
    <PeggingView v-if="game.stage == 'pegging'" />
    <CountingView v-if="game.stage == 'count'" />
    <ScoreBoard />
    <EndGameButton v-if="game.stage" />
    <Toast />
  </main>
  <div
    class="flex flex-col items-center justify-center w-screen h-screen text-center text-gray-400 bg-gray-900 md:hidden"
  >
    <span class="text-3xl">Tablet or Desktop only :(</span>
    <a
      class="mt-4 underline"
      href="https://github.com/andrewlfauth/cribbage"
      target="_blank"
      ref="'noreferrer'"
      >Find out why</a
    >
  </div>
</template>
