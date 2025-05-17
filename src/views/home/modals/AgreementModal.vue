<script setup>
import { useI18n } from "vue-i18n";
import { ref, shallowRef, watch} from "vue";
import Modal from "@/components/Modal.vue";
import BaseButton from "@/components/BaseButton.vue";
import API from "@/services/API.js";
import { storeUrl } from "@/constants/config.js";
import { useRouter } from "vue-router";

const { t: $t } = useI18n();

const props = defineProps({
  portal: undefined,
});

const router = useRouter();
const emit = defineEmits(["close"]);
const modalId = "portal_agreement_modal";
const isAgreed = ref(false);
const isLoading = shallowRef(true);
const portalDetail = ref(undefined);

const closeModal = () => {
  emit("close");
  portalDetail.value = undefined;
};

watch(
    () => props.portal,
    (value) => {
      if (value) {
        fetchDetail();
      } else {
        resetData();
      }
    },
    { immediate: true }
);

function resetData() {
  isAgreed.value = false;
  portalDetail.value = undefined;
  isLoading.value = true;
}

async function fetchDetail() {
  try {
    isLoading.value = true;
    const { data } = await API.portalView({ portalId: props?.portal?.portalId });
    portalDetail.value = data?.value?.data ;
  } catch (error) {
    console.error("Failed to fetch portal detail:", error);
    portalDetail.value = undefined;
  } finally {
    isLoading.value = false;
  }
}

const submitReport = () => {
  router.push({
    path: `/form/${props.portal?.portalId}/${portalDetail.value?.entryId}`,
  });
};
</script>

<template>
  <Modal
      title="Whistleblower Report Agreement"
      :id="modalId"
      modal-box-class="w-1/2 max-w-2xl"
      @close="closeModal"
  >
    <div :class="{ 'skeleton bg-base-300': isLoading }">
      <div v-if="!isLoading && portalDetail">
        <div class="mb-3">
          <img
              :src="storeUrl + portal?.portalId"
              alt="Whistleblower Portal Logo"
              class="h-10 object-content"
          />
        </div>
        <p class="text-sm text-gray-600 mb-4">
          Before submitting your report, please read and acknowledge the following:
        </p>
        <ul class="text-sm text-gray-600 space-y-3 mb-4">
          <li>
            <strong>Confidentiality:</strong> Your identity will be kept confidential to the fullest extent possible, in
            accordance with applicable laws and regulations. However, there may be circumstances where disclosure is
            required by law or necessary for investigation purposes.
          </li>
          <li>
            <strong>Good Faith Submission:</strong> You agree to submit this report in good faith, based on reasonable
            belief that the information provided is true and accurate to the best of your knowledge. Deliberate false
            reporting may have legal consequences.
          </li>
          <li>
            <strong>Non-Retaliation:</strong> We are committed to protecting whistleblowers from retaliation. If you
            experience any form of retaliation for submitting this report, please notify us immediately.
          </li>
          <li>
            <strong>Investigation Process:</strong> Your report will be reviewed and investigated promptly. However, due
            to the complexity of some cases, the investigation process may take time. We appreciate your patience and
            cooperation.
          </li>
          <li>
            <strong>Data Privacy:</strong> The information you provide will be handled securely and in compliance with
            data protection laws. By submitting this report, you consent to the collection, processing, and storage of
            your data for investigative purposes.
          </li>
          <li>
            <strong>No Guarantee of Action:</strong> While we take all reports seriously, submitting a report does not
            guarantee that specific action will be taken. The outcome will depend on the findings of the investigation.
          </li>
        </ul>
        <p class="text-sm text-gray-600 mb-4">
          By clicking "Submit," you acknowledge that you have read, understood, and agree to the terms outlined above.
        </p>
        <label class="flex items-center text-sm text-gray-600">
          <input
              type="checkbox"
              v-model="isAgreed"
              class="me-2 checkbox checkbox-xs"
              required
          />
          I have read and agree to the terms above.
        </label>
        <BaseButton
            :disabled="!isAgreed"
            class="mt-4 text-white btn btn-primary px-4 py-2 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
            :class="{ 'bg-gray-400 border-gray-700': !isAgreed }"
            size="sm"
            @click="submitReport"
        >
          {{ $t("button.submit") }}
        </BaseButton>
      </div>
    </div>
    <progress class="progress mt-4 progress-secondary w-full" v-show="isLoading"></progress>
  </Modal>
</template>

<style scoped>
</style>