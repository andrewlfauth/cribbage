<script setup>
import { reactive } from 'vue'
import Button from '../Button.vue'

const props = defineProps({
  player: String,
  total: Number,
  scores: Object,
  points: Object,
  isCrib: Boolean,
})
const emit = defineEmits(['clicked'])

let keys = Object.keys(props.scores).filter((key) => props.scores[key].length)

const textColorClass = reactive({
  'text-red-400 t-current:text-green-400 t-domino:text-gray-100':
    props.player == 'user',
  'text-blue-400 t-current:text-purple-400 t-domino:text-black':
    props.player == 'bot',
})

const buttonClass = reactive({
  'border-red-400 t-current:border-green-400 t-domino:border-gray-100':
    props.player == 'user',
  'border-blue-400 t-current:border-purple-400 t-domino:border-black':
    props.player == 'bot',
})
</script>

<template>
  <div
    style="box-shadow: 10px 10px 5px 0px rgba(0, 0, 0, 0.75)"
    class="absolute flex flex-col items-center px-4 py-2 text-gray-300 bg-gray-800 border-2 border-gray-700 rounded-md w-44"
  >
    <h3 class="text-lg tracking-tight">
      {{
        props.isCrib
          ? props.player == 'user'
            ? 'Your Crib Total'
            : "Bot's Crib Total"
          : props.player == 'user'
          ? 'Your hand total'
          : "Bot's hand total"
      }}
    </h3>
    <span class="mt-2 mb-4 text-6xl" :class="textColorClass">{{
      props.total
    }}</span>
    <Button
      text="Okay"
      @click="() => emit('clicked')"
      class="mb-4 bg-gray-900 ring-offset-gray-800"
      :class="buttonClass"
    />
    <div v-for="key in keys" class="mb-1 text-sm tracking-tight">
      <span
        >{{ props.scores[key].length != 1 ? props.scores[key].length : '' }}
        {{ props.scores[key].length == 1 ? key : key + 's' }} for
      </span>
      <span :class="textColorClass" class="text-base font-medium">{{
        key != 'flush' && key != 'nobs'
          ? props.points[key + 's']
          : props.points[key]
      }}</span>
      <span class="text-[11px]" :class="textColorClass">pts</span>
    </div>
  </div>
</template>
