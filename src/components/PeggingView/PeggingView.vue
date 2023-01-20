<script setup>
import Card from '../Card.vue'
import { useGameStore } from '../../stores/game'
import { onMounted } from 'vue'

const { game } = useGameStore()

onMounted(() => {
  console.log(game)
})
</script>

<template>
  <div class="flex flex-col h-full justify-between p-8 relative">
    <div
      class="absolute w-[115px] h-[175px]"
      :class="{
        'bottom-8': game.dealer == 'user',
        'top-8': game.dealer == 'bot',
      }"
    >
      <Card
        v-for="card in game.crib"
        :card="card"
        :key="card"
        :show-back="true"
        class="absolute cursor-default"
      />
    </div>
    <div
      ref="botsHandHome"
      class="h-[175px] w-[410px] self-center flex justify-center -space-x-14"
    >
      <Card
        v-for="card in game.botsHand"
        :card="card"
        :show-back="true"
        :key="card"
        :class="'cursor-default'"
      />
    </div>

    <div class="flex justify-center min-h-[175px]">
      <div class="absolute left-8">
        <Card
          :card="game.deck[19]"
          class="absolute cursor-default"
          :show-back="true"
        />
        <Card :card="game.deck[20]" class="absolute cursor-default" />
      </div>
    </div>

    <div
      ref="usersHandHome"
      class="h-[175px] w-[410px] self-center flex justify-center -space-x-14"
    >
      <Card v-for="card in game.usersHand" :card="card" :key="card" />
    </div>
  </div>
</template>
