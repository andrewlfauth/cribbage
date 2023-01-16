<script setup>
const props = defineProps({
  bg: String,
  showBack: {
    type: Boolean,
    default: false,
  },
  class: String,
})

const emit = defineEmits(['clicked'])

const customBack = `background-image: url('${props.bg}');`
const defaultBack =
  "background-image: url('https://res.cloudinary.com/dpnkrz8c8/image/upload/v1673850639/cribbage/brdtomirmaqh8mextlol.png');"
</script>

<template>
  <div
    v-if="props.showBack"
    class="w-[115px] rounded-md h-[175px] bg-gray-400"
    :class="class"
    @click="emit('clicked')"
  >
    <div class="w-full h-full border-2 border-gray-400 rounded-md border-3">
      <div
        :style="props.bg ? customBack : defaultBack"
        class="w-full h-full bg-white bg-center bg-cover rounded-md"
      ></div>
    </div>
  </div>
</template>
