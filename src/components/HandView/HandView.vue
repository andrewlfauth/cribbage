<script setup>
import DealAnimation from './DealAnimation.vue'

const handleCardsDealt = () => {
  // handle
}
</script>

<template>
  <DealAnimation @cards-dealt="handleCardsDealt" />
</template>
