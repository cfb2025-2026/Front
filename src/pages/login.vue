<script setup lang="ts">
import Navbar from '~/components/ui/Navbar.vue';
</script>

<template>
  <div class="page-auth">
    <Navbar />
    <AuthForm />
  </div>
</template>

<style>
.page-auth{
  min-height:100dvh;
  display:grid;
  place-items:center;
  padding:24px;
}
</style>
