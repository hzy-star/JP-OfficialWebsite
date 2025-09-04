<template>
  <section class="company-section full-height-company" id="company">
    <div class="company-inner">
      <header class="company-header">
        <h2 class="company-title">
          {{ t('home.company.title') }}
        </h2>
        <div class="title-underline"></div>
      </header>

      <div
        class="info-wrapper"
        v-if="rows.length"
      >
        <div class="info-row" v-for="row in rows" :key="row.key">
          <div class="info-label">{{ row.label }}</div>
          <div class="info-value" v-html="row.value"></div>
        </div>
      </div>

      <div v-else class="info-empty">
        {{ t('placeholder.updating') }}
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

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
</script>

<style scoped lang="scss">
$section-bg: #fafafa;
$title-color: #1f2329;
$text-color: #3d4349;
$label-color: #4e5560;
$underline-color: #163d84;
$info-max-width: 760px; /* 可调整：表格区域最大宽度 */

.company-section {
  position: relative;
  background: $section-bg;
  padding: clamp(5rem, 9vw, 7.5rem) clamp(1.4rem, 5vw, 3.2rem)
           clamp(5.5rem, 10vw, 8rem);
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
  /* 保证标题与表格中心线一致 */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.company-header {
  text-align: center;
  margin: 0 0 clamp(3rem, 5.5vw, 4rem);
}

.company-title {
  margin: 0 0 1.1rem;
  font-size: clamp(2rem, 2.6vw, 2.85rem);
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

/* 信息区域容器：限制宽度并居中（与标题中心对齐） */
.info-wrapper {
  max-width: $info-max-width;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.55rem;
}

.info-row {
  display: grid;
  grid-template-columns: 140px 1fr;
  column-gap: clamp(1.5rem, 4vw, 3.2rem);
  align-items: flex-start;
  font-size: 0.95rem;
}

.info-label {
  font-weight: 600;
  letter-spacing: 0.08em;
  color: $label-color;
  line-height: 1.75;
  font-size: 1.25rem;
  padding-top: 2px;
  white-space: nowrap;
  text-align: left;
  font-weight: 500;
}

.info-value {
  color: $text-color;
  line-height: 1.85;
  font-weight: 400;
  letter-spacing: 0.03em;
  word-break: break-word;
  text-align: left;
  font-size: 1.25rem;
  font-weight: 500;
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

/* 响应式 */
@media (max-width: 900px) {
  .info-row {
    grid-template-columns: 120px 1fr;
  }
}

@media (max-width: 680px) {
  .company-section {
    padding: 4.5rem 1.2rem 5.5rem;
  }
  .full-height-company {
    min-height: auto;
  }
  .info-wrapper {
    max-width: 100%;
    gap: 1.35rem;
  }
  .info-row {
    grid-template-columns: 105px 1fr;
    font-size: 0.9rem;
  }
  .info-label {
    font-size: 0.82rem;
  }
}

@media (max-width: 480px) {
  .info-row {
    grid-template-columns: 92px 1fr;
    column-gap: 1rem;
  }
  .company-title {
    font-size: 2.05rem;
  }
}
</style>