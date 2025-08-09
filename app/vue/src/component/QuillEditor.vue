<script setup lang="ts">
import Quill, { type QuillOptions } from 'quill';
import 'quill/dist/quill.snow.css';

defineOptions({
  inheritAttrs: false,
});

const {
  modelValue = '',
  options = {
    readOnly: false,
    modules: {
      toolbar: true,
    },
    theme: 'snow',
  },
} = defineProps<{
  modelValue?: string;
  options?: QuillOptions;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const container = useTemplateRef<HTMLDivElement>('editor-container');
// https://github.com/slab/quill/issues/4375
let quill: Quill | null = null;

onMounted(() => {
  quill = new Quill(container.value!, options);

  quill.setContents(JSON.parse(modelValue ? modelValue : '[]'));

  quill.on('text-change', () => {
    const contents = quill!.getContents();
    emit('update:modelValue', JSON.stringify(contents.ops));
  });
});

defineExpose({
  setContents: (value: string) => {
    quill?.setContents(JSON.parse(value ? value : '[]'));
  },
});
</script>

<template>
  <div>
    <div ref="editor-container" v-bind="$attrs"></div>
  </div>
</template>

<style scoped>
.ql-toolbar {
  font-family: unset;
}
.ql-container {
  font-family: unset;
  font-size: unset;
}
</style>
