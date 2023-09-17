<script setup lang="ts">
import type { RouterOutput } from '~/lib/trpc';
import { trpc } from '~/middleware/trpc';
import FormReadingrecord, {
  type ModelReadingrecord,
} from '~/pages/mypage/readingrecord/components/FormReadingrecord.vue';
import { useLoading } from '~/plugin/LoadingPlugin';
import { useToast } from '~/plugin/ToastPlugin';

const emit = defineEmits<{
  success: [RouterOutput['readingrecord']['update']];
  close: [];
}>();

const props = defineProps<{
  readingrecord_id: number;
}>();

const readingrecord_id = Number(props.readingrecord_id);
const updated_at = ref(new Date());
const modelValue = ref<ModelReadingrecord>();

onMounted(async () => {
  const readingrecord = await trpc.readingrecord.get.query({ readingrecord_id });

  modelValue.value = readingrecord;
  updated_at.value = readingrecord.updated_at;
});

const toast = useToast();
const $loading = useLoading();
async function handleSubmit(modelValue: ModelReadingrecord) {
  const loading = $loading.open();
  try {
    const readingrecord = await trpc.readingrecord.update.mutate({
      ...modelValue,
      readingrecord_id,
      updated_at: updated_at.value,
    });

    emit('success', readingrecord);

    toast.success('データを保存しました。');
  } finally {
    loading.close();
  }
}
</script>

<template>
  <Transition
    enter-from-class="transform opacity-0"
    enter-active-class="ease-out duration-500"
    enter-to-class="transform opacity-100"
  >
    <FormReadingrecord
      v-if="modelValue"
      v-model="modelValue"
      class="container mx-auto my-4 w-96"
      @submit="handleSubmit"
    ></FormReadingrecord>
    <MyPulseLoading v-else> </MyPulseLoading>
  </Transition>
</template>
