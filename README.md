# CLICK TECH Static Site (Vue3 + TS + Pinia + Router + Element Plus + i18n)

## 技术栈
- Vite
- Vue 3 + `<script setup>` + TypeScript
- Pinia
- Vue Router
- Element Plus
- vue-i18n
- Leaflet (地图)
- SCSS

## 功能现状
- 首页：全屏视频 Hero、VISION、SOLUTION、Sponsors 占位、公司信息、地图、Footer
- 响应式布局
- 顶部导航悬浮，语言切换（默认日本語）
- i18n 中日文（部分英文翻译）

## 启动
```bash
pnpm install # 或 npm install / yarn
pnpm dev
```

打包:
```bash
pnpm build
```

预览:
```bash
pnpm preview
```

## 目录说明
见源码。

## 地图
- 使用 Leaflet + OSM
- 可拖动/缩放，无选择交互
- 标记位置: 明治神宮前附近 (35.6702, 139.7065)

## 后续可扩展
- 新闻列表 / 详情
- 联系表单（前端 + 后端 API）
- 招聘职位列表（分页 + 搜索）
- 解决方案 +More 弹窗或路由跳转
- Sponsor 动态数据
- SEO SSR（若需要可迁移到 Nuxt 方案）

## 设计风格
当前为简洁企业站基础风格，可根据品牌规范完善色彩/组件。

## 许可
内部使用，可自行添加 LICENSE。