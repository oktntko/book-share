<script setup lang="ts">
import { z } from 'zod';
import MyInputFile from '~/components/MyInputFile.vue';
import { useValidate } from '~/composables/useValidate';
import { uploadSingleFile } from '~/lib/axios';
import { trpc } from '~/middleware/trpc';
import { ProfileRouterSchema } from '~/schema/ProfileRouterSchema';

const modelValue = defineModel<z.infer<typeof ProfileRouterSchema.patchAvatarFileIdInput>>({
  required: true,
});

const file = ref<File>();

const { validateSubmit, reset } = useValidate(
  ProfileRouterSchema.patchAvatarFileIdInput,
  modelValue,
);

const preview = computed(() => (file.value ? URL.createObjectURL(file.value) : undefined));
</script>

<template>
  <form
    class="flex flex-col items-center gap-4"
    autocomplete="off"
    @submit.prevent="
      validateSubmit(async () => {
        if (!file) {
          $dialog.alert('ファイルが選択されていません。');
          return;
        }

        const loading = $loading.open();
        try {
          const {
            data: { file_id },
          } = await uploadSingleFile(file);

          modelValue.avatar_file_id = file_id;
          file = undefined;

          const { avatar_file_id } = await trpc.profile.patchAvatarFileId.mutate({
            avatar_file_id: file_id,
          });

          reset({ ...modelValue, avatar_file_id });
        } catch {
          $dialog.alert('ファイルのアップロードに失敗しました。');
          return;
        } finally {
          loading.close();
        }
      })()
    "
  >
    <div>
      <MyImage
        :src-base="
          preview
            ? preview
            : modelValue.avatar_file_id
            ? `api/file/download/${modelValue.avatar_file_id}`
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
      @click="
        async () => {
          if (
            modelValue.avatar_file_id &&
            (await $dialog.confirm('ファイルを削除しますか？\nこの操作は取り消せません。'))
          ) {
            await trpc.file.delete.mutate({ file_id: modelValue.avatar_file_id });
            // TODO リセットしないと変更があったように見えてしまう。しかし、 modelValue でリセットすると、変更していた状態も失う
            // => initailValue を呼べるようにするか、特定のプロパティだけリセットできるようにする
            modelValue.avatar_file_id = null;
          }
        }
      "
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
          file = await $modal.open<File>({
            component: MyInputFile,
            componentProps: { accept: 'image/*' },
            componentEvents: {},
          });
        }
      "
    >
      イメージを選ぶ
    </MyButton>
    <MyButton v-if="file" type="submit" classset="text" colorset="green" class="w-64">
      登録
    </MyButton>
  </form>
</template>
