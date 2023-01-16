<script setup>
import CardSettings from './CardSettings.vue'
import ColorSettings from './ColorSettings.vue'
import StartButton from './StartButton.vue'
</script>

<template>
  <div class="flex flex-col items-center justify-between h-full py-20 mx-auto">
    <ColorSettings />
    <StartButton />
    <CardSettings />
  </div>
</template>
