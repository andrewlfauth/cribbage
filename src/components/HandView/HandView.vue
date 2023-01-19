<script setup>
import CribSelection from './CribSelection.vue'
import DealAnimation from './DealAnimation.vue'
import { useGameStore } from '../../stores/game'
import { ref } from 'vue'

const { game, changeStage } = useGameStore()

let simulatedStage = ref('deal')

const handleCardsDealt = () => {
  simulatedStage.value = 'crib-selection'
}
</script>

<template>
  <DealAnimation
    v-if="simulatedStage == 'deal'"
    @cards-dealt="handleCardsDealt"
  />
  <CribSelection v-if="simulatedStage == 'crib-selection'" />
</template>
