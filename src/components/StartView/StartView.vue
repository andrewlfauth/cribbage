<script setup>
import ThemeSettings from './ThemeSettings.vue'
import StartButton from './StartButton.vue'
</script>

<template>
  <div
    class="absolute top-1/2 -translate-y-1/2 mx-auto right-0 left-0 w-fit flex flex-col items-center"
  >
    <div class="absolute -top-52">
      <ThemeSettings />
    </div>
    <StartButton />
  </div>
</template>
