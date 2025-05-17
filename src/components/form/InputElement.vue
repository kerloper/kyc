<template>
  <div>
    <!-- Display the label -->
    <label class="inline-block text-sm font-medium mb-1 text-gray-800">
      {{ properties.label }}
    </label>

    <!-- Input field with dynamic placeholder -->
    <Field
        :name="properties.name"
        :type="properties.type || 'text'"
        :placeholder="properties.placeholder"
        class="input input-bordered w-full bg-base-300"
        :readonly="properties.readonly"
        :disabled="properties.disabled"
        :modelValue="modelValue"
        @update:modelValue="updateValue"
    />

    <!-- Display validation error -->
<!--    <ErrorMessage-->
<!--        :name="properties.name"-->
<!--        class="text-error text-sm mt-1"-->
<!--    />-->

    <!-- Display description if available -->
    <span v-if="properties.description" class="text-sm text-gray-500">
      {{ properties.description }}
    </span>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { Field, ErrorMessage } from 'vee-validate';

const props = defineProps({
  properties: {
    type: Object,
    required: true,
  },
  modelValue: {
    type: [String, Number, Boolean],
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);

const updateValue = (value) => {
  emit('update:modelValue', value);
};
</script>

<style scoped>
.input:focus,
.input:focus-within {
  box-shadow: 0 1px color-mix(in oklab, var(--input-color) calc(var(--depth) * 10%), #0000);
  outline: 0px solid var(--input-color);
  outline-offset: 2px;
  isolation: isolate;
}
</style>