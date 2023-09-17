<script setup lang="ts">
import Color from '@tiptap/extension-color';
import Focus from '@tiptap/extension-focus';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import { BubbleMenu, useEditor, EditorContent } from '@tiptap/vue-3';
import EditorShortcutKeysHelp from './EditorShortcutKeysHelp.vue';

const props = defineProps<{
  modelValue: string;
  editable: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

watch(
  () => props.modelValue,
  (value: string) => {
    // if value is updated
    if (editor.value && editor.value?.getHTML() !== props.modelValue) {
      // update value
      editor.value.commands.setContent(value, false);
    }
  },
);

const show = ref<{ Heading: boolean }>({ Heading: true });

const editor = useEditor({
  editable: props.editable,
  editorProps: {
    attributes: {
      class: 'prose prose-sm max-w-none lg:prose-lg m-5 focus:outline-none table-auto',
    },
  },
  content: props.modelValue,
  onUpdate: () => emit('update:modelValue', editor.value?.getHTML() ?? ''),
  extensions: [
    StarterKit,
    // Nodes
    Image,
    Table.configure({
      resizable: true,
      HTMLAttributes: {
        class: 'table-auto',
      },
    }),
    TableRow,
    TableHeader,
    TableCell,
    // Marks
    Highlight.configure({ multicolor: true }),
    Link,
    TextStyle,
    Underline,
    // Functionality
    Color,
    Focus.configure({
      className: 'has-focus',
      mode: 'all',
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
  ],
});

onMounted(() => {
  editor.value?.chain().focus();
});

onBeforeUnmount(() => {
  editor.value?.destroy();
});

function setLink() {
  const previousUrl = editor.value?.getAttributes('link').href;
  const url = window.prompt('URL', previousUrl);

  // cancelled
  if (url) {
    // update link
    editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  } else if (url === '') {
    // empty
    editor.value?.chain().focus().extendMarkRange('link').unsetLink().run();
  }
  // cancelled
}
function addImage() {
  const url = window.prompt('URL');

  if (url) {
    editor.value?.chain().focus().setImage({ src: url }).run();
  }
}
</script>

<template>
  <div class="editor">
    <!-- ヘッダー -->
    <div
      v-if="editor && editable"
      role="menu"
      class="peer flex appearance-none flex-col border border-b-0 border-gray-300 bg-white"
    >
      <div class="flex flex-wrap divide-x">
        <ul class="flex items-center justify-center px-1">
          <li class="flex items-center justify-center">
            <button
              type="button"
              title="Heading"
              class="m-1 flex items-center justify-center rounded transition-colors hover:bg-gray-200 hover:text-black"
              @click="show.Heading = !show.Heading"
            >
              <Icon icon="ci:heading" class="m-1 h-6 w-6"></Icon>
              <Icon
                icon="flat-color-icons:expand"
                class="-ml-1 h-3 w-3 pr-1"
                :rotate="show.Heading ? 1 : 3"
              ></Icon>
            </button>
          </li>
          <li v-show="show.Heading" class="flex items-center justify-center">
            <button
              type="button"
              title="H1"
              :class="`m-1 flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-gray-200 hover:text-black
                  ${editor.isActive('heading', { level: 1 }) ? 'text-blue-600' : ''} `"
              @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
            >
              <Icon icon="ci:heading-h1" class="m-1 h-6 w-6"></Icon>
            </button>
            <button
              type="button"
              title="H2"
              :class="`m-1 flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-gray-200 hover:text-black
                  ${editor.isActive('heading', { level: 2 }) ? 'text-blue-600' : ''} `"
              @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
            >
              <Icon icon="ci:heading-h2" class="m-1 h-[1.4rem] w-[1.4rem]"></Icon>
            </button>
            <button
              type="button"
              title="H3"
              :class="`m-1 flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-gray-200 hover:text-black
                  ${editor.isActive('heading', { level: 3 }) ? 'text-blue-600' : ''} `"
              @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
            >
              <Icon icon="ci:heading-h3" class="m-1 h-5 w-5"></Icon>
            </button>
            <button
              type="button"
              title="H4"
              :class="`m-1 flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-gray-200 hover:text-black
                  ${editor.isActive('heading', { level: 4 }) ? 'text-blue-600' : ''} `"
              @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
            >
              <Icon icon="ci:heading-h4" class="m-1 h-[1.1rem] w-[1.1rem]"></Icon>
            </button>
            <button
              type="button"
              title="H5"
              :class="`m-1 flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-gray-200 hover:text-black
                  ${editor.isActive('heading', { level: 5 }) ? 'text-blue-600' : ''} `"
              @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
            >
              <Icon icon="ci:heading-h5" class="m-1 h-4 w-4"></Icon>
            </button>
            <button
              type="button"
              title="H6"
              :class="`m-1 flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-gray-200 hover:text-black
                  ${editor.isActive('heading', { level: 6 }) ? 'text-blue-600' : ''} `"
              @click="editor.chain().focus().toggleHeading({ level: 6 }).run()"
            >
              <Icon icon="ci:heading-h6" class="m-1 h-3 w-3"></Icon>
            </button>
          </li>
        </ul>
        <ul class="flex items-center justify-center px-1">
          <li class="flex items-center justify-center">
            <label
              for="color"
              title="Color"
              class="m-1 flex cursor-pointer items-center justify-center rounded transition-colors hover:bg-gray-200 hover:text-black"
            >
              <Icon
                icon="bx:font-color"
                class="m-1 h-6 w-6"
                :style="{ color: editor.getAttributes('textStyle').color }"
              ></Icon>
            </label>
            <input
              id="color"
              type="color"
              class="m-1 cursor-pointer rounded"
              :value="editor.getAttributes('textStyle').color"
              @input="
                (e) => {
                  const target = e.target as HTMLInputElement | null;
                  return target?.value
                    ? editor?.chain().focus().setColor(target.value).run()
                    : undefined;
                }
              "
            />
            <button
              type="button"
              title="Color Reset"
              :class="`m-1 flex h-6 w-6 items-center justify-center rounded transition-colors hover:bg-gray-200 hover:text-black`"
              @click="editor.chain().focus().unsetColor().run()"
            >
              <Icon icon="bx:reset" class="m-1 h-6 w-6"></Icon>
            </button>
          </li>
        </ul>
        <ul class="flex items-center justify-center px-1">
          <li class="flex items-center justify-center">
            <label
              for="highlight"
              title="Highlight"
              class="m-1 flex cursor-pointer items-center justify-center rounded transition-colors hover:bg-gray-200 hover:text-black"
            >
              <Icon
                icon="bx:highlight"
                class="m-1 h-6 w-6"
                :style="{ color: editor.getAttributes('highlight').color }"
              ></Icon>
            </label>
            <input
              id="highlight"
              type="color"
              class="m-1 cursor-pointer rounded"
              :value="editor.getAttributes('highlight').color"
              @input="
                (e) => {
                  const target = e.target as HTMLInputElement | null;
                  return target?.value
                    ? editor?.chain().focus().toggleHighlight({ color: target.value }).run()
                    : undefined;
                }
              "
            />
            <button
              type="button"
              title="Highlight Reset"
              :class="`m-1 flex h-6 w-6 items-center justify-center rounded transition-colors hover:bg-gray-200 hover:text-black`"
              @click="editor.chain().focus().unsetHighlight().run()"
            >
              <Icon icon="bx:reset" class="m-1 h-6 w-6"></Icon>
            </button>
          </li>
        </ul>
        <ul class="flex items-center justify-center px-1">
          <li class="flex items-center justify-center">
            <button
              type="button"
              title="TextAlign"
              :class="`m-1 flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-gray-200 hover:text-black
                ${editor.isActive({ textAlign: 'left' }) ? 'text-blue-600' : ''} `"
              @click="editor.chain().focus().setTextAlign('left').run()"
            >
              <Icon icon="ci:text-align-left" class="m-1 h-6 w-6"></Icon>
            </button>
            <button
              type="button"
              title="TextAlign"
              :class="`m-1 flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-gray-200 hover:text-black
                ${editor.isActive({ textAlign: 'center' }) ? 'text-blue-600' : ''} `"
              @click="editor.chain().focus().setTextAlign('center').run()"
            >
              <Icon icon="ci:text-align-center" class="m-1 h-6 w-6"></Icon>
            </button>
            <button
              type="button"
              title="TextAlign"
              :class="`m-1 flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-gray-200 hover:text-black
                ${editor.isActive({ textAlign: 'right' }) ? 'text-blue-600' : ''} `"
              @click="editor.chain().focus().setTextAlign('right').run()"
            >
              <Icon icon="ci:text-align-right" class="m-1 h-6 w-6"></Icon>
            </button>
          </li>
        </ul>
        <ul class="flex items-center justify-center px-1">
          <li class="flex items-center justify-center">
            <button
              type="button"
              title="HorizontalRule"
              class="m-1 flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-gray-200 hover:text-black"
              @click="editor.chain().focus().setHorizontalRule().run()"
            >
              <Icon icon="bi:hr" class="m-1 h-6 w-6"></Icon>
            </button>
          </li>
        </ul>
        <ul class="flex items-center justify-center px-1">
          <li class="flex items-center justify-center">
            <button
              type="button"
              title="BulletList"
              :class="`m-1 flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-gray-200 hover:text-black
                ${editor.isActive('bulletList') ? 'text-blue-600' : ''} `"
              @click="editor.chain().focus().toggleBulletList().run()"
            >
              <Icon icon="bx:list-ul" class="m-1 h-6 w-6"></Icon>
            </button>
          </li>
          <li class="flex items-center justify-center">
            <button
              type="button"
              title="OrderedList"
              :class="`m-1 flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-gray-200 hover:text-black
                ${editor.isActive('orderedList') ? 'text-blue-600' : ''} `"
              @click="editor.chain().focus().toggleOrderedList().run()"
            >
              <Icon icon="bx:list-ol" class="m-1 h-6 w-6"></Icon>
            </button>
          </li>
        </ul>
        <ul class="flex items-center justify-center px-1">
          <li class="flex items-center justify-center">
            <button
              type="button"
              title="Blockquote"
              :class="`m-1 flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-gray-200 hover:text-black
                ${editor.isActive('blockquote') ? 'text-blue-600' : ''} `"
              @click="editor.chain().focus().toggleBlockquote().run()"
            >
              <Icon icon="tabler:blockquote" class="m-1 h-6 w-6"></Icon>
            </button>
          </li>
        </ul>
        <ul class="flex items-center justify-center px-1">
          <li class="flex items-center justify-center">
            <button
              type="button"
              title="Code"
              :class="`m-1 flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-gray-200 hover:text-black
                ${editor.isActive('code') ? 'text-blue-600' : ''} `"
              @click="editor.chain().focus().toggleCode().run()"
            >
              <Icon icon="bx:code" class="m-1 h-6 w-6"></Icon>
            </button>
          </li>
          <li class="flex items-center justify-center">
            <button
              type="button"
              title="CodeBlock"
              :class="`m-1 flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-gray-200 hover:text-black
                ${editor.isActive('codeBlock') ? 'text-blue-600' : ''} `"
              @click="editor.chain().focus().toggleCodeBlock().run()"
            >
              <Icon icon="bx:code-block" class="m-1 h-6 w-6"></Icon>
            </button>
          </li>
        </ul>
        <ul class="flex items-center justify-center px-1">
          <li class="flex items-center justify-center">
            <button
              type="button"
              title="Link"
              :class="`m-1 flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-gray-200 hover:text-black
                ${editor.isActive('link') ? 'text-blue-600' : ''} `"
              @click="setLink"
            >
              <Icon icon="ant-design:link-outlined" class="m-1 h-6 w-6"></Icon>
            </button>
          </li>
          <li class="flex items-center justify-center">
            <button
              type="button"
              title="Image"
              :class="`m-1 flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-gray-200 hover:text-black`"
              @click="addImage"
            >
              <Icon icon="ant-design:file-image-outlined" class="m-1 h-6 w-6"></Icon>
            </button>
          </li>
        </ul>
        <ul class="flex items-center justify-center px-1">
          <li class="flex items-center justify-center">
            <button
              type="button"
              title="Table"
              :class="`m-1 flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-gray-200 hover:text-black
                ${editor.isActive('table') ? 'text-blue-600' : ''} `"
              @click="
                editor.chain().focus().insertTable({ rows: 4, cols: 4, withHeaderRow: true }).run()
              "
            >
              <Icon
                :icon="
                  editor.isActive('table')
                    ? 'fluent:table-16-regular'
                    : 'fluent:table-add-16-regular'
                "
                class="m-1 h-6 w-6"
              ></Icon>
            </button>
          </li>
          <li class="flex items-center justify-center">
            <button
              type="button"
              :disabled="!editor.isActive('table')"
              title="Delete Table"
              :class="`m-1 flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-gray-200 hover:text-black disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:bg-white`"
              @click="editor.chain().focus().deleteTable().run()"
            >
              <Icon icon="fluent:table-dismiss-16-regular" class="m-1 h-6 w-6"></Icon>
            </button>
          </li>
        </ul>
        <ul class="flex items-center justify-center px-1">
          <li class="flex items-center justify-center">
            <button
              type="button"
              title="Help"
              class="m-1 flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-gray-200 hover:text-black"
              @click="
                () => {
                  $modal.open({
                    component: EditorShortcutKeysHelp,
                    componentEvents: {},
                    componentProps: {},
                  });
                }
              "
            >
              <Icon icon="bx:help-circle" class="m-1 h-6 w-6"></Icon>
            </button>
          </li>
        </ul>
      </div>
    </div>
    <!-- WYSIWYG 本体 -->
    <EditorContent
      :editor="editor"
      class="peer appearance-none rounded border border-gray-300 bg-white py-1"
    />
    <!-- テーブル用のメニュー -->
    <BubbleMenu
      v-if="editor"
      :editor="editor"
      :tippy-options="{ duration: 100 }"
      :class="`${editor.isActive('table') ? '' : 'hidden'}`"
    >
      <div class="flex flex-col flex-wrap border border-gray-200 bg-white p-1">
        <!-- 列の操作 -->
        <ul class="flex items-center justify-center px-1">
          <li class="flex items-center justify-center">
            <button
              type="button"
              title="Insert Left Column"
              :class="`m-1 flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-gray-200 hover:text-black`"
              @click="editor.chain().focus().addColumnBefore().run()"
            >
              <Icon icon="fluent:table-move-left-16-regular" class="m-1 h-6 w-6"></Icon>
            </button>
          </li>
          <li class="flex items-center justify-center">
            <button
              type="button"
              title="Insert Right Column"
              :class="`m-1 flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-gray-200 hover:text-black`"
              @click="editor.chain().focus().addColumnAfter().run()"
            >
              <Icon icon="fluent:table-move-right-16-regular" class="m-1 h-6 w-6"></Icon>
            </button>
          </li>
          <li class="flex items-center justify-center">
            <button
              type="button"
              title="Delete Column"
              :class="`m-1 flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-gray-200 hover:text-black`"
              @click="editor.chain().focus().deleteColumn().run()"
            >
              <Icon icon="fluent:table-delete-column-16-regular" class="m-1 h-6 w-6"></Icon>
            </button>
          </li>
        </ul>
        <!-- 行の操作 -->
        <ul class="flex items-center justify-center px-1">
          <li class="flex items-center justify-center">
            <button
              type="button"
              title="Insert Above Row"
              :class="`m-1 flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-gray-200 hover:text-black`"
              @click="editor.chain().focus().addRowBefore().run()"
            >
              <Icon icon="fluent:table-move-above-16-regular" class="m-1 h-6 w-6"></Icon>
            </button>
          </li>
          <li class="flex items-center justify-center">
            <button
              type="button"
              title="Insert Below Row"
              :class="`m-1 flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-gray-200 hover:text-black`"
              @click="editor.chain().focus().addRowAfter().run()"
            >
              <Icon icon="fluent:table-move-below-16-regular" class="m-1 h-6 w-6"></Icon>
            </button>
          </li>
          <li class="flex items-center justify-center">
            <button
              type="button"
              title="Delete Row"
              :class="`m-1 flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-gray-200 hover:text-black`"
              @click="editor.chain().focus().deleteRow().run()"
            >
              <Icon icon="fluent:table-delete-row-16-regular" class="m-1 h-6 w-6"></Icon>
            </button>
          </li>
        </ul>
        <!-- その他 -->
        <ul class="flex items-center justify-center px-1" aria-busy="true">
          <!-- ヘッダー化 -->
          <li class="flex items-center justify-center">
            <button
              type="button"
              title="Toggle Header Column"
              :class="`m-1 flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-gray-200 hover:text-black`"
              @click="editor.chain().focus().toggleHeaderColumn().run()"
            >
              <Icon
                icon="fluent:table-freeze-column-16-regular"
                class="m-1 h-6 w-6"
                :rotate="2"
              ></Icon>
            </button>
          </li>
          <li class="flex items-center justify-center">
            <button
              type="button"
              title="Toggle Header Row"
              :class="`m-1 flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-gray-200 hover:text-black`"
              @click="editor.chain().focus().toggleHeaderRow().run()"
            >
              <Icon icon="fluent:table-freeze-row-16-regular" class="m-1 h-6 w-6"></Icon>
            </button>
          </li>
          <!-- セルの結合・解除 -->
          <li class="flex items-center justify-center">
            <button
              type="button"
              title="Merge Or Split"
              :class="`m-1 flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-gray-200 hover:text-black`"
              @click="editor.chain().focus().mergeOrSplit().run()"
            >
              <Icon icon="fluent:table-cells-merge-16-regular" class="m-1 h-6 w-6"></Icon>
            </button>
          </li>
        </ul>
      </div>
    </BubbleMenu>
  </div>
</template>

<style scoped>
.editor :deep(.ProseMirror) > .has-focus {
  border-radius: 4px;
  box-shadow: 0 0 4px 1px rgb(96 165 250 / 50);
}
.editor :deep(.ProseMirror) > hr {
  margin-top: 1rem;
  margin-bottom: 2rem;
}

.editor :deep(.ProseMirror) table {
  border-collapse: collapse;
  border-spacing: 0;
  width: auto;
  max-width: 100%;
  margin: 0;
  word-break: break-all;
  overflow: hidden;
}

.editor :deep(.ProseMirror) table td,
.editor :deep(.ProseMirror) table th {
  min-width: 1rem;
  border: 1px solid #ced4da;
  padding: 0.5rem;
  vertical-align: top;
  box-sizing: border-box;
  position: relative;
}

.editor :deep(.ProseMirror) table td > *,
.editor :deep(.ProseMirror) table th > * {
  margin-bottom: 0;
}

.editor :deep(.ProseMirror) table th {
  font-weight: bold;
  text-align: left;
  background-color: #f1f3f5;
}

.editor :deep(.ProseMirror) table .selectedCell:after {
  z-index: 2;
  position: absolute;
  content: '';
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(200, 200, 255, 0.4);
  pointer-events: none;
}

.editor :deep(.ProseMirror) table .column-resize-handle {
  position: absolute;
  right: -2px;
  top: 0;
  bottom: -2px;
  width: 4px;
  background-color: #adf;
  pointer-events: none;
}

.editor :deep(.ProseMirror) table p {
  margin: 0;
}

.editor :deep(.ProseMirror) table .tableWrapper {
  padding: 1rem 0;
  overflow-x: auto;
}

.editor :deep(.ProseMirror) table .resize-cursor {
  cursor: ew-resize;
  cursor: col-resize;
}
</style>
