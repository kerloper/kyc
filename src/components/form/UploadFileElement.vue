<template>
  <div>
    <label class="inline-block text-sm font-medium mb-1">
      {{ properties.label }}
    </label>
    <Field
        :name="properties.name"
        type="file"
        :disabled="properties.disabled"
        :readonly="properties.readonly"
        class="file-input file-input-bordered w-full"
    />
    <ErrorMessage :name="properties.name" class="text-error text-sm mt-1" />
    <span v-if="properties.description" class="text-sm text-gray-500">
      {{ properties.description }}
    </span>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import { Field, ErrorMessage } from 'vee-validate';

const props = defineProps({
  properties: { type: Object, required: true }
});
</script>
