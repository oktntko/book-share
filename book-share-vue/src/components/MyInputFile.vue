<script setup lang="ts">
const props = defineProps<{
  accept?: string;
  multiple?: boolean;
}>();

const emit = defineEmits<{
  success: [File[] | File | undefined];
  close: [];
}>();

const dragging = ref(false);
</script>

<template>
  <div
    class="flex flex-col items-center justify-center px-4 py-4"
    @dragenter="dragging = true"
    @dragleave="
      (e) => {
        // 子要素へ dragenter すると自身の dragleave が発火するため、子要素かどうか判定する
        // https://qiita.com/keiliving/items/5e8b26e6567efbc15765
        if (e.relatedTarget && e.currentTarget) {
          const currentTarget = e.currentTarget as Node;
          const relatedTarget = e.relatedTarget as Node;
          if (currentTarget.contains(relatedTarget)) {
            return;
          }
        }

        dragging = false;
      }
    "
    @dragover.prevent
    @drop.prevent="
      (e) => {
        dragging = false;
        emit(
          'success',
          e.dataTransfer?.files
            ? props.multiple
              ? Array.from(e.dataTransfer.files)
              : e.dataTransfer.files[0]
            : undefined,
        );
      }
    "
  >
    <label
      for="file"
      :class="[
        'flex h-64 w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 transition-colors hover:bg-gray-200',
        dragging ? 'border-gray-500 bg-gray-200 ' : '',
      ]"
    >
      <Icon icon="material-symbols:upload-file" class="h-12 w-12"> </Icon>
      <span class="font-semibold">ファイルをドラッグ＆ドロップしてください</span>
      <span class="text-xs">クリックするとファイルを選択できます</span>
      <input
        v-bind="props"
        id="file"
        type="file"
        class="hidden"
        @change="
          (e) => {
            if (e.target && (e.target as HTMLInputElement).files) {
              const files = (e.target as HTMLInputElement).files!;
              emit('success', props.multiple ? Array.from(files) : files[0]);
            } else {
              emit('success', undefined);
            }
          }
        "
      />
    </label>
  </div>
</template>
