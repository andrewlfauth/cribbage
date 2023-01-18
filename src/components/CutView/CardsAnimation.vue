<script setup>
import Card from '../Card.vue'
import {
  getSplitCenteredXOffset,
  objectsEqual,
  wait,
} from '../../utils/helpers'
import { ref, onMounted, watchEffect } from 'vue'
import { useGameStore } from '../../stores/game'
import { gsap } from 'gsap'

const props = defineProps({
  animateOut: false,
})
const emit = defineEmits(['cards-spread', 'cards-cut', 'result', 'done'])

const { game } = useGameStore()

const usersCard = ref()
const botsCard = ref()

const container = ref(null)
const spread = ref(null)
const revealer = ref(null)

onMounted(() => {
  let tl = gsap.timeline()
  let cardWidth = spread.value.children[0].offsetWidth

  tl.from(container.value, { x: 200, y: 200, duration: 0.5 })
  tl.from(spread.value.children, { opacity: 0, duration: 0 })
  tl.to(
    revealer.value,
    {
      x: spread.value.offsetWidth - cardWidth,
      duration: 0.8,
      ease: 'power2.out',
    },
    '+=.1'
  )
  tl.call(() => emit('cards-spread'))
  tl.to(revealer.value, { zIndex: 0 })
})

const cutCards = async (e) => {
  if (usersCard.value) return

  emit('cards-cut')

  let usersCardEl = e.target
  usersCard.value = JSON.parse(usersCardEl.dataset.card)

  let botsCutIdx = Math.floor(Math.random() * 51)
  while (game.deck[botsCutIdx].order == usersCard.value.order) {
    botsCutIdx = Math.floor(Math.random() * 51)
  }
  let botsCardObj = game.deck[botsCutIdx]
  let botsCardEl = document.querySelector(
    `[data-card='${JSON.stringify(botsCardObj)}']`
  )

  let tl = gsap.timeline()
  tl.to(usersCardEl, { y: -50, zIndex: 50 })
  tl.to(usersCardEl, {
    x: getSplitCenteredXOffset(usersCardEl, 'left'),
    y: 15,
    scale: 1.2,
    boxShadow: '10px 10px 5px 0px rgba(0,0,0,0.65)',
  })

  await wait(1)
  botsCard.value = botsCardObj

  tl.to(botsCardEl, { y: -50, zIndex: 50 })
  tl.to(botsCardEl, {
    x: getSplitCenteredXOffset(botsCardEl, 'right'),
    y: 15,
    scale: 1.2,
    boxShadow: '10px 10px 5px 0px rgba(0,0,0,0.65)',
  })

  tl.to(revealer.value, { zIndex: 20 }, '-=1')
  tl.to(revealer.value, { x: 0, ease: 'power1.in', duration: 0.4 })

  const dealer = usersCard.value.order < botsCard.value.order ? 'user' : 'bot'
  tl.call(() => emit('result', dealer), null, '+=0.2')
}

watchEffect(() => {
  if (props.animateOut) {
    let tl = gsap.timeline()
    let distanceFromEdge = 32 - revealer.value.getBoundingClientRect().left
    tl.to([revealer.value, spread.value], { x: distanceFromEdge })
    tl.call(() => emit('done'))
  }
})
</script>

<template>
  <div ref="container" class="relative mx-auto">
    <div
      ref="revealer"
      class="absolute w-[102%] flexitems-center py-10 bg-gray-900 top-1/2 -translate-y-1/2 z-20"
    >
      <div>
        <Card :show-back="true" :card="{ suit: 'a', value: 'a' }" />
      </div>
    </div>
    <div ref="spread" class="relative flex -space-x-[6.25rem]">
      <div
        v-for="card in game.deck"
        @click="cutCards"
        v-bind:data-card="JSON.stringify(card)"
        class="z-10 duration-100 origin-bottom"
        :class="{ 'hover:-translate-y-2 cursor-pointer': !usersCard }"
      >
        <Card
          :card="card"
          :show-back="true"
          :flip="objectsEqual(card, usersCard) || objectsEqual(card, botsCard)"
          :class="'pointer-events-none'"
        />
      </div>
    </div>
  </div>
</template>
