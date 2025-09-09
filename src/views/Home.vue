<template>
  <main>
    <VideoHero :videoSrc="videoSrc" />
    <VisionSection />
    <SolutionSection />
    <SponsorsSection />
    <CompanyInfoSection />
    <MapSection />
  </main>
</template>

<script setup lang="ts">

import VideoHero from '@/components/home/VideoHero.vue';
import VisionSection from '@/components/home/VisionSection.vue';
import SolutionSection from '@/components/home/SolutionSection.vue';
import SponsorsSection from '@/components/home/SponsorsSection.vue';
import CompanyInfoSection from '@/components/home/CompanyInfoSection.vue';
import MapSection from '@/components/home/MapSection.vue';
import videoSrc from '@/assets/video/homeVideo.mp4';
</script>