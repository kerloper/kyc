<template>
  <div class="my-4">
    <hr class="border-t border-gray-300" />
    <!-- Optionally display text if provided -->
    <div v-if="properties.text" class="text-center text-sm text-gray-500 mt-2">
      {{ properties.text }}
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
const props = defineProps({
  properties: { type: Object, default: () => ({}) }
});
</script>
