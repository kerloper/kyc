<template>
  <div>
    <h5 class="text-lg font-medium text-gray-800 mt-4">
      {{ properties.text || properties.label }}
    </h5>
    <span v-if="properties.description" class="text-sm text-gray-500">
      {{ properties.description }}
    </span>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
const props = defineProps({
  properties: { type: Object, required: true }
});
</script>
