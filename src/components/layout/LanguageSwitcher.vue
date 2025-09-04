<template>
  <div>
    <el-select
      v-model="localeRef"
      size="small"
      style="width: 120px"
      @change="onChange"
    >
      <el-option label="日本語" value="ja" />
      <el-option label="English" value="en" />
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { useUiStore } from '@/store';
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';

const ui = useUiStore();
const { locale } = storeToRefs(ui);
const { locale: i18nLocale } = useI18n();

const localeRef = locale;

function onChange(val: 'ja' | 'en') {
  ui.setLocale(val);
  i18nLocale.value = val;
  document.documentElement.lang = val;
}
</script>