<script setup>
import { computed, defineProps, defineEmits, onMounted } from 'vue';
import { Field, ErrorMessage } from 'vee-validate';
import VueMultiselect from 'vue-multiselect';
import API from "@/services/API.js";
import { useTerminology } from "@/composables/useTerminology.js";

// Define props
const props = defineProps({
  properties: {
    type: Object,
    required: true,
    default: () => ({
      label: '',
      name: '',
      options: [], // Array of options for the multiselect
      placeholder: 'Select an option',
      validationRules: '',
      multiple: false, // Whether multiple selections are allowed
      disabled: false,
      readonly: false,
      description: '',
    }),
  },
  modelValue: {
    type: [Array, String, Number, Object], // Allow multiple types for single/multiple selections
    default: null,
  },
});

const emit = defineEmits(['update:modelValue']);

const { options, isLoading, fetchTerminology } = useTerminology(
    props.properties?.value?.terminologyId ?? ''
);

onMounted(() => {
  fetchTerminology();
});

const updateValue = (value) => {
  emit('update:modelValue', value);
};
</script>

<template>
  <div>
    <!-- Display the label -->
    <label class="inline-block text-sm font-medium mb-1">
      {{ properties.label }}
    </label>

    <!-- VueMultiselect field with vee-validate integration -->
    <Field v-slot="{ field, errors }" :name="properties.name" :rules="properties.validationRules || ''">
      <VueMultiselect
          v-bind="field"
          :modelValue="modelValue"
          @update:modelValue="updateValue"
          :options="options || []"
          :placeholder="properties.placeholder || 'Select an option'"
          :multiple="properties.multiple || false"
          track-by="value"
          :disabled="properties.disabled || false"
          :readonly="properties.readonly || false"
          :class="{ 'border-error': errors.length > 0 }"
          class="w-full"
          label="value"
      />
    </Field>

    <!-- Display validation error -->
<!--    <ErrorMessage :name="properties.name" class="text-error text-sm mt-1" />-->

    <!-- Display description if available -->
    <span v-if="properties.description" class="text-sm text-gray-500">
      {{ properties.description }}
    </span>
  </div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>

<style scoped>
/* Optional: Customize vue-multiselect styles */
.border-error .multiselect__tags {
  border-color: #ef4444; /* Matches Tailwind's text-error color */
}
</style>