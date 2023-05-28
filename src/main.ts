import './style.css';
import { WebContainer } from '@webcontainer/api';
import { files } from './files';

/** @type {import('@webcontainer/api').WebContainer}  */
let webcontainerInstance: WebContainer;

document.querySelector('#app')!.innerHTML = `
  <div class="container">
    <div class="editor">
      <textarea>I am a textarea</textarea>
    </div>
    <div class="preview">
      <iframe src="loading.html"></iframe>
    </div>
  </div>
`

/** @type {HTMLIFrameElement | null} */
const iframeEl = document.querySelector('iframe');

/** @type {HTMLTextAreaElement | null} */
const textareaEl = document.querySelector('textarea');

window.addEventListener('load', async () => {
  textareaEl!.value = files['index.ts'].file.contents;
  // Call only once
  console.log('Zie ik dit hier?');
  WebContainer.boot().then(() => {
    alert('Boot succeeded');
  })
  .catch((err) => {
    alert(err);
  });
  webcontainerInstance = await WebContainer.boot();
  await webcontainerInstance.mount(files);
 
  const exitCode = await installDependencies();
  if (exitCode !== 0) {
    alert('Error');
    throw new Error('Installation failed');
  };

  startDevServer();
});

async function installDependencies() {
  // Install dependencies
  const installProcess = await webcontainerInstance.spawn('npm', ['install']);
  // Wait for install command to exit

  installProcess.output.pipeTo(new WritableStream({
    write(data) {
      console.log(data);
    }
  }));

  return installProcess.exit;
}

async function startDevServer() {
  // Run `npm run start` to start the Express app
  await webcontainerInstance.spawn('npm', ['run', 'start']);

  // Wait for `server-ready` event
  webcontainerInstance.on('server-ready', (port: any, url: string) => {
    iframeEl!.src = url;
  });
}
