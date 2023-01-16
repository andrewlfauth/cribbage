<script setup>
import Card from '../Card.vue'
import { cardBacks } from '../../data/cards'
import { useThemeStore } from '../../stores/theme'

const { changeCard, theme } = useThemeStore()
</script>

<template>
  <span class="block text-center text-gray-400 mt-14 lg:mt-0"
    >Choose cards:</span
  >
  <div class="flex -mt-5 -space-x-8 md:-space-x-4 lg:-mt-28">
    <div class="flex flex-col items-center">
      <button
        :class="{ 'bg-white bg-opacity-10': theme.card == cardBacks.default }"
        class="p-4 scale-[.6] rounded-md hover:bg-white hover:bg-opacity-10 duration-150"
      >
        <Card
          :showBack="true"
          :bg="cardBacks.default"
          @clicked="changeCard(cardBacks.default)"
        />
      </button>
      <span class="-mt-8 text-sm text-gray-400">Default</span>
    </div>
    <div class="flex flex-col items-center">
      <button
        :class="{ 'bg-white bg-opacity-10': theme.card == cardBacks.fish }"
        class="p-4 scale-[.6] rounded-md hover:bg-white hover:bg-opacity-10 duration-150"
      >
        <Card
          :showBack="true"
          :bg="cardBacks.fish"
          @clicked="changeCard(cardBacks.fish)"
        />
      </button>
      <span class="-mt-8 text-sm text-gray-400">Fish</span>
    </div>
    <div class="flex flex-col items-center">
      <button
        :class="{ 'bg-white bg-opacity-10': theme.card == cardBacks.paint }"
        class="p-4 scale-[.6] rounded-md hover:bg-white hover:bg-opacity-10 duration-150"
      >
        <Card
          :showBack="true"
          :bg="cardBacks.paint"
          @clicked="changeCard(cardBacks.paint)"
        />
      </button>
      <span class="-mt-8 text-sm text-gray-400">Paint</span>
    </div>
  </div>
</template>
