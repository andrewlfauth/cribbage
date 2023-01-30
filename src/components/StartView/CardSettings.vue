<script setup>
import Card from '../Card.vue'
import { cardBacks } from '../../data/cards'
import { useThemeStore } from '../../stores/theme'

const { changeCard, theme } = useThemeStore()

const getBackgroundImage = (url) => `background-image: url('${url}');`
</script>

<template>
  <div class="mt-16 lg:mt-0">
    <span class="block mb-6 text-center text-gray-400">Choose cards:</span>
    <div class="flex space-x-6 md:space-x-10">
      <div class="flex flex-col items-center">
        <button
          @click="changeCard(cardBacks.default)"
          :class="{ 'bg-white bg-opacity-10': theme.card == cardBacks.default }"
          class="p-2 duration-150 rounded-md hover:bg-white hover:bg-opacity-10"
        >
          <div
            class="w-[65px] h-[100px] lg:w-[85px] lg:h-[128px] rounded-md border-2 border-gray-200 bg-gray-200"
          >
            <div
              :style="getBackgroundImage(cardBacks.default)"
              class="w-full h-full bg-cover rounded-md"
            ></div>
          </div>
        </button>
        <span class="mt-2 text-sm text-gray-400">Default</span>
      </div>
      <div class="flex flex-col items-center">
        <button
          @click="changeCard(cardBacks.paint)"
          :class="{ 'bg-white bg-opacity-10': theme.card == cardBacks.paint }"
          class="p-2 duration-150 rounded-md hover:bg-white hover:bg-opacity-10"
        >
          <div
            class="w-[65px] h-[100px] lg:w-[85px] lg:h-[128px] rounded-md border-2 border-gray-200 bg-gray-200"
          >
            <div
              :style="getBackgroundImage(cardBacks.paint)"
              class="w-full h-full bg-cover border rounded-md border-neutral-300"
            ></div>
          </div>
        </button>
        <span class="mt-2 text-sm text-gray-400">Paint</span>
      </div>
      <div class="flex flex-col items-center">
        <button
          @click="changeCard(cardBacks.fish)"
          :class="{ 'bg-white bg-opacity-10': theme.card == cardBacks.fish }"
          class="p-2 duration-150 rounded-md hover:bg-white hover:bg-opacity-10"
        >
          <div
            class="w-[65px] h-[100px] lg:w-[85px] lg:h-[128px] rounded-md border-2 border-gray-200 bg-gray-200"
          >
            <div
              :style="getBackgroundImage(cardBacks.fish)"
              class="w-full h-full bg-cover rounded-md"
            ></div>
          </div>
        </button>
        <span class="mt-2 text-sm text-gray-400">Fish</span>
      </div>
    </div>
  </div>
</template>
