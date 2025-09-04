<template>
  <!-- 当地址是http://xxx/contact的时候，隐藏ContactCallout -->
  <ContactCallout v-if="!isContactPage" />
  <footer class="site-footer">
    <div class="container footer-inner">
      <div class="left">
        <div class="footer-title">{{ t('app.title') }}</div>
      </div>
      <div class="right">
        <div class="footer-nav">
          <a v-for="i in nav" :key="i.to" @click.prevent="go(i.to)">{{ t(i.label) }}</a>
        </div>
        <div class="footer-bottom">
          {{ t('home.footer.rights') }}
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import ContactCallout from '@/components/home/ContactCallout.vue';

const { t } = useI18n();
const router = useRouter();

const isContactPage = computed(() => {
  return router.currentRoute.value.path === '/contact';
});
const nav = [
  { to: '/', label: 'app.nav.home' },
  { to: '/business', label: 'app.nav.business' },
  { to: '/news', label: 'app.nav.news' },
  { to: '/careers', label: 'app.nav.careers' },
  { to: '/contact', label: 'app.nav.contact' }
];

function go(to: string) {
  router.push(to);
}
</script>