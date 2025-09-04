<template>
   <main>
    <NewsPage />
  </main>
</template>
<script setup lang="ts">
import NewsPage from '@/components/news/NewsPage.vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>