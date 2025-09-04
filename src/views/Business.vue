<template>
  <!-- <div class="full-height-section">
    <div class="container">
      <h2 class="section-title">{{ t('app.nav.business') }}</h2>
      <p>{{ t('placeholder.updating') }}</p>
    </div>
  </div> -->
  <main>
    <BusinessTabs />
  </main>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import BusinessTabs from '@/components/business/BusinessTabs.vue';
const { t } = useI18n();
</script>