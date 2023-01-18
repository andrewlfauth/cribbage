<script setup>
import Button from '../Button.vue'
import Card from '../Card.vue'
import CardsAnimation from './CardsAnimation.vue'
import { ref } from 'vue'
import { useGameStore } from '../../stores/game'

const { setDealer, changeStage } = useGameStore()

const showInstructions = ref(false)
const resultMsg = ref('')
const animateOut = ref(false)
const endStage = ref(false)

const handleResults = (dealer) => {
  dealer == 'user'
    ? (resultMsg.value = 'You deal first!')
    : (resultMsg.value = 'Bot deals first')

  setDealer(dealer)
}

const startDealStage = () => {
  endStage.value = true
  changeStage('deal')
}
</script>

<template>
  <div class="w-full h-full p-8 flex items-center">
    <CardsAnimation
      :class="{ 'opacity-0 duration-300': endStage }"
      :animate-out="animateOut"
      @cards-spread="() => (showInstructions = true)"
      @cards-cut="() => (showInstructions = false)"
      @result="handleResults"
      @done="startDealStage"
    />
    <div v-if="endStage" class="absolute top-1/2 -translate-y-1/2">
      <Card :show-back="true" :card="{ value: '_', suit: '_' }" />
    </div>
    <div
      :class="{
        'opacity-0': !resultMsg || animateOut,
        'duration-300': animateOut,
        'duration-1000': !animateOut,
      }"
      class="absolute left-0 right-0 mx-auto text-center top-16"
    >
      <p class="text-4xl text-gray-400">{{ resultMsg }}</p>
      <Button
        @click="() => (animateOut = true)"
        text="Deal cards"
        class="mx-auto mt-6"
      />
    </div>
    <div
      class="text-center text-gray-400 absolute left-0 right-0 mx-auto top-1/2 translate-y-32 z-0 duration-700"
      :class="{ 'opacity-0': !showInstructions }"
    >
      <p class="text-3xl mb-4">Cut the cards</p>
      <p>Lowest card deals first</p>
    </div>
  </div>
</template>
