<script setup>
import {useI18n} from "vue-i18n";
import {computed, ref, shallowRef, watch} from "vue";
import Modal from "@/components/Modal.vue";
import {useRouter} from "vue-router";
import {storeUrl} from "@/constants/config.js";
import BaseButton from "@/components/BaseButton.vue";
import API from "@/services/API.js";

const {t: $t} = useI18n();

const props = defineProps({
  response: undefined,
  portalId: undefined,
  form: undefined,
  modalId: {
    type: String,
    default: "response_modal",
  }
});

const router = useRouter();
const emit = defineEmits(["close"]);
const isLoading = shallowRef(false);

const closeModal = () => {
  emit("close");
};

const password = ref('');
const confirmPassword = ref('');

const passwordsMatch = computed(() => {
  return password.value === confirmPassword.value;
});

const isPasswordValid = computed(() => {
  return password.value.length >= 8;
});

const isFormValid = computed(() => {
  return isPasswordValid.value && passwordsMatch.value;
});

const hasUpdatedPass = ref(false)

watch(
    () => props.response,
    (value) => {
      if (value) {
      } else {
      }
    },
    {immediate: true}
);

async function changePassword() {
  isLoading.value = true

  const {data: passUpdate} = await API.updatePassword({oldPassword:props.response?.pass,newPassword:password.value},props.response?.roomId)
  if(passUpdate.value){
    isLoading.value = false
    hasUpdatedPass.value = true
  }
}

</script>

<template>
  <Modal
      title="Report Submitted Successfully!"
      :closeBackdrop="false"
      :id="modalId"
      modal-box-class="w-1/2 max-w-2xl"
      @close="closeModal"
  >
    <div>
      <div>
        <div class="mb-3">
          <img
              :src="storeUrl + portalId??''"
              alt="Whistleblower Portal Logo"
              class="h-10 object-content"
          />
        </div>

        <div>
          <p class="text-sm text-gray-600 mb-4">
            Thank you for submitting your report. Please save the following details for follow-up:
          </p>
          <div class="bg-gray-50 p-4 rounded-lg mb-4">
            <p class="text-sm text-gray-700">
              <strong class="text-xs">Room ID:</strong> <code class="text-primary p-1 rounded text-sm">
              {{
                response?.roomId
              }}
            </code>
            </p>
            <p class="text-sm text-gray-700 mt-2" v-if="!hasUpdatedPass">
              <strong class="text-xs">Password:</strong> <code class="text-success p-1 rounded text-sm">
              {{ response?.pass }}
            </code>
            </p>
          </div>
          <p class="text-sm text-gray-600 mb-4">
            You will need these credentials to access updates or provide additional information about your report.
            Keep them safe and secure.
          </p>
          <p class="text-sm text-gray-600">
            <strong>Note:</strong> You can change your password at any time for added security. To do so, go to the
            "Settings" section of your account or contact support for assistance.
          </p>

          <div v-if="!hasUpdatedPass">
            <div class="grid grid-cols-1 gap-2 my-2">
              <div>
                <label class="input input-sm validator"
                       :class="{ 'border-red-700': !isPasswordValid&&password.length>0 }"
                >
                  <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none"
                       stroke="currentColor">
                      <path
                          d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                      <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                    </g>
                  </svg>
                  <input
                      type="password"
                      v-model="password"
                      required
                      placeholder="Password"
                      class="w-full"
                  />
                </label>
                <span v-if="!isPasswordValid &&password.length>0" class="text-red-700 text-xs mt-1">
                  Password must be at least 8 characters long.
                </span>
              </div>
              <div>
                <label class="input input-sm validator"
                       :class="{ 'border-red-700': !passwordsMatch && confirmPassword }">
                  <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none"
                       stroke="currentColor">
                      <path
                          d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                      <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                    </g>
                  </svg>
                  <input
                      type="password"
                      v-model="confirmPassword"
                      required
                      placeholder="Retype Password"
                      class="w-full"
                  />
                </label>
                <span v-if="!passwordsMatch && confirmPassword" class="text-xs text-red-700 mt-1">
                Passwords do not match. Please try again.
              </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="text-success mt-4" v-if="hasUpdatedPass">
      New password successfully set. <strong class="text-gray-500">{{ password }}</strong>
    </div>

    <progress class="progress mt-8 progress-secondary w-full" v-show="isLoading"></progress>
    <div class=" flex flex-row mt-4" v-show="!isLoading">
      <div class="flex justify-start mt-3 gap-2 w-full">
        <BaseButton type="button" class="btn-outline" @click="changePassword" v-if="!hasUpdatedPass"
                    :disabled="!isFormValid">
          {{ $t('button.change-password') }}
        </BaseButton>
      </div>
      <div class="flex justify-end mt-3 gap-2">
        <BaseButton type="button" class="btn-outline  " @click="closeModal">
          {{ $t('button.close') }}
        </BaseButton>
      </div>
    </div>

  </Modal>
</template>

<style scoped>
.password:focus,
.password:focus-within {
  box-shadow: 0 1px color-mix(in oklab, var(--input-color) calc(var(--depth) * 10%), #0000);
  outline: 0px solid var(--input-color);
  outline-offset: 2px;
  isolation: isolate;
}

.input:focus,
.input:focus-within {
  box-shadow: 0 1px color-mix(in oklab, var(--input-color) calc(var(--depth) * 10%), #0000);
  outline: 0px solid var(--input-color);
  outline-offset: 2px;
  isolation: isolate;
}
</style>