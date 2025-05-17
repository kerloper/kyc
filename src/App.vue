<script setup  >

import {getDirection} from "@/utils/index.js";
import {onBeforeMount, ref,provide} from "vue";

onBeforeMount(() => {
  document.querySelector('html').style.direction = getDirection().direction

  if (getDirection().isRtl) {
    document.body.classList.add("rtl");
    document.body.classList.add('font-rtl')
    document.dir = "rtl";
    document.body.classList.remove("ltr");
    document.body.classList.remove("font-ltr");
  } else {
    document.body.classList.add("ltr");
    document.body.classList.add('font-ltr')
    document.dir = "ltr";
    document.body.classList.remove("rtl");
    document.body.classList.remove("font-rtl");

  }
})
 </script>

<template>
  <div >
    <RouterView />
  </div>
</template>

<style scoped>

</style>
