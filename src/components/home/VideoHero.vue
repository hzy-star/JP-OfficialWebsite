<template>
  <section class="hero-video-wrapper">
    <video
      autoplay
      muted
      loop
      playsinline
      :src="videoSrc"
    ></video>
    <div class="hero-overlay-content">
      <h1>{{ t('home.hero.slogan') }}</h1>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

defineProps<{ videoSrc: string }>();

const { t } = useI18n();
</script>