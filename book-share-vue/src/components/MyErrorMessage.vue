<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import * as R from 'remeda';
import type { HTMLAttributes } from 'vue';

interface Props extends /* @vue-ignore */ HTMLAttributes {
  formId: string;
  name: string;
}

// useValidate で作った error, diff をバインドする
const props = defineProps<Props>();

const keys = props.name.split('.').filter((key) => key);

const injectedDiff = inject<Ref<object>>(`diff/${props.formId}`);
const injectedError = inject<Ref<any>>(`error/${props.formId}`);
const injectedSubmitCount = inject<Ref<number>>(`submitCount/${props.formId}`);

const message = computed<string | undefined>(() => {
  // @ts-ignore
  const diff = R.pathOr(injectedDiff?.value, keys, undefined); // 自分のキーの差分を取り出す
  // サブミット済みならエラーメッセージを表示する
  // 差分がなければエラーメッセージを表示しない
  if (injectedSubmitCount?.value === 0 && (!diff || R.isEmpty(diff))) {
    return;
  }

  // @ts-ignore
  const error = R.pathOr(injectedError?.value, keys, undefined); // 自分のキーのエラーを取り出す
  if (!error || R.isEmpty(error) || !Array.isArray(error._errors) || !error._errors.length) {
    return;
  }

  return error._errors[0];
});
</script>

<template>
  <span v-if="message">
    {{ message }}
  </span>
</template>
