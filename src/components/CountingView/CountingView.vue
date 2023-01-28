<script setup>
import { ref } from 'vue'
import { useGameStore } from '../../stores/game'
import { useScoreStore } from '../../stores/score'
import HandCounting from './HandCounting.vue'
import CribCounting from './CribCounting.vue'

const { startNewHand } = useGameStore()
const { resetHandScores } = useScoreStore()

const countingStage = ref('hand')
const countCrib = () => (countingStage.value = 'crib')
const newHand = () => {
  resetHandScores()
  startNewHand()
}
</script>

<template>
  <HandCounting v-if="countingStage == 'hand'" @done-counting="countCrib" />
  <CribCounting v-if="countingStage == 'crib'" @done-counting="newHand" />
</template>
