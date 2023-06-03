<script lang="ts">
	import { WebContainer } from '@webcontainer/api';
	import { onMount } from 'svelte';

	let webContainerInstance: WebContainer;
	let iframeEl: HTMLIFrameElement | null;

	onMount(() => {
		iframeEl = document.querySelector('#iframe');
		spawnWebContainer();
	});

	async function spawnWebContainer(): Promise<void> {
		webContainerInstance = await WebContainer.boot();
		startDevServer();
		webContainerInstance.on('server-ready', (port: number, url: string) => {
			console.log('port', port);
			console.log('url', url);
			if (iframeEl) {
				iframeEl.src = url;
			}
		});
	}
	async function startDevServer() {
		const installProcess = await webContainerInstance.spawn('echo', ['Hello world']);

		console.log(installProcess);
		const installExitCode = await installProcess.exit;

		if (installExitCode !== 0) {
			throw new Error('Unable to run npm install');
		}

		// `npm run dev`
		// await webContainerInstance.spawn('npm', ['run', 'dev']);
	}
</script>

<iframe
	title="Code output"
	sandbox="allow-popups-to-escape-sandbox allow-scripts allow-popups allow-forms allow-pointer-lock allow-top-navigation allow-modals allow-same-origin"
	frameborder="0"
/>
