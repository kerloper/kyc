<template>
  <div>
    <h4 class="text-gray-800 font-bold">
      {{ properties.text || properties.label }}
    </h4>
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
