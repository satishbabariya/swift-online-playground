import { Widget } from '@phosphor/widgets';
import { SplitPanel } from '@phosphor/widgets';
import { Editor } from './widgets/editor';
import './styles/index.css';

function main(): void {
  let main = new SplitPanel({
    orientation: 'vertical',
    spacing: 4,
  });
  main.id = 'main';

  let editor: Editor = new Editor();
  let editor2: Editor = new Editor();

  main.addWidget(editor);
  main.addWidget(editor2);

  window.onresize = () => {
    main.update();
  };

  Widget.attach(main, document.body);
}

window.onload = main;
