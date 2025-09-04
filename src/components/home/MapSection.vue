<template>
  <section class="full-height-section fade-in">
    <div class="container">
      <h2 class="section-title">MAP</h2>
      <div ref="mapEl" class="map-wrapper"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import L from 'leaflet';

const mapEl = ref<HTMLDivElement | null>(null);

onMounted(() => {
  if (!mapEl.value) return;
  const map = L.map(mapEl.value, {
    center: [35.6702, 139.7065], // 明治神宮前付近
    zoom: 15,
    zoomControl: true,
    attributionControl: false
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
  }).addTo(map);

  L.marker([35.6702, 139.7065]).addTo(map).bindPopup('CLICK TECH (Near Meiji-Jingumae)');
});
</script>
<style scoped lang="scss">

.container {
  width: min(1920px, 92%);
  margin: 0 auto;
}

.map-wrapper {
  height: 800px;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 10px 28px -12px rgba(0,0,0,.25);
}

</style>