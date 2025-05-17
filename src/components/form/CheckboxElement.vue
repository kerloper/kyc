<template>
  <div class="flex items-center">
    <!-- Checkbox field with vee-validate integration -->
    <Field
        :name="properties.name"
        type="checkbox"
        :value="true"
        :unchecked-value="false"
        :disabled="properties.disabled"
        :readonly="properties.readonly"
        class="checkbox checkbox-xs"
        :modelValue="modelValue"
        @update:modelValue="updateValue"
    />

    <!-- Display the label -->
    <label class="inline-block text-sm font-medium me-2 ms-2 mt-1">
      {{ properties.label }}
    </label>

    <!-- Display validation error -->
    <ErrorMessage :name="properties.name" class="text-error text-sm mt-1" />

    <!-- Display description if available -->
    <span v-if="properties.description" class="text-sm text-gray-500">
      {{ properties.description }}
    </span>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { Field, ErrorMessage } from 'vee-validate';

// Define props
const props = defineProps({
  properties: {
    type: Object,
    required: true,
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

// Handle value changes in the checkbox
const updateValue = (value) => {
  emit('update:modelValue', value);
};
</script>