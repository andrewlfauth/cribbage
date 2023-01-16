<script setup>
import CardSettings from './CardSettings.vue'
import ColorSettings from './ColorSettings.vue'
import StartButton from './StartButton.vue'
</script>

<template>
  <div
    class="absolute left-0 right-0 flex flex-col items-center mx-auto -translate-y-1/2 top-1/2 w-fit"
  >
    <div class="absolute -top-52">
      <ColorSettings />
    </div>
    <StartButton />
    <div class="absolute top-44">
      <CardSettings />
    </div>
  </div>
</template>
