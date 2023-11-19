import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { RouterOutput } from '~/lib/trpc';
import { trpc } from '~/middleware/trpc';

export const useAuthStore = defineStore('auth', () => {
  const auth = ref<RouterOutput['public']['auth']['get']>();

  async function fetchAuth() {
    auth.value = await trpc.public.auth.get.query();
  }

  return { auth, fetchAuth };
});
