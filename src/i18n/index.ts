import { createI18n } from 'vue-i18n';
import ja from '@/locales/ja.json';
import en from '@/locales/en.json';
import { useUiStore } from '@/store';

const i18n = createI18n({
  legacy: false,
  locale: 'ja',
  fallbackLocale: 'ja',
  messages: {
    ja,
    en
  }
});

// 同步 pinia（可在 main 挂载后处理，这里仅示例）
export function syncLocaleToStore() {
  const ui = useUiStore();
  i18n.global.locale.value = ui.locale;
}

export default i18n;