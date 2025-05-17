<template>
  <router-view/>
  <div class="card">
    <div class="card-content text-3xl text-gray-600">
      <h2>No Data to Display</h2>
    </div>
    <BaseButton class="btn btn-primary btn-outline" @click="goBack">Back</BaseButton>
  </div>
</template>

<script setup>
import BaseButton from "@/components/BaseButton.vue";
import {useRouter} from "vue-router";

const router = useRouter()
const goBack = () => {
  router.push('/')
};
</script>

<style scoped>
.card {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.card-content {
  margin-bottom: 20px;
}

.btn-back {
  background-color: #3498db;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-back:hover {
  background-color: #2980b9;
}
</style>
