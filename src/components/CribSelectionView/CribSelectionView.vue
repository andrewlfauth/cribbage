<script setup>
import CribSelection from './CribSelection.vue'
import DealAnimation from './DealAnimation.vue'
import { useGameStore } from '../../stores/game'
import { ref } from 'vue'

const { game, changeStage } = useGameStore()

let simulatedStage = ref('deal')

const handleCardsDealt = () => {
  simulatedStage.value = 'crib-selection'
  // change stage
}

const handleCribSelected = (usersHand, botsHand) => {
  simulatedStage.value = 'pegging'
  game.usersHand = usersHand
  game.botsHand = botsHand

  changeStage('pegging')
  // chnage stage
}
</script>

<template>
  <DealAnimation
    v-if="simulatedStage == 'deal'"
    @cards-dealt="handleCardsDealt"
  />
  <CribSelection
    v-if="simulatedStage == 'crib-selection'"
    @end-stage="handleCribSelected"
  />
</template>
