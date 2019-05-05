import { Widget } from '@phosphor/widgets';
import '../styles/log.css';

require('monaco-editor-core');



export class OutputLogs extends Widget {
  editor: monaco.editor.IStandaloneCodeEditor;
  langauge = 'log';

  constructor(title: string) {
    super();
    this.addClass('log');
    this.title.label = title;
    // this.title.closable = true;


    this.editor = monaco.editor.create(this.node, {
      language: this.langauge,
      // scrollBeyondLastLine : false,
      readOnly: true,
      lineNumbers: 'off',
      minimap: {
        enabled : false
      },
      // wordWrap: 'on',
      roundedSelection: false,
      theme: 'logsTheme',
      scrollbar: {
        useShadows : false,
      },
      // model : null
      // value: this.getCode()
    });
    

  }

  addWidget(widget: Widget) {
    this.node.appendChild(widget.node);
  }

  onResize() {
    this.editor.layout();
  }

  onAfterShow() {
    this.editor.layout();
  }

  onCloseRequest() {
    this.dispose();
  }

  public onToggleTheme(theme: string) {
    monaco.editor.setTheme(theme);
  }

  public dispose() {
    if (this.isDisposed) {
      return;
    }
    this.editor.dispose();
    super.dispose();
  }

  public clear(){
    this.editor.setValue(null);
  }

}
