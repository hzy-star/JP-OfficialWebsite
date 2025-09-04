<template>
  <section class="contact-callout">
    <div class="callout-inner">
      <div class="callout-card">
        <!-- 顶部居中标题 -->
        <div class="head-center">
          <h3 class="callout-title">{{ titleText }}</h3>
          <span class="callout-underline"></span>
        </div>

        <!-- 下方内容行 -->
        <div class="content-row">
          <div
            class="callout-phone"
            :title="plainPhone"
            @click="callPhone"
          >
            {{ displayPhone }}
          </div>

          <div class="callout-action">
            <button class="contact-btn" type="button" @click="goContact">
              {{ buttonText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

interface Props {
  phone?: string;
  title?: string;
  buttonLabel?: string;
  to?: string;
  telLink?: boolean;
  spaceDigits?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  phone: '',
  title: '',
  buttonLabel: '',
  to: '/contact',
  telLink: true,
  spaceDigits: true
});

const { t, tm, locale } = useI18n();
const router = useRouter();

function getTelFromI18n(): string {
  const fields = tm('home.company.fields') as any;
  let raw = fields?.tel || '';
  raw = raw
    .replace(/^電話[:：]?\s*/i, '')
    .replace(/^TEL[:：]?\s*/i, '')
    .trim();
  return raw;
}

const basePhone = computed(() => props.phone || getTelFromI18n() || '03-6635-2718');
const plainPhone = computed(() => basePhone.value.replace(/[^\d-]/g, ''));
const displayPhone = computed(() => (props.spaceDigits ? basePhone.value : basePhone.value));
const titleText = computed(() => props.title || 'CONTACT');
const buttonText = computed(() => props.buttonLabel || 'CONTACT FORM');

function goContact() {
  if (props.to) router.push(props.to);
}
function callPhone() {
  if (!props.telLink) return;
  if (plainPhone.value) window.location.href = `tel:${plainPhone.value}`;
}
</script>

<style scoped lang="scss">
@use "sass:color";
$card-bg: #f4f7fd;
$accent-blue: #1d3fa0;
$title-color: #1f2329;
$phone-color: #1f2329;
$btn-bg: #1d3fa0;
$btn-bg-hover: #214ab8;
$transition: .4s cubic-bezier(.16,.8,.24,1);

.contact-callout {
  width: 100%;
  background: #fff;
  padding: clamp(4.5rem, 8vw, 7rem) clamp(1.2rem, 4vw, 3.2rem)
           clamp(4.2rem, 7vw, 6rem);
  box-sizing: border-box;
}

.callout-inner {
  max-width: 1640px;
  margin: 0 auto;
}

.callout-card {
  background: $card-bg;
  padding: clamp(3.2rem, 5.2vw, 5rem) clamp(2.2rem, 5vw, 4.8rem);
  box-shadow:
    0 4px 14px -6px rgba(0,0,0,0.08),
    0 18px 45px -18px rgba(0,0,0,0.15);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: clamp(2.6rem, 4vw, 3.6rem);
}

.head-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.callout-title {
  margin: 0 0 1rem;
  font-size: clamp(0.9rem, 0.95vw, 1rem);
  letter-spacing: 0.38em;
  font-weight: 600;
  color: $title-color;
}

.callout-underline {
  width: 56px;
  height: 2px;
  background: $accent-blue;
  display: block;
}

.content-row {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: clamp(2rem, 6vw, 9rem);
}

.callout-phone {
  font-size: clamp(1.9rem, 3vw, 2.6rem);
  font-weight: 500;
  letter-spacing: 0.18em;
  color: $phone-color;
  white-space: nowrap;
  cursor: pointer;
  transition: color $transition;
  user-select: text;
  text-align: left;
}
.callout-phone:hover {
  color: color.adjust($phone-color, $lightness: -8%);
}

.callout-action {
  display: flex;
  justify-content: flex-end;
}

.contact-btn {
  background: $btn-bg;
  color: #fff;
  border: none;
  height: 74px;
  padding: 0 clamp(2.6rem, 4vw, 5rem);
  font-size: 0.82rem;
  letter-spacing: 0.16em;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: background $transition, transform $transition;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}
.contact-btn::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(110deg, rgba(255,255,255,0.28), rgba(255,255,255,0));
  opacity: 0;
  transition: opacity $transition;
}
.contact-btn:hover {
  background: $btn-bg-hover;
}
.contact-btn:hover::after {
  opacity: 1;
}
.contact-btn:active {
  transform: translateY(2px);
}

/* 中屏 */
@media (max-width: 1100px) {
  .contact-btn { height: 68px; }
  .content-row { gap: clamp(1.8rem,4vw,5rem); }
}

/* 小屏：纵向堆叠 */
@media (max-width: 860px) {
  .content-row {
    grid-template-columns: 1fr;
    gap: 2.2rem;
    text-align: center;
  }
  .callout-phone {
    text-align: center;
    letter-spacing: 0.14em;
  }
  .callout-action {
    justify-content: center;
  }
  .contact-btn {
    width: 100%;
    max-width: 380px;
    height: 66px;
  }
}

/* 超小屏 */
@media (max-width: 480px) {
  .callout-card {
    padding: 2.6rem 1.5rem 3rem;
    gap: 2.4rem;
  }
  .callout-phone {
    font-size: 1.9rem;
    letter-spacing: 0.12em;
  }
  .contact-btn {
    height: 60px;
    font-size: 0.78rem;
  }
}
</style>