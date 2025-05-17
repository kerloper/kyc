<script setup lang="js">
import AgreementModal from "@/views/home/modals/AgreementModal.vue";
import { nextTick,  ref, shallowRef, watch} from "vue";
import API from "@/services/API.js";
import { useStorage} from '@vueuse/core'
import {useJWTDecoder} from "@/composables/useJwtDecoder.js";
import {storeUrl} from "@/constants/config.js";


const {decodedJWT, error: jwtError, decodeJWT} = useJWTDecoder();
const generateUUID = () => crypto.randomUUID()
const devId = useStorage('dev-id', generateUUID())
const applicantId = useStorage("applicant-id", '');
const source = useStorage("source", '');
const utn = useStorage("utn", '');


const {data: session} = API.OpenSession({
  "applicantId": applicantId.value,
  "devId": devId.value
})

const {data: portals, execute: portalsExecute, isFetching: loadingPortals, error: errorPortals} = API.portalList()
const portalLit = ref(undefined)
const isLoading = shallowRef(true)
const selectedPortal = ref(null)
const portalAgreementModalId = "portal_agreement_modal";

function viewPortal(item) {
  selectedPortal.value = {...item}
  showModalById(portalAgreementModalId)
}

function showModalById(modalId) {
  document.getElementById(modalId).showModal()
}

function closeModal() {
  selectedPortal.value = undefined
}

watch(session, async (value) => {
  if (value?.data) {
    decodeJWT(value.data);
    await nextTick()
    source.value = decodedJWT?.value?.source
    applicantId.value = decodedJWT?.value?.applicantId
    utn.value = value.data
    await portalsExecute()
    portalLit.value = portals?.value?.data
    await nextTick()
    isLoading.value = loadingPortals?.value
  }
})

</script>

<template>
  <div class="">
    <AgreementModal :portal="selectedPortal" :id="portalAgreementModalId" @close="closeModal" v-show="!isLoading"/>
    <div class="container px-4 sm:px-8 xl:px-4 grid grid-cols-1 gap-2 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 "
         v-if="isLoading">
      <div class="skeleton card mb-3 px-4 py-1 rounded-md bg-light h-60 w-full mx-auto cursor-pointer pt-4 "
           v-for="i in 6">
      </div>
    </div>
    <div class="container px-4 sm:px-8 xl:px-4 grid grid-cols-1 gap-2 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 "
         v-else>
      <div class=" card mb-3 px-4 py-1 rounded-md bg-light max-w-[342px] mx-auto cursor-pointer pt-4"
           v-for="portal in portalLit" :key="portal?.portalId" @click="viewPortal(portal)"
           :class="{'skeleton':isLoading}">

        <div class="card-image ">
          <img class="h-10 object-contain mx-auto"  :src="storeUrl+portal.portalId"  alt="">
        </div>
        <div class="card-body">
          <h5 class="card-title">
            {{ portal?.title }}
          </h5>
          <p class="mb-4">
            {{ portal?.content }}
          </p>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>

</style>