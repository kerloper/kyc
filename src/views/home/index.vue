<script setup>

import HomeHeader from "@/views/home/components/HomeHeader.vue";
import PortalsSections from "@/views/home/components/PortalsSections.vue";
import DetailSection from "@/views/home/components/DetailSection.vue";
import FollowUpSection from "@/views/home/components/FollowUpSection.vue";
import IntroductionSection from "@/views/home/components/IntroductionSection.vue";
import {onMounted} from "vue";
import KYC from "@/views/home/components/KYC.vue";
onMounted(()=>{
  console.log('selectedPortal');
})
</script>

<template>
  <section>
    <router-view/>

    <section id="header">
      <HomeHeader/>
    </section>

   <section id="kyc">
     <KYC />
   </section>



    <section id="follow_up">
    </section>

  </section>
</template>

<style scoped>

</style>