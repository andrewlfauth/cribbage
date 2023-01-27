<script setup>
import { computed } from 'vue'

const props = defineProps({
  scoringType: String,
  points: Number,
  playerCounting: String,
})

const colorClass = computed(() => ({
  'text-red-400 t-current:text-green-400 t-domino:text-gray-100':
    props.playerCounting == 'user',
  'text-blue-400 t-current:text-purple-400 t-domino:text-black':
    props.playerCounting == 'bot',
}))
</script>

<template>
  <div class="flex items-center px-4 py-4 rounded-md pointer-events-none">
    <span class="text-2xl text-gray-400">{{
      props.scoringType.slice(0, 1).toUpperCase() +
      props.scoringType.slice(1) +
      ' for'
    }}</span>
    <span class="ml-4 text-5xl" :class="colorClass">{{ props.points }}</span>
  </div>
</template>
