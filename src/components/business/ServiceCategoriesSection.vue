<template>
  <section class="svc-categories" ref="rootEl">
    <div class="inner">
      <!-- 顶部标题区 -->
      <div class="head" :class="{ visible: headVisible }">
        <h2 class="title">{{ t('business.marketing.categories.title') }}</h2>
        <p class="desc">
          {{ t('business.marketing.categories.desc') }}
        </p>
      </div>

      <!-- 四个分类 -->
      <div class="grid">
        <div
          v-for="(it, idx) in items"
          :key="it.key"
          class="cat-item"
          :class="{ visible: itemVisible[idx] }"
          :style="staggerStyle(idx)"
          ref="itemRefs"
        >
          <div class="icon-wrap">
            <div class="icon-circle">
              <img
                :src="it.icon"
                :alt="t(it.titleKey)"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
          <div class="text">
            <h3 class="cat-title">{{ t(it.titleKey) }}</h3>
            <p class="cat-text">
              {{ t(it.textKey) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * ServiceCategoriesSection.vue
 * - “サービスカテゴリ / Service Categories” 模块
 * - IntersectionObserver 实现标题与每个 item 的滚动渐显
 * - 所有文案用 t() -> 切换语言实时更新
 */
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import iconStrategy from '@/assets/img/svg/strategy.svg';
import iconCreative from '@/assets/img/svg/creative.svg';
import iconMedia from '@/assets/img/svg/media.svg';
import iconInsights from '@/assets/img/svg/insights.svg';

const { t } = useI18n();

interface CategoryItem {
  key: string;
  icon: string;
  titleKey: string;
  textKey: string;
}

const items: CategoryItem[] = [
  { key: 'strategy', icon: iconStrategy, titleKey: 'business.marketing.categories.items.strategy.title', textKey: 'business.marketing.categories.items.strategy.text' },
  { key: 'creative', icon: iconCreative, titleKey: 'business.marketing.categories.items.creative.title', textKey: 'business.marketing.categories.items.creative.text' },
  { key: 'media', icon: iconMedia, titleKey: 'business.marketing.categories.items.media.title', textKey: 'business.marketing.categories.items.media.text' },
  { key: 'insights', icon: iconInsights, titleKey: 'business.marketing.categories.items.insights.title', textKey: 'business.marketing.categories.items.insights.text' }
];

const rootEl = ref<HTMLElement | null>(null);
const itemRefs = ref<HTMLElement[]>([]);

const headVisible = ref(false);
const itemVisible = ref<boolean[]>(new Array(items.length).fill(false));

const STAGGER = 140;
let headObserver: IntersectionObserver | null = null;
let itemObserver: IntersectionObserver | null = null;

function staggerStyle(i: number) {
  return {
    transitionDelay: itemVisible.value[i] ? i * STAGGER + 'ms' : '0ms'
  };
}

function observe() {
  if (!rootEl.value) return;

  headObserver = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          headVisible.value = true;
          headObserver?.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );
  headObserver.observe(rootEl.value.querySelector('.head') as Element);

  itemObserver = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const idx = itemRefs.value.indexOf(e.target as HTMLElement);
            if (idx !== -1) {
            itemVisible.value[idx] = true;
            // 如果想当前项显示后立即取消观察，可单独 unobserve
            itemObserver?.unobserve(e.target);
          }
        }
      });
    },
    {
      threshold: 0.35,
      root: null,
      rootMargin: '0px 0px -5% 0px'
    }
  );

  itemRefs.value.forEach(el => {
    itemObserver?.observe(el);
  });
}

onMounted(() => {
  observe();
});

onBeforeUnmount(() => {
  headObserver?.disconnect();
  itemObserver?.disconnect();
});

// 解决 v-for + template ref 数组
function setItemRef(el: HTMLElement | null) {
  if (el) itemRefs.value.push(el);
}
</script>

<script lang="ts">
// 提示：上面在模板中 ref="itemRefs" -> Vue3 会自动调用 setItemRef
export default {};
</script>

<style scoped lang="scss">
$bg: #EFF2FA;
$title-color: #1f2329;
$text-color: #4b5360;
$accent: #1d3fa0;
$circle-bg: #e9edf3;

.svc-categories {
  background: $bg;
  width: 100%;
  padding: clamp(4.5rem, 8vw, 6.5rem) clamp(1.4rem, 5vw, 4.5rem)
           clamp(5rem, 9vw, 7.5rem);
  box-sizing: border-box;
  position: relative;
}

.inner {
  max-width: 1380px;
  margin: 0 auto;
}

.head {
  text-align: center;
  max-width: 1080px;
  margin: 0 auto clamp(3rem, 6vw, 4.5rem);
  opacity: 0;
  transform: translateY(28px);
  transition: opacity .9s cubic-bezier(.16,.8,.24,1),
              transform .9s cubic-bezier(.16,.8,.24,1);
  will-change: opacity, transform;
}

.head.visible {
  opacity: 1;
  transform: translateY(0);
}

.title {
  margin: 0 0 1.6rem;
  font-size: clamp(1.9rem, 2.9vw, 2.7rem);
  font-weight: 700;
  letter-spacing: 0.08em;
  color: $title-color;
}

.desc {
  margin: 0;
  font-size: 0.85rem;
  line-height: 2;
  letter-spacing: 0.05em;
  color: $text-color;
  white-space: normal;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: clamp(3.2rem, 6vw, 5.2rem) clamp(3rem, 6vw, 6rem);
  max-width: 1080px;
  margin: 0 auto;
  position: relative;
}

.cat-item {
  display: flex;
  gap: clamp(1.6rem, 2.3vw, 2.4rem);
  align-items: flex-start;
  opacity: 0;
  transform: translateY(36px);
  transition:
    opacity .85s cubic-bezier(.16,.8,.24,1),
    transform .85s cubic-bezier(.16,.8,.24,1);
  will-change: opacity, transform;
}

.cat-item.visible {
  opacity: 1;
  transform: translateY(0);
}

.icon-wrap {
  flex: 0 0 auto;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  position: relative;
}

.icon-circle {
  width: clamp(130px, 13vw, 168px);
  height: clamp(130px, 13vw, 168px);
  border-radius: 50%;
  background: $circle-bg;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.icon-circle img {
  width: 56%;
  height: 56%;
  object-fit: contain;
  filter: grayscale(55%);
  transition: filter .5s;
}

.cat-item.visible .icon-circle img {
  filter: grayscale(0%);
}

.text {
  flex: 1;
  min-width: 0;
}

.cat-title {
  margin: 0 0 0.9rem;
  font-size: 1.2rem;
  letter-spacing: 0.08em;
  font-weight: 600;
  color: $title-color;
}

.cat-text {
  margin: 0;
  font-size: 0.98rem;
  line-height: 2;
  letter-spacing: 0.05em;
  color: $text-color;
  white-space: normal;
}

/* Hover 轻微动效（可选） */
.cat-item:hover .icon-circle img {
  transform: translateY(-2px);
}

@media (max-width: 1100px) {
  .grid {
    grid-template-columns: 1fr;
    gap: 3.2rem 2rem;
  }
  .cat-item {
    align-items: center;
  }
  .cat-text {
    font-size: 0.82rem;
  }
}

@media (max-width: 560px) {
  .svc-categories {
    padding: 3.8rem 1.1rem 5rem;
  }
  .icon-circle {
    width: 120px;
    height: 120px;
  }
  .title {
    font-size: 2rem;
  }
  .cat-title {
    font-size: 0.95rem;
  }
  .cat-text {
    font-size: 0.8rem;
  }
}
</style>