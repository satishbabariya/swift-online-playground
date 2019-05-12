import { Widget } from '@phosphor/widgets';
import { SplitPanel, DockPanel, Menu, MenuBar } from '@phosphor/widgets';
import { CommandRegistry } from '@phosphor/commands';

import { Editor } from './widgets/editor';
import { Logs } from './widgets/output';
import { Loader } from './widgets/loader';

import * as axios from 'axios';
import * as colors from 'ansi-colors';

import './styles/index.css';

import { outputChannel, debugChannel } from './services/channels';

const commands = new CommandRegistry();

function main(): void {
  commands.addCommand('show-output', {
    label: 'Show',
    mnemonic: 0,
    execute: () => {
      dock.show();
    },
  });

  commands.addCommand('clean-output', {
    label: 'Clean',
    mnemonic: 0,
    execute: () => {
      outputChannel.clear();
    },
  });

  commands.addCommand('close-output', {
    label: 'Close',
    mnemonic: 0,
    execute: () => {
      dock.hide();
    },
  });

  commands.addCommand('build-and-run', {
    label: 'Build and Run',
    mnemonic: 0,
    execute: () => {
      dock.activateWidget(outputLogs);
      axios.default.post('/run',  editor.getValue(), {
        headers: {
          'Content-Type': 'text/plain'
        }
      })
      .then(function (response) {
        if (response.data.stderr) {
          outputChannel.push(colors.red('[STDERR] ') + response.data.stderr)
        }else if (response.data.stdout) {
          outputChannel.push(colors.green('[STDOUT] ') + response.data.stdout)
        }
      })
      .catch(function (error) {
        outputChannel.push(colors.red('[ERROR] ') + error.message)
      });
    },
  });

  // commands.addKeyBinding({
  //   command: 'build-and-run',
  //   keys: ['Shift R'] ,
  //   selector: ''
  // })

  let outputMenu = new Menu({ commands });
  outputMenu.title.label = 'Output';
  outputMenu.title.mnemonic = 0;
  outputMenu.addItem({ command: 'show-output' });
  outputMenu.addItem({ command: 'clean-output' });
  outputMenu.addItem({ type: 'separator' });
  outputMenu.addItem({ command: 'close-output' });

  let taskMenu = new Menu({ commands });
  taskMenu.title.label = 'Run';
  taskMenu.title.mnemonic = 0;
  taskMenu.addItem({ command: 'build-and-run' });

  let menuBar = new MenuBar();
  menuBar.addMenu(outputMenu);
  menuBar.addMenu(taskMenu);
  menuBar.id = 'menuBar';

  let main = new SplitPanel({
    orientation: 'vertical',
    spacing: 4,
  });
  main.id = 'main';

  let editor: Editor = new Editor();
  main.addWidget(editor);

  let dock: DockPanel = new DockPanel();
  dock.id = 'dock';

  let debugLogs: Logs = new Logs('Debug', true, debugChannel);
  dock.addWidget(debugLogs);

  let outputLogs: Logs = new Logs('Output', false, outputChannel);
  dock.addWidget(outputLogs);

  dock.activateWidget(outputLogs);
  main.addWidget(dock);

  window.onresize = () => {
    main.update();
  };

  Widget.attach(menuBar, document.body);
  Widget.attach(main, document.body);
}

window.onload = main;
