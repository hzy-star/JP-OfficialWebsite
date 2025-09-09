<template>
  <section class="hero-video-wrapper" :class="{ mobile: isMobile }">
    <!-- 手机端：仅显示图片 -->
    <template v-if="isMobile">
      <picture class="hero-image">
        <img :src="mobileBanner" alt="Hero banner" />
      </picture>
    </template>

    <!-- 桌面端：显示视频 -->
    <template v-else>
      <video
        ref="videoEl"
        autoplay
        muted
        loop
        playsinline
        webkit-playsinline
        preload="auto"
        :poster="desktopBanner"
        :src="videoSrc"
      ></video>
    </template>

    <div class="hero-overlay-content">
      <h1>{{ t('home.hero.slogan') }}</h1>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';

// 图片资源
import desktopBanner from '@/assets/img/banner.jpg';
import mobileBanner from '@/assets/img/m_banner.jpg';

defineProps<{ videoSrc: string }>();

const { t } = useI18n();

const isMobile = ref(false);
let mql: MediaQueryList | null = null;

const update = () => {
  isMobile.value = !!mql?.matches;
};

onMounted(() => {
  mql = window.matchMedia('(max-width: 768px)');
  if (mql.addEventListener) mql.addEventListener('change', update);
  else mql.addListener(update);
  update();
});

onBeforeUnmount(() => {
  if (!mql) return;
  if (mql.removeEventListener) mql.removeEventListener('change', update);
  else mql.removeListener(update);
});
</script>

<style scoped>
.hero-video-wrapper {
  position: relative;
  width: 100%;
  overflow: hidden;
}

/* 让 picture 作为块级，避免内联元素可能带来的行高缝隙 */
.hero-image { display: block; line-height: 0; }

.hero-video-wrapper video,
.hero-image img {
  width: 100%;
  height: auto;
  display: block;
}

/* 移动端：取消任何固定高度或 min-height，消除底部空白 */
.hero-video-wrapper.mobile {
  height: auto !important;
  min-height: 0 !important;
  padding: 0;
  margin: 0;
}

/* 移动端文案贴近底部，避免遮挡过多画面 */
.hero-video-wrapper.mobile .hero-overlay-content {
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 24px;
  top: auto;
}

/* 默认覆盖层：铺满容器 */
.hero-overlay-content {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  pointer-events: none;
  color: #fff;
}
</style>