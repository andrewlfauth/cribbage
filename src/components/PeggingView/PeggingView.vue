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

const { game, changeStage } = useGameStore()
const { pegging, playCard, getBotsCard, startTurn } = usePeggingStore()

const botsFlippedCards = ref([])
const cardsPlayed = ref(0)
const showMessage = ref(pegging.turn == 'user')

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

watchEffect(() => {
  let id
  if (pegging.turn == 'user' && cardsPlayed.value !== 8) {
    id = setTimeout(() => (showMessage.value = true), 500)
  } else {
    clearTimeout(id)
    showMessage.value = false
  }
})

const selectCard = (card) => {
  if (pegging.waitForUserCard) {
    playCard(card)
    animateCardPlay(card)
    cardsPlayed.value++
  }
}

const botsTurn = async () => {
  await wait(1)
  startTurn('bot')
  if (pegging.waitForBotCard) {
    let card = getBotsCard()
    botsFlippedCards.value.push(card)
    playCard(card, 'bot')
    animateCardPlay(card, true)
    cardsPlayed.value++
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

    let oldActiveCards = [...activeCards.value.children].reverse()
    oldActiveCards.forEach((card) => {
      card.style.zIndex = 0
      spentCards.value.prepend(card)
    })

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

const animateOut = async () => {
  let tl = gsap.timeline()
  animateSpentCards()
  await wait(2)
  let cards = [...spentCards.value.children]
  let usersCards = cards.filter((card) =>
    game.usersHand.some((c) => objectsEqual(c, JSON.parse(card.dataset.card)))
  )
  let botsCards = cards.filter((card) =>
    game.botsHand.some((c) => objectsEqual(c, JSON.parse(card.dataset.card)))
  )

  let state = Flip.getState(spentCards.value.children)
  usersCards
    .sort(
      (a, b) =>
        JSON.parse(a.dataset.card).order - JSON.parse(b.dataset.card).order
    )
    .forEach((el) => userHand.value.appendChild(el))
  botsCards
    .sort(
      (a, b) =>
        JSON.parse(a.dataset.card).order - JSON.parse(b.dataset.card).order
    )
    .forEach((el) => botHand.value.appendChild(el))

  Flip.from(state, {
    duration: 0.7,
    ease: 'power1.inOut',
  })
  tl.to(peggingCount.value, { x: -250, delay: 1 })
  tl.call(() => changeStage('count'))
}

watchEffect(() => {
  if (cardsPlayed.value == 8) {
    animateOut()
  }
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
        :show-back="true"
        :key="card"
        :flip="botsFlippedCards.some((c) => objectsEqual(c, card))"
        :class="'cursor-default'"
      />
    </div>

    <div
      class="flex min-h-[175px] relative w-full border-green-500 boder justify-end"
    >
      <div
        ref="peggingCount"
        style="box-shadow: 10px 10px 5px 0px rgba(0, 0, 0, 0.85)"
        class="absolute z-10 flex flex-col items-center px-3 py-2 space-x-2 bg-gray-800 border border-gray-600 rounded-md left-4 top-10"
      >
        <span class="text-sm font-light text-gray-300"> Pegging count: </span>
        <span class="pt-1 text-4xl font-medium tracking-tight text-gray-100">{{
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
      <span
        v-if="showMessage"
        class="absolute w-fit left-0 right-0 mx-auto -bottom-10 text-gray-400"
      >
        Select a card to play
      </span>

      <GoIndicator
        :show="pegging.go.bot"
        class="text-blue-400 border-blue-400 -top-36 t-current:text-purple-400 t-current:border-purple-400 t-domino:text-black t-domino:border-black"
      />
      <GoIndicator
        :show="pegging.go.user"
        class="text-red-400 border-red-400 -bottom-36 t-current:text-green-400 t-domino:text-gray-100"
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

    <div class="relative mx-auto w-fit">
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
