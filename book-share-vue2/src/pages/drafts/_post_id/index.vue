<template>
  <div class="container mx-auto p-4">
    <DraftsNavVue> </DraftsNavVue>
    <EditDraftVue :post_id="post_id"> </EditDraftVue>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import DraftsNavVue from "~/pages/drafts/components/DraftsNav.vue";
import EditDraftVue from "~/pages/drafts/components/EditDraft.vue";

export default Vue.extend({
  components: {
    DraftsNavVue,
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
