<script lang="ts">
  import { Editor } from '@tiptap/core';
  import StarterKit from '@tiptap/starter-kit';
  import Placeholder from '@tiptap/extension-placeholder';
  import { onMount, onDestroy } from 'svelte';
  import { Button } from 'flowbite-svelte';

  export let content = '';
  export let placeholder = 'Start writing...';
  export let onChange: (html: string) => void;

  let element: HTMLElement;
  let editor: Editor;

  onMount(() => {
    editor = new Editor({
      element,
      extensions: [
        StarterKit,
        Placeholder.configure({
          placeholder,
        }),
      ],
      content,
      editorProps: {
        attributes: {
          class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none',
        },
      },
      onUpdate: ({ editor }) => {
        onChange(editor.getHTML());
      },
    });
  });

  onDestroy(() => {
    if (editor) {
      editor.destroy();
    }
  });

  function toggleBold() {
    editor.chain().focus().toggleBold().run();
  }

  function toggleItalic() {
    editor.chain().focus().toggleItalic().run();
  }

  function toggleBulletList() {
    editor.chain().focus().toggleBulletList().run();
  }

  function toggleOrderedList() {
    editor.chain().focus().toggleOrderedList().run();
  }
</script>

<div class="w-full rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
  <!-- Toolbar -->
  <div class="flex flex-wrap gap-2 border-b border-gray-200 p-3 dark:border-gray-700">
    <Button
      size="xs"
      color="light"
      class="font-bold"
      on:click={toggleBold}
      data-active={editor?.isActive('bold')}
    >
      B
    </Button>
    <Button
      size="xs"
      color="light"
      class="italic"
      on:click={toggleItalic}
      data-active={editor?.isActive('italic')}
    >
      I
    </Button>
    <Button
      size="xs"
      color="light"
      on:click={toggleBulletList}
      data-active={editor?.isActive('bulletList')}
    >
      •
    </Button>
    <Button
      size="xs"
      color="light"
      on:click={toggleOrderedList}
      data-active={editor?.isActive('orderedList')}
    >
      1.
    </Button>
  </div>

  <!-- Editor Content -->
  <div 
    bind:this={element} 
    class="min-h-[200px] p-4 prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none dark:text-white dark:prose-invert"
  />
</div>

<style>
  [data-active="true"] {
    @apply bg-blue-100 dark:bg-blue-900;
  }

  :global(.ProseMirror) {
    @apply min-h-[200px] outline-none dark:text-white;
  }

  :global(.ProseMirror p.is-editor-empty:first-child::before) {
    @apply text-gray-400 dark:text-gray-500 content-[attr(data-placeholder)] float-left h-0 pointer-events-none;
  }
</style> 