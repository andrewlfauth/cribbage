<script setup>
import CribSelection from './CribSelection.vue'
import DealAnimation from './DealAnimation.vue'
import { useGameStore } from '../../stores/game'
import { ref } from 'vue'

const { game, changeStage } = useGameStore()

let cardsDealt = ref(false)

const handleCardsDealt = () => {
  cardsDealt.value = true
}

const handleCribSelected = (usersHand, botsHand) => {
  game.usersHand = usersHand
  game.botsHand = botsHand
  changeStage('pegging')
}
</script>

<template>
  <DealAnimation v-if="!cardsDealt" @done="handleCardsDealt" />
  <CribSelection v-if="cardsDealt" @end-stage="handleCribSelected" />
</template>
