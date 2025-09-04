<template>
  <div>
    <NavBar class="app-nav-overlay" />
    <router-view />
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import NavBar from '@/components/layout/NavBar.vue';
import AppFooter from '@/components/layout/AppFooter.vue';
</script>