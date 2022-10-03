<template>
  <EditVolumeVue :volume_id="volume_id" class="container mx-auto p-4"> </EditVolumeVue>
</template>

<script lang="ts">
import Vue from "vue";
import EditVolumeVue from "~/pages/library/components/EditVolume.vue";

export default Vue.extend({
  components: {
    EditVolumeVue,
  },
  data() {
    const volume_id = this.$route.params.volume_id;
    return {
      volume_id: Number(volume_id),
    };
  },
});
</script>
