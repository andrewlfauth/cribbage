<script setup>
import Card from '../Card.vue'
import { useGameStore } from '../../stores/game'
import { usePeggingStore } from '../../stores/pegging'
import { objectsEqual, wait } from '../../utils/helpers'
import { ref, onMounted, watchEffect } from 'vue'
import { gsap } from 'gsap'
import Flip from 'gsap/Flip'
import GoIndicator from './GoIndicator.vue'

gsap.registerPlugin(Flip)

const { game } = useGameStore()
const { pegging, playCard, getBotsCard, startTurn } = usePeggingStore()

const activeCards = ref(null)
const spentCards = ref(null)
const userHand = ref(null)
const botHand = ref(null)
const peggingCount = ref(null)

let state

onMounted(() => {
  if (pegging.dealer == 'user') {
    startTurn('bot')
  } else {
    startTurn('user')
  }

  gsap.from(peggingCount.value, {
    x: -250,
    ease: 'elastic.out(.4, 0.5)',
    duration: 0.7,
  })
})

const selectCard = (card) => {
  if (pegging.waitForUserCard) {
    playCard(card)
    animateCardPlay(card)
  }
}

const botsTurn = async () => {
  await wait(1)
  startTurn('bot')
  if (pegging.waitForBotCard) {
    let card = getBotsCard()
    playCard(card, 'bot')
    animateCardPlay(card, true)
  }
}

watchEffect(() => {
  if (pegging.waitForBotCard) {
    botsTurn()
  }
})

watchEffect(() => {
  if (pegging.go.user) {
    console.log('USER GO')
  }
  if (pegging.go.bot) {
    console.log('BOT GO')
  }
})

const animateSpentCards = async () => {
  await wait(0.7)
  if (pegging.spent.length) {
    state = Flip.getState(activeCards.value?.children)

    let oldActiveCards = [...activeCards.value.children]
    oldActiveCards.forEach((card) => spentCards.value.appendChild(card))

    Flip.from(state, {
      duration: 0.7,
      ease: 'power1.inOut',
    })
  }
}

watchEffect(() => {
  if (pegging.spent?.length) {
    animateSpentCards()
  }
})

const animateCardPlay = (card, botsTurn) => {
  let cardEl = document.querySelector(`[data-card='${JSON.stringify(card)}']`)

  botsTurn
    ? (state = Flip.getState(botHand.value.children))
    : (state = Flip.getState(userHand.value.children))

  activeCards.value.appendChild(cardEl)

  gsap.to(cardEl, {
    zIndex: 50,
    boxShadow: '10px 10px 5px 0px rgba(0,0,0,0.65)',
  })
  gsap.to(cardEl, {
    zIndex: 0,
    boxShadow: 'none',
    delay: 0.7,
  })

  Flip.from(state, {
    duration: 0.7,
    ease: 'power1.inOut',
  })
}
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
        :show-back="true"
        :key="card"
        :flip="pegging.active.some((c) => objectsEqual(c, card))"
        :class="'cursor-default'"
      />
    </div>

    <div
      class="flex min-h-[175px] relative w-full border-green-500 boder justify-end"
    >
      <div
        ref="peggingCount"
        style="box-shadow: 10px 10px 5px 0px rgba(0, 0, 0, 0.85)"
        class="absolute left-4 flex-col top-10 z-10 px-3 py-2 border border-gray-600 rounded-md bg-gray-800 flex items-center space-x-2"
      >
        <span class="font-light text-sm text-gray-300"> Pegging count: </span>
        <span class="text-4xl font-medium pt-1 text-gray-100 tracking-tight">{{
          pegging.count
        }}</span>
      </div>
      <div class="absolute left-0">
        <Card
          :card="game.deck[19]"
          class="absolute cursor-default"
          :show-back="true"
        />
        <Card :card="game.deck[20]" class="absolute cursor-default" />
      </div>

      <GoIndicator
        :show="pegging.go.bot"
        class="-top-36 text-blue-400 border-blue-400 t-current:text-purple-400 t-current:border-purple-400 t-domino:text-black t-domino:border-black"
      />
      <GoIndicator
        :show="pegging.go.user"
        class="-bottom-36 text-red-400 border-red-400 t-current:text-green-400 t-domino:text-gray-100"
      />

      <div class="flex w-3/4">
        <div
          ref="activeCards"
          class="h-full w-1/2 flex -space-x-[4.9rem]"
        ></div>
        <div
          ref="spentCards"
          class="h-full w-1/2 flex -space-x-[4.9rem] justify-end"
        ></div>
      </div>
    </div>

    <div class="w-fit mx-auto relative">
      <div
        ref="userHand"
        class="h-[175px] w-[410px] self-center flex justify-center -space-x-14"
      >
        <Card
          v-for="card in game.usersHand"
          :card="card"
          :key="card"
          @clicked="selectCard"
        />
      </div>
    </div>
  </div>
</template>
