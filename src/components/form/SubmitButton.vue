<template>
  <div v-show="!submitLoading">
    <button
        type="submit"
        class="btn btn-primary w-full"
        :disabled="properties.disabled||submitLoading"
    >
      {{ properties.text || properties.label || "Submit" }}
    </button>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
const props = defineProps({
  properties: { type: Object, required: true },
  submitLoading: { type: Boolean, default: false }
});
</script>
