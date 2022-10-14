<template>
  <div class="container mx-auto p-4">
    <DraftsNavVue> </DraftsNavVue>
    <EditDraftVue> </EditDraftVue>
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
});
</script>
