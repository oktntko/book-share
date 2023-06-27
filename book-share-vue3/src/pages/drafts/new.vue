<script lang="ts">
import { defineComponent } from "vue";
import DraftsNavVue from "~/pages/drafts/components/DraftsNav.vue";
import EditDraftVue from "~/pages/drafts/components/EditDraft.vue";

export default defineComponent({
  components: {
    DraftsNavVue,
    EditDraftVue,
  },
});
</script>

<template>
  <div class="container mx-auto p-4">
    <DraftsNavVue> </DraftsNavVue>
    <EditDraftVue> </EditDraftVue>
  </div>
</template>
