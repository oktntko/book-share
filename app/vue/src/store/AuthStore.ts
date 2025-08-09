import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { RouterOutput } from '~/lib/trpc';
import { trpc } from '~/lib/trpc';

export const useAuthStore = defineStore('auth', () => {
  const profile = ref<RouterOutput['auth']['get']>();

  async function fetchAuth() {
    profile.value = await trpc.auth.get.query();
  }

  return { profile, fetchAuth };
});
