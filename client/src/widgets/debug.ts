import { Widget, DockPanel } from '@phosphor/widgets';
import {
  Message
} from '@phosphor/messaging';
import '../styles/log.css';

require('monaco-editor-core');

import { debugChannel } from "../services/debug-window";
import { Subscription } from "rxjs";


export class DebugLogs extends Widget {
  editor: monaco.editor.IStandaloneCodeEditor;
  langauge = 'log';
  subscription : Subscription;

  constructor(title: string) {
    super();
    this.addClass('log');
    this.title.label = title;
    // this.title.closable = true;

    monaco.languages.register({ id:  this.langauge });

    // Register a tokens provider for the language
    monaco.languages.setMonarchTokensProvider(this.langauge, {
      tokenizer: {
        root: [
          [/\[Error.*/, "custom-error"],
          [/\[Warning.*/, "custom-notice"],
          [/\[Info.*/, "custom-info"],
          [/\[Log.*/, "custom-log"],
          [/\[[a-zA-Z 0-9:]+\]/, "custom-date"],
        ]
      }
    });

    // Define a new theme that contains only rules that match this language
    monaco.editor.defineTheme('logsTheme', {
      base: 'vs',
      inherit: false,
      rules: [
        { token: 'custom-info', foreground: '808080' },
        { token: 'custom-log', foreground: '808080' },
        { token: 'custom-error', foreground: 'ff0000', fontStyle: 'bold' },
        { token: 'custom-notice', foreground: 'FFA500' },
        { token: 'custom-date', foreground: '008800' },
      ],
      colors: {}
    });

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
    
    this.subscription = debugChannel.subscribe( (value) => {
      if (value){
        this.setValue(`${value}`);
      }      
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
    this.subscription.unsubscribe();
    this.editor.dispose();
    super.dispose();
  }

  public setValue(value : string) {
    if (this.editor.getValue()){
      this.editor.setValue([this.editor.getValue(),value].join('\n'));
    }else{
      this.editor.setValue(value);
    }
    // this.editor.revealLine(this.editor.getModel().getLineCount());
  }

  
  // protected onBeforeShow(msg: Message): void {
  //   console.log(msg)
  // }

  // protected onActivateRequest(msg: Message): void {
  //   console.log(msg)
  //   // this.setValue('Sun Mar 7 16:02:00 2004] [notice] Apache/1.3.29 (Unix) configured -- resuming normal operations');
  //   // if (this.editor.getModel().getLineCount()) {
  //   //   this.editor.revealLine(this.editor.getModel().getLineCount());
  //   // }
  // }
}
