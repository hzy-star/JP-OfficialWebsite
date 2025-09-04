<template>
  <header class="nav-root">
    <div class="nav-inner">
      <div class="brand" @click="go('/')">{{ t('app.title') }}</div>
      <nav class="nav-links">
        <a
          v-for="item in items"
          :key="item.to"
          :class="['nav-link', { active: route.name === item.name }]"
          @click="go(item.to)"
        >{{ t(item.label) }}</a>
      </nav>
      <LanguageSwitcher />
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import LanguageSwitcher from './LanguageSwitcher.vue';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const items = [
  { to: '/', name: 'home', label: 'app.nav.home' },
  { to: '/business', name: 'business', label: 'app.nav.business' },
  { to: '/news', name: 'news', label: 'app.nav.news' },
  { to: '/careers', name: 'careers', label: 'app.nav.careers' },
  { to: '/contact', name: 'contact', label: 'app.nav.contact' }
];

function go(path: string) {
  if (route.path !== path) router.push(path);
}
</script>

<style scoped>
.nav-root {
  backdrop-filter: blur(10px);
  background: rgba(10, 16, 25, 0.45);
  border-bottom: 1px solid rgba(255,255,255,0.08);
  width: 100%;
  padding: 8px 0;
}
.nav-inner {
  width: min(1200px, 92%);
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 2rem;
  min-height: 54px;
}
.brand {
  font-weight: 700;
  letter-spacing: 0.08em;
  font-size: 1.05rem;
  cursor: pointer;
  color: #fff;
}
.nav-links {
  display: flex;
  gap: 1.6rem;
  flex: 1;
}
.nav-link {
  font-size: 0.85rem;
  letter-spacing: 0.06em;
  font-weight: 600;
  cursor: pointer;
  color: #d4dae2;
  position: relative;
  padding: 4px 0;
  transition: color .25s;
}
.nav-link.active,
.nav-link:hover {
  color: #fff;
}
.nav-link.active::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -6px;
  height: 2px;
  width: 100%;
  background: linear-gradient(90deg,#5aa8ff,#9ecbff);
  border-radius: 2px;
}
</style>