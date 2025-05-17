<template>
  <div>
    <!-- Display the label -->
    <label class="block text-sm font-medium mb-1 text-gray-800">
      {{ properties.label }}
    </label>

    <!-- Textarea field with vee-validate integration -->
    <Field
        :name="properties.name"
        as="textarea"
        :placeholder="properties.placeholder"
        class="textarea textarea-bordered w-full textarea-sm bg-base-300 rounded-md focus:shadow-none"
        :modelValue="modelValue"
        @update:modelValue="updateValue"
    />

    <!-- Display validation error -->
<!--    <ErrorMessage-->
<!--        :name="properties.name"-->
<!--        class="text-error text-sm mt-1"-->
<!--    />-->

    <!-- Display description if available -->
    <span v-if="properties.description" class="text-xs text-gray-500">
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
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);

// Handle value changes in the textarea
const updateValue = (value) => {
  emit('update:modelValue', value);
};
</script>

<style scoped>
.textarea:focus,
.textarea:focus-within {
  box-shadow: 0 1px color-mix(in oklab, var(--input-color) calc(var(--depth) * 10%), #0000);
  outline: 0px solid var(--input-color);
  outline-offset: 2px;
  isolation: isolate;
}
</style>