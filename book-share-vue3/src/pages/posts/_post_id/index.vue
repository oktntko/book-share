<script lang="ts">
import { defineComponent } from "vue";
import Editor from "~/components/Editor.vue";
import { $loading } from "~/components/Loading.vue";
import { Post, trpc } from "~/middleware/trpc";

export default defineComponent({
  components: {
    Editor,
  },
  data() {
    const post_id = this.$route.params.post_id;

    return {
      post_id: Number(post_id),
      post: undefined as Post | undefined,
    };
  },
  created() {
    this.getPost(this.post_id);
  },
  methods: {
    getPost(post_id: number) {
      const loading = $loading.open();
      return trpc
        .query("posts.get", { post_id })
        .then((data) => {
          this.post = data;
        })
        .finally(loading.close);
    },
  },
});
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="flex gap-8">
      <div class="w-80 shrink-0 p-2">
        <header class="flex items-center justify-between">書いた人</header>
        <div class="flex flex-col gap-2 py-4">この本の他の投稿</div>
      </div>

      <div class="flex grow flex-col justify-start gap-4">
        <Editor v-show="post" v-model="post.content" :editable="false"> </Editor>
      </div>

      <div class="w-80 shrink-0">
        <div class="flex flex-col gap-4">
          <div class="table h-64 w-80 border bg-stone-300 p-4">
            <span class="table-cell text-center align-middle text-2xl">広告スペース</span>
          </div>
          <div class="table h-64 w-80 border bg-stone-300 p-4">
            <span class="table-cell text-center align-middle text-2xl">広告スペース</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
