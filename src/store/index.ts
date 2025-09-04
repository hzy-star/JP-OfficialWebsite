import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUiStore = defineStore('ui', () => {
  const locale = ref<'ja' | 'en'>('ja');
  function setLocale(l: 'ja' | 'en') {
    locale.value = l;
  }
  return { locale, setLocale };
});