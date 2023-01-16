<script setup>
import { useThemeStore } from '../stores/theme'

const props = defineProps({
  bg: String,
  showBack: Boolean,
  class: String,
})

const { theme } = useThemeStore()

const emit = defineEmits(['clicked'])

const customBack = `background-image: url('${props.bg}');`
const themeBack = `background-image: url('${theme.card}');`
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
        :style="props.bg ? customBack : themeBack"
        class="w-full h-full bg-white bg-center bg-cover rounded-md"
      ></div>
    </div>
  </div>
</template>
