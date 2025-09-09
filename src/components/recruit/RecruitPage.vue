<template>
  <div class="recruit-page">
    <!-- Hero -->
    <section class="recruit-hero">
      <div class="hero-media">
        <img
          class="hero-image"
          :src="heroImage"
          :alt="t('recruit.hero.imageAlt')"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div class="hero-text">
        <h1 class="hero-title">
          {{ t('recruit.hero.title') }}
        </h1>
        <p class="hero-sub">
          {{ t('recruit.hero.subtitle') }}
        </p>
      </div>
    </section>

    <!-- 状态区：当前没有招聘 -->
    <section class="recruit-status">
      <div class="status-inner">
        <div class="status-icon-wrap">
          <img
            class="status-icon"
            :src="closedImage"
            :alt="t('recruit.status.closedImgAlt')"
            loading="lazy"
            decoding="async"
          />
        </div>
        <p class="status-text">
          {{ t('recruit.status.closedText') }}
        </p>
      </div>
    </section>

    <!-- 如果以后有职位列表，可在这里放 <RecruitPositions /> 或插槽 -->
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import join_img from '@/assets/img/join_img.png'
import stoprecruite from '@/assets/img/stoprecruite.png'
const { t } = useI18n();

/**
 * 预留可配置：图片或未来开放招聘后可以动态切换
 */
interface Props {
  heroImage?: string;
  closedImage?: string;
}

const props = withDefaults(defineProps<Props>(), {
  heroImage: join_img,
  closedImage: stoprecruite
});

const heroImage = props.heroImage;
const closedImage = props.closedImage;
</script>

<style scoped lang="scss">
$bg-hero: #ffffff;
$bg-status: #f3f5fa;
$title-color: #272a2f;
$sub-color: #454b52;
$text-color: #2e3338;

.recruit-page {
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
}

/* ===== HERO 改为左右平分 flex ===== */
.recruit-hero {
  width: 100%;
  display: flex;
  height: 70vh;
  min-height: 420px;
  max-height: 820px;
  background: $bg-hero;
  overflow: hidden;
  animation: heroFade .8s cubic-bezier(.16,.8,.24,1);
}

@keyframes heroFade {
  from { opacity: 0; transform: translateY(34px); }
  to   { opacity: 1; transform: translateY(0); }
}

.hero-media,
.hero-text {
  flex: 1 0 54%;
  height: 100%;
}

.hero-media {
  position: relative;
  overflow: hidden;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transform: scale(1.04);
  animation: imgIn 1.6s cubic-bezier(.22,.72,.25,1) forwards;
}

@keyframes imgIn {
  from { transform: scale(1.12); filter: brightness(.9); }
  to   { transform: scale(1.0);  filter: brightness(1); }
}

.hero-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(2.4rem, 6vw, 5rem) clamp(1.8rem, 5vw, 4rem);
  gap: 1.2rem;
}

.hero-title {
  margin: 0;
  font-size: clamp(2.1rem, 4.8vw, 3.2rem);
  font-weight: 700;
  letter-spacing: 0.14em;
  line-height: 1.05;
  color: $title-color;
}
.hero-sub {
  margin: 0;
  font-size: clamp(.7rem, 1.05vw, .95rem);
  letter-spacing: 0.38em;
  font-weight: 500;
  color: $sub-color;
}

/* ===== STATUS (未招聘) ===== */
.recruit-status {
  background: $bg-status;
  width: 100%;
  padding: clamp(4rem, 8vw, 6.5rem) 0 clamp(5rem, 10vw, 7rem);
  display: flex;
  justify-content: center;
}

.status-inner {
  max-width: 880px;
  padding: 0 clamp(1.2rem, 4vw, 2.2rem);
  text-align: center;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2.6rem;
  align-items: center;
  animation: statusIn .7s .15s cubic-bezier(.16,.8,.24,1) both;
  opacity: 0;
  transform: translateY(28px);
}

@keyframes statusIn {
  to { opacity: 1; transform: translateY(0); }
}

.status-icon-wrap {
  width: clamp(110px, 14vw, 150px);
  height: clamp(110px, 14vw, 150px);
  background: #eef1f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.status-icon {
  max-width: 65%;
  max-height: 65%;
  object-fit: contain;
  display: block;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.06));
}

.status-text {
  margin: 0;
  font-size: clamp(.85rem, 1.05vw, 1rem);
  letter-spacing: 0.05em;
  font-weight: 500;
  line-height: 1.95;
  color: $text-color;
}

/* ===== 响应式 ===== */
@media (max-width: 880px) {
  .recruit-hero {
    flex-direction: column;
    height: auto;
    min-height: unset;
  }
  .hero-media {
    height: clamp(220px, 42vh, 360px);
  }
  .hero-text {
    padding: clamp(2.2rem, 8vw, 3.2rem) clamp(1.3rem, 6vw, 2rem)
             clamp(2.6rem, 8vw, 3.4rem);
    text-align: center;
    align-items: center;
  }
  .hero-title { letter-spacing: 0.12em; }
  .hero-sub   { letter-spacing: 0.32em; }
}

@media (prefers-reduced-motion: reduce) {
  .recruit-hero,
  .status-inner,
  .hero-image {
    animation: none !important;
    transform: none !important;
    opacity: 1 !important;
  }
}
</style>