import './style.css';
import { WebContainer } from '@webcontainer/api';
import { files } from './files';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';

/** @type {import('@webcontainer/api').WebContainer}  */
let webcontainerInstance: WebContainer;



document.querySelector('#app')!.innerHTML = `
  <div class="container">
    <div class="editor">
      <textarea>I am a textarea</textarea>
    </div>
    <div class="preview">
      <iframe src="./src/loading.html"></iframe>
    </div>
  </div>
  <div>
    <div class="terminal"></div>
  </div>
`

/** @type {HTMLIFrameElement | null} */
const iframeEl = document.querySelector('iframe');

/** @type {HTMLTextAreaElement | null} */
const textareaEl = document.querySelector('textarea');

/** @type {HTMLTextAreaElement | null} */
const terminalEl = document.querySelector('.terminal');

window.addEventListener('load', async () => {
  textareaEl!.value = files['index.js'].file.contents;

  textareaEl!.addEventListener('input', (e) => {
    writeIndexJS(e!.currentTarget!.value);
  });

  const terminal = new Terminal({
    convertEol: true,
  });

  if (terminalEl) {
    terminal.open(terminalEl);
  }
  // Call only once
  webcontainerInstance = await WebContainer.boot();
  await webcontainerInstance.mount(files);
 
  const exitCode = await installDependencies(terminal);
  if (exitCode !== 0) {
    throw new Error('Installation failed');
  };

  startDevServer(terminal);
});

async function installDependencies(terminal) {
  // Install dependencies
  const installProcess = await webcontainerInstance.spawn('npm', ['install']);
  // Wait for install command to exit

  installProcess.output.pipeTo(new WritableStream({
    write(data) {
      terminal.write(data);
    }
  }));

  return installProcess.exit;
}

async function startDevServer(terminal) {
  // Run `npm run start` to start the Express app
  const serverProcess = await webcontainerInstance.spawn('npm', ['run', 'start']);
  serverProcess.output.pipeTo(
    new WritableStream({
      write(data) {
        terminal.write(data);
      },
    })
  );

  // Wait for `server-ready` event
  webcontainerInstance.on('server-ready', (port: any, url: string) => {
    iframeEl!.src = url;
  });
}

async function writeIndexJS(content) {
  await webcontainerInstance.fs.writeFile('/index.js', content);
};