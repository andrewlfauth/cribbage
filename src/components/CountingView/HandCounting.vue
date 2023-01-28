<script setup>
import { onMounted, ref, computed, onBeforeMount } from 'vue'
import { useGameStore } from '../../stores/game'
import { useScoreStore } from '../../stores/score'
import Card from '../Card.vue'
import Button from '../Button.vue'
import HandTotal from './HandTotal.vue'
import PointsPopup from './PointsPopup.vue'
import { gsap } from 'gsap'

const { game } = useGameStore()
const { score, calculateHandScores, getCardElementsThatScored } =
  useScoreStore()

const emit = defineEmits(['done-counting'])

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

const animationTrigger = ref(null)
const pointsPopup = ref(null)

let tl = gsap.timeline()
let scoringTypes = Object.keys(score.usersHand)
let currentScoringType = ref(scoringTypes[0])
let popupPoints = ref(0)

const showHandTotal = ref(false)
let countedFirstHand = ref(false)

let playerCounting = computed(() => {
  if (countedFirstHand.value) return game.dealer
  else return game.dealer == 'user' ? 'bot' : 'user'
})

let currentScores = ref({
  fifteens: 0,
  pairs: 0,
  runs: 0,
  flush: 0,
  nobs: 0,
})

onBeforeMount(() => calculateHandScores())

onMounted(() => gsap.from(animationTrigger.value, { opacity: 0.1 }))

const countFirstHand = () => {
  tl.to(animationTrigger.value, {
    opacity: 0,
    pointerEvents: 'none',
    duration: 0.2,
  })
  animateCount(game.dealer == 'user' ? score.botsHand : score.usersHand)
}

const acceptCount = () => {
  showHandTotal.value = false
  if (playerCounting.value == 'user') score.user += score.usersHandTotal
  else score.bot += score.botsHandTotal
  if (!countedFirstHand.value) {
    countedFirstHand.value = true
    Object.keys(currentScores.value).forEach(
      (key) => (currentScores.value[key] = 0)
    )

    animateCount(game.dealer == 'user' ? score.usersHand : score.botsHand)
  } else emit('done-counting')
}

const animateCount = (hand) => {
  let els = getCardElementsThatScored(hand)

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
    <div class="flex h-[175px] relative items-center justify-center">
      <div class="absolute top-0 left-0">
        <Card
          :card="game.deck[19]"
          class="absolute cursor-default"
          :show-back="true"
        />
        <Card :card="game.deck[20]" class="absolute cursor-default" />
      </div>
      <div
        ref="animationTrigger"
        class="absolute left-0 right-0 flex flex-col items-center mx-auto space-y-6"
      >
        <p class="text-3xl text-gray-400">
          <span>{{ game.dealer == 'user' ? 'Bot' : 'You' }}</span>
          {{ game.dealer == 'user' ? 'counts first' : 'count first' }}
        </p>
        <Button @click="countFirstHand" :text="'Okay'" />
      </div>
      <div
        ref="pointsPopup"
        class="flex items-center opacity-0 pointer-events-none"
        :class="playerCounting == 'user' ? 'mt-44' : '-mt-44'"
      >
        <PointsPopup
          :scoringType="currentScoringType"
          :points="popupPoints"
          :player-counting="playerCounting"
        />
      </div>
      <HandTotal
        v-if="showHandTotal"
        :player="playerCounting"
        :total="
          playerCounting == 'user' ? score.usersHandTotal : score.botsHandTotal
        "
        :scores="playerCounting == 'user' ? score.usersHand : score.botsHand"
        :points="currentScores"
        @clicked="acceptCount"
      />
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
