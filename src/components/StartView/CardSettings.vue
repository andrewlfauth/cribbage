<script setup>
import Card from '../Card.vue'
const a = () => console.log('PPP')
</script>

<template>
  <div class="flex space-x-4">
    <Card
      :showBack="true"
      :bg="'https://res.cloudinary.com/dpnkrz8c8/image/upload/v1673850639/cribbage/brdtomirmaqh8mextlol.png'"
      :class="'cursor-pointer'"
      @clicked="a"
    />
    <Card
      :showBack="true"
      :bg="'https://res.cloudinary.com/dpnkrz8c8/image/upload/v1673849811/cribbage/fjrijn26zuhbn0v3or2j.avif'"
    />
    <Card
      :showBack="true"
      :bg="'https://res.cloudinary.com/dpnkrz8c8/image/upload/v1673849518/cribbage/aaypyrg4xmb2cttdblmi.avif'"
    />
  </div>
</template>
