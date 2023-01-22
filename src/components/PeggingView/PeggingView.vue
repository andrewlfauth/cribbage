<script setup>
import Card from '../Card.vue'
import { useGameStore } from '../../stores/game'
import { usePeggingStore } from '../../stores/pegging'
import { objectsEqual, wait } from '../../utils/helpers'
import { ref, onMounted, watchEffect } from 'vue'
import { gsap } from 'gsap'
import Flip from 'gsap/Flip'

gsap.registerPlugin(Flip)

const { game } = useGameStore()
const { pegging, playCard, getBotsCard, startTurn } = usePeggingStore()

const activeCards = ref(null)
const spentCards = ref(null)
const userHand = ref(null)
const botHand = ref(null)

let state

onMounted(() => {
  if (pegging.dealer == 'user') {
    startTurn('bot')
  } else {
    startTurn('user')
  }
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
      <div class="absolute left-0">
        <Card
          :card="game.deck[19]"
          class="absolute cursor-default"
          :show-back="true"
        />
        <Card :card="game.deck[20]" class="absolute cursor-default" />
      </div>

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
      <span
        class="absolute -top-10 block w-full text-center text-gray-400 duration-300"
        >{{ pegging.turn }}'s turn to play a card</span
      >
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