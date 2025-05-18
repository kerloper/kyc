<script setup>
import {onMounted} from "vue";
import KYC from "@/views/home/components/KYC.vue";
import kycLogo from "@/assets/static/kyc-logo.png"

onMounted(() => {
})
</script>

<template>
  <section>
    <router-view/>
    <section id="kyc">
      <KYC/>
    </section>


  </section>
</template>

<style scoped>

</style>