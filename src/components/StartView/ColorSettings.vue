<script setup>
import { useThemeStore } from '../../stores/theme'

const { theme, changeColor } = useThemeStore()
</script>

<template>
  <div>
    <span class="block mb-6 text-center text-gray-400">Choose colors:</span>
    <div class="flex space-x-10">
      <div>
        <button
          :class="{ 'bg-white bg-opacity-10': theme.color == 'classic' }"
          class="flex p-2 space-x-2 duration-150 rounded-md hover:bg-white hover:bg-opacity-10"
          @click="changeColor('classic')"
        >
          <div
            class="w-10 h-10 bg-red-400 border-4 border-gray-800 rounded"
          ></div>
          <div
            class="w-10 h-10 bg-blue-400 border-4 border-gray-800 rounded"
          ></div>
        </button>
        <span class="block mt-2 text-sm text-center text-gray-400 duration-100"
          >Classic</span
        >
      </div>
      <div>
        <button
          :class="{ 'bg-white bg-opacity-10': theme.color == 'current' }"
          class="flex p-2 space-x-2 duration-150 rounded-md hover:bg-white hover:bg-opacity-10"
          @click="changeColor('current')"
        >
          <div
            class="w-10 h-10 bg-green-400 border-4 border-gray-800 rounded"
          ></div>
          <div
            class="w-10 h-10 bg-purple-400 border-4 border-gray-800 rounded"
          ></div>
        </button>
        <span class="block mt-2 text-sm text-center text-gray-400"
          >Current</span
        >
      </div>
      <div>
        <button
          :class="{ 'bg-white bg-opacity-10': theme.color == 'domino' }"
          class="flex p-2 space-x-2 duration-150 rounded-md hover:bg-white hover:bg-opacity-10"
          @click="changeColor('domino')"
        >
          <div
            class="w-10 h-10 bg-gray-100 border-4 border-gray-800 rounded"
          ></div>
          <div
            class="w-10 h-10 bg-black border-4 border-gray-800 rounded"
          ></div>
        </button>
        <span class="block mt-2 text-sm text-center text-gray-400">Domino</span>
      </div>
    </div>
  </div>
</template>
