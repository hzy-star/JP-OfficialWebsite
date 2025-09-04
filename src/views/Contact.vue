<template>
  
  <main>
    <ContactPage />
  </main>
</template>
<script setup lang="ts">
import ContactPage from '@/components/contact/ContactPage.vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>