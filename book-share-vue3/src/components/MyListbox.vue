<script setup lang="ts" generic="T">
import { Listbox, ListboxButton, ListboxOptions } from "@headlessui/vue";
import type { ComponentProps } from "~/utility-types";

export interface Props extends ComponentProps<typeof Listbox> {
  multiple?: boolean;
  name?: string;
}
const props = defineProps<Props>();
const emit = defineEmits(["update:modelValue"]);

function handleChange(value: string | number | boolean | object | null) {
  emit("update:modelValue", value);
}
</script>

<template>
  <Listbox v-bind="props" as="div" @update:model-value="handleChange">
    <ListboxButton #="{ value }" class="flex items-center space-x-1">
      <!-- 見えるところ -->
      <div
        v-if="Array.isArray(value) ? value.length : value"
        class="flex flex-wrap items-center space-x-1"
      >
        <slot name="value" :value="value"></slot>
      </div>
      <!-- 未選択 -->
      <label v-else class="flex cursor-pointer flex-nowrap items-center">
        <span class="truncate text-gray-400">未選択 </span>
      </label>

      <!-- リセットボタン -->
      <div
        v-if="Array.isArray(value) ? value.length : value"
        class="text-gray-400 hover:text-blue-700"
        @click="() => handleChange(props.multiple ? [] : null)"
      >
        <Icon icon="mdi:clear-circle-outline" class-name="text-gray-400" />
      </div>
    </ListboxButton>

    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-out"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <ListboxOptions
        class="absolute z-50 truncate rounded-md bg-white shadow-sm ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <slot name="option"></slot>
      </ListboxOptions>
    </Transition>
  </Listbox>
</template>
