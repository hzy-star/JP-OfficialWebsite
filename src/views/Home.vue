<template>
  <main>
    <VideoHero videoSrc="http://www.clicktech.jp/uploadfile/202403/0de1dea4944b6fc.mp4" />
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

</script>