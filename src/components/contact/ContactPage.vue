<template>
  <div class="contact-page">
    <!-- 顶部 HERO -->
    <section class="contact-hero">
      <div class="hero-inner">
        <h1 class="hero-title">{{ t('contact.hero.title') }}</h1>
        <p class="hero-sub">{{ t('contact.hero.subtitle') }}</p>
      </div>
    </section>

    <!-- 表单区 -->
    <section class="contact-form-section">
      <div class="form-container">

        <header class="form-intro">
          <p class="intro-line">
            {{ t('contact.intro.line1') }}<br />
            {{ t('contact.intro.line2') }}
          </p>
          <p class="note-required">
            {{ t('contact.intro.requiredNote') }}
          </p>
        </header>

        <!-- 提交反馈 -->
        <transition name="fade-slide">
          <div
            v-if="status.message"
            class="status-banner"
            :class="status.ok ? 'ok' : 'error'"
            role="alert"
          >
            {{ status.message }}
          </div>
        </transition>

        <form
          ref="formEl"
            class="contact-form"
          novalidate
          @submit.prevent="onSubmit"
        >
          <FormField
            v-for="f in fieldDefs"
            :key="f.name"
            v-model="form[f.name]"
            :config="f"
            :error="errors[f.name]"
            :t="t"
            required-mark="※"
            @blur="validateField(f.name)"
          />

          <!-- honeypot (隐藏) -->
          <div class="hp">
            <label>
              <input
                v-model="honeypot"
                type="text"
                tabindex="-1"
                autocomplete="off"
                aria-hidden="true"
              />
            </label>
          </div>

          <div class="actions">
            <button
              type="submit"
              class="submit-btn"
              :disabled="submitting"
            >
              <span v-if="!submitting">{{ t('contact.actions.submit') }}</span>
              <span v-else class="spinner-wrap">
                <span class="spinner" />
              </span>
            </button>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import FormField from '@/components/contact/FormField.vue';

const { t, locale } = useI18n();

/* 表单数据结构 */
interface ContactForm {
  name: string;
  company: string;
  website: string;
  email: string;
  address: string;
  phone: string;
  subject: string;
  body: string;
}
type FieldKey = keyof ContactForm;

/* 字段配置 */
interface FieldConfig {
  name: FieldKey;
  labelKey: string;
  placeholderKey?: string;
  type?: 'text' | 'email' | 'url' | 'textarea';
  required?: boolean;
  max?: number;
  autoComplete?: string;
}

const fieldDefs: FieldConfig[] = [
  { name: 'name',    labelKey: 'contact.fields.name',    required: true,  max: 80,  autoComplete: 'name' },
  { name: 'company', labelKey: 'contact.fields.company', max: 120, autoComplete: 'organization' },
  { name: 'website', labelKey: 'contact.fields.website', type: 'url', max: 200, autoComplete: 'url' },
  { name: 'email',   labelKey: 'contact.fields.email',   type: 'email', required: true, max: 160, autoComplete: 'email' },
  { name: 'address', labelKey: 'contact.fields.address', max: 200, autoComplete: 'street-address' },
  { name: 'phone',   labelKey: 'contact.fields.phone',   max: 40,  autoComplete: 'tel' },
  { name: 'subject', labelKey: 'contact.fields.subject', required: true, max: 200 },
  { name: 'body',    labelKey: 'contact.fields.body',    required: true, type: 'textarea', max: 5000 }
];

const form = reactive<ContactForm>({
  name: '',
  company: '',
  website: '',
  email: '',
  address: '',
  phone: '',
  subject: '',
  body: ''
});

const errors = reactive<Record<FieldKey, string>>({
  name: '', company: '', website: '', email: '',
  address: '', phone: '', subject: '', body: ''
});

const honeypot = ref('');
const submitting = ref(false);
const formEl = ref<HTMLFormElement | null>(null);

const status = reactive<{ message: string; ok: boolean | null }>({
  message: '',
  ok: null
});

function clearStatus() {
  status.message = '';
  status.ok = null;
}

/* 单字段校验 */
function validateField(field: FieldKey): boolean {
  const cfg = fieldDefs.find(f => f.name === field);
  if (!cfg) return true;
  const val = (form[field] || '').trim();

  // 必填
  if (cfg.required && !val) {
    errors[field] = t('contact.validation.required');
    return false;
  }

  // 邮箱
  if (cfg.type === 'email' && val) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(val)) {
      errors[field] = t('contact.validation.email');
      return false;
    }
  }

  // URL
  if (cfg.type === 'url' && val) {
    try {
      const normalized = /^(https?:)?\/\//i.test(val) ? val : 'https://' + val;
      const u = new URL(normalized);
      if (!u.hostname.includes('.')) throw new Error();
    } catch {
      errors[field] = t('contact.validation.url');
      return false;
    }
  }

  // 长度
  if (cfg.max && val.length > cfg.max) {
    errors[field] = t('contact.validation.max', { max: cfg.max });
    return false;
  }

  errors[field] = '';
  return true;
}

/* 全部校验 */
function validateAll(): boolean {
  let ok = true;
  for (const cfg of fieldDefs) {
    if (!validateField(cfg.name)) ok = false;
  }
  return ok;
}

async function onSubmit() {
  clearStatus();

  if (honeypot.value) {
    status.message = t('contact.validation.bot');
    status.ok = false;
    return;
  }

  if (!validateAll()) {
    status.message = t('contact.validation.fixErrors');
    status.ok = false;

    // 聚焦第一个出错字段
    queueMicrotask(() => {
      const firstErr = formEl.value?.querySelector('.has-error .field-control');
      (firstErr as HTMLElement | null)?.focus();
    });
    return;
  }

  submitting.value = true;
  try {
    // TODO: 真实提交
    await new Promise(res => setTimeout(res, 1200));

    status.message = t('contact.feedback.success');
    status.ok = true;

    // 重置
    Object.keys(form).forEach(k => {
      (form as any)[k] = '';
    });
  } catch (e) {
    status.message = t('contact.feedback.fail');
    status.ok = false;
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped lang="scss">
$hero-bg: #f3f5fa;
$title-color: #1f2329;
$sub-color: #40464d;
$border: #d9dde3;
$border-focus: #3863d8;
$error: #d93025;
$ok: #10893e;
$input-bg: #fff;
$max-width: 1480px;
$form-width: 760px;

.contact-page {
  display: flex;
  flex-direction: column;
  width: 100%;
  background: #fff;
  color: #1f252c;
}

/* HERO */
.contact-hero {
  background: $hero-bg;
  min-height: clamp(300px, 42vh, 400px);
  display: flex;
  align-items: flex-end;
  width: 100%;
  overflow: hidden;
}

.hero-inner {
  padding: clamp(2.8rem, 9vw, 6rem) clamp(1.4rem, 6vw, 6rem) 2.4rem;
  animation: heroIn .7s cubic-bezier(.16,.8,.24,1) both;
  opacity: 0;
  transform: translateY(36px);
}
@keyframes heroIn { to { opacity: 1; transform: translateY(0); } }

.hero-title {
  margin: 0 0 1.2rem;
  font-size: clamp(2.1rem, 5.2vw, 3.4rem);
  font-weight: 700;
  letter-spacing: 0.13em;
  line-height: 1.06;
  color: $title-color;
}
.hero-sub {
  margin: 0;
  font-size: clamp(.68rem, 1.1vw, .9rem);
  letter-spacing: 0.38em;
  color: $sub-color;
  font-weight: 500;
}

/* FORM SECTION */
.contact-form-section {
  padding: clamp(3.6rem, 6vw, 5.2rem) 0 clamp(5rem, 8vw, 7rem);
  display: flex;
  justify-content: center;
}

.form-container {
  width: 100%;
  max-width: $max-width;
  padding: 0 clamp(1.4rem, 4.5vw, 5rem);
  margin: 0 auto;
  box-sizing: border-box;
}

.form-intro {
  max-width: $form-width;
  margin: 0 auto 2.6rem;
}

.intro-line {
  margin: 0 0 1.2rem;
  font-size: 0.8rem;
  line-height: 1.85;
  letter-spacing: 0.05em;
  font-weight: 600;
  color: #22282d;
}

.note-required {
  margin: 0;
  font-size: 0.62rem;
  letter-spacing: 0.1em;
  color: #6a737c;
  font-weight: 500;
}

.status-banner {
  max-width: $form-width;
  margin: 0 auto 1.6rem;
  padding: 0.85rem 1rem;
  font-size: 0.7rem;
  letter-spacing: 0.04em;
  border: 1px solid transparent;
  border-radius: 3px;
}
.status-banner.ok {
  background: #e5f5ec;
  color: $ok;
  border-color: #b9e3c9;
}
.status-banner.error {
  background: #fdecea;
  color: $error;
  border-color: #f5c2ba;
}

.contact-form {
  width: 100%;
  max-width: $form-width;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.35rem;
}

.actions {
  margin-top: 0.6rem;
  display: flex;
}

.submit-btn {
  appearance: none;
  border: none;
  background: #173b9d;
  color: #fff;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.24em;
  padding: 0.75rem 2.2rem 0.78rem;
  cursor: pointer;
  border-radius: 2px;
  transition: background .25s, transform .25s;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.submit-btn:hover:not(:disabled) { background: #1d49bf; }
.submit-btn:active:not(:disabled) { transform: translateY(1px); }
.submit-btn:disabled { opacity: .6; cursor: not-allowed; }

.spinner-wrap { display: inline-flex; align-items: center; justify-content: center; min-width: 1.4rem; }
.spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin .8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.fade-slide-enter-active,
.fade-slide-leave-active { transition: opacity .4s, transform .4s; }
.fade-slide-enter-from,
.fade-slide-leave-to { opacity: 0; transform: translateY(-6px); }

.hp { display: none; }

@media (max-width: 620px) {
  .hero-title { font-size: 2.1rem; }
  .hero-sub { letter-spacing: 0.32em; }
  .intro-line { font-size: 0.74rem; }
  .contact-form { gap: 1.2rem; }
}

@media (prefers-reduced-motion: reduce) {
  .hero-inner { animation: none !important; opacity: 1 !important; transform: none !important; }
  .status-banner,
  .fade-slide-enter-active,
  .fade-slide-leave-active { transition: none !important; }
}
</style>