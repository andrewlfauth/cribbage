<script setup>
import Button from '../Button.vue'
import CardSettings from './CardSettings.vue'
import ColorSettings from './ColorSettings.vue'
</script>

<template>
  <div
    class="flex flex-col items-center h-full py-20 mx-auto lg:justify-between md:py-32 lg:py-20"
  >
    <ColorSettings />
    <div class="hidden lg:block">
      <Button text="Start Game" :class="'text-4xl ring-gray-200'" />
    </div>
    <CardSettings />
  </div>
</template>
