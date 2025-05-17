<script setup>

defineProps({
  title: {
    type: String,
    default: 'Modal'
  },
  modalBoxClass:{
    type:String
  },
  closeBackdrop: {
    type: Boolean,
    default: true
  },
  closeIcon: {
    type: Boolean,
    default: true
  },
  closeBtn: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <dialog class="modal overflow-y-auto ">
    <div class="modal-box max-h-full m-auto rounded-md " style="overflow-y: visible" :class="modalBoxClass">
      <form method="dialog" v-if="closeIcon">
        <button class="btn btn-sm btn-circle btn-ghost absolute end-2 top-2 focus-visible:outline-0">✕</button>
      </form>
      <h5 class="font-bold text-lg mb-2 border-b-2 border-primary">{{ title }}</h5>
      <main>
        <slot></slot>
      </main>

      <form method="dialog" class="flex justify-end" v-if="closeBtn">
        <!-- if there is a button in form, it will close the modal -->
        <button class="btn">Close</button>
      </form>
    </div>

    <form method="dialog" class="modal-backdrop">
      <button v-if="closeBackdrop">close</button>
    </form>
  </dialog>
</template>

<style scoped>

</style>