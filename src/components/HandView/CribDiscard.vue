<template>
  <div class="flex flex-col h-full justify-between p-8">
    <div
      ref="botsHandEl"
      class="h-[175px] w-[410px] self-center flex items-center -space-x-14"
    ></div>
    <div ref="deck" class="flex relative h-[175px]">
      <!-- <Card
        v-for="card in game.deck"
        :key="card"
        v-bind:data-card="JSON.stringify(card)"
        v-bind:data-order="card.order"
        :card="card"
        :show-back="true"
        class="absolute"
      /> -->
    </div>
    <div
      ref="usersHandEl"
      class="h-[175px] w-[410px] self-center flex items-center -space-x-14"
    ></div>
  </div>
</template>
