<script setup>
import { ref, onUpdated, computed } from 'vue'
import { useScoreStore } from '../stores/score'
import { gsap } from 'gsap'

const { score } = useScoreStore()
const toast = ref(null)

onUpdated(() => {
  let tl = gsap.timeline()
  tl.to(toast.value, { opacity: 1, y: -130, duration: 0.3 })
  tl.to(toast.value, { opacity: 0, y: 0, duration: 0 }, '+=1.5')
})

const classObject = computed(() => ({
  'text-red-400 t-current:text-green-400 t-domino:text-gray-100':
    score.flashMessage.player == 'user',
  'text-blue-400 t-current:text-purple-400 t-domino:text-black':
    score.flashMessage.player == 'bot',
}))
</script>

<template>
  <div
    ref="toast"
    class="absolute opacity-0 top-1/2 -translate-y-1/2 left-0 right-0 mx-auto bg-red400 text-gray-300 border-2 border-gray-700 py-1 z-50 w-fit rounded-full pointer-events-none flex items-center pr-4 bg-gray-900"
  >
    <span
      class="text-red-400 font-semibold text-2xl rounded-full w-[33px] -ml-[1px] flex items-center justify-center mr-3 before:content-['+'] before:text-xs before:mr-1 pl-3"
      :class="classObject"
    >
      {{ score.flashMessage.message[0] }}
    </span>
    <span>
      {{ score.flashMessage.message.slice(1) }}
    </span>
  </div>
</template>
