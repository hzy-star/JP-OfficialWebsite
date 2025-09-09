<template>
  <header class="nav-root">
    <div class="nav-inner">
      <div class="brand" @click="go('/')">{{ t('app.title') }}</div>

      <nav class="nav-links" aria-label="Primary">
        <a
          v-for="item in items"
          :key="item.to"
          :class="['nav-link', { active: route.name === item.name }]"
          @click="go(item.to)"
        >{{ t(item.label) }}</a>
      </nav>

      <!-- 包一层，便于控制在移动端行内位置与 z-index -->
      <div class="lang-switcher">
        <LanguageSwitcher />
      </div>
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
  overflow: visible; /* 确保下拉不被裁切 */
  z-index: 100;
}
.nav-inner {
  width: min(1200px, 92%);
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 2rem;
  min-height: 54px;
  flex-wrap: nowrap; /* 桌面保持单行 */
}
.brand {
  font-weight: 700;
  letter-spacing: 0.08em;
  font-size: 1.05rem;
  cursor: pointer;
  color: #fff;
  user-select: none;
}
.nav-links {
  display: flex;
  gap: 1.6rem;
  flex: 1 1 auto;
  justify-content: center;
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
  /* 关键：整项不折字，避免日文逐字竖排 */
  white-space: nowrap;
  word-break: keep-all;
  /* 让 flex 项宽度至少为内容宽，从而整体换行，而不是挤压成竖排 */
  min-width: max-content;
  flex: 0 1 auto;
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
.lang-switcher {
  flex: 0 0 auto;
  min-width: 0;
  position: relative;
  z-index: 200; /* 保证下拉在最上层 */
  display: flex;
  align-items: center;
}

/* ---------- 移动端：分两行 ----------
   第一行：brand 在左、语言切换在右
   第二行：nav-links 占满一行，内部链接自动换行且整体居中
*/
@media (max-width: 768px) {
  .nav-inner {
    flex-wrap: wrap;
    gap: 0.5rem 1rem;
    align-items: center;
  }
  .brand { order: 1; }
  .lang-switcher { order: 2; margin-left: auto; }
  .nav-links {
    order: 3;
    flex: 0 0 100%;
    justify-content: center;
    gap: 0.2rem 0.8rem;     /* 行/列间距 */
    flex-wrap: wrap;        /* 允许换行（整项换行） */
    padding-bottom: 6px;    /* 给下划线留点空间 */
  }
  .nav-link {
    font-size: 0.92rem;
    padding: 6px 0;
  }
}

/* 更小屏再紧凑一点 */
@media (max-width: 390px) {
  .nav-links {
    gap: 0.4rem 0.8rem;
  }
  .nav-link {
    font-size: 0.88rem;
  }
}
</style>