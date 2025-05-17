<script setup>
import {toRef} from 'vue';
import {useField} from 'vee-validate';

const props = defineProps({
  title: String,
  value: String,
  name: {
    type: String,
    required: true,
  },
  hasDefaultErrorMessage: {
    type: Boolean,
    default: false,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  customClass: {
    type: String,
    default: "min-h-32",
  },
  modelValue: String,
  placeholder: String
});

const name = toRef(props, 'name');


const {
  value,
  errorMessage,
} = useField(name, undefined, {
  syncVModel: true,
});
</script>

<template>

  <div>
    <span class="label-text ms-0.5" v-if="title">{{ title }}</span>
    <label class="    rounded-md  flex items-center gap-2 "
           :class="{'tooltip tooltip-top tooltip-open tooltip-warning':errorMessage}"
           :data-tip="errorMessage"
    >
      <slot></slot>
      <textarea
          :name="name"
          :id="name"
          :value="modelValue"
          :placeholder="placeholder"
          :class="customClass"
          :disabled="isDisabled"
          @input="$emit('update:modelValue', $event.target.value)"
          class="textarea textarea-xs lg:textarea-sm textarea-bordered w-full"
      />

    </label>
  </div>

</template>

<style scoped>

</style>
