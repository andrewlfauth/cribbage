<script setup>
import { ref } from 'vue'
import HandCounting from './HandCounting.vue'
import CribCounting from './CribCounting.vue'

const countingStage = ref('hand')
const countCrib = () => (countingStage.value = 'crib')
</script>

<template>
  <!-- <HandCounting v-if="countingStage == 'hand'" @done-counting="countCrib" /> -->
  <!-- <CribCounting v-if="countingStage == 'crib'" /> -->
  <CribCounting />
</template>
