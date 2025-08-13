<script setup lang="ts"></script>

<template>
  <RouterView v-slot="{ Component }">
    <template v-if="Component">
      <Transition
        mode="out-in"
        enter-from-class="transform opacity-0"
        enter-active-class="transition ease-out duration-200"
        enter-to-class="transform opacity-100"
      >
        <KeepAlive>
          <Suspense>
            <!-- main content -->
            <component :is="Component"></component>

            <!-- loading state -->
            <template #fallback>
              <div class="flex min-h-lvh grow flex-col items-center justify-center gap-4">
                <span
                  class="icon-[line-md--loading-loop] text-opacity-60 h-16 w-16 text-gray-600"
                ></span>
                <span class="animate-pulse">読み込み中</span>
              </div>
            </template>
          </Suspense>
        </KeepAlive>
      </Transition>
    </template>
  </RouterView>
</template>

<style scoped></style>
