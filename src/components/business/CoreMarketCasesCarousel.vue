<template>
    <section class="core-market-cases">
        <div class="inner" :style="{ maxWidth: containerMaxWidth }">
            <!-- 标题 & 简介（可隐藏） -->
            <div v-if="!hideHeading" class="head">
                <h2 class="title">{{ t('business.marketing.coreCases.title') }}</h2>
                <p class="desc">{{ t('business.marketing.coreCases.desc') }}</p>
            </div>

            <Swiper class="cases-swiper" :modules="swiperModules" :loop="loop" :looped-slides="loopedSlides"
                :speed="speed" :autoplay="autoplayObject" :space-between="spaceBetween"
                :breakpoints="computedBreakpoints" :pagination="paginationConfig" :navigation="navigationConfig"
                :a11y="{ enabled: true }" @swiper="onSwiper" @slideChange="onSlideChange">
                <SwiperSlide v-for="(item, idx) in displayItems" :key="item.key + '-' + idx" class="case-slide">
                    <article class="case-card">
                        <div class="media">
                            <img :src="item.image" :alt="t(item.titleKey)" loading="lazy" decoding="async" />
                        </div>
                        <div class="content">
                            <h3 class="case-title">{{ t(item.titleKey) }}</h3>
                            <p class="case-desc">
                                {{ t(item.descKey) }}
                            </p>
                            <!-- <button class="more-btn" type="button" @click="emit('more', item.key)">
                                more
                                <span class="chevron">›</span>
                            </button> -->
                        </div>
                    </article>
                </SwiperSlide>

                <div v-if="showPagination" class="swiper-pagination" />
                <div v-if="showNavigation" class="swiper-button-prev" />
                <div v-if="showNavigation" class="swiper-button-next" />
            </Swiper>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, Navigation, Pagination, A11y } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const { t } = useI18n();

interface CaseItem {
    key: string;
    image: string;
    titleKey: string;
    descKey: string;
}

interface Props {
    autoplay?: boolean;
    interval?: number;
    loop?: boolean;
    hideHeading?: boolean;
    speed?: number;
    spaceBetween?: number;
    maxPerView?: number;
    containerMaxWidth?: string;
    pauseOnInteraction?: boolean;
    showPagination?: boolean;
    showNavigation?: boolean;
    forceDuplicate?: boolean; // 当数据条数==可见数时是否自动复制
}

const props = withDefaults(defineProps<Props>(), {
    autoplay: true,
    interval: 4000,
    loop: true,
    hideHeading: false,
    speed: 650,
    spaceBetween: 26,
    maxPerView: 4,
    containerMaxWidth: '1280px',
    pauseOnInteraction: false, // 保持无限滚动连续
    showPagination: true,
    showNavigation: true,
    forceDuplicate: true
});

const emit = defineEmits<{
    (e: 'more', key: string): void;
    (e: 'change', activeIndex: number): void;
}>();

// 原始数据
const items: CaseItem[] = [
    {
        key: 'case1',
        image: 'http://www.clicktech.jp/uploadfile/202403/5ada3b88908f2af.jpg',
        titleKey: 'business.marketing.coreCases.items.case1.title',
        descKey: 'business.marketing.coreCases.items.case1.desc'
    },
    {
        key: 'case2',
        image: 'http://www.clicktech.jp/uploadfile/202403/96c00f27b3ba79a.jpg',
        titleKey: 'business.marketing.coreCases.items.case2.title',
        descKey: 'business.marketing.coreCases.items.case2.desc'
    },
    {
        key: 'case3',
        image: 'http://www.clicktech.jp/uploadfile/202403/24b7e71521b3230.jpg',
        titleKey: 'business.marketing.coreCases.items.case3.title',
        descKey: 'business.marketing.coreCases.items.case3.desc'
    },
    {
        key: 'case4',
        image: 'http://www.clicktech.jp/uploadfile/202403/7cc71b8367d9b12.jpg',
        titleKey: 'business.marketing.coreCases.items.case4.title',
        descKey: 'business.marketing.coreCases.items.case4.desc'
    }
];

// 需要真正循环：若条数 == 目标可见数 -> 复制一份（displayItems > slidesPerView）
const displayItems = computed<CaseItem[]>(() => {
    if (!props.forceDuplicate) return items;
    // 最大可能可见数
    const target = props.maxPerView;
    if (items.length <= target) {
        // 复制一次即可；若以后可能再加更多，可再做乘法扩展
        return [...items, ...items];
    }
    return items;
});

// Swiper 模块
const swiperModules = [Autoplay, Navigation, Pagination, A11y];

// 自动播放配置（对象形式）
const autoplayObject = computed(() => {
    if (!props.autoplay) return false;
    return {
        delay: props.interval,
        pauseOnMouseEnter: true,
        disableOnInteraction: props.pauseOnInteraction
    };
});

// 真实最大视图数：如果复制了，仍按用户设置的 maxPerView 控制显示
const realMaxPerView = computed(() => {
    // 保证不超过 displayItems.length - 1 （必须留至少 1 个用来流动）
    return Math.min(props.maxPerView, Math.max(displayItems.value.length - 1, 1));
});

// 断点（根据 realMaxPerView 计算）
const computedBreakpoints = computed(() => {
    function pick(n: number) {
        return Math.min(n, realMaxPerView.value);
    }
    return {
        0: { slidesPerView: pick(1) },
        600: { slidesPerView: pick(2) },
        1024: { slidesPerView: pick(3) },
        1440: { slidesPerView: pick(realMaxPerView.value) }
    };
});

// 指示点：只显示真实条目的数量（即原 items）
const paginationConfig = computed(() =>
    props.showPagination
        ? {
            el: '.swiper-pagination',
            clickable: true,
            // 自定义 bullet 数量 = 原始 items.length
            renderBullet(index: number, className: string) {
                return `<span class="${className}"></span>`;
            }
        }
        : false
);

const navigationConfig = computed(() =>
    props.showNavigation
        ? {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        }
        : false
);

// loopedSlides：让 Swiper 复制的克隆数量更充分（避免快速拖拽露空白）
const loopedSlides = computed(() => displayItems.value.length);

// 事件
function onSwiper() { }
function onSlideChange(swiper: any) {
    // swiper.realIndex 基于“原始数据顺序”，因为我们复制了，realIndex 会 modulo 原 items.length
    emit('change', swiper.realIndex % items.length);
}
</script>

<style scoped lang="scss">
$bg: #fff;
$title-color: #1f2329;
$text-color: #4b5360;
$accent: #1d3fa0;
$border: #e5e8ee;
$card-hover-shadow: 0 8px 28px -10px rgba(0, 0, 0, 0.15);

.core-market-cases {
    background: $bg;
    padding: clamp(4.2rem, 7vw, 6.3rem) clamp(1rem, 4.5vw, 3rem) clamp(4.2rem, 8vw, 6.3rem);
    box-sizing: border-box;
    width: 100%;
    overflow-x: clip;
}

.inner {
    margin: 0 auto;
    width: 100%;
}

.head {
    text-align: center;
    max-width: 1040px;
    margin: 0 auto clamp(2.6rem, 5vw, 3.4rem);
    animation: headFade .9s ease forwards;
    opacity: 0;
    transform: translateY(28px);
}

@keyframes headFade {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.title {
    margin: 0 0 1.3rem;
    font-size: clamp(1.9rem, 2.6vw, 2.5rem);
    font-weight: 700;
    letter-spacing: 0.08em;
    color: $title-color;
}

.desc {
    margin: 0;
    font-size: 0.82rem;
    line-height: 2;
    letter-spacing: 0.05em;
    color: $text-color;
}

.cases-swiper {
    width: 100%;
    position: relative;
}

.case-slide {
    height: auto;
    display: flex;
}

.case-card {
    background: #fff;
    border: 1px solid $border;
    width: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: box-shadow .45s, transform .45s;
}

.case-card:hover {
    box-shadow: $card-hover-shadow;
    transform: translateY(-4px);
}

.media {
    width: 100%;
    aspect-ratio: 4 / 3;
    background: #f2f4f7;
    overflow: hidden;
}

.media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.content {
    padding: 1.1rem 1.15rem 1.05rem;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    flex: 1;
}

.case-title {
    margin: 0;
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    line-height: 1.35;
    color: #232a32;
}

.case-desc {
    margin: 0;
    flex: 1;
    font-size: 0.7rem;
    line-height: 1.85;
    letter-spacing: 0.04em;
    color: #505a63;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 6;
    -webkit-box-orient: vertical;
}

.more-btn {
    background: none;
    border: none;
    padding: 0;
    font-size: 0.62rem;
    font-weight: 600;
    letter-spacing: 0.18em;
    color: $accent;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    text-transform: uppercase;
    position: relative;
}

.more-btn .chevron {
    font-size: 0.85rem;
    line-height: 1;
    transform: translateY(-1px);
}

.more-btn:hover {
    text-decoration: underline;
}

.swiper-button-prev,
.swiper-button-next {
    width: 42px;
    height: 42px;
    background: rgba(255, 255, 255, 0.85);
    border-radius: 50%;
    box-shadow: 0 6px 18px -8px rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(4px);
    color: $accent;
    top: 42%;
    transition: background .35s;
}

.swiper-button-prev:hover,
.swiper-button-next:hover {
    background: #fff;
}

.swiper-button-prev:after,
.swiper-button-next:after {
    font-size: 1.2rem;
    font-weight: 600;
}

.swiper-button-prev {
    left: 0;
}

.swiper-button-next {
    right: 0;
}

.swiper-pagination {
    position: static;
    margin-top: clamp(1.8rem, 4vw, 2.3rem);
    display: flex;
    justify-content: center;
    gap: 1rem;
}

.swiper-pagination-bullet {
    width: 28px;
    height: 2px;
    border-radius: 0;
    background: #ccd2d9;
    opacity: 1;
    transition: background .4s, transform .4s;
}

.swiper-pagination-bullet-active {
    background: $accent;
    transform: scaleY(1.5);
}

@media (max-width: 1100px) {
    .case-desc {
        -webkit-line-clamp: 7;
    }

    .swiper-button-prev,
    .swiper-button-next {
        width: 38px;
        height: 38px;
    }
}

@media (max-width: 760px) {

    .swiper-button-prev,
    .swiper-button-next {
        width: 34px;
        height: 34px;
    }

    .case-desc {
        -webkit-line-clamp: 8;
    }

    .title {
        font-size: 2rem;
    }
}
</style>