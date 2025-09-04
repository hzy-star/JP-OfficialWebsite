<template>
  <section class="business-section" id="business">

    <!-- 面板区域 -->
    <div class="biz-panel-wrap">
      <Transition name="biz-fade" mode="out-in">
        <component
          :is="activeComponent"
          :key="activeKey"
          @panel-mounted="onPanelMounted"
        />
      </Transition>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * BusinessTabs.vue
 * - 控制多个业务模块的 Tab 切换
 * - 当前只实现第一个“Marketing Services”
 * - 后续新增模块：在 tabs 与 componentsMap 中追加
 */
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

import MarketingServicesPanel from '../business/MarketingServicesPanel.vue';
// 未来的：import AnotherServicePanel from './AnotherServicePanel.vue';

const { t } = useI18n();

interface TabItem {
  key: string;
  label: string;
  comp: any;
}

const tabs = ref<TabItem[]>([
  {
    key: 'marketing',
    label: t('business.tabs.marketing'),
    comp: MarketingServicesPanel
  },
  // 追加更多：
  // { key: 'xxx', label: t('business.tabs.xxx'), comp: XxxPanel }
]);

const activeKey = ref('marketing');

const componentsMap = computed<Record<string, any>>(() => {
  return tabs.value.reduce((acc, cur) => {
    acc[cur.key] = cur.comp;
    return acc;
  }, {} as Record<string, any>);
});

const activeComponent = computed(() => componentsMap.value[activeKey.value]);

function select(key: string) {
  if (key === activeKey.value) return;
  activeKey.value = key;
}

function onPanelMounted() {
  // 可在这里做：滚动到顶部 / 重置滚动位置
  // window.scrollTo({ top: 0, behavior: 'smooth' });
}
</script>

<style scoped lang="scss">
$tab-active: #1d3fa0;
$tab-color: #353b44;
$tab-bg: #f5f7fa;

.business-section {
  width: 100%;
  background: #fff;
}

.biz-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.2rem;
  padding: 1.2rem clamp(1rem, 4vw, 3.2rem) 0.8rem;
  border-bottom: 1px solid #e3e6eb;
}

.biz-tab-btn {
  position: relative;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.85rem 1.6rem;
  font-size: 0.85rem;
  letter-spacing: 0.14em;
  font-weight: 600;
  color: $tab-color;
  transition: color .3s, background .35s;
  text-transform: uppercase;
}

.biz-tab-btn:hover {
  color: $tab-active;
  background: rgba(29,63,160,0.08);
}

.biz-tab-btn.active {
  color: #fff;
  background: $tab-active;
}

.biz-tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: $tab-active;
}

.biz-panel-wrap {
  position: relative;
  width: 100%;
}

.biz-fade-enter-active,
.biz-fade-leave-active {
  transition: opacity .5s ease;
}
.biz-fade-enter-from,
.biz-fade-leave-to {
  opacity: 0;
}
</style>