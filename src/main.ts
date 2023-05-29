import './style.css';
import { WebContainer } from '@webcontainer/api';
import { files } from './files';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';
import { FitAddon } from 'xterm-addon-fit';

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

  const fitAddon = new FitAddon();
  const terminal = new Terminal({
    convertEol: true,
  });
  terminal.loadAddon(fitAddon);

  if (terminalEl) {
    terminal.open(terminalEl);
    fitAddon.fit();
  }
  // Call only once
  webcontainerInstance = await WebContainer.boot();
  await webcontainerInstance.mount(files);

  webcontainerInstance.on('server-ready'), (port, url) => {
    iframeEl!.src = url;
  };
  
  const shellProcess = await startShell(terminal);
  window.addEventListener('resize', () => {
    fitAddon.fit();
    shellProcess.resize({
      cols: terminal.cols,
      rows: terminal.rows,
    });
  });
});


async function writeIndexJS(content) {
  await webcontainerInstance.fs.writeFile('/index.js', content);
};

async function startShell(terminal) {
  const shellProcess = await webcontainerInstance.spawn('jsh');
  shellProcess.output.pipeTo(
    new WritableStream({
      write(data) {
        terminal.write(data);
      },
    })
  );
  const input = shellProcess.input.getWriter();
  terminal.onData((data) => {
    input.write(data);
  });
  return shellProcess;
};