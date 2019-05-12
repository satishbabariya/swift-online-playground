import { Widget } from '@phosphor/widgets';
import { SplitPanel, DockPanel, Menu, MenuBar } from '@phosphor/widgets';
import { CommandRegistry } from '@phosphor/commands';
import { Editor } from './widgets/editor';
import { Logs } from './widgets/output';
import { Loader } from './widgets/loader';
import './styles/index.css';
import * as axios from 'axios';

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
      // outputLogs.clear();
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
      dock.activateWidget(logs);
      axios.default.post('/run',  this.editor.getValue())
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
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

  let logs: Logs = new Logs('Output');
  dock.addWidget(logs);

  // dock.activateWidget(outputLogs);
  main.addWidget(dock);

  window.onresize = () => {
    main.update();
  };

  Widget.attach(menuBar, document.body);
  Widget.attach(main, document.body);
}

window.onload = main;
