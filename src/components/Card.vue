<script setup>
import { useThemeStore } from '../stores/theme'
import { gsap } from 'gsap'
import { ref, watchEffect } from 'vue'

const { theme } = useThemeStore()

const props = defineProps({
  card: Object,
  showBack: Boolean,
  bg: String,
  flip: Boolean,
})

const emit = defineEmits(['clicked'])

const contentRef = ref(null)
const flipped = ref(false)

const flipCard = () => {
  if (!flipped.value) {
    gsap.to(contentRef.value, {
      rotateY: 180,
    })
    flipped.value = true
  } else {
    gsap.to(contentRef.value, {
      rotateY: 0,
    })
    flipped.value = false
  }
}

watchEffect(() => {
  if (props.flip) flipCard()
})

const TEXT_CLASS =
  props?.card?.suit === '♥' || props?.card?.suit === '♦'
    ? 'text-red-700'
    : 'text-black'

const customBack = `background-image: url('${props.bg}');`
const themeBack = `background-image: url('${theme.card}');`
</script>

<template>
  <div class="card">
    <div ref="contentRef" class="duration-150 content">
      <div
        :class="{ front: !props.showBack, back: props.showBack }"
        class="flex items-center justify-center bg-gray-200"
      >
        <span
          :class="TEXT_CLASS"
          class="absolute text-4xl font-bold tracking-tighter top-1 left-2"
          >{{ props.card.value }}</span
        >
        <span :class="TEXT_CLASS" class="absolute text-3xl top-8 left-[13px]">{{
          props.card.suit
        }}</span>
        <span :class="TEXT_CLASS" class="text-[78px]">{{
          props.card.suit
        }}</span>
        <span
          :class="TEXT_CLASS"
          class="absolute text-4xl font-bold tracking-tighter rotate-180 bottom-1 right-2"
          >{{ props.card.value }}</span
        >
        <span
          :class="TEXT_CLASS"
          class="absolute text-3xl bottom-9 right-[13px]"
          >{{ props.card.suit }}</span
        >
      </div>

      <div :class="{ front: props.showBack, back: !props.showBack }">
        <div class="w-full h-full border-2 border-gray-200 rounded-md">
          <div
            :style="props.bg ? customBack : themeBack"
            class="w-full h-full bg-gray-200 bg-center bg-cover rounded-md"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.card {
  position: relative;
  width: 115px;
  height: 175px;
  perspective: 500px;
}

.content {
  position: absolute;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
}

.front,
.back {
  position: absolute;
  height: 100%;
  width: 100%;
  background: white;
  line-height: 300px;
  color: #03446a;
  text-align: center;
  font-size: 60px;
  border-radius: 5px;
  backface-visibility: hidden;
}

.back {
  background: #03446a;
  color: white;
  transform: rotateY(180deg);
}
</style>
