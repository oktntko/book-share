import { diff as difference } from 'deep-object-diff';
import * as R from 'remeda';
import { z } from 'zod';
import { openAlertDialog } from '~/utils/ProgrammaticComponentHelper';
import { type Ref } from 'vue';

export function useValidate<T extends z.ZodRawShape>(
  schema: z.ZodEffects<z.ZodObject<T>> | z.ZodObject<T>,
  modelValue: Ref<z.infer<typeof schema>>,
) {
  const formId = self.crypto.randomUUID();

  // initial value
  const initialValue = ref(R.clone(modelValue.value)) as Ref<z.infer<typeof schema>>;

  const diff = computed(() => difference(initialValue.value, modelValue.value));
  provide(`diff/${formId}`, diff);

  const isDirty = computed(() => !R.isEmpty(diff.value as ReadonlyArray<unknown>));

  // error object
  type SafeParseReturnType = AwaitedReturnType<typeof schema.safeParseAsync>;
  const error = ref<z.ZodFormattedError<SafeParseReturnType>>();
  provide(`error/${formId}`, error);

  // watch model & run validate
  watch(
    () => R.clone(modelValue.value),
    async (currentValue) => {
      const validateResult = await schema.safeParseAsync(currentValue);
      if (validateResult.success) {
        error.value = undefined;
      } else {
        error.value = validateResult.error.format();
      }
    },
  );

  const isInvalid = computed(() => !!error.value);

  const submitCount = ref(0);
  provide(`submitCount/${formId}`, submitCount);

  // バリデーションする
  function validateSubmit(
    callback: () => void,
    onInvalidSubmit: (
      eroor: z.ZodFormattedError<SafeParseReturnType>,
    ) => void = handleInvalidSubmit,
  ) {
    return async (_?: Event) => {
      submitCount.value++;

      // 値が変更されていないこともあるのでバリデーションする
      const validateResult = await schema.safeParseAsync(modelValue.value);

      if (validateResult.success) {
        return callback();
      } else {
        error.value = validateResult.error.format();
        return onInvalidSubmit ? onInvalidSubmit(error.value) : undefined;
      }
    };
  }

  function revert() {
    modelValue.value = R.clone(initialValue.value) as z.infer<typeof schema>;
  }

  function reset(resetlValue: z.infer<typeof schema>) {
    modelValue.value = R.clone(resetlValue);
    initialValue.value = resetlValue;
  }

  async function handleInvalidSubmit(error: z.ZodFormattedError<unknown>) {
    if (import.meta.env.DEV) console.log(error);

    return openAlertDialog('入力値に誤りがあります。');
  }

  return {
    formId,
    diff,
    error,
    isInvalid,
    isDirty,
    revert,
    reset,
    submitCount,
    validateSubmit,
  };
}
