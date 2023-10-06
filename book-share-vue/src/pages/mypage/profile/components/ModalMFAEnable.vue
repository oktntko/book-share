<script setup lang="ts">
import type { RouterOutput } from '~/lib/trpc';
import { trpc } from '~/middleware/trpc';
import { z } from 'zod';
import { useValidate } from '~/composables/useValidate';

const a = z.object({
  token: z.string().length(6),
});
export type ModelReadingrecord = z.infer<typeof a>;

const emit = defineEmits<{
  success: [result: boolean];
  close: [];
}>();

const modelValue = ref({
  token: '',
});
const qrcode = ref<RouterOutput['profile']['generateSecret']>({
  dataurl: '',
});

onMounted(async () => {
  qrcode.value = await trpc.profile.generateSecret.mutate();
});

const { validateSubmit, ErrorMessage, isDirty, reset } = useValidate(a, modelValue);
</script>

<template>
  <div class="no-overflow">
    <div class="columns">
      <div class="column is-half is-offset-one-quarter">
        <div class="box has-text-grey">
          <p class="is-size-5 has-text-weight-bold">二要素認証の有効化</p>
          <hr />
          <section class="section has-text-centered">
            <img :src="qrcode.dataurl" width="128" height="128" decoding="async" />
            <input
              placeholder="検証コードを入力してください。"
              type="text"
              pattern="\d{6}"
              required
              maxlength="6"
            />
          </section>
          <hr />
          <div class="is-flex is-justify-content-flex-end block">
            <b-button
              class="unify-size-button"
              icon-left="check"
              type="is-primary"
              @click="
                validateSubmit(async () => {
                  await trpc.profile.enableSecret.mutate(modelValue);
                  $emit('success', true);
                })()
              "
            >
              検証コードを確認して有効化
            </b-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.no-overflow {
  overflow: hidden;
}
</style>
