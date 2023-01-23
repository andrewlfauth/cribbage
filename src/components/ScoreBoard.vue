<script setup>
import { useScoreStore } from '../stores/score'
import TextSlider from './TextSlider.vue'

const { score } = useScoreStore()
</script>

<template>
  <div class="absolute px-4 pt-2 pb-3 rounded-md top-2 right-4">
    <span
      class="block text-xs font-semibold tracking-tight text-center text-gray-400"
      >Points</span
    >
    <div class="flex mt-2 space-x-2">
      <div
        class="flex flex-col items-center font-semibold text-red-400 t-current:text-green-400 t-domino:text-gray-100"
      >
        <div class="w-16 text-center border-2 border-gray-800 rounded">
          <TextSlider :reactive-text="score.user" :text-class="'text-3xl'" />
        </div>
        <span class="mt-1 text-sm tracking-tight text-gray-400">You</span>
      </div>

      <div
        class="flex flex-col items-center font-semibold text-blue-500 t-current:text-purple-400 t-domino:text-black"
      >
        <div
          class="w-16 text-center border-2 border-gray-800 rounded t-domino:bg-gray-800"
        >
          <TextSlider :reactive-text="score.bot" :text-class="'text-3xl'" />
        </div>
        <span class="mt-1 text-sm tracking-tight text-gray-400">Bot</span>
      </div>
    </div>
  </div>
</template>
