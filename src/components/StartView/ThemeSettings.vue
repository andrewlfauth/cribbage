<script setup>
import { useGameStore } from '../../stores/game'

const { game, changeTheme } = useGameStore()
</script>

<template>
  <div>
    <span class="text-gray-400 mb-6 block text-center">Choose colors:</span>
    <div class="flex space-x-10">
      <div>
        <button
          :class="{ 'bg-white bg-opacity-10': game.theme == 'classic' }"
          class="flex space-x-2 p-2 rounded-md hover:bg-white hover:bg-opacity-10 duration-150"
          @click="changeTheme('classic')"
        >
          <div
            class="w-10 h-10 bg-red-400 border-4 border-gray-800 rounded"
          ></div>
          <div
            class="w-10 h-10 bg-blue-400 border-4 border-gray-800 rounded"
          ></div>
        </button>
        <span class="text-center text-gray-400 text-sm block mt-2 duration-100"
          >Classic</span
        >
      </div>
      <div>
        <button
          :class="{ 'bg-white bg-opacity-10': game.theme == 'current' }"
          class="flex space-x-2 p-2 rounded-md hover:bg-white hover:bg-opacity-10 duration-150"
          @click="changeTheme('current')"
        >
          <div
            class="w-10 h-10 bg-green-400 border-4 border-gray-800 rounded"
          ></div>
          <div
            class="w-10 h-10 bg-purple-400 border-4 border-gray-800 rounded"
          ></div>
        </button>
        <span class="text-center text-gray-400 text-sm block mt-2"
          >Current</span
        >
      </div>
      <div>
        <button
          :class="{ 'bg-white bg-opacity-10': game.theme == 'domino' }"
          class="flex space-x-2 p-2 rounded-md hover:bg-white hover:bg-opacity-10 duration-150"
          @click="changeTheme('domino')"
        >
          <div
            class="w-10 h-10 bg-gray-100 border-4 border-gray-800 rounded"
          ></div>
          <div
            class="w-10 h-10 bg-black border-4 border-gray-800 rounded"
          ></div>
        </button>
        <span class="text-center text-gray-400 text-sm block mt-2">Domino</span>
      </div>
    </div>
  </div>
</template>
