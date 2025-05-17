<script setup>
import {ref, onMounted, onUnmounted, shallowRef, nextTick} from 'vue'
import {useI18n} from "vue-i18n"
import {menu} from "@/constants/menu.js.js"
import {useRoute, useRouter} from "vue-router";

const {t: $t} = useI18n()
const isNavFixed = ref(false)


const router = useRouter();
const route = useRoute();

const handleScroll = () => {
  isNavFixed.value = window.scrollY > 60
  const sections = document.querySelectorAll("section")
  let currentSection = ""

  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.offsetHeight

    if (window.scrollY >= sectionTop - sectionHeight / 3) {
      currentSection = section.id
    }
  })

  activeSection.value = currentSection
}
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})


const isMenuOpen = shallowRef(false)
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

function closeMenu() {
  isMenuOpen.value = false
}

const activeSection = ref("")


onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const handleNavClick = (target, section) => {
  if (route.path === '/') {
    scrollToSection(section);
  } else {
    router.push(target).then(() => {
      nextTick(() => {
        scrollToSection(section);
      });
    });
  }
  closeMenu();
};

const scrollToSection = (section) => {
  const element = document.getElementById(section);
  if (element) {
    console.log(section)
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

</script>

<template>
  <nav class="navbar fixed-top" :class="{'top-nav-collapse':isNavFixed}">
    <div class="container sm:px-4 lg:px-8 flex flex-wrap items-center justify-between lg:flex-nowrap">

      <RouterLink class="inline-block mr-4 py-0.5 text-xl whitespace-nowrap hover:no-underline focus:no-underline"
         to="/#header">
        <img src="/src/assets/logos/digikala-en.png" alt="alternative" class="h-10"/>
      </RouterLink>

      <label class="swap swap-rotate leading-none hover:no-underline focus:no-underline lg:hidden lg:text-gray-400">
        <!-- this hidden checkbox controls the state -->
        <input type="checkbox" @click="toggleMenu" class="theme-controller" :value="isMenuOpen.toString()"
               :checked="isMenuOpen"/>

        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
             stroke="currentColor" class="swap-off size-10">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
             stroke="currentColor" class="swap-on size-10">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
        </svg>

      </label>

      <div class="navbar-collapse offcanvas-collapse lg:flex lg:flex-grow lg:items-center" :class="{'open':isMenuOpen}">
        <ul class="pl-0 mt-3 mb-2 ml-auto flex flex-col list-none lg:mt-0 lg:mb-0 lg:flex-row ">

          <li v-for="item in menu " :key="item.key">
            <RouterLink class="nav-link page-scroll"
                        :class="{
                'ms-20 , open':isMenuOpen,
                'active': activeSection === item.section
               }"
              @click="handleNavClick(item.target, item.section)"
              :to="`${item.target}`">
              {{ $t(`menu.${item.key}`) }}
            </RouterLink>
          </li>
        </ul>
      </div> <!-- end of navbar-collapse -->
    </div> <!-- end of container -->
  </nav>

</template>

<style scoped>
/* Add any custom styles here if needed */
</style>