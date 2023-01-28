<script setup>
import { ref, onUpdated, computed } from 'vue'
import { useScoreStore } from '../stores/score'
import { gsap } from 'gsap'

const { score } = useScoreStore()
const toast = ref(null)

onUpdated(() => {
  if (!score.flashMessage.messages?.length) return
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
    class="absolute left-0 right-0 z-50 flex items-center py-1 pl-2 pr-5 mx-auto space-x-2 text-lg text-gray-300 -translate-y-1/2 bg-gray-900 border-2 border-gray-700 rounded-full opacity-0 pointer-events-none top-1/2 w-fit"
  >
    <div
      v-for="message in score.flashMessage.messages"
      class="flex items-center"
    >
      <span
        class="text-red-400 font-semibold text-2xl rounded-full w-[33px] flex items-center justify-center mr-3 before:content-['+'] before:text-sm before:mr-[2px] pl-3"
        :class="classObject"
      >
        {{ message[0] }}
      </span>
      <span>
        {{ message.slice(1) }}
      </span>
    </div>
  </div>
</template>
