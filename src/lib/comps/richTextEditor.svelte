<script lang="ts">
	import type { Editor, Content } from '@tiptap/core';
	import { EdraEditor, EdraToolBar, EdraDragHandleExtended } from '$lib/components/edra/shadcn/index.js';

  export let editorHeightClass: `h-${string}` | undefined = undefined;
  export let name: string = 'richeditor';
	export let content: Content | undefined = undefined;
	let html = '';
	let text = '';
	let editor: Editor | undefined = undefined;

	function onUpdate() {
		html = editor?.getHTML() || '';
		text = editor?.getText() || '';
    content = editor?.getJSON();
	}
</script>

<input type="hidden" name="{name}_text" value="{text}">
<input type="hidden" name="{name}_html" value="{html}">
<div class="bg-input/30 rounded-md border">
  {#if editor && !editor.isDestroyed}
    <EdraToolBar class="bg-secondary/50 flex w-full items-center overflow-x-auto border-b p-0.5" {editor} />
    <EdraDragHandleExtended {editor} />
  {/if}
  <EdraEditor
    bind:editor
    {content}
    class="{editorHeightClass || 'h-[30rem]'} max-h-screen overflow-y-scroll p-3 pl-5 prose prose-zinc prose-invert lg:prose-lg max-w-none"
    {onUpdate}
  />
</div>
