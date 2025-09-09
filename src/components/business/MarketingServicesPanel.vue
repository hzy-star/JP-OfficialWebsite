<template>
    <div class="marketing-panel">
        <!-- 上半 HERO -->
        <div class="hero-row">
            <div class="hero-image-wrap">
                <img class="hero-image" :src="imgSrc" alt="Marketing Services" loading="lazy" decoding="async" />
            </div>
            <div class="hero-text-wrap">
                <h1 class="hero-title">
                    <span class="line">{{ t('business.marketing.hero.title.enLine1') }}</span>
                    <span class="line">{{ t('business.marketing.hero.title.enLine2') }}</span>
                </h1>
                <p class="hero-sub">
                    {{ t('business.marketing.hero.title.jaSub') }}
                </p>
            </div>
        </div>

        <!-- 下半三列（滚动后淡入） -->
        <div ref="revealContainer" class="content-rows">
            <div v-for="(col, i) in colDefs" :key="col.key" class="col-item" :class="{ visible: visibleStates[i] }"
                :style="staggerStyle(i)">
                <div class="col-inner">
                    <h3 v-if="col.type === 'title'" class="col-title">
                        {{ t(col.key) }}
                    </h3>
                    <p v-else class="col-text">
                        {{ t(col.key) }}
                    </p>
                </div>
            </div>
        </div>
        <ServiceCategoriesSection />
        <CoreMarketSection />
        <CoreMarketCasesCarousel :autoplay="true" :interval="2000" :loop="true" :maxPerView="4"
            containerMaxWidth="1280px" @more="onCaseMore" />
    </div>
</template>

<script setup lang="ts">
/**
 * 修正版：
 * 1. 不再缓存翻译文本，只缓存 key 元数据；t() 保持响应式，切换语言自动刷新。
 * 2. IntersectionObserver 只负责触发 visibleStates。
 * 3. 使用 white-space: pre-line 处理换行，无需 v-html。
 */
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';
import ServiceCategoriesSection from './ServiceCategoriesSection.vue';
import CoreMarketSection from './CoreMarketSection.vue';
import CoreMarketCasesCarousel from './CoreMarketCasesCarousel.vue';
import imgSrc from '@/assets/img/about_img.png'
const { t } = useI18n();


interface ColDef {
    key: string;
    type: 'title' | 'text';
}

const colDefs: ColDef[] = [
    { key: 'business.marketing.blocks.leftTitle', type: 'title' },
    { key: 'business.marketing.blocks.middleText', type: 'text' },
    { key: 'business.marketing.blocks.rightText', type: 'text' }
];

const revealContainer = ref<HTMLElement | null>(null);
const visibleStates = ref<boolean[]>([false, false, false]);
let observer: IntersectionObserver | null = null;

const STAGGER_MS = 180;

function staggerStyle(index: number) {
    return {
        transitionDelay: visibleStates.value[index] ? index * STAGGER_MS + 'ms' : '0ms'
    };
}

function setupObserver() {
    if (!revealContainer.value) return;
    observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 进入视口：一次性显示全部（通过 delay 做阶梯）
                    visibleStates.value = visibleStates.value.map(() => true);
                    observer?.disconnect();
                }
            });
        },
        { threshold: 0.25 }
    );
    observer.observe(revealContainer.value);
}
function onCaseMore(key: string) {
  // 例如：router.push(`/case/${key}`)
  console.log('More case:', key);
}
onMounted(() => {
    setupObserver();
    emit('panel-mounted');
});

onBeforeUnmount(() => {
    observer?.disconnect();
});

const emit = defineEmits<{
    (e: 'panel-mounted'): void;
}>();
</script>

<style scoped lang="scss">
$hero-gap: clamp(2rem, 4vw, 5rem);
$hero-title-color: #1f2329;
$sub-color: #4c525b;
$bg-light: #fff;
$col-title-color: #1f2329;
$col-text-color: #444b53;

.marketing-panel {
    width: 100%;
    background: $bg-light;
    display: flex;
    flex-direction: column;
}

/* 上半部分 */
.hero-row {
    display: grid;
    grid-template-columns: minmax(300px, 56%) 1fr;
    gap: $hero-gap;
    align-items: stretch;
    width: 100%;
    min-height: clamp(340px, 40vw, 520px);
    overflow: hidden;
}

.hero-image-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background: #f0f2f5;
}

.hero-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.hero-text-wrap {
    padding: clamp(3rem, 6.2vw, 6rem) clamp(2rem, 4vw, 4rem);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
}

.hero-title {
    margin: 0 0 1.6rem;
    font-size: clamp(2.2rem, 3.8vw, 3.3rem);
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: 0.05em;
    color: $hero-title-color;
}

.hero-title .line {
    display: block;
}

.hero-sub {
    margin: 0;
    font-size: 0.78rem;
    letter-spacing: 0.24em;
    text-transform: none;
    color: $sub-color;
}

/* 下半三列 */
.content-rows {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: clamp(2.2rem, 3.2vw, 4rem);
    padding: clamp(4.2rem, 8vw, 6.8rem) clamp(2rem, 5.2vw, 5rem) clamp(5.2rem, 9vw, 7.5rem);
    position: relative;
}

.col-item {
    opacity: 0;
    transform: translateY(26px);
    transition:
        opacity .8s cubic-bezier(.16, .8, .24, 1),
        transform .8s cubic-bezier(.16, .8, .24, 1);
    will-change: opacity, transform;
}

.col-item.visible {
    opacity: 1;
    transform: translateY(0);
}

.col-inner {
    display: flex;
    flex-direction: column;
}

.col-title {
    margin: 0;
    font-size: clamp(1.45rem, 2.1vw, 2rem);
    line-height: 1.4;
    font-weight: 600;
    letter-spacing: 0.07em;
    color: $col-title-color;
    white-space: pre-line;
}

.col-text {
    margin: 0;
    font-size: 0.85rem;
    line-height: 2;
    letter-spacing: 0.05em;
    color: $col-text-color;
    white-space: pre-line;
}

/* 响应式 */
@media (max-width: 1100px) {
    .hero-row {
        grid-template-columns: 1fr;
        min-height: auto;
    }

    .hero-image-wrap {
        height: clamp(260px, 45vw, 400px);
    }

    .hero-text-wrap {
        align-items: center;
        text-align: center;
    }

    .content-rows {
        grid-template-columns: 1fr;
        padding: clamp(3rem, 7vw, 5rem) 1.6rem clamp(4rem, 8vw, 6rem);
    }

    .col-title {
        font-size: 1.6rem;
    }

    .col-text {
        font-size: 0.9rem;
    }
}

@media (max-width: 480px) {
    .hero-title {
        font-size: 2.1rem;
    }

    .content-rows {
        gap: 2.6rem;
    }
}
</style>