import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { RouterOutput } from '~/lib/trpc';
import { trpc } from '~/middleware/trpc';

export const useAuthStore = defineStore('auth', () => {
  const auth = ref<RouterOutput['auth']['get']>({
    auth: false,
  });

  async function fetchAuth() {
    auth.value = await trpc.auth.get.query();
  }

  return { auth, fetchAuth };
});
