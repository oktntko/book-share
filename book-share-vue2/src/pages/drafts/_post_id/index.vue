<template>
  <EditDraftVue :post_id="post_id" class="container mx-auto p-4"> </EditDraftVue>
</template>

<script lang="ts">
import Vue from "vue";
import EditDraftVue from "~/pages/drafts/components/EditDraft.vue";

export default Vue.extend({
  components: {
    EditDraftVue,
  },
  data() {
    const post_id = this.$route.params.post_id;
    return {
      post_id: Number(post_id),
    };
  },
});
</script>
