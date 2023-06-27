<script lang="ts">
import { defineComponent } from "vue";
import EditVolumeVue from "~/pages/library/components/EditVolume.vue";
import LibraryNavVue from "~/pages/library/components/LibraryNav.vue";

export default defineComponent({
  components: {
    EditVolumeVue,
    LibraryNavVue,
  },
});
</script>

<template>
  <div class="container mx-auto p-4">
    <LibraryNavVue></LibraryNavVue>
    <EditVolumeVue> </EditVolumeVue>
  </div>
</template>
