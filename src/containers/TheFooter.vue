<script setup>

import {useI18n} from "vue-i18n";

const {t: $t} = useI18n();
</script>
<template>
  <section>
    <!-- Footer -->
    <div class="footer">
      <div class="container px-4 sm:px-8">
        <h4 class="mb-8 lg:max-w-3xl lg:mx-auto">
          Whistleblow is a cutting-edge application designed to empower organizations with a secure and efficient whistleblowing system.
        </h4>
      </div> <!-- end of container -->
    </div> <!-- end of footer -->
    <!-- end of footer -->



    <!-- Copyright -->
    <div class="copyright">
      <div class="container px-4 sm:px-8 lg:grid lg:grid-cols-3">
        <ul class="mb-4 list-unstyled p-small">
          <li class="mb-2">
            <a href="#home">
            {{$t("menu.home")}}
          </a>
          </li>
          <li class="mb-2">
            <a href="#portals">
            {{ $t("menu.portals")}}
          </a>
          </li>
        </ul>
        <p class="pb-2 p-small statement">Copyright © <strong class="text-primary"> Rezilens </strong></p>

      </div>

      <!-- end of container -->
    </div> <!-- end of copyright -->
    <!-- end of copyright -->

  </section>
</template>


<style scoped>

</style>

