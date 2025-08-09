<script setup lang="ts">
import { dayjs } from '@book-share/lib/dayjs';
import type { RouterOutput } from '~/lib/trpc';
import { trpc } from '~/lib/trpc';
import FormReadingrecord, {
  type ModelReadingrecord,
} from '~/page/mypage/readingrecord/component/FormReadingrecord.vue';
import { useLoading } from '~/plugin/LoadingPlugin';
import { useToast } from '~/plugin/ToastPlugin';

const emit = defineEmits<{
  close: [readingrecord?: RouterOutput['readingrecord']['create']];
}>();

const props = defineProps<{
  volume_id: string;
  book_title: string;
}>();

const modelValue = ref<ModelReadingrecord>({
  volume_id: props.volume_id,
  book_title: props.book_title,
  star: 2.5,
  hitokoto: '',
  read_date: dayjs().format('YYYY-MM-DD'),
});

const toast = useToast();
const $loading = useLoading();
async function handleSubmit() {
  const loading = $loading.open();
  try {
    const readingrecord = await trpc.readingrecord.create.mutate(modelValue.value);

    emit('close', readingrecord);

    toast.success('データを保存しました。');
  } finally {
    loading.close();
  }
}
</script>

<template>
  <FormReadingrecord
    v-model="modelValue"
    class="container mx-auto w-96 p-4"
    @submit="handleSubmit"
  ></FormReadingrecord>
</template>
