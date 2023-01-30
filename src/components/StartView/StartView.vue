<script setup>
import Button from '../Button.vue'
import CardSettings from './CardSettings.vue'
import ColorSettings from './ColorSettings.vue'
import { useGameStore } from '../../stores/game'

const { changeStage } = useGameStore()
</script>

<template>
  <div
    class="flex flex-col justify- items-center h-full py-20 mx-auto lg:justify-between md:py-32 lg:py-20"
  >
    <ColorSettings />
    <CardSettings class="lg:hidden" />
    <div>
      <Button
        @click="changeStage('cut')"
        text="Start Game"
        :class="'text-4xl ring-gray-200 mt-20 lg:mt-0'"
      />
    </div>
    <CardSettings class="hidden lg:block" />
  </div>
</template>
