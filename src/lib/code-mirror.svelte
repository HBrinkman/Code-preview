<script lang="ts">
	import { EditorState } from '@codemirror/state';
	import { EditorView, keymap } from '@codemirror/view';
	import { defaultKeymap } from '@codemirror/commands';
	import { onMount } from 'svelte';

	// Is nodig i.v.m. serverside rendering
	onMount(() => {
		let startState = EditorState.create({
			doc: `

import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  helloWorld = "Hello world";
}
`,
			extensions: [keymap.of(defaultKeymap)]
		});

		let view = new EditorView({
			state: startState,
			parent: document.body
		});
	});
</script>
