<script setup lang="ts">
import type { z } from 'zod';
import { useValidate } from '~/composables/useValidate';
import { ReadingrecordRouterSchema } from '~/schema/ReadingrecordRouterSchema';

export type ModelReadingrecord = z.infer<typeof ReadingrecordRouterSchema.createInput>;
export type ResetReadingrecord = typeof reset;

const emit = defineEmits<{
  submit: [value: ModelReadingrecord, reset: ResetReadingrecord];
}>();

const modelValue = defineModel<ModelReadingrecord>({ required: true });

const { formId, validateSubmit, isDirty, reset } = useValidate(
  ReadingrecordRouterSchema.createInput,
  modelValue,
);

const handleSubmit = validateSubmit(() => emit('submit', modelValue.value, reset));
</script>

<template>
  <form
    class="flex flex-col gap-8 laptop:max-w-3xl desktop:max-w-4xl"
    autocomplete="off"
    @submit.prevent="handleSubmit"
  >
    <section class="flex flex-col gap-4">
      <!-- 本のタイトル -->
      <div>
        <label
          for="book_title"
          class="mb-1 block text-sm font-medium text-gray-900 dark:text-white"
        >
          本のタイトル
        </label>
        <input
          id="book_title"
          v-model.lazy="modelValue.book_title"
          type="text"
          class="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 sm:text-sm"
          required
          maxlength="400"
        />
        <MyErrorMessage name="book_title" class="text-xs text-red-600" :form-id="formId" />
      </div>
      <!-- 読んだ日 -->
      <div>
        <label for="read_date" class="mb-1 block text-sm font-medium text-gray-900 dark:text-white">
          読んだ日
        </label>
        <input
          id="read_date"
          v-model.lazy="modelValue.read_date"
          type="date"
          class="block rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 sm:text-sm"
          required
        />
        <MyErrorMessage name="read_date" class="text-xs text-red-600" :form-id="formId" />
      </div>
      <!-- 評価 -->
      <!-- https://dev.to/madsstoumann/star-rating-using-a-single-input-i0l -->
      <div>
        <label for="star" class="mb-1 block text-sm font-medium text-gray-900 dark:text-white">
          評価
        </label>
        <div class="flex flex-row items-center gap-2">
          <input
            id="star"
            v-model.number="modelValue.star"
            min="0"
            max="5"
            type="range"
            step="0.5"
            class="rating"
            :style="`--value: ${modelValue.star}`"
            :title="`${modelValue.star}`"
          />
          <input
            id="star-number"
            v-model.number="modelValue.star"
            min="0"
            max="5"
            type="number"
            step="0.1"
            class="inline-block h-8 rounded-lg bg-transparent p-2.5 text-right text-sm text-gray-600"
          />
        </div>

        <MyErrorMessage name="star" class="text-xs text-red-600" :form-id="formId" />
      </div>
      <!-- ひとこと -->
      <div>
        <label for="hitokoto" class="mb-1 block text-sm font-medium text-gray-900 dark:text-white">
          ひとこと
        </label>
        <input
          id="hitokoto"
          v-model.lazy="modelValue.hitokoto"
          type="text"
          class="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 sm:text-sm"
          required
          maxlength="255"
        />
        <MyErrorMessage name="hitokoto" class="text-xs text-red-600" :form-id="formId" />
      </div>
    </section>

    <section class="flex gap-4">
      <MyButton type="submit" classset="text" colorset="green" :disabled="!isDirty">
        <Icon icon="entypo:save" class="-ml-1 mr-2 h-5 w-5"> </Icon>
        保存する
      </MyButton>
      <slot name="sub-button"></slot>
    </section>
  </form>
</template>

<style>
.rating {
  --dir: right;
  --fill: gold;
  --fillbg: rgba(100, 100, 100, 0.15);
  --star: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 17.25l-6.188 3.75 1.641-7.031-5.438-4.734 7.172-0.609 2.813-6.609 2.813 6.609 7.172 0.609-5.438 4.734 1.641 7.031z"/></svg>');
  --stars: 5;
  --starsize: 2rem;
  --symbol: var(--star);
  --value: 1;
  --w: calc(var(--stars) * var(--starsize));
  --x: calc(100% * (var(--value) / var(--stars)));
  block-size: var(--starsize);
  inline-size: var(--w);
  position: relative;
  touch-action: manipulation;

  -webkit-appearance: none;
  appearance: none;
  outline: none;
  background: transparent;
  cursor: pointer;
}

/* Track: Firefox */
.rating::-moz-range-track {
  background: linear-gradient(to var(--dir), var(--fill) 0 var(--x), var(--fillbg) 0 var(--x));
  block-size: 100%;
  mask: repeat left center/var(--starsize) var(--symbol);
}

/* Track: Chrome, Safari, Opera, Edge Chromium */
.rating::-webkit-slider-runnable-track {
  background: linear-gradient(to var(--dir), var(--fill) 0 var(--x), var(--fillbg) 0 var(--x));
  block-size: 100%;
  mask: repeat left center/var(--starsize) var(--symbol);
  -webkit-mask: repeat left center/var(--starsize) var(--symbol);
}

/* Thumb: Firefox */
.rating::-moz-range-thumb {
  height: var(--starsize);
  opacity: 0;
  width: var(--starsize);
}

/* Thumb: Chrome, Safari, Opera, Edge Chromium */
.rating::-webkit-slider-thumb {
  height: var(--starsize);
  opacity: 0;
  width: var(--starsize);
  -webkit-appearance: none;
}
</style>
