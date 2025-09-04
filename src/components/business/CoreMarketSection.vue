<template>
  <section class="core-market" ref="rootEl">
    <div class="inner">
      <!-- 头部 -->
      <div class="head" :class="{ visible: headVisible }">
        <h2 class="title">{{ t('business.marketing.coreMarket.title') }}</h2>
        <p class="desc">
          {{ t('business.marketing.coreMarket.desc') }}
        </p>
      </div>

      <!-- 地图区域 -->
      <div class="map-wrap" ref="mapWrap">
        <img
          class="map-img"
            :class="{ loaded: mapLoaded }"
          :src="mapSrc"
          alt="Core market distribution map"
          @load="onMapLoaded"
          decoding="async"
          loading="lazy"
        />

        <!-- 标记点 -->
        <div
          v-for="(m, i) in markers"
          :key="m.key"
          class="marker"
          :class="{ visible: markerVisible[i] }"
          :style="markerStyle(m, i)"
          role="img"
          :aria-label="t(m.labelKey)"
        >
          <div class="pin"></div>
          <div class="label">
            {{ t(m.labelKey) }}
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * CoreMarketSection.vue
 * - 地图背景 + 5 个定位 Marker
 * - 标题与简介整体淡入；地图加载后再启动 Marker 的 IntersectionObserver
 * - 所有文案：t() 响应式，切换语言即时更新
 * - markers 坐标使用百分比，方便字号/响应式缩放
 *
 * 调整位置：修改 markers 数组 x,y (百分比)
 */
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const mapSrc = 'http://www.clicktech.jp/static/style/pc/images/buju_map.png';

interface MarkerDef {
  key: string;
  x: number; // left %
  y: number; // top %
  labelKey: string;
}

// 粗略估算的坐标，可按实际视觉微调
const markers: MarkerDef[] = [
  { key: 'us',     x: 30,  y: 60, labelKey: 'business.marketing.coreMarket.markers.us' },
  { key: 'bvi',    x: 41,  y: 70, labelKey: 'business.marketing.coreMarket.markers.bvi' },
  { key: 'china',  x: 63,  y: 55, labelKey: 'business.marketing.coreMarket.markers.china' },
  { key: 'korea',  x: 72.5, y: 57, labelKey: 'business.marketing.coreMarket.markers.korea' },
  { key: 'japan',  x: 77,  y: 56, labelKey: 'business.marketing.coreMarket.markers.japan' }
];

const rootEl = ref<HTMLElement | null>(null);
const mapWrap = ref<HTMLElement | null>(null);

const headVisible = ref(false);
const markerVisible = ref<boolean[]>(new Array(markers.length).fill(false));
const mapLoaded = ref(false);

let headObserver: IntersectionObserver | null = null;
let markerObserver: IntersectionObserver | null = null;

const STAGGER = 160;

function markerStyle(m: MarkerDef, index: number) {
  return {
    left: m.x + '%',
    top: m.y + '%',
    transitionDelay: markerVisible.value[index] ? (index * STAGGER) + 'ms' : '0ms'
  };
}

function onMapLoaded() {
  mapLoaded.value = true;
  // 地图加载完才监听 marker 进入（避免图片未撑开定位误差）
  observeMarkers();
}

function observeHead() {
  if (!rootEl.value) return;
  const headEl = rootEl.value.querySelector('.head');
  if (!headEl) return;

  headObserver = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          headVisible.value = true;
          headObserver?.disconnect();
        }
      });
    },
    { threshold: 0.25 }
  );
  headObserver.observe(headEl);
}

function observeMarkers() {
  if (!mapWrap.value || markerObserver) return;
  markerObserver = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const idx = markers.findIndex(m => e.target === mapWrap.value!.querySelector(`.marker[data-k='${m.key}']`));
          // 由于上面使用 querySelector 方式较麻烦，这里更简单：直接取 dataset.index
          const datasetIdx = Number((e.target as HTMLElement).dataset.index);
          if (!isNaN(datasetIdx)) {
            markerVisible.value[datasetIdx] = true;
            markerObserver?.unobserve(e.target);
          }
        }
      });
    },
    {
      threshold: 0.4,
      rootMargin: '0px 0px -5% 0px'
    }
  );

  // 直接观察所有 marker 元素
  const els = mapWrap.value.querySelectorAll('.marker');
  els.forEach(el => markerObserver!.observe(el));
}

onMounted(() => {
  observeHead();
});

onBeforeUnmount(() => {
  headObserver?.disconnect();
  markerObserver?.disconnect();
});
</script>

<style scoped lang="scss">
$max-width: 1480px;
$title-color: #1f2329;
$text-color: #454d58;
$pin-color: #1d4aa8;
$pin-shadow: rgba(0,0,0,0.25);

.core-market {
  width: 100%;
  background: #fff;
  padding: clamp(4.8rem, 8vw, 6.8rem) clamp(1.4rem, 5vw, 4.2rem)
           clamp(5.2rem, 9vw, 8rem);
  box-sizing: border-box;
  position: relative;
}

.inner {
  max-width: $max-width;
  margin: 0 auto;
}

.head {
  text-align: center;
  max-width: 1080px;
  margin: 0 auto clamp(3.4rem, 7vw, 4.6rem);
  opacity: 0;
  transform: translateY(32px);
  transition: opacity .9s cubic-bezier(.16,.8,.24,1),
              transform .9s cubic-bezier(.16,.8,.24,1);
  will-change: opacity, transform;
}

.head.visible {
  opacity: 1;
  transform: translateY(0);
}

.title {
  margin: 0 0 1.4rem;
  font-size: clamp(1.95rem, 3vw, 2.85rem);
  font-weight: 700;
  letter-spacing: 0.08em;
  color: $title-color;
}

.desc {
  margin: 0;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
  line-height: 2;
  color: $text-color;
}

/* 地图容器 */
.map-wrap {
  position: relative;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  /* 维持图片原有宽高比可选：若已知 ratio，可加 aspect-ratio */
}

.map-img {
  width: 100%;
  height: auto;
  display: block;
  opacity: 0;
  transition: opacity .7s ease;
}

.map-img.loaded {
  opacity: 1;
}

/* Marker */
.marker {
  position: absolute;
  transform: translate(-50%, -90%) scale(.6);
  opacity: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
  transition:
    opacity .85s cubic-bezier(.16,.8,.24,1),
    transform .85s cubic-bezier(.16,.8,.24,1);
  will-change: opacity, transform;
  font-size: 0.65rem;
  letter-spacing: 0.06em;
  color: #1a2026;
}

.marker.visible {
  opacity: 1;
  transform: translate(-50%, -90%) scale(1);
}

.pin {
  width: 18px;
  height: 18px;
  position: relative;
  background: $pin-color;
  border-radius: 50% 50% 50% 50%;
  box-shadow: 0 2px 5px -1px $pin-shadow;
  filter: drop-shadow(0 3px 8px rgba(0,0,0,0.25));
}

.pin::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -6px;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border: 6px solid transparent;
  border-top-color: $pin-color;
}

.label {
  margin-top: 6px;
  font-weight: 500;
  white-space: nowrap;
  text-shadow: 0 1px 2px rgba(255,255,255,0.9);
}

@media (max-width: 1000px) {
  .core-market {
    padding: 4.2rem 1.2rem 6rem;
  }
  .marker {
    font-size: 0.62rem;
  }
}

@media (max-width: 600px) {
  .title {
    font-size: 2.1rem;
  }
  .marker {
    font-size: 0.6rem;
  }
  .pin {
    width: 15px;
    height: 15px;
  }
}
</style>