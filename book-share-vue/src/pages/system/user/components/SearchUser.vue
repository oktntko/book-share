<script setup lang="tsx">
import { RouterLink } from 'vue-router';
import type { VxeGridPropTypes } from 'vxe-table';
import { type z } from 'zod';
import MyButton from '~/components/MyButton.vue';
import MyImage from '~/components/MyImage.vue';
import { useValidate } from '~/composables/useValidate';
import type { RouterOutput } from '~/lib/trpc';
import type { ExtendsColumns } from '~/lib/vxe-table';
import { trpc } from '~/middleware/trpc';
import { UserRouterSchema } from '~/schema/UserRouterSchema';
import SortOrderSchema from '~/schema/zod/inputTypeSchemas/SortOrderSchema';
import UserScalarFieldEnumSchema from '~/schema/zod/inputTypeSchemas/UserScalarFieldEnumSchema';

const modelValue = ref<z.infer<typeof UserRouterSchema.listInput>>({
  where: {
    keyword: '',
  },
  sort: [],
  limit: 30,
  offset: 0,
});

const { validateSubmit, ErrorMessage } = useValidate(UserRouterSchema.listInput, modelValue);

const data = ref<RouterOutput['user']['list']>({
  total: 0,
  user_list: [],
});
const loading = ref(false);
const handleSubmit = validateSubmit(async () => {
  loading.value = true;
  try {
    data.value = await trpc.user.list.query(modelValue.value);
  } finally {
    loading.value = false;
  }
});

// https://zenn.dev/jay_es/scraps/20674fa0f7c2f8
const columns: ExtendsColumns<RouterOutput['user']['list']['user_list'][number]> = [
  {
    type: 'seq',
    width: '48',
    align: 'right',
  },
  {
    field: 'username',
    title: '名前',
    sortable: true,
    slots: {
      default: ({ row }) => {
        return (
          <div class="flex items-center gap-2">
            <MyImage
              srcBase={
                row.avatar_file_id
                  ? `api/file/download/${row.avatar_file_id}`
                  : `https://dummyimage.com/256x256`
              }
              width="32"
              height="32"
              decoding="async"
              class="h-8 w-8 rounded-full object-cover object-center"
              alt="avatar"
            />
            <RouterLink
              to={`/system/user/${row.user_id}`}
              class="text-blue-600 hover:text-blue-900"
            >
              {row.username}
            </RouterLink>
          </div>
        );
      },
    },
  },
  {
    field: 'email',
    title: 'メールアドレス',
    sortable: true,
  },
];

const toolbarConfig: VxeGridPropTypes.ToolbarConfig = {
  perfect: true,
  zoom: true,
  slots: {
    buttons: () => {
      return (
        <div class="ml-4 flex gap-2">
          <RouterLink to="/system/user/add">
            <MyButton type="button" classset="text" colorset="blue" secondary>
              ユーザを追加する
            </MyButton>
          </RouterLink>
        </div>
      );
    },
  },
};

onMounted(() => {
  handleSubmit();
});
</script>

<template>
  <div class="flex flex-col gap-8 overflow-y-auto">
    <header>
      <form
        class="flex flex-col gap-4"
        @submit.prevent="
          () => {
            modelValue.offset = 0;
            handleSubmit();
          }
        "
      >
        <section class="flex flex-col gap-2">
          <div>
            <label for="where.keyword" class="sr-only"> キーワード </label>
            <div class="relative">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Icon icon="flat-color-icons:search" class="h-5 w-5"> </Icon>
              </div>
              <input
                id="where.keyword"
                v-model.lazy="modelValue.where.keyword"
                type="search"
                class="block w-full rounded-lg border border-gray-300 p-2 pl-10 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                maxlength="255"
              />
            </div>
            <ErrorMessage class="text-xs text-red-600" for="where.keyword" />
          </div>
        </section>

        <section>
          <MyButton type="submit" classset="text" colorset="green">
            <Icon
              :horizontal-flip="true"
              inline
              icon="line-md:search-twotone"
              class="-ml-4 mr-2 h-4 w-4"
            ></Icon>
            検索
          </MyButton>
        </section>
      </form>
    </header>

    <main class="shrink grow overflow-y-auto">
      <VxeGrid
        :data="data.user_list"
        border
        :loading="loading"
        show-overflow
        show-header-overflow
        :columns="columns"
        :column-config="{ resizable: true }"
        :toolbar-config="toolbarConfig"
        :row-config="{ isCurrent: true, isHover: true }"
        :sort-config="{
          defaultSort: modelValue.sort,
          multiple: true,
          remote: true,
          trigger: 'cell',
        }"
        :pager-config="{
          perfect: true,
          loading,
          currentPage: modelValue.offset / modelValue.limit + 1,
          pageSize: modelValue.limit,
          pageSizes: [30, 50, 100],
          total: data.total,
        }"
        @sort-change="
          ({ sortList }) => {
            modelValue.sort = sortList.map((sort) => {
              return {
                field: sort.field as z.infer<typeof UserScalarFieldEnumSchema>,
                order: sort.order as z.infer<typeof SortOrderSchema>,
              };
            });

            handleSubmit();
          }
        "
        @page-change="
          ({ pageSize, currentPage }) => {
            modelValue.limit = pageSize;
            modelValue.offset = (currentPage - 1) * pageSize;

            handleSubmit();
          }
        "
      >
      </VxeGrid>
    </main>

    <footer></footer>
  </div>
</template>
