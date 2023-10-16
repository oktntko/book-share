<script setup lang="ts">
import { trpc } from '~/middleware/trpc';
</script>

<template>
  <div class="flex flex-col gap-8 laptop:max-w-3xl desktop:max-w-4xl">
    <div>
      <h4 class="mb-4 text-2xl font-bold dark:text-white">アカウントを削除する</h4>

      <section class="flex gap-4">
        <MyButton
          type="button"
          classset="text"
          colorset="red"
          @click="
            async () => {
              if (
                // TODO: promptも作りたいの
                $window.prompt(`
アカウントを削除します。この操作は取り消せません。本当に削除してもよろしいですか？
「 完全に削除 」と入力してください。`) === '完全に削除'
              ) {
                await trpc.profile.delete.mutate();

                $toast.info('アカウントを削除しました。');
                $router.push('/');
              }
            }
          "
        >
          アカウントを削除する
        </MyButton>
      </section>
    </div>
  </div>
</template>
