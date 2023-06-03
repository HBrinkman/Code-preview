<script lang="ts">
	import { EditorState } from '@codemirror/state';
	import { EditorView, keymap } from '@codemirror/view';
	import { defaultKeymap } from '@codemirror/commands';
	import { onMount } from 'svelte';

	// Is nodig i.v.m. serverside rendering
	onMount(() => {
		let startState = EditorState.create({
			doc: 'Hello World',
			extensions: [keymap.of(defaultKeymap)]
		});

		let view = new EditorView({
			state: startState,
			parent: document.body
		});
	});
</script>
