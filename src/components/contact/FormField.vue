<template>
  <div :class="['field', 'f-' + config.name, error && 'has-error']">
    <label :for="id" class="field-label">
      {{ t(config.labelKey) }}
      <span v-if="config.required" class="req-mark">{{ requiredMark }}</span>
    </label>

    <textarea
      v-if="isTextarea"
      :id="id"
      class="field-control textarea"
      :rows="6"
      :maxlength="config.max"
      :placeholder="placeholder"
      :aria-required="config.required ? 'true' : 'false'"
      :aria-invalid="error ? 'true' : 'false'"
      :aria-describedby="error ? id + '-err' : undefined"
      :value="modelValue"
      @input="onInput"
      @blur="$emit('blur')"
    />
    <input
      v-else
      :id="id"
      class="field-control"
      :type="inputType"
      :maxlength="config.max"
      :placeholder="placeholder"
      :autocomplete="config.autoComplete"
      :aria-required="config.required ? 'true' : 'false'"
      :aria-invalid="error ? 'true' : 'false'"
      :aria-describedby="error ? id + '-err' : undefined"
      :value="modelValue"
      @input="onInput"
      @blur="$emit('blur')"
    />

    <p
      v-if="error"
      class="field-error"
      :id="id + '-err'"
      role="alert"
    >
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface FieldConfig {
  name: string;
  labelKey: string;
  type?: 'text' | 'email' | 'url' | 'textarea';
  required?: boolean;
  max?: number;
  autoComplete?: string;
}

const props = defineProps<{
  config: FieldConfig;
  modelValue: string;
  error: string;
  t: (k: string, v?: Record<string, any>) => string;
  requiredMark: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void;
  (e: 'blur'): void;
}>();

const id = `field-${props.config.name}`;
const isTextarea = computed(() => props.config.type === 'textarea');
const inputType = computed(() =>
  props.config.type === 'email'
    ? 'email'
    : props.config.type === 'url'
    ? 'text'
    : 'text'
);

const placeholder = ''; // 如果以后需要 placeholderKey，可在父级传入

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).value);
}
</script>

<style scoped lang="scss">
$border: #d9dde3;
$border-focus: #3863d8;
$error: #d93025;
$input-bg: #fff;

.field {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.field-label {
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  color: #2e3338;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  user-select: none;
}

.req-mark {
  color: $error;
  font-weight: 700;
  font-size: 0.8em;
  transform: translateY(-1px);
}

.field-control {
  width: 100%;
  background: $input-bg;
  border: 1px solid $border;
  padding: 0.55rem 0.7rem 0.56rem;
  font-size: 0.7rem;
  letter-spacing: 0.04em;
  line-height: 1.5;
  outline: none;
  border-radius: 2px;
  transition: border-color .25s, box-shadow .25s;
  font-family: inherit;
  resize: vertical;
}
.field-control:focus {
  border-color: $border-focus;
  box-shadow: 0 0 0 3px rgba($border-focus, .18);
}
.textarea { min-height: 160px; }

.has-error .field-control {
  border-color: $error;
  box-shadow: 0 0 0 2px rgba($error, .18);
}

.field-error {
  margin: 0;
  font-size: 0.58rem;
  letter-spacing: 0.04em;
  color: $error;
  font-weight: 500;
  line-height: 1.4;
}
</style>