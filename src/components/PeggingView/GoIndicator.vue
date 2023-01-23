<script setup>
const props = defineProps({
  show: Boolean,
})
</script>

<template>
  <div
    v-if="props.show"
    class="absolute left-0 right-0 mx-auto w-fit text-3xl rounded-full bg-gray-900 border-[3px] font-semibold px-3 font-sans pb-1 z-[60]"
  >
    Go
  </div>
</template>
