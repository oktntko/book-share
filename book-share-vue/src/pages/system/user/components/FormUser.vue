<script setup lang="ts">
import type { z } from 'zod';
import MyInputFile from '~/components/MyInputFile.vue';
import { useValidate } from '~/composables/useValidate';
import { uploadSingleFile } from '~/lib/axios';
import { trpc } from '~/middleware/trpc';
import { UserRouterSchema } from '~/schema/UserRouterSchema';
import { openAlertDialog, openConfirmDialog, openModal } from '~/utils/ProgrammaticComponentHelper';

export type ModelUser = z.infer<typeof UserRouterSchema.createInput>;
export type ResetUser = typeof reset;

const emit = defineEmits<{
  submit: [modelValue: Ref<ModelUser>, reset: ResetUser];
}>();

const modelValue = defineModel<ModelUser>({ required: true });

const { formId, validateSubmit, isDirty, reset } = useValidate<
  typeof UserRouterSchema.createInput.shape
>(UserRouterSchema.createInput, modelValue);

const handleSubmit = validateSubmit(async () => {
  if (file.value) {
    try {
      const {
        data: { file_id },
      } = await uploadSingleFile(file.value);

      modelValue.value.avatar_file_id = file_id;
      file.value = undefined;
    } catch {
      openAlertDialog('ファイルのアップロードに失敗しました。');
      return;
    }
  }

  emit('submit', modelValue, reset);
});

async function handleDeleteImage() {
  if (
    modelValue.value.avatar_file_id &&
    (await openConfirmDialog('ファイルを削除しますか？\nこの操作は取り消せません。'))
  ) {
    await trpc.file.delete.mutate({ file_id: modelValue.value.avatar_file_id });
    // TODO リセットしないと変更があったように見えてしまう。しかし、 modelValue でリセットすると、変更していた状態も失う
    // => initailValue を呼べるようにするか、特定のプロパティだけリセットできるようにする
    modelValue.value.avatar_file_id = null;
  }
}

const file = ref<File>();
const preview = computed(() => (file.value ? URL.createObjectURL(file.value) : undefined));
</script>

<template>
  <form
    class="flex flex-col gap-8 laptop:max-w-3xl desktop:max-w-5xl"
    autocomplete="off"
    @submit.prevent="handleSubmit"
  >
    <section class="flex flex-col gap-4 tablet:flex-row tablet:gap-8">
      <div class="flex grow flex-col gap-4">
        <!-- 名前 -->
        <div>
          <label
            for="username"
            class="mb-1 block text-sm font-medium text-gray-900 dark:text-white"
          >
            名前
          </label>
          <input
            id="username"
            v-model.lazy="modelValue.username"
            name="username"
            type="text"
            class="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 sm:text-sm"
            required
          />
          <MyErrorMessage class="text-xs text-red-600" :form-id="formId" name="username" />
        </div>
        <!-- メールアドレス -->
        <div>
          <label for="email" class="mb-1 block text-sm font-medium text-gray-900 dark:text-white">
            メールアドレス
          </label>
          <input
            id="email"
            v-model.lazy="modelValue.email"
            name="email"
            type="email"
            class="block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-gray-900 sm:text-sm"
            required
          />
          <MyErrorMessage class="text-xs text-red-600" :form-id="formId" name="email" />
        </div>
      </div>
      <!-- 画像 -->
      <div class="flex flex-col items-center gap-4">
        <div>
          <MyImage
            :src-base="
              preview
                ? preview
                : modelValue.avatar_file_id
                ? `api/files/download/${modelValue.avatar_file_id}`
                : `https://dummyimage.com/256x256`
            "
            width="256"
            height="256"
            decoding="async"
            class="h-64 w-64 rounded object-cover object-center"
            alt="avatar"
          />
        </div>
        <MyButton
          v-if="modelValue.avatar_file_id"
          type="button"
          colorset="yellow"
          classset="text"
          class="w-64"
          secondary
          @click="handleDeleteImage"
        >
          イメージを削除する
        </MyButton>
        <MyButton
          v-else
          type="button"
          colorset="white"
          classset="text"
          class="w-64"
          @click="
            async () => {
              file = await openModal<File>({
                component: MyInputFile,
                componentProps: { accept: 'image/*' },
                componentEvents: {},
              });
            }
          "
        >
          イメージを選ぶ
        </MyButton>
      </div>
    </section>

    <section class="flex gap-4">
      <MyButton type="submit" classset="text" colorset="green" :disabled="!(isDirty || file)">
        登録
      </MyButton>
      <slot name="sub-button"></slot>
    </section>
  </form>
</template>
