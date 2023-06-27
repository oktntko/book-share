<script lang="ts">
import { defineComponent } from "vue";
import EditVolumeVue from "~/pages/library/components/EditVolume.vue";
import LibraryNavVue from "~/pages/library/components/LibraryNav.vue";

export default defineComponent({
  components: {
    EditVolumeVue,
    LibraryNavVue,
  },
  data() {
    const volume_id = this.$route.params.volume_id;
    return {
      volume_id: Number(volume_id),
    };
  },
});
</script>

<template>
  <div class="container mx-auto p-4">
    <LibraryNavVue></LibraryNavVue>
    <EditVolumeVue :volume_id="volume_id"> </EditVolumeVue>
  </div>
</template>
