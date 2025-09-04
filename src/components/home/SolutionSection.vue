<template>
  <section class="solution-section full-height-vision" id="solution">
    <div class="solution-inner">
      <div class="solution-header">
        <h2 class="solution-title">
          {{ t('home.solution.title') }}
        </h2>
        <div class="solution-title-underline"></div>
      </div>

      <div class="cards-wrap">
        <div
          v-for="card in cards"
          :key="card.key"
          class="solution-card"
        >
          <div class="card-head">
            <h3 class="card-title">{{ card.title }}</h3>
            <span class="card-title-underline"></span>
          </div>

            <div class="card-body">
            <p
              v-for="(line, i) in card.lines"
              :key="i"
              class="card-line"
            >{{ line }}</p>
          </div>

          <button
            v-if="card.showMore"
            type="button"
            class="more-btn"
            @click="onMore(card.url)"
          >
            <span class="plus">+</span>
            <span>{{ t('app.more').replace('+', '').trim() }}</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

const { t, locale } = useI18n();

/**
 * 将描述分行：
 * 1. 优先按换行符
 * 2. 若没有换行，可选按全角句号/。/。+空格进行拆分（保持原意）
 */
function splitLines(raw: string) {
  if (!raw) return [];
  // 先把 \n（两字符）替换成真实换行（兼容有些 JSON 可能写成 \\n）
  const normalized = raw.replace(/\\n/g, '\n');
  if (normalized.includes('\n')) {
    return normalized
      .split(/\r?\n+/)
      .map(s => s.trim())
      .filter(Boolean);
  }
  // 没有换行时按日文句号/。+中文逗号等粗略分句（可根据需要简化）
  return normalized
    .split(/(?<=[。．！!？?])\s*/u)
    .map(s => s.trim())
    .filter(Boolean);
}

const cards = computed(() => {
  return [
    {
      key: 'yeahmobi',
      title: t('home.solution.items.yeahmobi.title'),
      desc: t('home.solution.items.yeahmobi.desc') as string,
      showMore: true,
      url:t('home.solution.items.yeahmobi.url') as string
    },
    {
      key: 'oversea',
      title: t('home.solution.items.oversea.title'),
      desc: t('home.solution.items.oversea.desc') as string,
      showMore: true, // 如果想隐藏中间按钮改成 false
      url:t('home.solution.items.oversea.url') as string
    },
    {
      key: 'zMaticoo',
      title: t('home.solution.items.zMaticoo.title'),
      desc: t('home.solution.items.zMaticoo.desc') as string,
      showMore: true,
      url:t('home.solution.items.zMaticoo.url') as string
    }
  ].map(c => ({
    ...c,
    lines: splitLines(c.desc)
  }));
});

function onMore(url: string) {
  window.open(url, '_blank');
}
</script>

<style scoped lang="scss">
$solution-bg: #eef2f9; // 背景浅灰蓝
$card-bg: #ffffff;
$card-radius: 0; // 看截图是直角或极微小圆角，设 0
$card-shadow: 0 4px 14px -6px rgba(0,0,0,0.08), 0 18px 45px -18px rgba(0,0,0,0.15);
$card-shadow-hover: 0 10px 28px -10px rgba(20,29,60,0.18), 0 22px 60px -25px rgba(0,0,0,0.22);

$color-title: #1f2329;
$color-text: #4c525b;
$color-accent: #1d3fa0;     // 深一点的蓝
$color-accent-hover: #244cbf;
$color-btn-text: #ffffff;

.solution-section {
  background: $solution-bg;
  padding: clamp(4.5rem, 9vw, 7rem) clamp(1.5rem, 4vw, 3.5rem);
  position: relative;
}

.solution-inner {
  max-width: 1720px;
  margin: 0 auto;
}

.solution-header {
  text-align: center;
  margin-bottom: clamp(3rem, 6vw, 4.5rem);
}

.solution-title {
  margin: 0 0 1.2rem;
  font-size: clamp(1.9rem, 2.6vw, 2.8rem);
  font-weight: 600;
  letter-spacing: .08em;
  color: $color-title;
}

.solution-title-underline {
  width: 58px;
  height: 2px;
  background: $color-accent;
  margin: 0 auto;
}

.cards-wrap {
  display: grid;
  gap: clamp(2.5rem, 3vw, 3.2rem);
  grid-template-columns: repeat(3, 1fr);
  align-items: stretch;
}

.solution-card {
  position: relative;
  background: $card-bg;
  border-radius: $card-radius;
  box-shadow: $card-shadow;
  padding: clamp(2.8rem, 4.2vw, 4rem) clamp(2.4rem, 3vw, 3.2rem)
           clamp(2.8rem, 4.2vw, 4rem);
  display: flex;
  flex-direction: column;
  transition: box-shadow .35s cubic-bezier(.16,.8,.24,1),
              transform .35s cubic-bezier(.16,.8,.24,1);
  overflow: hidden;
}

.solution-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(145deg, rgba(255,255,255,0.0), rgba(255,255,255,0.05));
  opacity: 0;
  transition: opacity .4s;
  pointer-events: none;
}

.solution-card:hover {
  transform: translateY(-6px);
  box-shadow: $card-shadow-hover;
}

.solution-card:hover::before {
  opacity: 1;
}

.card-head {
  margin-bottom: 1.8rem;
}

.card-title {
  margin: 0 0 0.95rem;
  font-size: clamp(1.35rem, 1.55vw, 1.55rem);
  font-weight: 600;
  letter-spacing: .05em;
  color: $color-title;
}

.card-title-underline {
  display: block;
  width: 48px;
  height: 2px;
  background: $color-accent;
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-line {
  margin: 0 0 .9rem;
  font-size: .85rem;
  line-height: 1.9;
  letter-spacing: 0.05em;
  color: $color-text;
  font-weight: 400;
  text-align: left;
  word-break: break-word;
}

.card-line:last-child {
  margin-bottom: 0;
}

.more-btn {
  margin-top: clamp(2rem, 2.6vw, 2.8rem);
  background: $color-accent;
  color: $color-btn-text;
  border: none;
  font-size: .82rem;
  font-weight: 500;
  letter-spacing: .12em;
  padding: 0 2.3rem 0 2.05rem;
  height: 70px;
  line-height: 70px;
  display: inline-flex;
  align-items: center;
  gap: .9rem;
  cursor: pointer;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  transition: background .35s, transform .35s;
}

.more-btn .plus {
  font-size: 1.15rem;
  font-weight: 400;
  transform: translateY(-1px);
}

.more-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, rgba(255,255,255,0.15), rgba(255,255,255,0));
  opacity: 0;
  transition: opacity .35s;
  mix-blend-mode: overlay;
}

.more-btn:hover {
  background: $color-accent-hover;
}

.more-btn:hover::after {
  opacity: 1;
}

.full-height-vision {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding-top: 90px;  /* 预留顶部导航 */
  padding-bottom: 60px;
}
.more-btn:active {
  transform: translateY(2px);
}

/* 响应式 */
@media (max-width: 1300px) {
  .cards-wrap {
    gap: clamp(2rem, 2.8vw, 3rem);
  }
}

@media (max-width: 1100px) {
  .cards-wrap {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 760px) {
  .cards-wrap {
    grid-template-columns: 1fr;
  }
  .solution-card {
    padding: 2.4rem 1.9rem 2.6rem;
  }
  .more-btn {
    width: 100%;
    justify-content: center;
    height: 62px;
    line-height: 62px;
    margin-top: 1.9rem;
  }
  .card-line {
    font-size: .83rem;
    line-height: 1.85;
  }
}

@media (max-width: 480px) {
  .solution-section {
    padding: 3.8rem 1.1rem 4.2rem;
  }
  .solution-title {
    font-size: 1.9rem;
  }
  .full-height-vision {
    padding-top: 80px;
    padding-bottom: 40px;
  }
}
</style>