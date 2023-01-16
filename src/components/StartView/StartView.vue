<script setup>
import CardSettings from './CardSettings.vue'
import ColorSettings from './ColorSettings.vue'
import StartButton from './StartButton.vue'
</script>

<template>
  <div
    class="flex flex-col items-center justify-center h-full py-20 mx-auto md:justify-start lg:justify-between md:py-32 lg:py-20"
  >
    <ColorSettings />
    <div class="hidden lg:block">
      <StartButton />
    </div>
    <CardSettings />
    <div class="mt-20 lg:hidden">
      <StartButton />
    </div>
  </div>
</template>
