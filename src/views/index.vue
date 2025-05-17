<script setup>

import AppLayout from "@/layouts/AppLayout.vue";
import {watch} from "vue";
import {useRouter} from "vue-router";


</script>

<template>
  <AppLayout>
    <RouterView v-slot="{ Component }">
      <Transition name="fade">
        <component :is="Component"/>
      </Transition>
    </RouterView>
  </AppLayout>
</template>

<style scoped>
</style>