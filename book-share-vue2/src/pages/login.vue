<route lang="yaml">
meta:
  layout: empty
</route>

<template>
  <div class="container mx-auto max-w-full py-24 px-6">
    <div class="">
      <div class="mx-auto max-w-sm px-6">
        <div class="relative flex flex-wrap">
          <div class="relative w-full">
            <div class="mt-6">
              <div class="text-center font-semibold uppercase text-black">book share</div>

              <form class="mt-8" @submit.prevent="login">
                <div class="mx-auto max-w-lg">
                  <div class="py-2">
                    <span class="px-1 text-sm text-gray-600">メールアドレス</span>
                    <input
                      v-model="form.email"
                      placeholder="example@example.com"
                      type="email"
                      class="text-md block w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 placeholder-gray-600 shadow-md focus:border-gray-600 focus:bg-white focus:placeholder-gray-500 focus:outline-none"
                      required
                      maxlength="255"
                    />
                  </div>
                  <div class="py-2">
                    <span class="px-1 text-sm text-gray-600">パスワード</span>
                    <div class="relative">
                      <input
                        v-model="form.password"
                        :type="show ? 'text' : 'password'"
                        class="text-md block w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 placeholder-gray-600 shadow-md focus:border-gray-600 focus:bg-white focus:placeholder-gray-500 focus:outline-none"
                        required
                        maxlength="255"
                      />
                      <div
                        class="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-sm leading-5"
                        @click="show = !show"
                      >
                        <Icon v-if="!show" icon="fa6-solid:eye"></Icon>
                        <Icon v-if="show" icon="fa6-solid:eye-slash"></Icon>
                      </div>
                    </div>
                  </div>
                  <div class="flex justify-end">
                    <label class="my-4 block text-gray-500">
                      <a
                        class="cursor-pointer border-b-2 border-gray-200 tracking-tighter hover:border-gray-400"
                      >
                        <span>パスワードを忘れてしまった</span>
                      </a>
                    </label>
                  </div>
                  <button
                    type="submit"
                    class="mt-3 block w-full rounded-lg bg-gray-800 px-6 py-3 text-lg font-semibold text-white shadow-xl hover:bg-black hover:text-white"
                  >
                    ログイン
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { trpc } from "~/libs/trpc";

export default Vue.extend({
  data() {
    return {
      show: false,
      form: {
        email: "example@example.com",
        password: "",
      },
    };
  },
  methods: {
    login() {
      trpc
        .mutation("auth.create", {
          email: this.form.email,
          password: this.form.password,
        })
        .then((data) => {
          console.log(data);
          this.$router.push({ name: "index" });
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
});
</script>
