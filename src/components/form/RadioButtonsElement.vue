<template>
  <div>
    <label class="inline-block text-sm font-medium mb-1">{{ properties.label }}</label>
    <div class="flex flex-col gap-2">
      <div v-for="(option, index) in options" :key="index" class="flex items-center gap-2">
        <Field
            :name="properties.name"
            type="radio"
            :value="option"
            :disabled="properties.disabled"
            :readonly="properties.readonly"
            class="radio radio-xs "
            :modelValue="modelValue"
            @update:modelValue="updateValue"
        />
        <span class="text-sm">{{ option.value }}</span>
      </div>
    </div>
<!--    <ErrorMessage :name="properties.name" class="text-error text-sm mt-1" />-->
    <span v-if="properties.description" class="text-sm text-gray-500">
      {{ properties.description }}
    </span>
  </div>
</template>

<script setup>
import {defineEmits, defineProps, onMounted} from 'vue';
import { Field, ErrorMessage } from 'vee-validate';
import {useTerminology} from "@/composables/useTerminology.js";
import VueMultiselect from "vue-multiselect";

const props = defineProps({
  properties: { type: Object, required: true },
  modelValue: {
    type: [Array, String, Number, Object], // Allow multiple types for single/multiple selections
    default: null,
  },
});
const emit = defineEmits(['update:modelValue']);
const { options,isLoading, fetchTerminology } = useTerminology(
    props.properties?.value?.terminologyId??''
);

onMounted(() => {
  fetchTerminology();
});

const updateValue = (value) => {
  emit('update:modelValue', value);
};
</script>
