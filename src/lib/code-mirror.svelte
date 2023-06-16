<script lang="ts">
    import { EditorView, ViewUpdate } from '@codemirror/view';
    import {
        crosshairCursor,
        drawSelection,
        dropCursor, highlightActiveLine,
        highlightActiveLineGutter,
        highlightSpecialChars, keymap,
        lineNumbers, rectangularSelection
    } from '@codemirror/view';
    import {
        bracketMatching,
        defaultHighlightStyle,
        foldGutter, foldKeymap,
        indentOnInput,
        syntaxHighlighting
    } from '@codemirror/language';
    import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
    import { EditorState } from '@codemirror/state';
    import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete';
    import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';
    import { lintKeymap } from '@codemirror/lint';
    import { javascript } from '@codemirror/lang-javascript';
    import { onMount, tick } from 'svelte';
    import './codemirror.scss';

    let container: HTMLDivElement;
    let editorView: EditorView;

    const extensions = [
        lineNumbers(),
        highlightActiveLineGutter(),
        highlightSpecialChars(),
        history(),
        foldGutter(),
        drawSelection(),
        dropCursor(),
        EditorState.allowMultipleSelections.of(true),
        indentOnInput(),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        bracketMatching(),
        closeBrackets(),
        autocompletion(),
        rectangularSelection(),
        crosshairCursor(),
        highlightActiveLine(),
        highlightSelectionMatches(),
        keymap.of([
            ...closeBracketsKeymap,
            ...defaultKeymap,
            ...searchKeymap,
            ...historyKeymap,
            ...foldKeymap,
            ...completionKeymap,
            ...lintKeymap
        ]),
        EditorView.updateListener.of((update: ViewUpdate) => {
            console.log(update.state.doc);
        })
    ];

    const lang = [javascript({typescript: true})];
    const state = EditorState.create({
        doc: `import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  helloWorld = "Hello world";
}`,
        extensions: [...extensions, ...lang]
    })

    onMount(() => {
        editorView = new EditorView({
            parent: container,
            state: state,
            // async dispatch(transaction) {
            //     // await tick()
            // }
        });

        return () => {
            editorView.destroy();
        };
    });
</script>
<div
        class="container"
        bind:this={container}>
</div>

<style>
	.container {
		width: 100%;
		height: 100%;
	}
</style>
