<script setup>
import { ref, onMounted, computed } from 'vue'
import { gsap } from 'gsap'
import { wait } from '../utils/helpers'
import { useScoreStore } from '../stores/score'
import { useGameStore } from '../stores/game'
import { usePeggingStore } from '../stores/pegging'
import Button from './Button.vue'
import ConfettiExplosion from 'vue-confetti-explosion'

const { score, resetScoreStore } = useScoreStore()
const { clearPegging } = usePeggingStore()
const { startNewGame, game } = useGameStore()

const overlay = ref(null)
const popup = ref(null)
const winner = game.winner
const loser = winner == 'user' ? 'bot' : 'user'
const skunked = score[loser] < 90

onMounted(async () => {
  await wait(1)
  gsap.to(overlay.value, { opacity: 1, duration: 0.3 })
  gsap.to(popup.value, { opacity: 1, scale: 1, duration: 0.3, delay: 0.2 })
})

const beginNewGame = () => {
  resetScoreStore()
  clearPegging()
  startNewGame()
}

const returnToMenu = () => {
  resetScoreStore()
  clearPegging()
  startNewGame()
  game.stage = ''
}

let message = computed(() => {
  if (skunked) {
    return winner == 'user' ? 'You skunked the bot!' : 'You got skunked'
  } else return winner == 'user' ? 'You beat the bot!' : 'Bot is the winner'
})

const popupClass = computed(() => {
  return winner == 'user'
    ? 'ring-red-400 t-current:ring-green-400'
    : 'ring-blue-400 t-current:ring-purple-400'
})

let colors = [
  '#f87171',
  '#fb923c',
  '#facc15',
  '#a3e635',
  '#4ade80',
  '#2dd4bf',
  '#60a5fa',
  '#581c87',
  '#fb7185',
]
</script>

<template>
  <div class="absolute z-50 top-14 right-32">
    <ConfettiExplosion
      v-if="winner == 'user'"
      :colors="colors"
      :particleSize="2"
      :particleCount="100"
    />
  </div>
  <div
    ref="overlay"
    class="absolute inset-0 z-50 w-full h-full bg-black opacity-0 bg-opacity-40"
  ></div>
  <div
    ref="popup"
    :class="popupClass"
    class="absolute left-0 right-0 z-[100] p-10 pb-6 mx-auto text-gray-400 scale-95 -translate-y-1/2 bg-gray-900 rounded-md ring-4 w-fit top-1/2"
  >
    <h2 class="text-3xl font-medium tracking-tight text-center">
      {{ message }}
    </h2>
    <div class="flex justify-center mt-6 space-x-8">
      <div
        :class="{ 'scale-110': winner == 'user', 'scale-90': loser == 'user' }"
      >
        <h3 class="text-5xl text-red-400 t-current:text-green-400">
          {{ score.user }}
        </h3>
        <span class="block text-sm text-center">You</span>
      </div>
      <div
        :class="{ 'scale-110': winner == 'bot', 'scale-90': loser == 'bot' }"
      >
        <h3 class="text-5xl text-blue-400 t-current:text-purple-400">
          {{ score.bot }}
        </h3>
        <span class="block text-sm text-center">Bot</span>
      </div>
    </div>
    <Button text="New Game" class="w-full mx-auto mt-8" @click="beginNewGame" />
    <span
      @click="returnToMenu"
      class="block mt-4 text-sm text-center cursor-pointer hover:underline"
      >Main menu</span
    >
  </div>
</template>
