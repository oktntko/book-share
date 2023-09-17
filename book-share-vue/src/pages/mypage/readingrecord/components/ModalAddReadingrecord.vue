<script setup lang="ts">
import dayjs from 'dayjs';
import type { RouterOutput } from '~/lib/trpc';
import { trpc } from '~/middleware/trpc';
import FormReadingrecord, {
  type ModelReadingrecord,
} from '~/pages/mypage/readingrecord/components/FormReadingrecord.vue';
import { useToast } from '~/plugin/ToastPlugin';
import { openLoading } from '~/utils/ProgrammaticComponentHelper';

const emit = defineEmits<{
  success: [RouterOutput['readingrecord']['create']];
  close: [];
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
async function handleSubmit() {
  const loading = openLoading();
  try {
    const readingrecord = await trpc.readingrecord.create.mutate(modelValue.value);

    emit('success', readingrecord);

    toast.success('データを保存しました。');
  } finally {
    loading.close();
  }
}
</script>

<template>
  <FormReadingrecord
    v-model="modelValue"
    class="container mx-auto my-4 w-96"
    @submit="handleSubmit"
  ></FormReadingrecord>
</template>
