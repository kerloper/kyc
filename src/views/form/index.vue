<script setup>
import {useRoute} from "vue-router";
import {useStorage} from "@vueuse/core";
import {storeUrl} from "@/constants/config.js";
import {useScrollToTop} from "@/composables/scroll-to-top.js";
import {computed, onMounted, ref, shallowRef} from "vue";
import API from "@/services/API.js";
import InputElement from "@/components/form/InputElement.vue";
import TextareaElement from "@/components/form/TextareaElement.vue";
import CheckboxElement from "@/components/form/CheckboxElement.vue";
import RadioButtonsElement from "@/components/form/RadioButtonsElement.vue";
import SelectElement from "@/components/form/SelectElement.vue";
import UploadFileElement from "@/components/form/UploadFileElement.vue";
import Divider from "@/components/form/Divider.vue";
import SectionHeading from "@/components/form/SectionHeading.vue";
import SubHeading from "@/components/form/SubHeading.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import FormHeading from "@/components/form/FormHeading.vue";
import {Form, ErrorMessage} from "vee-validate";
import * as yup from "yup";
import ResponseModal from "@/views/form/modals/ResponseModal.vue";
import router from "@/router/index.js";

const route = useRoute();
const {scrollToTop} = useScrollToTop();

const {data, isFetching, execute} = API.fromTemplate({entryId: route.params.entryId});
const form = computed(() => data?.value?.data || undefined);
const isLoading = computed(() => isFetching?.value || undefined);

const componentMap = {
  InputElement,
  Divider,
  SubHeading,
  FormHeading,
  SectionHeading,
  TextareaElement,
  CheckboxElement,
  RadioButtonsElement,
  SelectElement,
  UploadFileElement,
  SubmitButton,
};

const submitLoading = shallowRef(false)
const answer = ref({});
const response = ref(undefined)
const responseModalId = "response_modal"

const getComponent = (type) => {
  return componentMap[type];
};

const buildValidationSchema = (schema) => {
  const validationSchema = {};

  schema.forEach((item) => {
    const {name, validationRules} = item.props;

    if (validationRules) {
      let yupSchema;

      // Default schema based on field type
      switch (item.type) {
        case "InputElement":
        case "TextareaElement":
          yupSchema = yup.string();
          break;
        case "CheckboxElement":
          yupSchema = yup.boolean();
          break;
        case "RadioButtonsElement":
        case "SelectElement":
          yupSchema = yup.object();
          break;
        default:
          yupSchema = yup.string();
          break;
      }

      // Parse validation rules
      const rules = validationRules.split("|");
      rules.forEach((rule) => {
        const [ruleName, ruleValue] = rule.split(":");

        switch (ruleName) {
          case "required":
            yupSchema = yupSchema.required("This field is required");
            break;
          case "min":
            yupSchema = yupSchema.min(parseInt(ruleValue), `Must be at least ${ruleValue} characters`);
            break;
          case "max":
            yupSchema = yupSchema.max(parseInt(ruleValue), `Must be at most ${ruleValue} characters`);
            break;
          case "email":
            yupSchema = yupSchema.email("Invalid email address");
            break;
            // Add more rules as needed
        }
      });

      validationSchema[name] = yupSchema;
    }
  });

  return yup.object(validationSchema);
};

const validationSchema = computed(() => {
  if (form.value?.template?.schema) {
    return buildValidationSchema(form.value.template.schema);
  }
  return yup.object({}); // Fallback to an empty schema
});

const onSubmit = async (values, {setErrors}) => {
  submitLoading.value = false;
  const {data: result, isFetching: resultFetching} = await API.submitForm({values:values,schema:form.value?.template?.schema},route?.params?.entryId);
  if (result?.value?.data) {
    showResponseModal(result?.value?.data)
  }
}

function showResponseModal(result) {
  response.value = {...result}
  showModalById(responseModalId)
}

function showModalById(modalId) {
  document.getElementById(modalId).showModal()
}

function closeModal() {
  response.value = undefined
  router.push({
    path: `/`,
  });
}

onMounted(() => {
  scrollToTop();
});
</script>

<template>
  <section>

    <ResponseModal :response="response" :portal-id="route?.params?.portalId" :form="form" :id="responseModalId"
                   @close="closeModal"/>

    <div class="">
      <header class="header py-28 text-start">
        <div class="container px-4 sm:px-8 w-full mx-auto">
          <div class="mb-16 h-screen">
            <progress class="progress mt-4 progress-secondary w-full" v-show="isLoading"></progress>
            <div v-show="!isLoading">
              <fieldset class="fieldset w-full px-10 rounded-box pb-4 max-w-2xl card bg-base-300">
                <div class="flex flex-row mt-2 border-b border-primary/10 mb-2 pb-4">
                  <p class="text-xl text-gray-700 mt-2 w-full">{{ form?.title }}</p>
                  <div class="text-end">
                    <img
                        class="inline object-contain max-h-10"
                        :src="storeUrl + route?.params?.portalId"
                        alt="alternative"
                    />
                  </div>
                </div>
                <div class="text-start text-base text-gray-700">{{ form?.description }}</div>
                <div class="gird grid-cols-1 gap-4">
                  <!-- Wrap the form with vee-validate's Form component -->
                  <Form
                      :validation-schema="validationSchema"
                      @submit="onSubmit"
                      v-slot="{ errors }"
                  >
                    <div v-for="item in form?.template?.schema" :key="item.id" class="my-4">
                      <component
                          :is="getComponent(item.type)"
                          :properties="item.props"
                          v-model="answer[item.props.name]"
                          :submit-loading="submitLoading"
                      />
                      <ErrorMessage
                          :name="item.props.name"
                          class="text-error text-sm mt-1"
                      />
                    </div>
                    <div class="h-10" v-show="submitLoading">
                      <progress class="progress mt-4 progress-secondary w-full"></progress>
                    </div>
                    <!-- Submit button -->
                  </Form>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
      </header>
    </div>
  </section>
</template>

<style scoped></style>