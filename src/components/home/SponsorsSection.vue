<template>
  <section class="partners-section" id="partners">
    <!-- 左侧大背景装饰（图片 + 背景文字） -->
    <div class="left-decor">
      <img
        class="decor-image"
        :src="leftDecorSrc"
        alt="Decor"
        loading="lazy"
      />
      <!-- 若想直接用超大淡色文字而不是图片，把上面 <img> 去掉并使用下面这个文本块 -->
      <!-- <div class="ghost-text" aria-hidden="true">
        <span v-for="(ch,i) in ghostWords" :key="i">{{ ch }}</span>
      </div> -->
    </div>

    <!-- 右侧内容 -->
    <div class="right-content">
      <div class="partners-header">
        <h2 class="partners-title">
          {{ titleText }}
        </h2>
        <div class="partners-underline"></div>
      </div>

      <div class="logos-grid">
        <div
          v-for="(logo, idx) in logos"
          :key="idx"
          class="logo-item"
        >
          <img
            :src="logo.src"
            :alt="logo.alt || ('partner-' + (idx+1))"
            loading="lazy"
            decoding="async"
            @error="onImgError($event)"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
// 左侧装饰图片（注意空格需要编码：Group%2010.png）
import leftDecorSrc from '@/assets/img/leftDecorSrc.png';

/**
 * 说明：
 * - 截图里标题似乎拼成 “PARTNER”，如果想改回英文正确 “PARTNER”，改下面 titleText 逻辑即可。
 * - 左侧给了一个图片 URL（含空格），需要做 encode。
 */

const { t, locale } = useI18n();


// 大背景淡字（如果使用图片就不一定需要；保留做可选）
// const ghostWords = 'Our Best Partners'.split('');

// 标题：如果你确定要保留“PARTNER”原始拼写，就写死；否则可根据语言切换
const titleText = computed(() => {
  // 也可以：return locale.value === 'ja' ? 'PARTNER' : 'PARTNER';
  return 'PARTNER';
});
// 右侧 logo 列表（改为使用本地 assets）
// 匹配 /src/assets/img 目录下：PARTNER1-1.jpg、1-2.png、…、4-3.webp
type ImgUrl = string;
const allImgs = import.meta.glob('/src/assets/img/PARTNER/*.{png,jpg,jpeg,webp,svg}', {
  eager: true,
  import: 'default'
}) as Record<string, ImgUrl>;

// 只要文件名符合 (PARTNER)?<行数>-<列数>，就收集并按行、列排序：1-1,1-2,1-3,2-1,...,4-3
const entries = Object.entries(allImgs)
  .filter(([p]) => /(?:PARTNER)?\d+-\d+\.(?:png|jpe?g|webp|svg)$/i.test(p))
  .sort(([aPath], [bPath]) => {
    const a = aPath.split('/').pop() || '';
    const b = bPath.split('/').pop() || '';
    const ma = a.match(/(?:PARTNER)?(\d+)-(\d+)/i);
    const mb = b.match(/(?:PARTNER)?(\d+)-(\d+)/i);
    if (!ma || !mb) return a.localeCompare(b);
    const [ar, ac] = [parseInt(ma[1], 10), parseInt(ma[2], 10)];
    const [br, bc] = [parseInt(mb[1], 10), parseInt(mb[2], 10)];
    return ar === br ? ac - bc : ar - br;
  });

const logos = entries.map(([, url], i) => ({
  src: url,
  alt: '' // 可按需补真实名称
}));

// 图片加载失败时（防止 404），可替换成透明占位或本地默认图
function onImgError(e: Event) {
  const target = e.target as HTMLImageElement;
  target.style.opacity = '0.25';
  target.style.filter = 'grayscale(100%)';
}
</script>

<style scoped lang="scss">
$section-padding-y: clamp(4.5rem, 9vw, 7rem);
$section-padding-x: clamp(1.5rem, 6vw, 5rem);
$ghost-color: #e6e6e6;
$title-color: #1f2329;
$accent-blue: #1d3fa0;
$grid-gap-x: clamp(4.5rem, 7vw, 8rem);
$grid-gap-y: 3.4rem;

.partners-section {
  position: relative;
  display: grid;
  grid-template-columns: minmax(300px, 46%) 1fr;
  padding: $section-padding-y $section-padding-x;
  background: #fff;
  overflow: hidden;
  min-height: 100vh;
  box-sizing: border-box;
}

.left-decor {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-right: 2rem;
  min-height: 100%;
}

.decor-image {
  max-width: 100%;
  max-height: 78%;
  object-fit: contain;
  opacity: 0.8;
  mix-blend-mode: normal;
  pointer-events: none;
  user-select: none;
}

/* 如果想用文字，展示大淡字（默认隐藏图片或二选一）
   可把 .decor-image display:none; 再启用 .ghost-text */
.ghost-text {
  position: absolute;
  inset: 0;
  font-size: clamp(3.2rem, 6.8vw, 7.2rem);
  font-weight: 600;
  letter-spacing: 0.18em;
  line-height: 1.05;
  color: $ghost-color;
  opacity: 0.4;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  padding: 0.5rem 0;
  mix-blend-mode: normal;
  pointer-events: none;

  span {
    display: inline-block;
    padding-right: 0.18em;
  }
}

.right-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
}

.partners-header {
  margin-bottom: clamp(2.2rem, 4vw, 3.5rem);
}

.partners-title {
  margin: 0 0 0.9rem;
  font-size: clamp(1.9rem, 2.6vw, 2.8rem);
  font-weight: 600;
  letter-spacing: 0.08em;
  color: $title-color;
}

.partners-underline {
  width: 58px;
  height: 2px;
  background: $accent-blue;
}

/* Logos Grid:
   3 列 * 4 行（12 个）；保持横向均匀，纵向有行距。
*/
.logos-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(120px, 1fr));
  column-gap: $grid-gap-x;
  row-gap: $grid-gap-y;
  align-items: center;
  justify-items: start;
  max-width: 100%;
  padding-right: clamp(1rem, 2vw, 2rem);
}

.logo-item {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  min-height: 54px;
}

.logo-item img {
  max-height: 100px;
  max-width: 100%;
  object-fit: contain;
  // filter: grayscale(100%) brightness(0.9);
  opacity: 0.85;
  transition: filter .5s, opacity .5s, transform .5s;
  image-rendering: -webkit-optimize-contrast;
  backface-visibility: hidden;
}

.logo-item img:hover {
  filter: grayscale(0%) brightness(1);
  opacity: 1;
  transform: translateY(-4px);
}

/* 响应式 */
@media (max-width: 1400px) {
  .partners-section {
    grid-template-columns: minmax(260px, 40%) 1fr;
  }
  .logos-grid {
    column-gap: clamp(3rem, 4vw, 5rem);
  }
}

@media (max-width: 1100px) {
  .partners-section {
    grid-template-columns: 1fr;
    padding-top: clamp(4rem, 8vw, 6rem);
    padding-bottom: clamp(3.5rem, 7vw, 5.5rem);
  }
  .left-decor {
    min-height: auto;
    margin-bottom: 3rem;
    justify-content: center;
  }
  .decor-image {
    max-width: 60%;
  }
  .ghost-text {
    position: relative;
    font-size: clamp(3rem, 10vw, 5.2rem);
    text-align: center;
    justify-content: center;
  }
  .logos-grid {
    justify-items: center;
  }
  .logo-item {
    justify-content: center;
  }
}

@media (max-width: 760px) {
  .logos-grid {
    grid-template-columns: repeat(2, minmax(120px, 1fr));
    column-gap: clamp(2rem, 5vw, 3rem);
  }
  .logo-item img {
    max-height: 44px;
  }
}

@media (max-width: 520px) {
  .logos-grid {
    grid-template-columns: repeat(2, 1fr);
    row-gap: 2.2rem;
  }
  .partners-title {
    font-size: 1.9rem;
  }
  .decor-image {
    max-width: 75%;
    opacity: 0.8;
  }
  .ghost-text {
    font-size: clamp(2.6rem, 15vw, 4rem);
    opacity: 0.3;
  }
}
</style>