<script setup>
import SideBar from "@/containers/SideBar.vue";
import TheHeader from "@/containers/TheHeader.vue";
import TheFooter from "@/containers/TheFooter.vue";
import TopNav from "@/containers/TopNav.vue";


</script>

<template>
  <div class="flex flex-col  mx-auto">
<!--    <TheHeader/>-->
    <SideBar></SideBar>
    <div class=" ">
      <main class=" ">
        <div class="transition-all mx-auto duration-300">
          <slot></slot>
        </div>
      </main>
    </div>
<!--    <TheFooter class="mt-auto"/>-->
  </div>
</template>

<style scoped>

</style>