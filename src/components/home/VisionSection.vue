<template>
  <section class="vision-section full-height-vision">
    <div class="container vision-container">
      <div class="vision-card">
        <!-- 装饰方块（叠在卡片边框上） -->
        <div class="decor-square decor-large"></div>
        <div class="decor-square decor-blue"></div>
        <div class="decor-square decor-small"></div>

        <div class="vision-left">
          <h2 class="vision-title">
            {{ t('home.vision.title') }}
            <span class="title-underline"></span>
          </h2>
        </div>
        <div class="vision-right">
          <div class="vision-lines">
            <p
              v-for="(line, idx) in lines"
              :key="idx"
              :class="['vision-line', { 'with-accent': idx === 1 }]"
            >
              <span v-if="idx === 1" class="accent-block"></span>
              {{ line }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

const { t } = useI18n();
// const raw = computed(() => t('home.vision.content') as string);
const raw = computed(() => {
  const txt = t('home.vision.content') as string;
  // 兼容两种：如果是\\n（字面 \n）转成真正换行
  return txt.includes('\\n') ? txt.replace(/\\n/g, '\n') : txt;
});
const lines = computed(() =>
  raw.value
    .split(/\r?\n+/)
    .map(l => l.trim())
    .filter(Boolean)
);
</script>

<style scoped lang="scss">
/* 可抽取到全局 */
$vision-bg: #f7f7f8;
$vision-card-bg: #ffffff;
$vision-title-color: #2d3338;
$vision-text-color: #555a5f;
$vision-accent-blue: #274c90;
$vision-accent-yellow: #fee8b5;
$vision-line-height: 1.75;

.vision-section {
  position: relative;
  background: $vision-bg;
  overflow: hidden;
}

.full-height-vision {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding-top: 90px;  /* 预留顶部导航 */
  padding-bottom: 60px;
}

.vision-container {
  width: 100%;
}

.vision-card {
  position: relative;
  width: 100%;
  max-width: 1420px;
  margin: 0 auto;
  background: $vision-card-bg;
  border-radius: 2px;
  padding: clamp(10rem, 6vw, 5rem) clamp(2.2rem, 5vw, 4.5rem);
  display: grid;
  grid-template-columns: minmax(140px, 240px) 1fr;
  gap: clamp(2rem, 5vw, 4.5rem);
  box-shadow:
    0 4px 14px -6px rgba(0, 0, 0, 0.08),
    0 18px 45px -18px rgba(0, 0, 0, 0.15);
  z-index: 1;
}

/* 装饰方块公共样式（放在卡片上方） */
.decor-square {
  position: absolute;
  pointer-events: none;
  z-index: 3;
  border-radius: 2px;
  /* 可以加一个轻的阴影，让叠加更明显 */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
  }
}

/* 大浅灰方块：靠左下，向外突出 */
.decor-large {
  width: 110px;
  height: 110px;
  background: #f0f0f3;
  left: -55px;        /* 一半在外面，一半覆盖卡片边框 */
  bottom: -35px;      /* 略超出底部形成压线效果 */
  box-shadow: 0 6px 18px -8px rgba(0,0,0,0.12);
}

/* 蓝色方块：底部稍靠中偏左，压线 1/3 */
.decor-blue {
  width: 50px;
  height: 50px;
  background: $vision-accent-blue;
  left: clamp(9rem, 21vw, 430px);
  bottom: -22px;      /* 仅露出 2/3 在外或内，视需要调 */
  box-shadow: 0 6px 16px -6px rgba(39,76,144,0.35);
}

/* 小浅灰方块：靠下偏中（稍微靠右），轻微悬浮 */
.decor-small {
  width: 66px;
  height: 66px;
  background: #f4f4f6;
  left: 54%;
  bottom: -18px;
  transform: translateX(-50%);
  box-shadow: 0 4px 14px -6px rgba(0,0,0,0.10);
}

.vision-left { position: relative; }

.vision-title {
  margin: 0 0 1.4rem;
  font-size: clamp(1.6rem, 2.2vw, 2.1rem);
  letter-spacing: 0.15em;
  font-weight: 500;
  color: $vision-title-color;
  position: relative;
  display: inline-flex;
  flex-direction: column;
  z-index: 2; /* 文字在方块上层还是下层？如需永远在上，可设 >3 */
}

.title-underline {
  content: '';
  display: block;
  width: 50px;
  height: 2px;
  background: $vision-accent-blue;
  margin-top: 0.9rem;
}

.vision-right {
  display: flex;
  align-items: flex-start;
  z-index: 2;
}

.vision-lines { width: 100%; }

.vision-line {
  position: relative;
  margin: 0 0 1.1rem;
  font-size: clamp(0.98rem, 1.05vw, 1.15rem);
  line-height: $vision-line-height;
  color: $vision-text-color;
  font-weight: 500;
  letter-spacing: 0.04em;
  font-feature-settings: 'palt';
  z-index: 2;
}

.with-accent { padding-left: 110px; }

.accent-block {
  position: absolute;
  left: 0;
  top: 50%;
  width: 76px;
  height: 76px;
  background: $vision-accent-yellow;
  transform: translateY(-52%);
  border-radius: 2px;
  z-index: 1;
  box-shadow: 0 4px 12px -4px rgba(255, 189, 46, 0.35);
}

.with-accent { z-index: 2; }

@media (max-width: 1200px) {
  .vision-card { max-width: 1180px; }
}

@media (max-width: 960px) {
  .vision-card {
    grid-template-columns: 1fr;
    padding: clamp(2.2rem, 6vw, 3.2rem) clamp(1.4rem, 5vw, 2.4rem);
  }
  .with-accent { padding-left: 90px; }
  .accent-block {
    width: 64px;
    height: 64px;
    transform: translateY(-55%);
  }

  /* 移动端调整装饰方块位置避免遮挡文字 */
  .decor-large {
    width: 90px; height: 90px;
    left: -45px;
    bottom: -30px;
  }
  .decor-blue {
    bottom: -18px;
    left: 38%;
  }
  .decor-small {
    width: 54px; height: 54px;
    bottom: -14px;
    left: 63%;
  }
}

/* 新增：手机端取消 100vh，顶部对齐并收紧内边距，去掉多余空白 */
@media (max-width: 768px) {
  .full-height-vision {
    min-height: auto;
    align-items: flex-start;
    padding-top: 40px;
    padding-bottom: 32px;
  }
}

@media (max-width: 520px) {
  .with-accent { padding-left: 72px; }
  .accent-block { width: 54px; height: 54px; }

  .decor-blue,
  .decor-small {
    display: none; /* 小屏可隐藏（如果仍想显示就删除这两行） */
  }

  .decor-large {
    width: 78px; height: 78px;
    left: -40px;
    bottom: -26px;
  }

  /* 520 以下继续保持去 100vh 与紧凑内边距 */
  .full-height-vision {
    min-height: auto;
    align-items: flex-start;
    padding-top: 32px;
    padding-bottom: 28px;
  }
}
</style>