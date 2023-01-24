<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useGameStore } from '../../stores/game'
import Card from '../Card.vue'
import Button from '../Button.vue'
import { gsap } from 'gsap'

const { game } = useGameStore()

const animationTrigger = ref(null)

onMounted(() => {
  gsap.from(animationTrigger.value, { opacity: 0.1 })
})

const startAnimation = () => {
  let tl = gsap.timeline()
  tl.to(animationTrigger.value, { opacity: 0, duration: 0.2 })
}

const ringStyles = reactive({
  'ring-red-400 t-current:ring-green-400 t-domino:ring-gray-100':
    game.dealer == 'bot',
  'ring-blue-400 t-current:ring-purple-400 t-domino:ring-black':
    game.dealer == 'user',
})
</script>

<template>
  <div class="relative flex flex-col justify-between h-full p-8">
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
      ref="botHand"
      class="h-[175px] w-[410px] self-center flex justify-center -space-x-14"
    >
      <Card
        v-for="card in game.botsHand"
        :card="card"
        :key="card"
        :class="'cursor-default'"
      />
    </div>

    <div class="flex h-[175px] relative items-center">
      <div class="absolute left-0 top-0">
        <Card
          :card="game.deck[19]"
          class="absolute cursor-default"
          :show-back="true"
        />
        <Card :card="game.deck[20]" class="absolute cursor-default" />
      </div>
      <div
        ref="animationTrigger"
        class="mx-auto flex flex-col items-center space-y-6"
      >
        <p class="text-3xl text-gray-400">
          <span>{{ game.dealer == 'user' ? 'Bot' : 'You' }}</span>
          {{ game.dealer == 'user' ? 'counts first' : 'count first' }}
        </p>
        <Button @click="startAnimation" :text="'Okay'" :class="ringStyles" />
      </div>
    </div>

    <div class="relative mx-auto w-fit">
      <div
        ref="userHand"
        class="h-[175px] w-[410px] self-center flex justify-center -space-x-14"
      >
        <Card v-for="card in game.usersHand" :card="card" :key="card" />
      </div>
    </div>
  </div>
</template>
