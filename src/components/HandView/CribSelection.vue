<script setup>
import Card from '../Card.vue'
import { useGameStore } from '../../stores/game'
import { gsap } from 'gsap'
import Flip from 'gsap/Flip'
import { ref } from 'vue'
import { removeObjFromArray, arrayIncludesObject } from '../../utils/helpers'

gsap.registerPlugin(Flip)

const { game } = useGameStore()

const selectedCards = ref([])
const usersHandEl = ref(null)
const crib = ref(null)

const selectCard = (selection) => {
  let cardString = JSON.stringify(selection)
  const el = document.querySelector(`[data-card='${cardString}'`)

  let state = Flip.getState(usersHandEl.value.children)

  let alreadySelected = arrayIncludesObject(selection, selectedCards.value)

  if (alreadySelected) {
    state = Flip.getState(el)

    usersHandEl.value.appendChild(el)
    gsap.to(el, { boxShadow: '10px 10px 5px 0px rgba(0,0,0,0.65)' })
    gsap.to(el, { boxShadow: 'none', delay: 1, duration: 0.2 })

    selectedCards.value = removeObjFromArray(selection, selectedCards.value)
  } else {
    if (selectedCards.value.length == 2) return
    crib.value.appendChild(el)
    gsap.to(el, { boxShadow: '10px 10px 5px 0px rgba(0,0,0,0.65)' })
    gsap.to(el, { boxShadow: 'none', delay: 1, duration: 0.2 })
    el.style.zIndex = 50

    selectedCards.value.push(selection)
  }

  Flip.from(state, {
    duration: 1,
    ease: 'power1.inOut',
    // zIndex: 50,
    // absolute: true,
    // scale: true,
  })
}
</script>

<template>
  <div class="flex flex-col h-full justify-between p-8">
    <div
      ref="botsHandEl"
      class="h-[175px] w-[410px] self-center flex items-center -space-x-14"
    >
      <Card v-for="card in game.botsHand" :card="card" :show-back="true" />
    </div>

    <div class="flex justify-center">
      <Card
        :card="{ value: '_', order: '_' }"
        :show-back="true"
        class="absolute left-8"
      />

      <div
        ref="crib"
        class="border border-white flex w-[200px] h-[175px] -space-x-8"
      ></div>
    </div>

    <div
      ref="usersHandEl"
      class="h-[175px] w-[410px] self-center flex items-center justify-center -space-x-14"
    >
      <Card
        v-for="card in game.usersHand"
        :card="card"
        @clicked="selectCard"
        v-bind:data-card="JSON.stringify(card)"
      />
    </div>
  </div>
</template>
