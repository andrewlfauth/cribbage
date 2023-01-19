<script setup>
import Card from '../Card.vue'
import { objectsEqual, wait } from '../../utils/helpers'
import { useGameStore } from '../../stores/game'
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import Flip from 'gsap/Flip'

gsap.registerPlugin(Flip)

const { game, addCardToHand } = useGameStore()

const emit = defineEmits(['cards-dealt'])

const deck = ref(null)
const usersHandEl = ref(null)
const botsHandEl = ref(null)
const dealtCard = ref()

onMounted(async () => {
  let cards = [...deck.value.children]
  let usersHand = []
  let botsHand = []

  for (let i = 0; i < 6; i++) {
    if (game.dealer == 'user') {
      let botsCard = cards.pop()
      let usersCard = cards.pop()
      botsHand.push(botsCard)
      usersHand.push(usersCard)
    } else {
      let usersCard = cards.pop()
      let botsCard = cards.pop()
      usersHand.push(usersCard)
      botsHand.push(botsCard)
    }
  }
  usersHand.sort(
    (a, b) => parseInt(a.dataset.order) - parseInt(b.dataset.order)
  )

  for (let i = 0; i < 6; i++) {
    if (game.dealer == 'bot') {
      await wait(0.1)
      dealCard(usersHand[i], 'user', i)
      await wait(0.1)
      dealCard(botsHand[i], 'bot', i)
    } else {
      await wait(0.1)
      dealCard(botsHand[i], 'bot', i)
      await wait(0.1)
      dealCard(usersHand[i], 'user', i)
    }
  }
  setTimeout(() => {
    emit('cards-dealt')
  }, 1100)
})

async function dealCard(card, player, i) {
  let cardObj = JSON.parse(card.dataset.card)
  let state = Flip.getState(card)

  card.style.position = 'relative'
  card.style.zIndex = 10

  if (player == 'user') {
    usersHandEl.value.appendChild(card)
  } else {
    botsHandEl.value.appendChild(card)
  }
  addCardToHand(card, player)

  Flip.from(state, {
    duration: 1,
    ease: 'power1.inOut',
  })
  if (player == 'user') {
    await wait((i + 0.1) / 10)
    dealtCard.value = cardObj
  }
}
</script>

<template>
  <div class="flex flex-col h-full justify-between p-8">
    <div
      ref="botsHandEl"
      class="h-[175px] w-[410px] self-center flex items-center -space-x-14"
    ></div>
    <div ref="deck" class="flex relative h-[175px]">
      <Card
        v-for="card in game.deck"
        :key="card"
        v-bind:data-card="JSON.stringify(card)"
        v-bind:data-order="card.order"
        :flip="objectsEqual(dealtCard, card)"
        :card="card"
        :show-back="true"
        class="absolute"
      />
    </div>
    <div
      ref="usersHandEl"
      class="h-[175px] w-[410px] self-center flex items-center -space-x-14"
    ></div>
  </div>
</template>
