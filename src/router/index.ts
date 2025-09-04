import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: () => import('@/views/Home.vue') },
  { path: '/business', name: 'business', component: () => import('@/views/Business.vue') },
  { path: '/news', name: 'news', component: () => import('@/views/News.vue') },
  { path: '/careers', name: 'careers', component: () => import('@/views/Careers.vue') },
  { path: '/contact', name: 'contact', component: () => import('@/views/Contact.vue') }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, saved) {
    if (saved) return saved;
    return { top: 0 };
  }
});

export default router;