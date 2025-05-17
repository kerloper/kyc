<script setup>
defineProps({
  isLoading:{
    required:true,
    type:Boolean
  }
})
</script>

<template>
  <div v-if="isLoading" class="fixed end-1/2 top-1/2 z-10">
    <span class="loading loading-spinner text-secondary loading-lg"></span>
  </div>
</template>

<style scoped>

</style>