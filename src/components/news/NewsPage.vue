<template>
  <div class="news-page" :class="{ 'is-detail': !!activeItem }">
    <!-- Hero 半屏 -->
    <section class="news-hero">
      <div class="hero-inner">
        <h1 class="hero-title">{{ t('news.hero.title') }}</h1>
        <p class="hero-sub">{{ t('news.hero.subtitle') }}</p>
      </div>
    </section>

    <!-- 列表模式 -->
    <section
      v-if="!activeItem"
      key="list"
      class="news-list-wrap fade-section"
    >
      <div class="news-container">
        <article
          class="news-item"
          v-for="item in items"
          :key="item.id"
          @mouseenter="onItemEnter"
          @mouseleave="onItemLeave"
          @click="openItem(item)"
          @keydown.enter.prevent="openItem(item)"
          @keydown.space.prevent="openItem(item)"
          role="button"
          tabindex="0"
          :aria-label="t(item.titleKey)"
        >
          <div class="thumb">
            <img
              :src="item.image"
              :alt="t(item.titleKey)"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div class="content">
            <div class="meta-row">
              <time class="date">{{ formatDate(t(item.dateKey)) }}</time>
              <div class="tags">
                <span
                  v-for="(catKey, i) in item.categoryKeys"
                  :key="catKey + i"
                  class="tag"
                >{{ t(catKey) }}</span>
              </div>
            </div>

            <h2 class="item-title">
              {{ t(item.titleKey) }}
            </h2>

            <p class="excerpt">
              {{ t(item.excerptKey) }}
            </p>

            <button
              type="button"
              class="read-more"
              @click.stop="openItem(item)"
            >
              {{ t('news.readMore') }}
              <span class="chevron">›</span>
            </button>
          </div>
        </article>

        <div v-if="!items.length" class="empty">
          {{ t('news.empty') }}
        </div>
      </div>
    </section>

    <!-- 详情模式 -->
    <section
      v-else
      key="detail"
      class="news-detail-wrap fade-section"
    >
      <div class="detail-container">
        <div class="detail-body">
          <div class="detail-meta">
            <time class="detail-date">{{ formatDate(t(activeItem.dateKey)) }}</time>
            <div class="detail-tags">
              <span
                v-for="(catKey, i) in activeItem.categoryKeys"
                :key="catKey + i"
                class="detail-tag"
              >
                {{ t(catKey) }}
              </span>
            </div>
          </div>

          <h2 class="detail-title">
            {{ t(activeItem.titleKey) }}
          </h2>

          <!-- 主图（可单独设置 detailImage；默认复用缩略图） -->
            <figure class="detail-hero-media" v-if="activeItem.image">
            <img
              :src="activeItem.image"
              :alt="t(activeItem.titleKey)"
              loading="lazy"
              decoding="async"
            />
          </figure>

          <!-- 正文：目前为空占位（从 bodyKey 取 i18n 文本） -->
          <div
            class="detail-content rich-text"
            v-html="renderBody(activeItem.bodyKey)"
          ></div>

          <div class="back-row">
            <button type="button" class="back-btn" @click="backToList">
              ‹ {{ t('news.back') }}
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import news1 from '@/assets/img/news1.jpg'

const { t, locale } = useI18n();

interface NewsRecord {
  id: string | number;
  image: string;
  dateKey: string;
  titleKey: string;
  excerptKey: string;
  bodyKey: string;
  categoryKeys: string[];
  // 可扩展 detailImage / gallery 等
}

const items: NewsRecord[] = [
  {
    id: 'award-20240112',
    image: news1,
    dateKey: 'news.items.award20240112.date',
    titleKey: 'news.items.award20240112.title',
    excerptKey: 'news.items.award20240112.excerpt',
    bodyKey: 'news.items.award20240112.body',
    categoryKeys: [
      'news.categories.brandInnovation',
      'news.categories.overseasMarketing',
      'news.categories.localizationTeam'
    ]
  }
];

const activeId = ref<string | number | null>(null);
const activeItem = computed(() => items.find(i => i.id === activeId.value) || null);

/* 打开详情 */
function openItem(item: NewsRecord) {
  if (activeId.value === item.id) return;
  activeId.value = item.id;
  // 滚动到详情顶部（Hero 底部稍下）
  requestAnimationFrame(() => {
    const heroH = document.querySelector('.news-hero')?.getBoundingClientRect().height || 0;
    window.scrollTo({
      top: heroH + 10,
      behavior: 'smooth'
    });
  });
}

/* 返回列表 */
function backToList() {
  activeId.value = null;
  requestAnimationFrame(() => {
    const hero = document.querySelector('.news-hero');
    if (hero) {
      const top = hero.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top + hero.clientHeight - 20, behavior: 'smooth' });
    }
  });
}

/* 正文：若 bodyKey 没有真实内容，给一个空占位或基础段落 */
function renderBody(bodyKey: string) {
  const raw = t(bodyKey);
  if (!raw || raw === bodyKey) {
    return `<p style="opacity:.6;font-size:.8rem;letter-spacing:.05em;">
      ${locale.value.startsWith('ja')
        ? '（本文の詳細内容は後日追加されます）'
        : '(Full article content will be added later.)'}
    </p>`;
  }
  // 如果你的 body 中包含换行，可在 i18n 文本中放 <br/> 或使用 \n 再这里替换
  return raw
    .replace(/\n{2,}/g, '</p><p>')
    .replace(/\n/g, '<br/>')
    .replace(/^(.+)$/, '<p>$1</p>');
}

/* 日期格式（可未来改高级国际化） */
function formatDate(dateText: string) {
  // 输入: '2024-03-27'
  const parts = dateText.split('-');
  if (parts.length === 3) {
    const [y, m, d] = parts;
    if (locale.value.startsWith('ja')) return `${y}-${m}-${d}`;
    // 英文示例 Mar 27, 2024
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const mm = parseInt(m, 10);
    if (!isNaN(mm)) return `${monthNames[mm - 1]} ${parseInt(d,10)}, ${y}`;
    return `${y}-${m}-${d}`;
  }
  return dateText;
}

/* Hover 线条动画控制 */
const leaveTimers = new WeakMap<HTMLElement, number>();

function onItemEnter(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement;
  const existed = leaveTimers.get(el);
  if (existed) {
    clearTimeout(existed);
    leaveTimers.delete(el);
  }
  el.classList.remove('leaving');
  el.classList.add('hovering');
}

function onItemLeave(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement;
  if (!el.classList.contains('hovering')) return;
  el.classList.add('leaving');
  const duration =
    parseFloat(getComputedStyle(el).getPropertyValue('--line-duration')) || 0.55;
  const timer = window.setTimeout(() => {
    el.classList.remove('hovering', 'leaving');
    leaveTimers.delete(el);
  }, duration * 1000 + 30);
  leaveTimers.set(el, timer);
}

/* 如果以后支持通过路由参数 /news/:id 深链进入，可在此解析并设置 activeId */
onMounted(() => {
  // 伪代码:
  // const route = useRoute();
  // if (route.params.id) activeId.value = route.params.id as string;
});
</script>

<style scoped lang="scss">
@use 'sass:color';

$hero-bg: #f3f5fa;
$title-color: #272a2f;
$sub-color: #41474d;
$accent: #1d3fa0;
$tag-border: #cad1d9;
$text-color: #2f3942;
$muted: #54606a;
$detail-max-width: 1480px;
$detail-text-max: 980px;

.news-page {
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* Hero */
.news-hero {
  position: relative;
  width: 100%;
  min-height: 300px;
  height: 50vh;
  background: $hero-bg;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}

.hero-inner {
  padding: clamp(2.8rem, 9vw, 6rem) clamp(1.4rem, 6vw, 6rem) 2.4rem;
  animation: fadeHero .8s cubic-bezier(.16,.8,.24,1) forwards;
  opacity: 0;
  transform: translateY(40px);
}
@keyframes fadeHero { to { opacity: 1; transform: translateY(0); } }

.hero-title {
  margin: 0 0 1.2rem;
  font-size: clamp(2.2rem, 5.2vw, 3.6rem);
  font-weight: 700;
  letter-spacing: 0.13em;
  color: $title-color;
  line-height: 1.04;
}
.hero-sub {
  margin: 0;
  font-size: clamp(.68rem, 1vw, .9rem);
  letter-spacing: 0.38em;
  color: $sub-color;
  font-weight: 500;
}

/* 公共淡入容器 */
.fade-section {
  animation: fadeSection .6s cubic-bezier(.16,.8,.24,1);
}
@keyframes fadeSection { from { opacity:0; transform:translateY(24px);} to { opacity:1; transform:translateY(0);} }

/* 列表模式 */
.news-list-wrap {
  background: #fff;
  padding: clamp(3.4rem, 6vw, 5.2rem) 0 clamp(5rem, 8vw, 6.5rem);
}

.news-container {
  width: 100%;
  max-width: $detail-max-width;
  margin: 0 auto;
  padding: 0 clamp(1.4rem, 4.5vw, 5rem);
  box-sizing: border-box;
}

.news-item {
  --line-height: 2px;
  --line-duration: 0.55s;
  position: relative;
  display: grid;
  grid-template-columns: minmax(220px, 360px) 1fr;
  gap: clamp(2.2rem, 4.5vw, 5.2rem);
  align-items: start;
  margin-bottom: clamp(3.2rem, 6vw, 4.6rem);
  opacity: 0;
  transform: translateY(34px);
  animation: itemIn .9s .15s cubic-bezier(.16,.8,.24,1) forwards;
  cursor: pointer;
  outline: none;
}
.news-item:focus-visible {
  box-shadow: 0 0 0 3px rgba($accent, .35);
  border-radius: 2px;
}
@keyframes itemIn { to { opacity:1; transform:translateY(0);} }

/* 线条伪元素 */
.news-item::after {
  content: '';
  position: absolute;
  left: 0; bottom: 0;
  height: var(--line-height);
  width: 100%;
  background: linear-gradient(
    90deg,
    $accent 0%,
    /* 替换 lighten -> color.adjust */
    color.adjust($accent, $lightness: 6%) 70%,
    $accent 100%
  );
  transform: scaleX(0);
  transform-origin: left;
  pointer-events: none;
  transition: none;
}
.news-item.hovering::after {
  transform: scaleX(1);
  transform-origin: left;
  transition: transform var(--line-duration) cubic-bezier(.52,.08,.22,1);
}
.news-item.leaving::after {
  transform: scaleX(0);
  transform-origin: right;
  transition: transform var(--line-duration) cubic-bezier(.6,.04,.4,1);
}

.thumb {
  width: 100%;
  background: #e8ecf1;
  overflow: hidden;
  border: 1px solid #e4e8ed;
}
.news-item:hover .thumb img { transform: scale(1.05); }
.thumb img {
  width: 100%; height: 100%; object-fit: cover;
  display: block;
  transition: transform 1.1s ease;
}

.content { display: flex; flex-direction: column; gap: 1.2rem; }

.meta-row {
  display: flex; flex-wrap: wrap; align-items: center;
  gap: 1.1rem;
}
.date {
  font-size: 0.68rem;
  letter-spacing: 0.18em;
  font-weight: 600;
  color: $muted;
  white-space: nowrap;
}
.tags { display: flex; flex-wrap: wrap; gap: 0.55rem; }
.tag {
  font-size: 0.6rem; letter-spacing: 0.1em;
  font-weight: 500;
  padding: 0.28rem 0.55rem 0.3rem;
  border: 1px solid $tag-border;
  background: #f7f9fc;
  color: #49535b;
  border-radius: 2px;
  line-height: 1;
}

.item-title {
  margin: 0;
  font-size: clamp(1rem, 1.3vw, 1.15rem);
  line-height: 1.75;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: $text-color;
  word-break: break-word;
}
.excerpt {
  margin: 0;
  font-size: 0.75rem;
  line-height: 2;
  letter-spacing: 0.04em;
  color: #4d5861;
  max-width: 900px;
}
.read-more {
  margin-top: 0.4rem;
  background: none;
  border: none;
  color: $accent;
  font-size: 0.62rem;
  letter-spacing: 0.22em;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  text-transform: uppercase;
  transition: color .3s;
}
.read-more .chevron { font-size: .95rem; line-height: 1; transform: translateY(1px); }
/* 替换 darken -> color.adjust */
.read-more:hover { color: color.adjust($accent, $lightness: -8%); text-decoration: underline; }

.empty {
  text-align: center;
  font-size: 0.8rem;
  color: #66727c;
  letter-spacing: 0.08em;
  padding: 3rem 1rem;
}

/* 详情模式 */
.news-detail-wrap {
  background: #fff;
  padding: clamp(3.4rem, 6vw, 5.2rem) 0 clamp(6rem, 10vw, 7.5rem);
}

.detail-container {
  max-width: $detail-max-width;
  margin: 0 auto;
  padding: 0 clamp(1.4rem, 4.5vw, 5rem);
  box-sizing: border-box;
}

.detail-body {
  max-width: $detail-text-max;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  gap: 2.4rem;
  animation: detailIn .6s cubic-bezier(.16,.8,.24,1);
  position: relative;
}
@keyframes detailIn { from { opacity:0; transform:translateY(26px);} to { opacity:1; transform:translateY(0);} }

.detail-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 1.2rem;
  align-items: center;
}
.detail-date {
  font-size: 0.68rem;
  letter-spacing: 0.18em;
  font-weight: 600;
  color: $muted;
}
.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}
.detail-tag {
  font-size: 0.55rem;
  letter-spacing: 0.12em;
  padding: 0.3rem 0.55rem 0.35rem;
  border: 1px solid $tag-border;
  background: #f5f8fb;
  font-weight: 500;
  color: #4a545d;
  border-radius: 2px;
  line-height: 1;
}

.detail-title {
  margin: 0;
  font-size: clamp(1.3rem, 2.2vw, 1.9rem);
  line-height: 1.7;
  font-weight: 700;
  letter-spacing: 0.035em;
  color: $text-color;
}

.detail-hero-media {
  margin: 0;
  width: 100%;
  background: #eef1f5;
  border: 1px solid #e4e8ed;
  overflow: hidden;
  aspect-ratio: 16 / 7.5;
  display: flex;
  align-items: center;
  justify-content: center;
}
.detail-hero-media img {
  width: 100%; height: 100%; object-fit: cover;
  display: block;
  transition: transform 1.3s ease;
}
.detail-hero-media:hover img {
  transform: scale(1.04);
}

.detail-content {
  font-size: 0.82rem;
  line-height: 1.95;
  letter-spacing: 0.04em;
  color: #414b54;
  word-break: break-word;
}
.detail-content p { margin: 0 0 1.2rem; }
.detail-content p:last-child { margin-bottom: 0; }

.back-row {
  margin-top: 1rem;
}
.back-btn {
  background: none;
  border: 1px solid $accent;
  color: $accent;
  font-size: 0.62rem;
  letter-spacing: 0.22em;
  font-weight: 600;
  padding: 0.55rem 1.2rem;
  cursor: pointer;
  text-transform: uppercase;
  border-radius: 2px;
  transition: background .35s, color .35s;
}
.back-btn:hover {
  background: $accent;
  color: #fff;
}

/* 减少动画首选项 */
@media (prefers-reduced-motion: reduce) {
  .news-item,
  .news-item::after,
  .hero-inner,
  .detail-body,
  .fade-section {
    animation: none !important;
    transition: none !important;
    transform: none !important;
    opacity: 1 !important;
  }
}

/* 响应式 */
@media (max-width: 1100px) {
  .news-item { grid-template-columns: minmax(200px, 300px) 1fr; }
  .excerpt { font-size: 0.72rem; }
}
@media (max-width: 780px) {
  .news-item { grid-template-columns: 1fr; }
  .thumb { max-width: 420px;  }
  .meta-row { gap: 0.9rem; }
  .detail-hero-media { aspect-ratio: 16 / 9.5; }
}
@media (max-width: 480px) {
  .hero-title { font-size: 2rem; }
  .hero-sub { letter-spacing: 0.3em; }
  .item-title { line-height: 1.55; }
  .detail-title { line-height: 1.5; }
}
</style>