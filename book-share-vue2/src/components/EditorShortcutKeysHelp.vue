<template>
  <div class="p-4">
    <h4 class="mt-0 mb-2 text-2xl font-bold leading-tight">キーボードショートカット</h4>
    <!-- テーブル -->
    <div class="relative overflow-x-auto shadow">
      <table class="w-full text-left text-sm text-gray-500 dark:text-gray-400">
        <thead
          class="bg-blue-50 text-xs uppercase text-gray-700 dark:bg-gray-800 dark:text-gray-400"
        >
          <tr>
            <th scope="col" class="py-3 px-6">説明</th>
            <th scope="col" class="py-3 px-6">ショートカットキー</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b bg-white dark:border-gray-700 dark:bg-gray-900">
            <td class="flex items-center gap-2 py-4 px-6">
              <Icon icon="bx:reply" :rotate="2" :horizontal-flip="true" class="h-4 w-4" />

              改行
            </td>
            <th
              scope="row"
              class="whitespace-nowrap py-4 px-6 font-medium text-gray-500 dark:text-gray-400"
            >
              <kbd
                class="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100"
                >Ctrl</kbd
              >
              <span class="mx-2"> + </span>
              <kbd
                class="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100"
                >Enter</kbd
              >
              <span class="mx-2"> or </span>
              <kbd
                class="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100"
                >Shift</kbd
              >
              <span class="mx-2"> + </span>
              <kbd
                class="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100"
                >Enter</kbd
              >
            </th>
          </tr>

          <tr class="border-b bg-white dark:border-gray-700 dark:bg-gray-900">
            <td class="flex items-center gap-2 py-4 px-6">
              <Icon icon="bx:bold" class="h-4 w-4"></Icon>
              太字
            </td>
            <th
              scope="row"
              class="whitespace-nowrap py-4 px-6 font-medium text-gray-500 dark:text-gray-400"
            >
              <kbd
                class="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100"
                >Ctrl</kbd
              >
              <span class="mx-2"> + </span>
              <kbd
                class="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100"
                >B</kbd
              >
            </th>
          </tr>

          <tr class="border-b bg-white dark:border-gray-700 dark:bg-gray-900">
            <td class="flex items-center gap-2 py-4 px-6">
              <Icon icon="bx:italic" class="h-4 w-4"></Icon>
              斜体
            </td>
            <th
              scope="row"
              class="whitespace-nowrap py-4 px-6 font-medium text-gray-500 dark:text-gray-400"
            >
              <kbd
                class="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100"
                >Ctrl</kbd
              >
              <span class="mx-2"> + </span>
              <kbd
                class="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100"
                >I</kbd
              >
            </th>
          </tr>

          <tr class="border-b bg-white dark:border-gray-700 dark:bg-gray-900">
            <td class="flex items-center gap-2 py-4 px-6">
              <Icon icon="bx:underline" class="h-4 w-4"></Icon>
              下線
            </td>
            <th
              scope="row"
              class="whitespace-nowrap py-4 px-6 font-medium text-gray-500 dark:text-gray-400"
            >
              <kbd
                class="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100"
                >Ctrl</kbd
              >
              <span class="mx-2"> + </span>
              <kbd
                class="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100"
                >U</kbd
              >
            </th>
          </tr>

          <tr class="border-b bg-white dark:border-gray-700 dark:bg-gray-900">
            <td class="flex items-center gap-2 py-4 px-6">
              <Icon icon="bx:strikethrough" class="h-4 w-4"></Icon>
              取り消し線
            </td>
            <th
              scope="row"
              class="whitespace-nowrap py-4 px-6 font-medium text-gray-500 dark:text-gray-400"
            >
              <kbd
                class="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100"
                >Ctrl</kbd
              >
              <span class="mx-2"> + </span>
              <kbd
                class="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100"
                >Shift</kbd
              >
              <span class="mx-2"> + </span>
              <kbd
                class="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100"
                >X</kbd
              >
            </th>
          </tr>

          <tr class="border-b bg-white dark:border-gray-700 dark:bg-gray-900">
            <td class="flex items-center gap-2 py-4 px-6">
              <Icon icon="bx:code" class="h-4 w-4"></Icon>
              インラインコード
            </td>
            <th
              scope="row"
              class="whitespace-nowrap py-4 px-6 font-medium text-gray-500 dark:text-gray-400"
            >
              <kbd
                class="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100"
                >Ctrl</kbd
              >
              <span class="mx-2"> + </span>
              <kbd
                class="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100"
                >E</kbd
              >
            </th>
          </tr>

          <tr class="border-b bg-white dark:border-gray-700 dark:bg-gray-900">
            <td class="flex items-center gap-2 py-4 px-6">
              <Icon icon="bx:code-block" class="h-4 w-4"></Icon>
              コードブロック
            </td>
            <th
              scope="row"
              class="whitespace-nowrap py-4 px-6 font-medium text-gray-500 dark:text-gray-400"
            >
              <kbd
                class="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100"
                >Ctrl</kbd
              >
              <span class="mx-2"> + </span>
              <kbd
                class="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100"
                >Alt</kbd
              >
              <span class="mx-2"> + </span>
              <kbd
                class="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100"
                >C</kbd
              >
            </th>
          </tr>

          <tr class="border-b bg-white dark:border-gray-700 dark:bg-gray-900">
            <td class="flex items-center gap-2 py-4 px-6">
              <Icon icon="bx:highlight" class="h-4 w-4"></Icon>
              ハイライト
            </td>
            <th
              scope="row"
              class="whitespace-nowrap py-4 px-6 font-medium text-gray-500 dark:text-gray-400"
            >
              <kbd
                class="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100"
                >Ctrl</kbd
              >
              <span class="mx-2"> + </span>
              <kbd
                class="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100"
                >Shift</kbd
              >
              <span class="mx-2"> + </span>
              <kbd
                class="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100"
                >H</kbd
              >
            </th>
          </tr>

          <tr class="border-b bg-white dark:border-gray-700 dark:bg-gray-900">
            <td class="flex items-center gap-2 py-4 px-6">
              <Icon icon="bx:list-ol" class="h-4 w-4"></Icon>
              順番付きリスト
            </td>
            <th
              scope="row"
              class="whitespace-nowrap py-4 px-6 font-medium text-gray-500 dark:text-gray-400"
            >
              <kbd
                class="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100"
                >Ctrl</kbd
              >
              <span class="mx-2"> + </span>
              <kbd
                class="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100"
                >Shift</kbd
              >
              <span class="mx-2"> + </span>
              <kbd
                class="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100"
                >7</kbd
              >
            </th>
          </tr>

          <tr class="border-b bg-white dark:border-gray-700 dark:bg-gray-900">
            <td class="flex items-center gap-2 py-4 px-6">
              <Icon icon="bx:list-ul" class="h-4 w-4"></Icon>
              箇条書き
            </td>
            <th
              scope="row"
              class="whitespace-nowrap py-4 px-6 font-medium text-gray-500 dark:text-gray-400"
            >
              <kbd
                class="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100"
                >Ctrl</kbd
              >
              <span class="mx-2"> + </span>
              <kbd
                class="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100"
                >Shift</kbd
              >
              <span class="mx-2"> + </span>
              <kbd
                class="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100"
                >8</kbd
              >
            </th>
          </tr>

          <tr class="border-b bg-white dark:border-gray-700 dark:bg-gray-900">
            <td class="flex items-center gap-2 py-4 px-6">
              <Icon icon="tabler:blockquote" class="h-4 w-4"></Icon>
              引用
            </td>
            <th
              scope="row"
              class="whitespace-nowrap py-4 px-6 font-medium text-gray-500 dark:text-gray-400"
            >
              <kbd
                class="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100"
                >Ctrl</kbd
              >
              <span class="mx-2"> + </span>
              <kbd
                class="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100"
                >Shift</kbd
              >
              <span class="mx-2"> + </span>
              <kbd
                class="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100"
                >B</kbd
              >
            </th>
          </tr>

          <tr class="border-b bg-white dark:border-gray-700 dark:bg-gray-900">
            <td class="flex items-center gap-2 py-4 px-6">
              <Icon icon="ci:heading-h1" class="h-4 w-4"></Icon>
              ～
              <Icon icon="ci:heading-h6" class="h-4 w-4"></Icon>
              見出し
            </td>
            <th
              scope="row"
              class="whitespace-nowrap py-4 px-6 font-medium text-gray-500 dark:text-gray-400"
            >
              <kbd
                class="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100"
                >Ctrl</kbd
              >
              <span class="mx-2"> + </span>
              <kbd
                class="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100"
                >Alt</kbd
              >
              <span class="mx-2"> + </span>
              <kbd
                class="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100"
                >1</kbd
              >
              <span class="mx-2"> ～ </span>
              <kbd
                class="rounded-lg border border-gray-200 bg-gray-100 px-2 py-1.5 text-xs font-semibold text-gray-800 dark:border-gray-500 dark:bg-gray-600 dark:text-gray-100"
                >6</kbd
              >
            </th>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({});
</script>
