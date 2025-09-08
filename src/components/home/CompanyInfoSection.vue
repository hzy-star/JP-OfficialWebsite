<template>
  <div class="company-section full-height-company" id="company">
    <div class="company-inner">
      <div class="company-header">
        <h2 class="company-title">
          {{ t('home.company.title') }}
        </h2>
        <div class="title-underline"></div>
      </div>

      <div v-if="rows.length" ref="tableWrapper" class="info-wrapper">
        <div class="info-grid">
          <div class="info-row" v-for="row in rows" :key="row.key">
            <div class="info-label">{{ row.label }}</div>
            <div class="info-value" v-html="row.value"></div>
          </div>
        </div>
      </div>

      <div v-else class="info-empty">
        {{ t('placeholder.updating') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed, ref, onMounted, nextTick, watch } from 'vue';

const { t, tm, locale } = useI18n();

function getFields() {
  const obj = tm('home.company.fields') as any;
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) return obj;
  return {};
}

function normalizeMultiline(str: string) {
  return (str || '').replace(/\\n/g, '\n').trim();
}

function escapeToHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n+/g, '<br/>');
}

const rows = computed(() => {
  const fields = getFields();
  if (!fields.name) return [];

  const addr = normalizeMultiline(fields.addrVal || '');
  const tel = fields.tel ? String(fields.tel) : '';
  const bizLines: string[] = Array.isArray(fields.bizLines) ? fields.bizLines : [];
  const biz = bizLines.join('\n');

  const companyName =
    locale.value === 'ja'
      ? 'CLICK TECH株式会社'
      : 'CLICK TECH Co., Ltd.';

  return [
    { key: 'name', label: fields.name, value: companyName },
    { key: 'rep', label: fields.rep, value: fields.ceo || '' },
    { key: 'est', label: fields.est, value: fields.estVal || '' },
    { key: 'capital', label: fields.capital, value: fields.capitalVal || '' },
    {
      key: 'addr',
      label: fields.addr,
      value: escapeToHtml(addr + (tel ? '\n' + tel : ''))
    },
    {
      key: 'biz',
      label: fields.biz,
      value: escapeToHtml(biz)
    }
  ];
});

const tableWrapper = ref<HTMLElement | null>(null);

function measureLabelWidth() {
  nextTick(() => {
    const el = tableWrapper.value;
    if (!el) return;
    const labels = el.querySelectorAll<HTMLElement>('.info-label');
    if (!labels.length) return;
    let max = 0;
    labels.forEach(l => {
      // 先清空可能已有的 width 限制，避免反复测量变小
      l.style.width = '';
      const w = l.offsetWidth;
      if (w > max) max = w;
    });
    // 设定一个上下限，避免异常撑开
    const min = 100;
    const maxLimit = 240;
    const finalWidth = Math.min(Math.max(max, min), maxLimit);

    // 写入 CSS 变量
    el.style.setProperty('--label-width', finalWidth + 'px');

    // （可选）光学微调：如果 value 宽度远大于 label，可右移一点
    const grid = el.querySelector<HTMLElement>('.info-grid');
    if (grid) {
      const valueCells = el.querySelectorAll<HTMLElement>('.info-value');
      let maxValueWidth = 0;
      valueCells.forEach(v => {
        const w = v.offsetWidth;
        if (w > maxValueWidth) maxValueWidth = w;
      });
      // 比例差异
      const ratio = maxValueWidth / finalWidth;
      let shift = 0;
      if (ratio > 2.2) {
        shift = 4; // 轻微右移
      }
      if (ratio > 3.2) {
        shift = 6;
      }
      el.style.setProperty('--optical-shift', shift + 'px');
    }
  });
}

onMounted(() => {
  measureLabelWidth();
});

// 监听语言与数据变化
watch([locale, rows], () => {
  measureLabelWidth();
});
</script>

<style scoped lang="scss">
$section-bg: #fafafa;
$title-color: #1f2329;
$text-color: #3d4349;
$label-color: #4e5560;
$underline-color: #163d84;
$max-total-width: 920px; /* 信息块最大整体宽度（含两列与间距） */

.company-section {
  position: relative;
  background: $section-bg;
  padding: 6.5rem 2.6rem 7.5rem;
  box-sizing: border-box;
  width: 100%;
}

.full-height-company {
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
}

.company-inner {
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.company-header {
  text-align: center;
  margin: 0 0 4rem;
}

.company-title {
  margin: 0 0 1.1rem;
  font-size: 2.8rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: $title-color;
}

.title-underline {
  width: 52px;
  height: 2px;
  background: $underline-color;
  margin: 0 auto;
}

/* 包裹层：通过 shrink-to-fit + auto 居中 */
.info-wrapper {
  --label-width: 140px;      /* 初始值，后面 JS 会覆盖 */
  --col-gap: 3rem;
  --optical-shift: 0px;
  width: 100%;
  display: flex;
  justify-content: center;
  transform: translateX(var(--optical-shift));
  /* 限制最大宽度以避免超宽 */
  max-width: $max-total-width;
  padding: 0;
  box-sizing: border-box;
}

.info-grid {
  display: inline-grid;
  grid-template-columns: var(--label-width) 1fr;
  column-gap: var(--col-gap);
  row-gap: 1.55rem;
  width: auto;
  /* 让网格宽度自动由内容决定并居中 */
  justify-content: center;
}

.info-row {
  display: contents; /* 让两个单元格直接参与 grid 布局 */
}

.info-label {
  font-size: 1.2rem;
  font-weight: 500;
  color: $label-color;
  letter-spacing: 0.08em;
  line-height: 1.75;
  text-align: right;
  white-space: nowrap;
  /* 由 grid-template-columns 控制宽度 */
}

.info-value {
  font-size: 1.2rem;
  font-weight: 500;
  color: $text-color;
  letter-spacing: 0.03em;
  line-height: 1.85;
  text-align: left;
  word-break: break-word;
  max-width: 290px; /* 防止右列过长一行撑太宽，可按需要调整 */
}

.info-value :deep(br) {
  line-height: 1.5;
}

.info-empty {
  margin-top: 2rem;
  font-size: 0.9rem;
  color: #888;
  letter-spacing: 0.05em;
}

/* ---------- 响应式 ---------- */
@media (max-width: 900px) {
  .company-title {
    font-size: 2.45rem;
  }
  .info-wrapper {
    --col-gap: 2.4rem;
  }
  .info-label,
  .info-value {
    font-size: 1.05rem;
  }
  .info-value {
    max-width: 500px;
  }
}

@media (max-width: 680px) {
  .company-section {
    padding: 4.5rem 1.2rem 5.5rem;
  }
  .full-height-company {
    min-height: auto;
  }
  .company-title {
    font-size: 2.15rem;
  }
  .info-wrapper {
    --col-gap: 1.6rem;
  }
  .info-grid {
    row-gap: 1.15rem;
  }
  .info-label {
    font-size: 0.94rem;
  }
  .info-value {
    font-size: 0.98rem;
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .company-title {
    font-size: 2rem;
  }
  /* 移动端可选择保持两列；如果想改成上下堆叠告诉我 */
  .info-wrapper {
    --col-gap: 1rem;
  }
  .info-label {
    font-size: 0.86rem;
  }
  .info-value {
    font-size: 0.94rem;
  }
}
</style>