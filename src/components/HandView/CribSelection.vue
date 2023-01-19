<script setup>
import Card from '../Card.vue'
import { useGameStore } from '../../stores/game'
import { gsap } from 'gsap'
import Flip from 'gsap/Flip'
import { ref } from 'vue'
import {
  removeObjFromArray,
  arrayIncludesObject,
  wait,
} from '../../utils/helpers'
import { getCribCards } from '../../utils/bot'
import Button from '../Button.vue'

gsap.registerPlugin(Flip)

const emit = defineEmits(['end-stage'])

const { game } = useGameStore()

const selectedCards = ref([])
const flipCards = ref(false)
const flipCutCard = ref(false)
const animationStart = ref(false)

const usersHandHome = ref(null)
const botsHandHome = ref(null)
const crib = ref(null)
const cribHome = ref(null)

const selectCard = (selection) => {
  let cardString = JSON.stringify(selection)
  const el = document.querySelector(`[data-card='${cardString}'`)

  let state = Flip.getState(usersHandHome.value.children)

  let alreadySelected = arrayIncludesObject(selection, selectedCards.value)

  if (alreadySelected) {
    state = Flip.getState(el)

    usersHandHome.value.appendChild(el)
    gsap.to(el, { boxShadow: '10px 10px 5px 0px rgba(0,0,0,0.65)' })
    gsap.to(el, { boxShadow: 'none', delay: 0.7, duration: 0.2 })

    selectedCards.value = removeObjFromArray(selection, selectedCards.value)
  } else {
    if (selectedCards.value.length == 2) return
    crib.value.appendChild(el)
    el.style.zIndex = 30
    gsap.to(el, { boxShadow: '10px 10px 5px 0px rgba(0,0,0,0.65)' })
    gsap.to(el, { boxShadow: 'none', zIndex: 0, delay: 0.7, duration: 0.2 })

    selectedCards.value.push(selection)
  }

  Flip.from(state, {
    duration: 0.7,
    ease: 'power1.inOut',
  })
}

const throwCards = async () => {
  if (selectedCards.value.length != 2) return
  animationStart.value = true
  flipCards.value = true

  let tl = gsap.timeline()
  let state

  let botsCardIdxs = getCribCards(game.botsHand)
  let card1El = botsHandHome.value.children[botsCardIdxs[0]]
  let card2El = botsHandHome.value.children[botsCardIdxs[1]]

  tl.call(() => {
    state = Flip.getState(botsHandHome.value.children, crib.value)

    card1El.style.position = 'absolute'
    crib.value.appendChild(card1El)
    card2El.style.position = 'absolute'
    crib.value.appendChild(card2El)

    Flip.from(state, {
      duration: 0.7,
      ease: 'power1.inOut',
      absolute: true,
    })
  })

  tl.call(
    () => {
      state = Flip.getState(crib.value)
      cribHome.value.appendChild(crib.value)
      Flip.from(state, {
        duration: 0.7,
        ease: 'power1.inOut',
        absolute: true,
      })
    },
    null,
    '+=.5'
  )
  tl.to(crib.value.children[1], { x: '-100%' }, '-=.5')
  tl.call(endStage)
}

const endStage = async () => {
  await wait(1)
  flipCutCard.value = true

  let usersHand = [...usersHandHome.value.children].map((el) =>
    JSON.parse(el.dataset.card)
  )
  let botsHand = [...botsHandHome.value.children].map((el) =>
    JSON.parse(el.dataset.card)
  )

  game.usersHand = usersHand
  game.botsHand = botsHand

  emit('end-stage')
}
</script>

<template>
  <div class="flex flex-col h-full justify-between p-8 relative">
    <div
      ref="cribHome"
      class="absolute w-[115px] h-[175px]"
      :class="{
        'bottom-8': game.dealer == 'user',
        'top-8': game.dealer == 'bot',
      }"
    ></div>
    <div
      ref="botsHandHome"
      class="h-[175px] w-[410px] self-center flex justify-center -space-x-14"
    >
      <Card
        v-for="card in game.botsHand"
        :card="card"
        :show-back="true"
        :key="card"
      />
    </div>

    <div class="flex justify-center min-h-[175px]">
      <div class="absolute left-8">
        <Card :card="game.deck[19]" :show-back="true" class="absolute" />
        <Card
          :card="game.deck[20]"
          :show-back="true"
          :flip="flipCutCard"
          class="absolute"
        />
      </div>

      <div class="relative">
        <div
          ref="crib"
          class="rounded-md border-gray-700 flex w-[230px] h-[175px]"
        ></div>
        <span
          class="absolute inset-0 mx-auto w-fit -top-10 text-xl font-medium"
          :class="{
            'opacity-0': animationStart,
            'text-red-400': game.dealer == 'user',
            'text-blue-400': game.dealer == 'bot',
          }"
          >{{ game.dealer == 'user' ? 'Your crib' : "Bot's crib" }}</span
        >
        <Button
          text="Throw"
          @click="throwCards"
          class="h-fit absolute inset-0 mx-auto my-auto z-50 bg-gray-900 border-gray-700"
          :class="{
            'opacity-0 pointer-events-none':
              selectedCards.length != 2 || animationStart,
          }"
        />
        <span
          :class="{ 'opacity-0': selectedCards.length }"
          class="absolute duration-500 inset-0 my-auto block mx-auto w-fit h-fit text-gray-400 tracking-tight"
          >Select 2 cards for crib</span
        >
      </div>
    </div>

    <div
      ref="usersHandHome"
      class="h-[175px] w-[410px] self-center flex justify-center -space-x-14"
    >
      <Card
        v-for="card in game.usersHand"
        :card="card"
        :key="card"
        :flip="arrayIncludesObject(card, selectedCards) && flipCards"
        @clicked="selectCard"
      />
    </div>
  </div>
</template>
