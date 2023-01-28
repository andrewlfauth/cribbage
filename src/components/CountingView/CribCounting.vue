<script setup>
import { ref, onBeforeMount, onMounted } from 'vue'
import Card from '../Card.vue'
import { gsap } from 'gsap'
import Flip from 'gsap/Flip'
import { wait } from '../../utils/helpers'
import { useScoreStore } from '../../stores/score'
import { useGameStore } from '../../stores/game'
import PointsPopup from './PointsPopup.vue'
import HandTotal from './HandTotal.vue'

gsap.registerPlugin(Flip)
let tl = gsap.timeline()

const emit = defineEmits(['done-counting'])

const { score, calculateCribScores, getCardElementsThatScored } =
  useScoreStore()
const { game } = useGameStore()
game.dealer = 'bot'
game.botsHand = [
  { suit: '♣', value: '8', order: 8, count: 8 },
  { suit: '♥', value: 'Q', order: 12, count: 10 },
  { suit: '♠', value: 'Q', order: 12, count: 10 },
  { suit: '♦', value: 'Q', order: 12, count: 10 },
]
game.usersHand = [
  { suit: '♦', value: '2', order: 2, count: 2 },
  { suit: '♥', value: '6', order: 6, count: 6 },
  { suit: '♠', value: 'K', order: 13, count: 10 },
  { suit: '♥', value: 'K', order: 13, count: 10 },
]
game.crib = [
  { suit: '♠', value: '3', order: 3, count: 3 },
  { suit: '♠', value: '6', order: 6, count: 6 },
  { suit: '♠', value: 'J', order: 11, count: 10 },
  { suit: '♠', value: '4', order: 4, count: 4 },
]

const flipHands = ref(false)
const flipCrib = ref(false)
const flipCutCard = ref(false)
const showHandTotal = ref(false)
const scoringTypes = Object.keys(score.crib)
const currentScoringType = ref(scoringTypes[0])
let state

const botHand = ref(null)
const userHand = ref(null)
const deck = ref(null)
const crib = ref(null)
const pointsPopup = ref(null)

let popupPoints = ref(0)
let currentScores = ref({
  fifteens: 0,
  pairs: 0,
  runs: 0,
  flush: 0,
  nobs: 0,
})

onBeforeMount(() => calculateCribScores())

onMounted(async () => {
  animateCountedHandsOut()
  animateCribCardsIn()
  await wait(2)
  flipCrib.value = true
  await wait(1)
  animateCount()
})

const animateCountedHandsOut = () => {
  let hands = [].concat(
    [...userHand.value.children],
    [...botHand.value.children]
  )
  state = Flip.getState(hands)

  flipHands.value = true
  hands.forEach((card) => {
    deck.value.prepend(card)
    card.classList.add('absolute')
  })

  Flip.from(state, {
    duration: 0.7,
    ease: 'power1.inOut',
    stagger: 0.1,
    delay: 0.5,
  })
}

const animateCribCardsIn = () => {
  let cards = [...crib.value.children]
  state = Flip.getState(cards)

  cards.forEach((card) => {
    botHand.value.appendChild(card)
    card.classList.remove('absolute')
  })

  Flip.from(state, {
    duration: 0.7,
    ease: 'power1.inOut',
    delay: 2,
  })
}

const animateCount = () => {
  let els = getCardElementsThatScored(score.crib)

  scoringTypes.forEach((type) => {
    tl.call(() => (currentScoringType.value = type))
    els[type].forEach((cards) => {
      tl.call(() => {
        let pointsAdded = incrementPoints(type, cards)
        popupPoints.value = pointsAdded
      })
      raiseCards(cards)
    })
  })
  tl.call(() => (showHandTotal.value = true))
}

const animateOut = async () => {
  if (game.dealer == 'user') score.user += score.cribTotal
  else score.bot += score.cribTotal

  showHandTotal.value = false
  flipCrib.value = false

  let cribCards =
    game.dealer == 'user'
      ? [...userHand.value.children]
      : [...botHand.value.children]
  let state = Flip.getState(cribCards)

  cribCards.reverse().forEach((card) => {
    deck.value.prepend(card)
    card.style.position = 'absolute'
  })

  Flip.from(state, {
    duration: 0.7,
    ease: 'power1.inOut',
    stagger: 0.1,
  })

  await wait(1)
  flipCutCard.value = true
  await wait(1)
  emit('done-counting')
}

const raiseCards = (cards) => {
  tl.to(cards, { y: -10, duration: 0.3 })
  tl.to(cards, { y: 0, duration: 0.3 })
  tl.to(pointsPopup.value, { opacity: 1, scale: 1 }, '-=.4')
  tl.to(
    pointsPopup.value,
    { opacity: 0, scale: 0.97, duration: 0.1, ease: 'power1.out' },
    '+=.2'
  )
}

const incrementPoints = (type, cards) => {
  switch (type) {
    case 'fifteen':
      currentScores.value.fifteens += 2
      return 2
    case 'pair':
      currentScores.value.pairs += 2
      return 2
    case 'run':
      currentScores.value.runs += cards.length
      return cards.length
    case 'flush':
      currentScores.value.flush += cards.length
      return cards.length
    case 'nobs':
      currentScores.value.nobs++
      return 1
  }
}
</script>

<template>
  <div class="relative flex flex-col justify-between h-full p-8">
    <div
      ref="crib"
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
        :flip="flipCrib"
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
        :flip="flipHands"
      />
    </div>

    <div class="flex h-[175px] relative items-center justify-center">
      <div ref="deck" class="absolute top-0 left-0">
        <Card
          :card="game.deck[19]"
          class="absolute cursor-default"
          :show-back="true"
        />
        <Card
          :card="game.deck[20]"
          class="absolute cursor-default"
          :flip="flipCutCard"
        />
      </div>
      <div
        ref="pointsPopup"
        class="flex items-center opacity-0 pointer-events-none"
        :class="game.dealer == 'user' ? 'mt-44' : '-mt-44'"
      >
        <PointsPopup
          :player-counting="game.dealer"
          :scoring-type="currentScoringType"
          :points="popupPoints"
        />
      </div>
      <HandTotal
        v-if="showHandTotal"
        :player="game.dealer"
        :total="score.cribTotal"
        :scores="score.crib"
        :points="currentScores"
        :is-crib="true"
        @clicked="animateOut"
      />
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
          :flip="flipHands"
        />
      </div>
    </div>
  </div>
</template>
