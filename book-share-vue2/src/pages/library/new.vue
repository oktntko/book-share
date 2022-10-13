<template>
  <div class="container mx-auto p-4">
    <LibraryNavVue></LibraryNavVue>
    <EditVolumeVue> </EditVolumeVue>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import EditVolumeVue from "~/pages/library/components/EditVolume.vue";
import LibraryNavVue from "~/pages/library/components/LibraryNav.vue";

export default Vue.extend({
  components: {
    EditVolumeVue,
    LibraryNavVue,
  },
});
</script>
