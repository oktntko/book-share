<script setup lang="ts">
import Editor from '~/pages/components/Editor.vue';
import type { RouterOutput } from '~/lib/trpc';
import { trpc } from '~/middleware/trpc';

const route = useRoute();

const post_id = Number(route.params.post_id);

const post = ref<RouterOutput['post']['get']>();

onMounted(async () => {
  post.value = await trpc.post.get.query({ post_id });
});
</script>

<template>
  <div class="container mx-auto mb-8 flex gap-8 p-4">
    <div class="w-80 shrink-0 py-4">
      <header class="flex items-center justify-between">書いた人</header>
      <div class="flex flex-col gap-2 py-4">この本の他の投稿</div>
    </div>

    <div class="flex grow flex-col justify-start gap-4">
      <Transition
        mode="out-in"
        enter-from-class="transform opacity-0"
        enter-active-class="transition ease-out duration-200"
        enter-to-class="transform opacity-100"
      >
        <div v-if="post">
          <div class="flex grow flex-col justify-start gap-4">
            <Editor v-show="post" v-model="post.content" :editable="false"> </Editor>
          </div>
        </div>
        <MyPulseLoading v-else> </MyPulseLoading>
      </Transition>
    </div>

    <div class="flex w-80 shrink-0 flex-col gap-4 py-4">
      <div class="table h-64 w-80 border bg-stone-300 p-4">
        <span class="table-cell text-center align-middle text-2xl">広告スペース</span>
      </div>
      <div class="table h-64 w-80 border bg-stone-300 p-4">
        <span class="table-cell text-center align-middle text-2xl">広告スペース</span>
      </div>
    </div>
  </div>
</template>
